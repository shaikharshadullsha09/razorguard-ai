from typing import Any


def safe_ratio(current: float, baseline: float) -> float:
    return current / max(baseline, 1)


def analyze_spike(data: Any) -> dict[str, Any]:
    velocity_ratio = safe_ratio(data.current_tx_per_min, data.baseline_tx_per_min)
    failure_ratio = safe_ratio(data.current_failure_rate, data.baseline_failure_rate)
    device_ratio = safe_ratio(data.current_new_devices + 1, data.baseline_new_devices + 1)
    ip_ratio = safe_ratio(data.current_ip_repeats + 1, data.baseline_ip_repeats + 1)

    velocity_component = min(max(velocity_ratio - 1, 0) / 2, 1)
    failure_component = min(max(failure_ratio - 1, 0) / 4, 1)
    device_component = min(max(device_ratio - 1, 0) / 3, 1)
    ip_component = min(max(ip_ratio - 1, 0) / 3, 1)

    score = round(min(8 + velocity_component * 32 + failure_component * 30 + device_component * 14 + ip_component * 16, 100))

    if score >= 70:
        status = 'critical'
        action = 'Investigate high-risk payments'
    elif score >= 35:
        status = 'warning'
        action = 'Review suspicious activity'
    else:
        status = 'normal'
        action = 'Continue monitoring'

    reasons = []
    if velocity_ratio >= 1.5:
        reasons.append({'signal': 'transaction_velocity', 'message': f'Transaction velocity increased {velocity_ratio:.1f}x.'})
    if failure_ratio >= 1.8:
        reasons.append({'signal': 'failure_rate', 'message': f'Payment failure rate increased {failure_ratio:.1f}x.'})
    if device_ratio >= 1.6:
        reasons.append({'signal': 'new_devices', 'message': f'New-device activity increased {device_ratio:.1f}x.'})
    if ip_ratio >= 1.7:
        reasons.append({'signal': 'ip_activity', 'message': f'Repeated IP activity increased {ip_ratio:.1f}x.'})
    if not reasons:
        reasons.append({'signal': 'normal', 'message': 'Current behaviour remains close to baseline.'})

    return {
        'spike_score': score,
        'status': status,
        'recommended_action': action,
        'signals': reasons,
        'ratios': {
            'velocity': round(velocity_ratio, 2),
            'failure': round(failure_ratio, 2),
            'new_devices': round(device_ratio, 2),
            'ip_activity': round(ip_ratio, 2),
        },
    }
