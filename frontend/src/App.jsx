import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, ArrowRight, BarChart3, Bell, BrainCircuit, CircleCheck, CreditCard, Eye, Gauge, IndianRupee, Landmark, Network, Radar, Search, ShieldCheck, SlidersHorizontal, Smartphone, TriangleAlert, WalletCards, Zap } from 'lucide-react'
import TestPaymentButton from './components/TestPaymentButton'
import { analyseSpike } from './services/riskApi'
import './App.css'

const stats = [
  ['TRANSACTIONS / MIN', '42', 'Normal range', 'good'],
  ['SUSPICIOUS RATE', '1.8%', 'Stable', 'good'],
  ['ACTIVE ALERTS', '3', 'Requires review', 'warning'],
  ['AT-RISK VALUE', '₹84.2K', 'Being monitored', 'warning'],
]

function HowItWorks() {
  const [mode, setMode] = useState('spike')
  const isSpike = mode === 'spike'

  return (
    <section className="how-section" id="how">
      <div className="how-glow how-glow-left" />
      <div className="how-glow how-glow-right" />
      <div className="how-container">
        <motion.div className="how-heading" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .7 }}>
          <div className="section-label">HOW IT WORKS</div>
          <h2>From payment activity<span>to fraud intelligence.</span></h2>
          <p>RazorGuard continuously observes payment behaviour, compares current activity with expected patterns, and surfaces abnormal spikes before they become expensive.</p>
          <div className="flow-switch"><button className={mode === 'normal' ? 'active' : ''} onClick={() => setMode('normal')}><CircleCheck size={14} /> Normal traffic</button><button className={mode === 'spike' ? 'active spike' : ''} onClick={() => setMode('spike')}><TriangleAlert size={14} /> Simulate fraud spike</button></div>
        </motion.div>

        <motion.div className="flow-stage" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .9 }}>
          <svg className="flow-lines" viewBox="0 0 1000 650" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="flowBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#49c9f2" /><stop offset="100%" stopColor="#7b6df3" /></linearGradient><linearGradient id="flowSafe" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#63c9ef" /><stop offset="100%" stopColor="#34bf86" /></linearGradient><linearGradient id="flowRisk" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7c71ef" /><stop offset="100%" stopColor="#ec7183" /></linearGradient></defs>
            <motion.path d="M500 120 C500 170 500 175 500 225" fill="none" stroke="url(#flowBlue)" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
            <motion.path d="M500 120 C500 170 500 175 500 225" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeDasharray="3 25" animate={{ strokeDashoffset: [0, -56] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
            <motion.path d="M500 365 C500 420 250 405 190 485" fill="none" stroke={!isSpike ? 'url(#flowSafe)' : '#d9e5ed'} strokeWidth={!isSpike ? 3 : 1.5} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: .4, duration: 1 }} />
            <motion.path d="M500 365 C500 420 750 405 810 485" fill="none" stroke={isSpike ? 'url(#flowRisk)' : '#d9e5ed'} strokeWidth={isSpike ? 3 : 1.5} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: .4, duration: 1 }} />
            <motion.path d={isSpike ? 'M500 365 C500 420 750 405 810 485' : 'M500 365 C500 420 250 405 190 485'} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeDasharray="3 29" animate={{ strokeDashoffset: [0, -64] }} transition={{ duration: 1.7, repeat: Infinity, ease: 'linear' }} />
          </svg>

          <motion.div className="flow-node source-node" animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}><div className="node-top"><div className="node-icon blue"><CreditCard size={19} /></div><span>LIVE INPUT</span></div><h3>Transaction Stream</h3><p>Razorpay payment activity</p><div className="transaction-signals"><div><span>VELOCITY</span><strong>{isSpike ? '42/min' : '18/min'}</strong></div><div><span>FAILURES</span><strong className={isSpike ? 'danger-text' : ''}>{isSpike ? '8.7%' : '1.2%'}</strong></div></div></motion.div>

          <div className={`flow-node ai-node ${isSpike ? 'spike-active' : ''}`}><div className="ai-animation"><motion.div className="ai-ring ai-ring-one" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }} /><motion.div className="ai-ring ai-ring-two" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: 'linear' }} /><div className="ai-center"><BrainCircuit size={27} /></div></div><div className="ai-copy"><span>RAZORGUARD ENGINE</span><h3>Behaviour Intelligence</h3><p>Comparing live behaviour against expected patterns.</p></div><div className="ai-risk-mini"><span>SPIKE SCORE</span><strong>{isSpike ? '87' : '12'}<small>/100</small></strong></div></div>

          <motion.div className={`flow-node outcome-node normal-node ${!isSpike ? 'active-outcome' : ''}`} animate={{ scale: !isSpike ? 1.03 : 1 }}><div className="outcome-header"><div className="node-icon green"><CircleCheck size={19} /></div><span className="safe-status">NORMAL</span></div><h3>Expected Behaviour</h3><p>Payment patterns remain inside the expected range.</p><div className="outcome-data"><div><span>DEVIATION</span><strong>+4%</strong></div><div><span>ACTION</span><strong>Continue</strong></div></div></motion.div>
          <motion.div className={`flow-node outcome-node spike-node ${isSpike ? 'active-outcome' : ''}`} animate={{ scale: isSpike ? 1.03 : 1 }}><div className="outcome-header"><div className="node-icon red"><TriangleAlert size={19} /></div><span className="danger-status">FRAUD SPIKE</span></div><h3>Abnormal Behaviour</h3><p>Multiple payment signals changed unusually fast.</p><div className="outcome-data"><div><span>DEVIATION</span><strong className="danger-text">+327%</strong></div><div><span>ACTION</span><strong>Investigate</strong></div></div></motion.div>
          <motion.div className="floating-signal signal-one" animate={{ y: [0, -9, 0], rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity }}><Radar size={13} /> Velocity</motion.div>
          <motion.div className="floating-signal signal-two" animate={{ y: [0, 8, 0], rotate: [2, -2, 2] }} transition={{ duration: 6, repeat: Infinity }}><Activity size={13} /> Failure rate</motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function IntelligenceBento() {
  const reasons = [
    ['Payment velocity', '+327%', 'red', '94%'],
    ['Failed payments', '4.8x', 'orange', '81%'],
    ['New devices', '+190%', 'purple', '68%'],
    ['Repeated IP activity', '+144%', 'blue', '58%'],
  ]

  return (
    <section className="intelligence-section" id="features">
      <div className="intel-glow intel-glow-one" />
      <div className="intel-glow intel-glow-two" />
      <div className="intelligence-container">
        <motion.div className="intelligence-heading" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .7 }}>
          <div className="section-label">INTELLIGENCE</div>
          <h2>Built to understand<span>what changed - and why.</span></h2>
          <p>RazorGuard combines transaction-level risk signals with behaviour changes across the payment stream, helping merchants detect suspicious spikes without losing context.</p>
        </motion.div>

        <div className="intelligence-bento">
          <motion.article className="intel-card spike-intelligence-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7 }} whileHover={{ y: -5 }}>
            <div className="intel-card-top"><div className="intel-icon blue"><BarChart3 size={19} /></div><span className="intel-mini-label">LIVE DETECTION</span></div>
            <h3>See the spike as it happens.</h3><p>RazorGuard watches transaction velocity and suspicious-payment behaviour against the merchant&apos;s expected baseline.</p>
            <div className="spike-live-data"><div><span>TRANSACTIONS / MIN</span><strong>42</strong><small className="intel-danger">up 327%</small></div><div><span>FAILURE RATE</span><strong>8.7%</strong><small className="intel-danger">up 4.8x</small></div><div><span>RISK LEVEL</span><strong>87</strong><small>/100</small></div></div>
            <div className="intel-chart"><svg viewBox="0 0 700 230" preserveAspectRatio="none" aria-label="Fraud spike activity chart"><defs><linearGradient id="intelGraphStroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#43c5ef" /><stop offset="70%" stopColor="#7f70ef" /><stop offset="100%" stopColor="#ed7083" /></linearGradient><linearGradient id="intelGraphFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#816ff0" stopOpacity=".24" /><stop offset="100%" stopColor="#42c5ef" stopOpacity="0" /></linearGradient></defs><line x1="0" y1="55" x2="700" y2="55" className="chart-grid-line" /><line x1="0" y1="115" x2="700" y2="115" className="chart-grid-line" /><line x1="0" y1="175" x2="700" y2="175" className="chart-grid-line" /><motion.path d="M0 170 C45 163 80 168 110 158 S170 150 210 157 S265 166 300 151 S350 143 390 150 S430 148 455 132 S490 96 515 110 S545 64 570 72 S610 45 635 62 S675 30 700 27 L700 230 L0 230 Z" fill="url(#intelGraphFill)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: .5, duration: 1 }} /><motion.path d="M0 170 C45 163 80 168 110 158 S170 150 210 157 S265 166 300 151 S350 143 390 150 S430 148 455 132 S490 96 515 110 S545 64 570 72 S610 45 635 62 S675 30 700 27" fill="none" stroke="url(#intelGraphStroke)" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: 'easeInOut' }} /><motion.circle cx="635" cy="62" r="6" fill="#ed7083" initial={{ scale: 0 }} whileInView={{ scale: [0, 1.4, 1] }} viewport={{ once: true }} transition={{ delay: 1.6, duration: .5 }} /><motion.circle cx="635" cy="62" r="13" fill="none" stroke="#ed7083" strokeOpacity=".25" animate={{ r: [8, 18], opacity: [.6, 0] }} transition={{ duration: 1.8, repeat: Infinity }} /></svg><div className="spike-marker">FRAUD SPIKE</div><div className="intel-chart-labels"><span>12:10</span><span>12:15</span><span>12:20</span><span>12:25</span><span>12:30</span></div></div>
          </motion.article>

          <motion.article className="intel-card explanation-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: .1, duration: .7 }} whileHover={{ y: -5 }}>
            <div className="intel-card-top"><div className="intel-icon purple"><Eye size={19} /></div><span className="intel-mini-label">EXPLAINABILITY</span></div><h3>Never just say<br />“high risk.”</h3><p>Every alert tells the merchant what changed and which signals contributed to the decision.</p>
            <div className="explain-risk-score"><div className="explain-ring"><div><strong>87</strong><span>/100</span></div></div><div className="explain-score-copy"><span>FRAUD SPIKE</span><strong>High Risk</strong><p>Multiple abnormal signals were detected together.</p></div></div>
            <div className="risk-reasons">{reasons.map(([name, value, color, width], index) => <div className="risk-reason" key={name}><div className="reason-name"><span className={`reason-dot ${color}`} />{name}</div><div className="reason-right"><strong>{value}</strong><div className="reason-bar"><motion.div initial={{ width: 0 }} whileInView={{ width }} viewport={{ once: true }} transition={{ delay: index * .1, duration: 1 }} /></div></div></div>)}</div>
            <div className="recommended-action"><div><ShieldCheck size={15} /> Recommended action</div><strong>Review high-risk card payments</strong></div>
          </motion.article>

          <motion.article className="intel-card model-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: .15, duration: .7 }} whileHover={{ y: -5 }}>
            <div className="intel-card-top"><div className="intel-icon green"><Gauge size={19} /></div><span className="metric-demo-badge">DEMO UI</span></div><h3>Measure detection honestly.</h3><p>The final model will report actual held-out test results instead of relying on an accuracy claim alone.</p>
            <div className="metric-main"><div className="metric-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" className="metric-ring-bg" /><motion.circle cx="60" cy="60" r="48" className="metric-ring-value" initial={{ pathLength: 0 }} whileInView={{ pathLength: .92 }} viewport={{ once: true }} transition={{ duration: 1.5 }} /></svg><div><strong>-</strong><span>F1</span></div></div><div className="metric-copy"><span>MODEL QUALITY</span><strong>Awaiting trained model</strong><p>Real metrics will appear here after ML integration.</p></div></div>
            <div className="model-metrics"><div><span>PRECISION</span><strong>-</strong></div><div><span>RECALL</span><strong>-</strong></div><div><span>FALSE POSITIVES</span><strong>-</strong></div></div><div className="model-note">These values remain blank until RazorGuard is connected to the real trained model.</div>
          </motion.article>

          <motion.article className="intel-card network-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: .2, duration: .7 }} whileHover={{ y: -5 }}>
            <div className="intel-card-top"><div className="intel-icon orange"><Network size={19} /></div><span className="intel-mini-label">PAYMENT SIGNALS</span></div><h3>One intelligence layer across payment behaviour.</h3><p>Combine behaviour from multiple payment channels into one merchant risk view.</p>
            <div className="network-visual"><svg viewBox="0 0 600 330" className="network-lines" aria-hidden="true"><defs><linearGradient id="networkGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#40c3ed" /><stop offset="100%" stopColor="#846dec" /></linearGradient></defs><motion.path d="M150 75 C220 80 230 155 300 165" fill="none" stroke="url(#networkGradient)" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} /><motion.path d="M450 75 C380 80 370 155 300 165" fill="none" stroke="url(#networkGradient)" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} /><motion.path d="M145 260 C215 245 230 175 300 165" fill="none" stroke="url(#networkGradient)" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} /><motion.path d="M455 260 C385 245 370 175 300 165" fill="none" stroke="url(#networkGradient)" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} /><circle r="4" fill="#fff" className="network-packet"><animateMotion dur="2.4s" repeatCount="indefinite" path="M150 75 C220 80 230 155 300 165" /></circle><circle r="4" fill="#fff" className="network-packet"><animateMotion dur="2.8s" repeatCount="indefinite" path="M455 260 C385 245 370 175 300 165" /></circle></svg>
              <PaymentNode className="payment-upi" icon={Smartphone} title="UPI" subtitle="Payment activity" motionY={[-6, 0, -6]} /><PaymentNode className="payment-card" icon={CreditCard} title="Cards" subtitle="Failure behaviour" motionY={[6, 0, 6]} /><PaymentNode className="payment-bank" icon={Landmark} title="Net Banking" subtitle="Transaction flow" motionY={[5, 0, 5]} /><PaymentNode className="payment-wallet" icon={WalletCards} title="Wallets" subtitle="Customer signals" motionY={[-5, 0, -5]} />
              <motion.div className="network-center" animate={{ scale: [1, 1.035, 1] }} transition={{ duration: 3, repeat: Infinity }}><div className="network-center-icon"><Zap size={22} /></div><strong>RazorGuard</strong><span>RISK ENGINE</span></motion.div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}

