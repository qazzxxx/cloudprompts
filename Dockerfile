# Stage 1: Build Frontend
FROM node:18-alpine AS builder

WORKDIR /app/frontend

# Copy package.json to install dependencies
COPY frontend/package.json ./

# 配置 registry
RUN npm config set registry https://registry.npmmirror.com

# Install dependencies
# Note: We don't have package-lock.json yet, so we use npm install
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ ./

# Build the application (outputs to /dist)
RUN npm run build

# Stage 2: Production Backend
FROM python:3.10-slim

WORKDIR /app

# Prevent Python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend Code
# This puts main.py and models.py directly into /app
COPY backend/ .

# Copy Built Frontend Assets from Stage 1 to /app/static
COPY --from=builder /app/frontend/dist /app/static

# Expose the port
EXPOSE 8000

# Create a volume mount point for data
VOLUME /data

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
