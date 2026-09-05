import json
import hashlib
import hmac
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from .schemas import CreateOrderInput, SpikeInput, TransactionInput, VerifyPaymentInput
from .services.model_service import predict_transaction
from .services.payment_service import PaymentConfigurationError, create_razorpay_order, verify_payment
from .services.payment_stream import get_stream_snapshot, record_payment_event
from .services.spike_service import analyze_spike

load_dotenv()
RAZORPAY_WEBHOOK_SECRET = os.getenv('RAZORPAY_WEBHOOK_SECRET')
processed_webhook_events: set[str] = set()

app = FastAPI(
    title='RazorGuard AI API',
    description='Fraud detection and fraud-spike intelligence API.',
    version='1.0.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/')
def root() -> dict[str, str]:
    return {'name': 'RazorGuard AI', 'status': 'online'}


@app.get('/health')
def health_check() -> dict[str, str]:
    return {'status': 'healthy', 'model': 'available after training'}


@app.post('/predict')
def predict(transaction: TransactionInput) -> dict:
    return predict_transaction(transaction)


@app.post('/spike/analyze')
def spike(spike_data: SpikeInput) -> dict:
    return analyze_spike(spike_data)


@app.get('/metrics')
def metrics() -> dict:
    metrics_file = Path(__file__).resolve().parents[1] / 'artifacts' / 'metrics.json'
    if not metrics_file.exists():
        return {'status': 'pending', 'dataset_type': 'synthetic-development'}
    return json.loads(metrics_file.read_text(encoding='utf-8'))


@app.post('/payments/create-order')
def create_order(data: CreateOrderInput) -> dict:
    try:
        return create_razorpay_order(data.amount, data.currency, data.receipt)
    except PaymentConfigurationError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=502, detail='Razorpay order creation failed.') from error


@app.post('/payments/verify')
def verify_checkout_payment(data: VerifyPaymentInput) -> dict:
    try:
        return {'success': True, **verify_payment(data)}
    except PaymentConfigurationError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=400, detail='Payment signature verification failed.') from error


def verify_webhook_signature(body: bytes, received_signature: str) -> bool:
    if not RAZORPAY_WEBHOOK_SECRET:
        raise RuntimeError('RAZORPAY_WEBHOOK_SECRET is missing.')
    expected_signature = hmac.new(
        RAZORPAY_WEBHOOK_SECRET.encode('utf-8'),
        body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected_signature, received_signature)


@app.post('/webhooks/razorpay')
async def razorpay_webhook(request: Request) -> dict:
    raw_body = await request.body()
    signature = request.headers.get('X-Razorpay-Signature')
    if not signature:
        raise HTTPException(status_code=400, detail='Missing Razorpay signature.')
    try:
        valid = verify_webhook_signature(raw_body, signature)
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    if not valid:
        raise HTTPException(status_code=400, detail='Invalid Razorpay webhook signature.')

    event_id = request.headers.get('X-Razorpay-Event-Id')
    if event_id and event_id in processed_webhook_events:
        return {'received': True, 'duplicate': True}
    try:
        payload = json.loads(raw_body.decode('utf-8'))
    except json.JSONDecodeError as error:
        raise HTTPException(status_code=400, detail='Invalid webhook JSON.') from error

    event_type = payload.get('event')
    stream_result = None
    if event_type in {'payment.captured', 'payment.failed'}:
        payment = payload.get('payload', {}).get('payment', {}).get('entity', {})
        stream_result = record_payment_event(event_type, payment)
    if event_id:
        processed_webhook_events.add(event_id)
    return {'received': True, 'duplicate': False, 'event': event_type, 'stream': stream_result}


@app.get('/payments/stream')
def payment_stream() -> dict:
    return get_stream_snapshot()
