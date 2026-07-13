from fastapi import APIRouter, UploadFile, File
from app.services.review_service import review_service

router = APIRouter(
    prefix="/review",
    tags=["Code Review"]
)


@router.get("/")
def review_home():
    return {
        "message": "Welcome to AI Code Reviewer 🚀",
        "status": "Review Module Working"
    }


@router.post("/upload")
async def upload_python_file(
    file: UploadFile = File(...)
):
    return await review_service.read_python_file(file)