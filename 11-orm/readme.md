# ORM

Для запуску спочатку запустити докер контейнер командою:

``docker-compose up -d``

Тепер можна командою наступною командою, перевірити роботу апки:

``npm run demo``


***
### В випадку якщо щось пішло не так:

може бути проблема ``error: relation "products" does not exist``

для цього потрібно виконати наступні кроки:
* ``docker-compose exec db psql -U superuser -d mydb``
* ``CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);``
