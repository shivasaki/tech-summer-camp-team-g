setup:
	docker compose build

migrate:
	docker compose up db -d
	docker compose run --rm db bash -c "psqldef -h db -p 5432 -U user -W postgres postgres < schema.sql"
	docker compose down db

dev:
	docker compose up -d

logs:
	docker compose logs -f

down:
	docker compose down

rebuild:
	docker compose build --no-cache