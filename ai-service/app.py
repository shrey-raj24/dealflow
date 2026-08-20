from fastapi import FastAPI
app = FastAPI()

# Added fallback rules engine circuit breaker
def fallback_scoring(deal):
    return {"risk": 50, "reason": "Fallback engine (OpenAI timeout)"}
