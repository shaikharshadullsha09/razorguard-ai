import os
from typing import Any

import razorpay
from dotenv import load_dotenv

load_dotenv()


class PaymentConfigurationError(RuntimeError):
    pass


def _credentials() -> tuple[str, str]:
    key_id = os.getenv('RAZORPAY_KEY_ID')
    key_secret = os.getenv('RAZORPAY_KEY_SECRET')
    if not key_id or not key_secret:
        raise PaymentConfigurationError('Razorpay test credentials are not configured.')
    return key_id, key_secret


def _client() -> razorpay.Client:
    key_id, key_secret = _credentials()
    return razorpay.Client(auth=(key_id, key_secret))


def create_razorpay_order(amount: float, currency: str = 'INR', receipt: str | None = None) -> dict[str, Any]:
    key_id, _ = _credentials()
    order_data: dict[str, Any] = {'amount': int(round(amount * 100)), 'currency': currency, 'payment_capture': 1}
    if receipt:
        order_data['receipt'] = receipt
    return {'key_id': key_id, 'order': _client().order.create(data=order_data)}


def verify_payment(data: Any) -> dict[str, Any]:
    _client().utility.verify_payment_signature({
        'razorpay_order_id': data.razorpay_order_id,
        'razorpay_payment_id': data.razorpay_payment_id,
        'razorpay_signature': data.razorpay_signature,
    })
    return {'verified': True, 'payment_id': data.razorpay_payment_id, 'order_id': data.razorpay_order_id}
