FROM python:3.9-slim-buster

WORKDIR /app

COPY . .
RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_APP=app.py

RUN apt -y update && apt -y upgrade
RUN apt -y install libopencv-dev

CMD ["flask", "run", "--host=0.0.0.0"]