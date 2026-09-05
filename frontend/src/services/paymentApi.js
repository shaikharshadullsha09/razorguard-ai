const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function postJson(path, data) {
  const response = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if (!response.ok) throw new Error(`RazorGuard payment request failed: ${response.status}`)
  return response.json()
}

export function createOrder(amount) {
  return postJson('/payments/create-order', { amount, currency: 'INR', receipt: `rg_${Date.now()}` })
}

export function verifyPayment(paymentData) {
  return postJson('/payments/verify', paymentData)
}

export async function getPaymentStream() {
  const response = await fetch(`${API_BASE}/payments/stream`)
  if (!response.ok) throw new Error(`Unable to load payment stream: ${response.status}`)
  return response.json()
}
