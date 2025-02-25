FROM python:3.9

WORKDIR /app

COPY ejemplo.py ejemplo.py

RUN pip install flask

EXPOSE 8080

CMD ["python", "ejemplo.py"]
