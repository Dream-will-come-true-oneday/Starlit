# Python 后端镜像
FROM python:3.11-slim

WORKDIR /app

# 安装依赖（利用 Docker 层缓存）
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码与内容数据
COPY app ./app
COPY migrate_content.py .
COPY data ./data

# 建表 + 导入内容 + 启动
EXPOSE 8000

CMD ["sh", "-c", "python migrate_content.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
