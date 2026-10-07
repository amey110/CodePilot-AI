from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.engine.analysis_engine import analysis_engine
from app.ai.gemini_service import gemini_service
from app.database.repository import review_repository


class ReviewService:

    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

    async def read_python_file(self, file: UploadFile, db: Session, user_id: int):
        """Upload, analyze, and persist a Python file review."""

        if not file.filename:
            raise HTTPException(status_code=400, detail="No file selected.")

        if not file.filename.endswith(".py"):
            raise HTTPException(status_code=400, detail="Only Python (.py) files are allowed.")

        content = await file.read()

        if len(content) > self.MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File size must be less than 5 MB.")

        try:
            code = content.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=400,
                detail="Unable to read file. Please upload a valid UTF-8 Python file.",
            )

        # 1. Static analysis
        analysis_result = analysis_engine.analyze(code)

        # 2. Gemini AI review (gracefully fails)
        ai_res = gemini_service.review_code(code, analysis_result)
        ai_review = ai_res.get("ai_review")
        ai_message = ai_res.get("message")

        analysis_result["ai_review"] = ai_review
        analysis_result["ai_message"] = ai_message

        # 3. Persist to database
        saved = review_repository.create(
            db,
            obj_in_data={
                "user_id": user_id,
                "filename": file.filename,
                "code": code,
                "language": "Python",
                "score": analysis_result.get("overall_score"),
                "rating": analysis_result.get("overall_rating"),
                "analysis": analysis_result,
                "ai_review": ai_review,
            },
        )

        return {
            "success": True,
            "message": "File uploaded and analyzed successfully.",
            "review_id": saved.id,
            "filename": file.filename,
            "language": "Python",
            "size_bytes": len(content),
            "total_lines": len(code.splitlines()),
            "analysis": analysis_result,
            "ai_review": ai_review,
            "ai_message": ai_message,
        }

    async def analyze_code(self, code: str, db: Session, user_id: int, filename: str = None):
        """Analyze pasted Python code and persist the review."""

        if not code or not code.strip():
            raise HTTPException(status_code=400, detail="Code cannot be empty.")

        # 1. Static analysis
        analysis_result = analysis_engine.analyze(code)

        # 2. Gemini AI review
        ai_res = gemini_service.review_code(code, analysis_result)
        ai_review = ai_res.get("ai_review")
        ai_message = ai_res.get("message")

        analysis_result["ai_review"] = ai_review
        analysis_result["ai_message"] = ai_message

        # 3. Persist to database
        saved = review_repository.create(
            db,
            obj_in_data={
                "user_id": user_id,
                "filename": filename,
                "code": code,
                "language": "Python",
                "score": analysis_result.get("overall_score"),
                "rating": analysis_result.get("overall_rating"),
                "analysis": analysis_result,
                "ai_review": ai_review,
            },
        )

        return {
            "success": True,
            "message": "Code analyzed successfully.",
            "review_id": saved.id,
            "analysis": analysis_result,
            "ai_review": ai_review,
            "ai_message": ai_message,
        }


review_service = ReviewService()