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
	npm -y

RUN npm install react@19.1.0 react-dom@19.1.0 react-router-dom@6.30.0 react-scripts@5.0.1

WORKDIR /app/reactapp/

RUN npm run build

WORKDIR /app/backend/

CMD [ "make" , "all" ]