function PaymentNode({ className, icon: Icon, title, subtitle, motionY }) {
  return <motion.div className={`payment-node ${className}`} animate={{ y: motionY }} transition={{ duration: 4.5, repeat: Infinity }}><Icon size={18} /><div><strong>{title}</strong><span>{subtitle}</span></div></motion.div>
}

function TrustAndPerformance() {
  return (
    <section className="trust-section" id="trust">
      <div className="trust-bg-glow trust-glow-one" />
      <div className="trust-bg-glow trust-glow-two" />
      <div className="trust-container">
        <motion.div className="trust-heading" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
          <div className="section-label">TRUST &amp; PERFORMANCE</div>
          <h2>AI risk decisions should be<span>measurable and explainable.</span></h2>
          <p>RazorGuard is designed around clear reasoning, merchant control and measurable model performance, not hidden predictions.</p>
        </motion.div>

        <div className="trust-feature-grid">
          <TrustFeature icon={Eye} tone="blue" title="Explainable alerts">Merchants can see which payment signals caused a fraud-spike alert instead of receiving only a black-box score.</TrustFeature>
          <TrustFeature icon={ShieldCheck} tone="green" title="Merchant control">RazorGuard recommends an action while keeping review decisions visible to the merchant.</TrustFeature>
          <TrustFeature icon={Gauge} tone="purple" title="Measured performance">Precision, recall, F1 score and false positives will come from the real held-out test set.</TrustFeature>
        </div>

        <motion.div className="performance-console" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .8 }}>
          <div className="performance-left"><div className="performance-title"><div><span>MODEL EVALUATION</span><h3>Fraud Detection Performance</h3></div><div className="backend-pending">BACKEND PENDING</div></div><div className="performance-metrics">{['PRECISION', 'RECALL', 'F1 SCORE'].map((metric) => <div key={metric}><span>{metric}</span><strong>-</strong><small>Awaiting model</small></div>)}</div><div className="confusion-wrapper"><div className="confusion-heading"><span>CONFUSION MATRIX</span><small>Held-out test data</small></div><div className="confusion-grid"><div /><div className="confusion-axis">Predicted Safe</div><div className="confusion-axis">Predicted Fraud</div><div className="confusion-axis">Actual Safe</div><MatrixCell tone="safe-cell" label="True Negative" /><MatrixCell tone="warning-cell" label="False Positive" /><div className="confusion-axis">Actual Fraud</div><MatrixCell tone="warning-cell" label="False Negative" /><MatrixCell tone="fraud-cell" label="True Positive" /></div></div></div>
          <div className="performance-right"><span className="performance-side-label">EVALUATION PHILOSOPHY</span><h3>Accuracy alone isn&apos;t enough.</h3><p>Fraud detection must balance catching suspicious transactions with avoiding unnecessary blocks on genuine customers.</p><div className="evaluation-list"><EvaluationItem number="01" title="Precision">How many flagged payments were actually fraudulent?</EvaluationItem><EvaluationItem number="02" title="Recall">How much real fraudulent activity did the system detect?</EvaluationItem><EvaluationItem number="03" title="False positives">How many genuine payments were incorrectly flagged?</EvaluationItem></div><div className="model-disclaimer">Model results will appear only after the Python fraud model is trained and evaluated.</div></div>
        </motion.div>

        <motion.div className="final-cta" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .8 }}><div className="final-cta-glow" /><div className="final-cta-content"><span>RAZORGUARD AI</span><h2>Detect the spike.<br /><span>Protect the payment.</span></h2><p>Real-time fraud intelligence designed to help merchants understand abnormal payment behaviour before it turns into financial loss.</p><div className="final-cta-buttons"><a href="#features" className="final-primary">Open Intelligence Console <ArrowRight size={15} /></a><a href="#how" className="final-secondary">See how it works</a></div></div></motion.div>
      </div>
      <footer className="rg-footer"><div className="footer-inner"><div className="footer-brand"><div className="footer-logo"><ShieldCheck size={18} /></div><div><strong>RazorGuard AI</strong><span>FRAUD-SPIKE INTELLIGENCE</span></div></div><div className="footer-links"><a href="#how">How it works</a><a href="#features">Intelligence</a><a href="#trust">Trust</a></div><div className="footer-status"><span /> BUILDATHON PROTOTYPE</div></div><div className="footer-bottom"><p>RazorGuard AI is a Buildathon prototype operating in a demonstration/test environment.</p><span>© 2026 RazorGuard AI</span></div></footer>
    </section>
  )
}

