from fastapi import APIRouter, UploadFile, File
from app.services.review_service import review_service
from app.schemas.review import CodeReviewRequest

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


@router.post("/analyze")
async def analyze_python_code(
    request: CodeReviewRequest
):
    return await review_service.analyze_code(request.code)