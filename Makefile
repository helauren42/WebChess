devFront:
	reactapp/ && npm start

devBack:
	make all -C backend

buildFront:
	(cd reactapp/ && npm run build)

dockerUp:
	docker-compose build --parallel
	docker-compose up

dockerDown:
	docker-compose down

dockerRe: clean dockerUp

production: buildFront dockerUp

clean:
	docker-compose down --rmi local
	docker system prune -f

fclean:
	docker-compose down -v --rmi local
	docker system prune -f
	rm -rf reactapp/build/

.PHONY: devFront devBack buildFront dockerUp production clean fclean