function TrustFeature({ icon: Icon, tone, title, children }) {
  return <motion.article className="trust-feature" whileHover={{ y: -5 }}><div className={`trust-feature-icon ${tone}`}><Icon size={20} /></div><h3>{title}</h3><p>{children}</p></motion.article>
}

function MatrixCell({ tone, label }) {
  return <div className={`confusion-cell ${tone}`}><strong>-</strong><span>{label}</span></div>
}

function EvaluationItem({ number, title, children }) {
  return <div><div className="evaluation-icon">{number}</div><div><strong>{title}</strong><span>{children}</span></div></div>
}

function RiskLab() {
  const [mode, setMode] = useState('normal')
  const [backendRisk, setBackendRisk] = useState(null)
  const [error, setError] = useState('')

  const windows = {
    normal: { current_tx_per_min: 18, baseline_tx_per_min: 18, current_failure_rate: 1.2, baseline_failure_rate: 1.2, current_new_devices: 8, baseline_new_devices: 8, current_ip_repeats: 3, baseline_ip_repeats: 3 },
    warning: { current_tx_per_min: 29, baseline_tx_per_min: 18, current_failure_rate: 3.2, baseline_failure_rate: 1.2, current_new_devices: 14, baseline_new_devices: 8, current_ip_repeats: 8, baseline_ip_repeats: 3 },
    spike: { current_tx_per_min: 45, baseline_tx_per_min: 18, current_failure_rate: 8.7, baseline_failure_rate: 1.2, current_new_devices: 28, baseline_new_devices: 8, current_ip_repeats: 18, baseline_ip_repeats: 3 },
  }

  useEffect(() => {
    let cancelled = false
    setError('')
    analyseSpike(windows[mode]).then((result) => {
      if (!cancelled) setBackendRisk(result)
    }).catch(() => {
      if (!cancelled) {
        setBackendRisk(null)
        setError('Backend offline - showing the selected test window.')
      }
    })
    return () => { cancelled = true }
  }, [mode])

  const current = windows[mode]
  const score = backendRisk?.spike_score ?? (mode === 'spike' ? 90 : mode === 'warning' ? 42 : 8)
  const status = backendRisk?.status ?? (mode === 'spike' ? 'critical' : mode === 'warning' ? 'warning' : 'normal')

  return <section className="risk-lab-section" id="risk-lab"><div className="risk-lab-container"><div className="risk-lab-copy"><div className="section-label">BACKEND-CONNECTED PREVIEW</div><h2>Pressure-test the signal.<span>Watch the risk change.</span></h2><p>These controls send real baseline comparisons to the FastAPI spike detector. The response comes back as a score, status, ratios, and explainable signals.</p><div className="lab-mode-buttons">{[['normal', 'Normal traffic'], ['warning', 'Raise pressure'], ['spike', 'Simulate fraud spike']].map(([value, label]) => <button key={value} className={mode === value ? `active ${value}` : ''} onClick={() => setMode(value)}>{label}</button>)}</div>{error && <small className="lab-error">{error}</small>}</div><motion.div className="risk-lab-console" layout><div className="risk-lab-header"><div><span><span className="live-dot" /> FRAUD SPIKE LAB</span><h3>Current payment window</h3></div><strong className={`lab-status ${status}`}>{status.toUpperCase()}</strong></div><div className="risk-lab-score"><div><span>SPIKE SCORE</span><strong>{score}<small>/100</small></strong></div><div className={`lab-score-ring ${status}`} style={{ '--lab-score': `${score * 3.6}deg` }}><span>{score}</span></div></div><div className="risk-lab-stats"><div><span>TRANSACTIONS / MIN</span><strong>{current.current_tx_per_min}</strong><small>baseline {current.baseline_tx_per_min}</small></div><div><span>FAILURE RATE</span><strong>{current.current_failure_rate}%</strong><small>baseline {current.baseline_failure_rate}%</small></div><div><span>NEW DEVICES</span><strong>{current.current_new_devices}</strong><small>baseline {current.baseline_new_devices}</small></div></div><div className="lab-signal-list">{(backendRisk?.signals ?? [{ signal: 'waiting', message: 'Waiting for the FastAPI response.' }]).map((signal) => <div key={signal.signal}><TriangleAlert size={14} /><span>{signal.message}</span></div>)}</div><div className="lab-action"><span>RECOMMENDED ACTION</span><strong>{backendRisk?.recommended_action ?? 'Connect backend to receive action guidance'}</strong></div></motion.div></div></section>
}

