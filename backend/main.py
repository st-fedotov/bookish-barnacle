from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import uvicorn
from llm_privacy_wrapper import LLMPrivacyWrapper
from openai import OpenAI

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize your privacy wrapper with your replacement map
replacement_map = {
    "sensitive_word1": "innocent_word1",
    "sensitive_word2": "innocent_word2",
    # Add more mappings as needed
}
privacy_wrapper = LLMPrivacyWrapper(replacement_map)

# Initialize OpenAI client
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
