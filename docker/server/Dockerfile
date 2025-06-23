FROM debian:bookworm

WORKDIR /app

EXPOSE 6453

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

WORKDIR /app/backend/

CMD [ "make" , "all" ]

