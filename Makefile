initSqlLocal:
	make initSqlLocal -C backend

initSqlDeploy:
	make initSqlDeploy -C backend

devFront:
	npm cache clean --force
	(cd reactapp/ && npm start)

devBack: initSqlLocal
	make dev -C backend

buildFront:
	(cd reactapp/ && npm run build)

dockerUp:
	docker compose build --parallel
	docker compose up -d

dockerDown:
	docker compose down

dockerRe: dockerDown dockerUp

deploy: dockerDown initSqlDeploy dockerUp

fclean: clean
	docker compose down --rmi local
	docker system prune -af
	rm -rf /home/${USER}/.volumes/db-vol

.PHONY: devFront devBack buildFront dockerUp production clean initSql

