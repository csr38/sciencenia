.PHONY: build up down logs shell

build:
	docker compose build
up:
	docker compose up
down:
	docker compose down
logs:
	docker compose logs -f api
shell:
	docker compose exec api sh
rebuild: down build

