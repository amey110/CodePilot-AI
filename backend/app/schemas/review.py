from pydantic import BaseModel


class CodeReviewRequest(BaseModel):
    code: str


class CodeReviewResponse(BaseModel):
    success: bool
    score: float
    rating: str
    issues: list[str]