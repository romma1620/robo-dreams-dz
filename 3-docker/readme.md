### Docker

---
Для запуску виконати команду:
- ``docker-compose up --build``

Тепер в нашій мережі доступний шлях http://localhost:8080/kv

Для тестування redis, необхідно:
- ``docker exec -it 3-docker-kv-1 sh``
- ``apk update && apk add --no-cache curl``
- ``curl http://redis:4000/get?key=test``

