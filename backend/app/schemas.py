from pydantic import BaseModel, Field


class TransactionInput(BaseModel):
    amount: float = Field(gt=0)
    transaction_hour: int = Field(ge=0, le=23)
    transactions_last_10min: int = Field(ge=0)
    failed_attempts: int = Field(ge=0)
    new_device: int = Field(ge=0, le=1)
    location_change: int = Field(ge=0, le=1)
    account_age_days: int = Field(ge=0)
    previous_chargebacks: int = Field(ge=0)
    ip_repeat_count: int = Field(ge=0)
    merchant_tx_per_min: float = Field(ge=0)
    failure_rate_5m: float = Field(ge=0, le=100)


class SpikeInput(BaseModel):
    current_tx_per_min: float = Field(ge=0)
    baseline_tx_per_min: float = Field(gt=0)
    current_failure_rate: float = Field(ge=0)
    baseline_failure_rate: float = Field(gt=0)
    current_new_devices: int = Field(ge=0)
    baseline_new_devices: int = Field(ge=0)
    current_ip_repeats: int = Field(ge=0)
    baseline_ip_repeats: int = Field(ge=0)


class CreateOrderInput(BaseModel):
    amount: float = Field(gt=0)
    currency: str = 'INR'
    receipt: str | None = None


class VerifyPaymentInput(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
