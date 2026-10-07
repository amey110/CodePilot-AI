from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class CodeIssue(BaseModel):
    line: Optional[int] = 1
    severity: str = "warning"
    code: Optional[str] = None
    message: str


class AnalyzerResult(BaseModel):
    success: bool
    score: Optional[float] = 0.0
    rating: Optional[str] = "N/A"
    issues: List[CodeIssue] = Field(default_factory=list)


class CodeReviewRequest(BaseModel):
    code: str


class CodeReviewResponse(BaseModel):
    success: bool
    score: float
    rating: str
    issues: List[CodeIssue]