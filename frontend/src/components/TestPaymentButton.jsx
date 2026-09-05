import { useState } from 'react'
import { CheckCircle2, CreditCard } from 'lucide-react'
import { createOrder, verifyPayment } from '../services/paymentApi'
import { loadRazorpayScript } from '../utils/loadRazorpay'

function TestPaymentButton() {
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')

  async function startPayment() {
    setLoading(true)
    setVerified(false)
    setError('')
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error('Razorpay Checkout could not load.')
      const response = await createOrder(100)
      const checkout = new window.Razorpay({
        key: response.key_id,
        amount: response.order.amount,
        currency: response.order.currency,
        name: 'RazorGuard AI',
        description: 'Buildathon Test Payment',
        order_id: response.order.id,
        handler: async (checkoutResponse) => {
          try {
            const result = await verifyPayment({
              razorpay_order_id: checkoutResponse.razorpay_order_id,
              razorpay_payment_id: checkoutResponse.razorpay_payment_id,
              razorpay_signature: checkoutResponse.razorpay_signature,
            })
            if (result.success) setVerified(true)
          } catch {
            setError('Payment signature could not be verified.')
          }
        },
        theme: { color: '#7168EA' },
        modal: { ondismiss: () => setLoading(false) },
      })
      checkout.on('payment.failed', () => setError('Test payment failed.'))
      checkout.open()
    } catch (paymentError) {
      setError(paymentError.message || 'Unable to start test payment.')
    } finally {
      setLoading(false)
    }
  }

  return <div className="test-payment-wrap"><button className="test-payment-button" onClick={startPayment} disabled={loading}>{verified ? <><CheckCircle2 size={15} /> Payment verified</> : <><CreditCard size={15} /> {loading ? 'Opening...' : 'Run INR 100 Test Payment'}</>}</button>{error && <small>{error}</small>}</div>
}

export default TestPaymentButton
