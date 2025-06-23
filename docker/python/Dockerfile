FROM debian:bookworm

WORKDIR /app

COPY backend/ /app/backend/
COPY reactapp/ /app/reactapp/
COPY .env .env

EXPOSE 6453

WORKDIR /app/backend/

RUN apt update && apt install -y \
  python3  \
  python3-pip \
  python3-dev \
  python3-venv \
  make \
  default-mysql-client \
  default-libmysqlclient-dev \
  build-essential \
  pkg-config \
  iputils-ping \
  telnet

CMD [ "make" , "all" ]

