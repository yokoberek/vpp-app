FROM python:3.11.3-slim-bullseye

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y gcc default-libmysqlclient-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/
COPY . .

RUN pip install --upgrade pip \
    && pip install mysqlclient \
    && pip install -r requirements.txt 
    
WORKDIR /usr/src/
    
EXPOSE 8000

CMD [ "gunicorn", "-w" , "3", "-b", "0.0.0.0:8000", "run:app"]


# For run this Image
# 1. docker build -t name:tag .
# 2. docker run --name vpp-app -d -p 8000:8000 vpp-flask

