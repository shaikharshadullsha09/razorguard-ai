import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score, precision_score, recall_score
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_FILE = BASE_DIR / 'data' / 'transactions.csv'
ARTIFACT_DIR = BASE_DIR / 'artifacts'
MODEL_FILE = ARTIFACT_DIR / 'fraud_model.joblib'
METRICS_FILE = ARTIFACT_DIR / 'metrics.json'
FEATURE_COLUMNS = ['amount', 'transaction_hour', 'transactions_last_10min', 'failed_attempts', 'new_device', 'location_change', 'account_age_days', 'previous_chargebacks', 'ip_repeat_count', 'merchant_tx_per_min', 'failure_rate_5m']


def train() -> dict[str, int | float | str]:
    dataframe = pd.read_csv(DATA_FILE)
    x_train, x_test, y_train, y_test = train_test_split(dataframe[FEATURE_COLUMNS], dataframe['fraud'], test_size=.25, random_state=42, stratify=dataframe['fraud'])
    model = RandomForestClassifier(n_estimators=250, max_depth=14, min_samples_leaf=3, class_weight='balanced', random_state=42, n_jobs=-1)
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    matrix = confusion_matrix(y_test, predictions)
    tn, fp, fn, tp = matrix.ravel()
    metrics: dict[str, int | float | str] = {
        'accuracy': round(accuracy_score(y_test, predictions), 4),
        'precision': round(precision_score(y_test, predictions, zero_division=0), 4),
        'recall': round(recall_score(y_test, predictions, zero_division=0), 4),
        'f1_score': round(f1_score(y_test, predictions, zero_division=0), 4),
        'true_negative': int(tn),
        'false_positive': int(fp),
        'false_negative': int(fn),
        'true_positive': int(tp),
        'test_samples': len(x_test),
        'dataset_type': 'synthetic-development',
    }
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump({'model': model, 'features': FEATURE_COLUMNS}, MODEL_FILE)
    METRICS_FILE.write_text(json.dumps(metrics, indent=2), encoding='utf-8')
    print(f'Accuracy : {metrics["accuracy"] * 100:.2f}%')
    print(f'Precision: {metrics["precision"] * 100:.2f}%')
    print(f'Recall   : {metrics["recall"] * 100:.2f}%')
    print(f'F1 Score : {metrics["f1_score"] * 100:.2f}%')
    print('\nConfusion Matrix\n', matrix)
    print('\nClassification Report\n', classification_report(y_test, predictions))
    print(f'\nModel saved: {MODEL_FILE}')
    return metrics


if __name__ == '__main__':
    train()
