from fastapi import FastAPI

app = FastAPI(
    title="RazorGuard AI API",
    description="Real-time fraud spike intelligence for merchants.",
    version="0.1.0",
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
