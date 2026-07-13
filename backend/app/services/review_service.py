from fastapi import UploadFile, HTTPException
from app.engine.analysis_engine import analysis_engine


class ReviewService:

    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

    async def read_python_file(self, file: UploadFile):

        # Check if file is selected
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file selected."
            )

        # Validate extension
        if not file.filename.endswith(".py"):
            raise HTTPException(
                status_code=400,
                detail="Only Python (.py) files are allowed."
            )

        # Read uploaded file
        content = await file.read()

        # Validate file size
        if len(content) > self.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File size must be less than 5 MB."
            )

        # Convert bytes to string
        try:
            code = content.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=400,
                detail="Unable to read file. Please upload a valid UTF-8 Python file."
            )

        # Run Complete Analysis Engine
        analysis_result = analysis_engine.analyze(code)

        return {
            "success": True,
            "message": "File uploaded and analyzed successfully.",
            "filename": file.filename,
            "language": "Python",
            "size_bytes": len(content),
            "total_lines": len(code.splitlines()),
            "analysis": analysis_result
        }


review_service = ReviewService()