# RazorGuard AI

AI-powered real-time fraud-spike detection and payment risk intelligence platform for Razorpay merchants, built for the Razorpay Buildathon.

Real-time fraud spike intelligence for merchants.

RazorGuard AI observes transaction streams, detects abnormal changes in payment behaviour, explains the signals behind a spike, and helps merchants decide what to do next.

## Project Structure

- `frontend/` - React and Vite merchant experience
- `backend/` - FastAPI service and transaction APIs
- `ml/` - datasets, notebooks, training code, and saved models
- `docs/` - product and engineering documentation

## Current Phase

Step 1: project setup.

The next implementation step is to create a transaction dataset, explore it with Pandas, and build the first fraud engine before designing the frontend.

## Backend Quick Start

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API health check is available at `http://127.0.0.1:8000/health`.

## Phase 6: AI + FastAPI

The backend includes a synthetic development dataset, a Random Forest fraud classifier, a statistical fraud-spike detector, and FastAPI routes for prediction and model metrics.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python training/generate_data.py
python training/train_model.py
uvicorn app.main:app --reload
```

Available endpoints:

- `GET /health`
- `POST /predict`
- `POST /spike/analyze`
- `GET /metrics`

The generated dataset and metrics describe a synthetic development environment. They are not evidence of real-world fraud performance. The trained `.joblib` model artifact is intentionally ignored by Git and should be regenerated from the training scripts.

## Phase 7: Razorpay Test Mode

Copy `backend/.env.example` to `backend/.env` and fill it with Razorpay **Test Mode** credentials. Never expose the key secret or webhook secret in React or commit the `.env` file.

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

Payment routes:

- `POST /payments/create-order` creates a server-side test order in paise
- `POST /payments/verify` verifies the Checkout signature server-side
- `POST /webhooks/razorpay` verifies the raw webhook body and records captured/failed payments
- `GET /payments/stream` returns the in-memory five-minute payment snapshot

Local Checkout and signature verification work on `127.0.0.1`. Razorpay webhook delivery requires a public deployed URL, which is part of the final deployment phase. The payment stream is intentionally in-memory for this MVP and should move to SQLite/PostgreSQL later.

## Phase 8: Deployment

The repository is prepared for Vercel + Render deployment:

- Vercel project root: `frontend/`
- Frontend build command: `npm run build`
- Frontend output directory: `dist`
- Frontend variable: `VITE_API_URL=https://your-backend.onrender.com`
- Render service root: `backend/`
- Render build command: `pip install -r requirements.txt`
- Render start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Render variable: `FRONTEND_URL=https://your-site.vercel.app`

`frontend/vercel.json` contains the Vite SPA rewrite. `render.yaml` contains the backend service definition and secret variable names. Use `frontend/.env.example` and `backend/.env.example` as templates; never commit real credentials.

The deployable model artifact is `backend/artifacts/fraud_model.joblib`, generated from the synthetic development dataset. The metrics endpoint and UI label these results accordingly; they are not production fraud-performance claims.

## Buildathon Demo

1. Start with the payment-behaviour problem.
2. Switch the Risk Lab from normal traffic to a simulated spike.
3. Show the score, ratios, signals, and recommended action.
4. Show the live model metrics and synthetic-data disclaimer.
5. Run the Razorpay Test Mode payment after configuring credentials.
6. Explain the server-side order, signature verification, and webhook stream.

For deployment, configure the Razorpay Test Mode webhook URL as `https://your-backend.onrender.com/webhooks/razorpay` and enable `payment.captured` and `payment.failed`.
