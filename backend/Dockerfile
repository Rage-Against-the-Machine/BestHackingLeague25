FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
COPY server.py .
COPY classes ./classes

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "server.py", "docker"]