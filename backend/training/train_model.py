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
    x_train_full, x_test, y_train_full, y_test = train_test_split(dataframe[FEATURE_COLUMNS], dataframe['fraud'], test_size=.25, random_state=42, stratify=dataframe['fraud'])
    x_train, x_validation, y_train, y_validation = train_test_split(x_train_full, y_train_full, test_size=.2, random_state=42, stratify=y_train_full)
    model = RandomForestClassifier(n_estimators=250, max_depth=14, min_samples_leaf=3, class_weight='balanced', random_state=42, n_jobs=-1)
    model.fit(x_train, y_train)
    validation_probabilities = model.predict_proba(x_validation)[:, 1]
    threshold_candidates = [round(value, 2) for value in pd.Series(range(5, 96)).div(100)]
    threshold = max(threshold_candidates, key=lambda candidate: (f1_score(y_validation, validation_probabilities >= candidate, zero_division=0), recall_score(y_validation, validation_probabilities >= candidate, zero_division=0)))
    model.fit(x_train_full, y_train_full)
    probabilities = model.predict_proba(x_test)[:, 1]
    predictions = probabilities >= threshold
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
        'decision_threshold': threshold,
        'dataset_type': 'synthetic-development',
    }
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump({'model': model, 'features': FEATURE_COLUMNS, 'threshold': threshold}, MODEL_FILE)
    METRICS_FILE.write_text(json.dumps(metrics, indent=2), encoding='utf-8')
    print(f'Accuracy : {metrics["accuracy"] * 100:.2f}%')
    print(f'Precision: {metrics["precision"] * 100:.2f}%')
    print(f'Recall   : {metrics["recall"] * 100:.2f}%')
    print(f'F1 Score : {metrics["f1_score"] * 100:.2f}%')
    print(f'Threshold: {threshold:.2f}')
    print('\nConfusion Matrix\n', matrix)
    print('\nClassification Report\n', classification_report(y_test, predictions))
    print(f'\nModel saved: {MODEL_FILE}')
    return metrics


if __name__ == '__main__':
    train()
