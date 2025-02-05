from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
from llm_privacy_wrapper import LLMPrivacyWrapper
from openai import OpenAI
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize your privacy wrapper with your replacement map
replacement_map = {
     "Hogwarts": "Hogsmith State Secondary School",
     "Albus Dumbledore": "Merlin",
     "Ministry of Magic": "London Bureau of Immigration and Statistics"
    # Add more mappings as needed
}

# Create the privacy wrapper instance with the replacement map
privacy_wrapper = LLMPrivacyWrapper(replacement_map=replacement_map)

# Initialize Nebius client
client = OpenAI(
    base_url="https://api.studio.nebius.ai/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY"),
)

class QueryRequest(BaseModel):
    text: str
    model: str

@app.post("/api/query")
async def query_llm(request: QueryRequest):
    try:
        response = privacy_wrapper.answer_with_llm(
            text=request.text,
            client=client,
            model=request.model
        )
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add a health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
