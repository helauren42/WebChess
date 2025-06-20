buildFront:
	(cd reactapp/ && npm run build)

server:
	make all -C backend

.phony: buildFront server
