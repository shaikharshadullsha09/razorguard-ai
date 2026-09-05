from pathlib import Path

import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / 'data'
OUTPUT_FILE = DATA_DIR / 'transactions.csv'


def generate_dataset(rows: int = 15_000, random_state: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(random_state)
    amount = np.clip(np.exp(rng.normal(8.2, 1.05, rows)), 50, 150_000)
    transaction_hour = rng.integers(0, 24, rows)
    transactions_last_10min = np.clip(rng.poisson(2.8, rows), 0, 25)
    failed_attempts = np.clip(rng.poisson(0.7, rows), 0, 12)
    new_device = rng.binomial(1, 0.18, rows)
    location_change = rng.binomial(1, 0.09, rows)
    account_age_days = np.clip(rng.gamma(2.2, 190, rows), 1, 2500).astype(int)
    previous_chargebacks = np.clip(rng.poisson(0.10, rows), 0, 6)
    ip_repeat_count = np.clip(rng.poisson(1.4, rows), 0, 20)
    merchant_tx_per_min = np.clip(rng.normal(18, 6, rows), 2, 65)
    failure_rate_5m = np.clip(rng.beta(2, 30, rows) * 100, 0, 25)

    risk_logit = (
        -5.4
        + 0.000025 * np.maximum(amount - 15_000, 0)
        + 0.22 * np.maximum(transactions_last_10min - 3, 0)
        + 0.58 * failed_attempts
        + 0.60 * new_device
        + 0.78 * location_change
        + 0.80 * (account_age_days < 30)
        + 1.20 * previous_chargebacks
        + 0.14 * np.maximum(ip_repeat_count - 3, 0)
        + 0.065 * np.maximum(merchant_tx_per_min - 25, 0)
        + 0.18 * np.maximum(failure_rate_5m - 3, 0)
        + 0.45 * (transaction_hour < 5)
    )
    # Synthetic labels are generated from the same observable risk factors
    # with a small amount of label noise. This creates a learnable development
    # benchmark without claiming to represent real-world fraud prevalence.
    fraud_signal = risk_logit + rng.normal(0, 0.18, rows)
    fraud = (fraud_signal > -2.5).astype(int)

    return pd.DataFrame({
        'amount': np.round(amount, 2),
        'transaction_hour': transaction_hour,
        'transactions_last_10min': transactions_last_10min,
        'failed_attempts': failed_attempts,
        'new_device': new_device,
        'location_change': location_change,
        'account_age_days': account_age_days,
        'previous_chargebacks': previous_chargebacks,
        'ip_repeat_count': ip_repeat_count,
        'merchant_tx_per_min': np.round(merchant_tx_per_min, 2),
        'failure_rate_5m': np.round(failure_rate_5m, 2),
        'fraud': fraud,
    })


if __name__ == '__main__':
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    dataframe = generate_dataset()
    dataframe.to_csv(OUTPUT_FILE, index=False)
    print(f'Dataset created: {OUTPUT_FILE}')
    print(f'Rows: {len(dataframe)}')
    print(f'Fraud cases: {dataframe["fraud"].sum()}')
    print(f'Fraud rate: {dataframe["fraud"].mean() * 100:.2f}%')
