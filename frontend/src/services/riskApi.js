const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function postJson(path, data) {
  const response = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if (!response.ok) throw new Error(`RazorGuard API request failed: ${response.status}`)
  return response.json()
}

export function analyseSpike(data) {
  return postJson('/spike/analyze', data)
}

export function predictPayment(data) {
  return postJson('/predict', data)
}

export async function getModelMetrics() {
  const response = await fetch(`${API_BASE}/metrics`)
  if (!response.ok) throw new Error(`Unable to load metrics: ${response.status}`)
  return response.json()
}
