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


class AIReviewData(BaseModel):
    summary: str
    bugs: List[str] = Field(default_factory=list)
    security_risks: List[str] = Field(default_factory=list)
    performance_tips: List[str] = Field(default_factory=list)
    readability_tips: List[str] = Field(default_factory=list)
    improved_code: str = ""


class CodeReviewRequest(BaseModel):
    code: str


class CodeReviewResponse(BaseModel):
    success: bool
    score: float
    rating: str
    issues: List[CodeIssue]
    ai_review: Optional[AIReviewData] = None
    ai_message: Optional[str] = None