function App() {
  return (
    <div className="app" id="top">
      <nav className="navbar">
        <div className="nav-inner">
          <a className="brand" href="#top" aria-label="RazorGuard AI home">
            <span className="brand-icon"><ShieldCheck size={19} /></span>
            <span className="brand-copy"><strong>RazorGuard</strong><span>AI RISK INTELLIGENCE</span></span>
          </a>
          <div className="nav-links"><a href="#product">Product</a><a href="#how">How it works</a><a href="#features">Intelligence</a><a href="#trust">Trust</a></div>
          <a className="nav-button" href="#product">Launch console <ArrowRight size={14} /></a>
        </div>
      </nav>

      <main className="hero" id="product">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <motion.div className="light-orbit orbit-one" animate={{ rotate: [0, 360] }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} />
        <motion.div className="light-orbit orbit-two" animate={{ rotate: [360, 0] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />

        <section className="hero-content">
          <motion.div className="hero-badge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}><span className="live-dot" /> FRAUD-SPIKE INTELLIGENCE</motion.div>
          <motion.p className="hero-small-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, duration: .7 }}>REAL-TIME AI FOR PAYMENT RISK</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .8 }}>DETECT FRAUD SPIKES<span> BEFORE THEY BECOME LOSSES.</span></motion.h1>
          <motion.p className="hero-description" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .7 }}>RazorGuard continuously studies payment behaviour, identifies abnormal transaction spikes and explains exactly what changed, helping merchants react before suspicious activity becomes expensive.</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4, duration: .6 }}><a className="primary-button" href="#dashboard">Launch risk console <ArrowRight size={16} /></a><a className="secondary-button" href="#how">See how it works</a></motion.div>
          <motion.div className="trust-line" id="trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }}><span><ShieldCheck size={15} /> Explainable alerts</span><i /><span><Activity size={15} /> Real-time monitoring</span><i /><span><TriangleAlert size={15} /> False-positive aware</span></motion.div>
        </section>

        <motion.section className="dashboard-shell" id="dashboard" initial={{ opacity: 0, y: 80, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: .5, duration: .9 }}>
          <div className="dashboard-glow" />
          <div className="dashboard">
            <aside className="dashboard-sidebar"><div className="mini-brand"><span className="mini-logo">RG</span><strong>RazorGuard</strong></div><div className="sidebar-search"><Search size={13} /> Search</div><div className="sidebar-menu"><button className="active"><Activity size={14} /> Overview</button><button><TriangleAlert size={14} /> Risk events</button><button><IndianRupee size={14} /> Transactions</button><button><ShieldCheck size={14} /> Investigations</button></div><div className="sidebar-footer">TEST ENVIRONMENT</div></aside>
            <div className="dashboard-main">
              <header className="dashboard-header"><div><span>MERCHANT OVERVIEW</span><h3>Payment Risk Console</h3></div><div className="dashboard-header-actions"><button aria-label="Filter dashboard"><SlidersHorizontal size={13} /></button><button aria-label="View alerts"><Bell size={13} /></button><span className="merchant-avatar">M</span></div></header>
              <div className="dashboard-stats">{stats.map(([label, value, note, tone]) => <div className="dashboard-stat" key={label}><span>{label}</span><strong>{value}</strong><small className={tone}>{note}</small></div>)}</div>
              <div className="dashboard-grid">
                <div className="chart-card"><div className="card-heading"><div><span>LIVE TRAFFIC</span><strong>Transaction activity</strong></div><span className="live-label">● LIVE</span></div><div className="chart"><div className="chart-line"><svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-label="Transaction activity chart"><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c6cff" stopOpacity=".32" /><stop offset="100%" stopColor="#38bdf8" stopOpacity="0" /></linearGradient><linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs><path d="M0 140 C60 130 90 118 130 122 S200 145 240 110 S310 85 345 105 S395 120 430 70 S490 45 515 75 S555 110 600 38" fill="none" stroke="url(#chartStroke)" strokeWidth="4" strokeLinecap="round" /><path d="M0 140 C60 130 90 118 130 122 S200 145 240 110 S310 85 345 105 S395 120 430 70 S490 45 515 75 S555 110 600 38 L600 180 L0 180 Z" fill="url(#chartFill)" /></svg></div><div className="chart-labels"><span>12:10</span><span>12:15</span><span>12:20</span><span>12:25</span><span>12:30</span></div></div></div>
                <div className="alert-card"><div className="alert-icon"><TriangleAlert size={20} /></div><span className="alert-label">FRAUD SPIKE</span><strong>Abnormal activity detected</strong><p>Card failure rate increased 4.8× within the last 8 minutes.</p><div className="risk-score"><div><span>RISK SCORE</span><strong>87<small>/100</small></strong></div><div className="risk-ring">87</div></div><a href="#how" className="investigate-button">Investigate event <ArrowRight size={13} /></a></div>
              </div>
            </div>
          </div>
        </motion.section>
        <div className="company-message">Built for merchants who need clarity<br />when payment behaviour changes.</div>
      </main>

      <HowItWorks />
      <IntelligenceBento />
      <RiskLab />
      <div className="payment-launcher"><TestPaymentButton /></div>
      <TrustAndPerformance />

    </div>
  )
}

export default App
