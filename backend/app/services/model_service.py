from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

from ..schemas import TransactionInput

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / 'artifacts' / 'fraud_model.joblib'


@lru_cache(maxsize=1)
def _load_bundle() -> dict[str, Any]:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f'Model artifact not found at {MODEL_PATH}. Run the training scripts first.')
    return joblib.load(MODEL_PATH)


def explain_transaction(transaction: TransactionInput) -> list[str]:
    reasons = []
    if transaction.amount > 30_000:
        reasons.append('Transaction amount is unusually high.')
    if transaction.transactions_last_10min > 5:
        reasons.append('Transaction velocity is unusually high.')
    if transaction.failed_attempts > 3:
        reasons.append('Multiple failed payment attempts detected.')
    if transaction.new_device == 1:
        reasons.append('Payment originated from a new device.')
    if transaction.location_change == 1:
        reasons.append('Customer location changed suddenly.')
    if transaction.account_age_days < 30:
        reasons.append('Payment originated from a recently created account.')
    if transaction.previous_chargebacks > 0:
        reasons.append('Customer has previous chargeback history.')
    if transaction.ip_repeat_count > 4:
        reasons.append('Repeated activity from the same IP was detected.')
    if transaction.merchant_tx_per_min > 30:
        reasons.append('Merchant transaction velocity is above normal.')
    if transaction.failure_rate_5m > 5:
        reasons.append('Short-term payment failure rate is elevated.')
    return reasons or ['No major abnormal signals detected.']


def predict_transaction(transaction: TransactionInput) -> dict[str, Any]:
    bundle = _load_bundle()
    frame = pd.DataFrame([transaction.model_dump()])[bundle['features']]
    probability = float(bundle['model'].predict_proba(frame)[0][1])
    risk_score = round(probability * 100)
    if risk_score >= 70:
        level, action = 'high', 'Hold and verify payment'
    elif risk_score >= 35:
        level, action = 'review', 'Manual review recommended'
    else:
        level, action = 'low', 'Approve and continue monitoring'
    return {'fraud_probability': round(probability, 4), 'risk_score': risk_score, 'risk_level': level, 'recommended_action': action, 'reasons': explain_transaction(transaction)}
