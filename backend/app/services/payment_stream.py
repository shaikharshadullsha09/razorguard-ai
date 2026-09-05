import time
from collections import deque
from typing import Any

from ..schemas import SpikeInput
from .spike_service import analyze_spike

MAX_EVENTS = 500
BASELINE_TX_PER_MIN = 18
BASELINE_FAILURE_RATE = 1.2
payment_events: deque[dict[str, Any]] = deque(maxlen=MAX_EVENTS)


def record_payment_event(event_type: str, payment: dict[str, Any]) -> dict[str, Any]:
    event = {
        'payment_id': payment.get('id'),
        'order_id': payment.get('order_id'),
        'amount': payment.get('amount', 0) / 100,
        'currency': payment.get('currency', 'INR'),
        'method': payment.get('method', 'unknown'),
        'status': payment.get('status', 'unknown'),
        'event_type': event_type,
        'failed': event_type == 'payment.failed',
        'received_at': time.time(),
    }
    payment_events.append(event)
    return get_stream_snapshot()


def get_stream_snapshot() -> dict[str, Any]:
    now = time.time()
    recent = [event for event in payment_events if now - event['received_at'] <= 300]
    total = len(recent)
    failed = sum(1 for event in recent if event['failed'])
    failure_rate = failed / total * 100 if total else 0
    spike_input = SpikeInput(
        current_tx_per_min=total / 5,
        baseline_tx_per_min=BASELINE_TX_PER_MIN,
        current_failure_rate=failure_rate,
        baseline_failure_rate=BASELINE_FAILURE_RATE,
        current_new_devices=0,
        baseline_new_devices=0,
        current_ip_repeats=0,
        baseline_ip_repeats=0,
    )
    return {
        'window_minutes': 5,
        'transactions': total,
        'failures': failed,
        'transactions_per_min': round(total / 5, 2),
        'failure_rate': round(failure_rate, 2),
        'spike': analyze_spike(spike_input),
        'recent_events': list(reversed(recent[-20:])),
    }
