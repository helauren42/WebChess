import uvicorn
import fastapi

from utils import HOST, PORT

app = fastapi.FastAPI()

@app.get("/")
async def home():
    return "hello world"


if __name__ == "__main__":
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True)
