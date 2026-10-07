FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

WORKDIR /backend

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code and prepare startup script
COPY . .
RUN chmod +x start.sh && sed -i 's/\r$//' start.sh

# Expose port
EXPOSE 8000

# Run production startup script (migrations + uvicorn with proxy headers)
CMD ["./start.sh"]
