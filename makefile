npm:
	docker compose run app npm $(filter-out $@,$(MAKECMDGOALS))

bash:
	docker compose run app bash

nest:
	docker compose run app nest $(filter-out $@,$(MAKECMDGOALS))