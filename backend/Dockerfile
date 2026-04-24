FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Copy requirements if it exists, otherwise we'll run a base installation
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt || pip install django djangorestframework djangorestframework-simplejwt django-cors-headers gunicorn uvicorn psycopg2-binary redis channels daphne

COPY . .

EXPOSE 8000

CMD ["gunicorn", "core.asgi:application", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "--workers", "4"]
