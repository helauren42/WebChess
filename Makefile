initSql:
	make initSql -C backend

devFront:
	npm cache clean --force
	(cd reactapp/ && npm start)

devBack:
	make dev -C backend

buildFront:
	(cd reactapp/ && npm run build)

dockerUp:
	docker compose build --parallel
	docker compose up

dockerDown:
	docker compose down

dockerRe: clean dockerDown dockerUp

deploy: clean initSql dockerUp

clean:
	docker compose down --rmi local
	docker system prune -f

fclean: clean
	rm -rf /home/${USER}/.volumes/db-vol

.PHONY: devFront devBack buildFront dockerUp production clean initSql

