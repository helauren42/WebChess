buildFront:
	(cd reactapp/ && npm run build)

server:
	make all -C backend

all: buildFront server

.phony: buildFront server
