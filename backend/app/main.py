import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import SpikeInput, TransactionInput
from .services.model_service import predict_transaction
from .services.spike_service import analyze_spike

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
