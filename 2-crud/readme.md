# Саморобний CRUD :-)

---
### Щоб запустити application

`node index.js` або `nodemon index.js`

### API Endpoints

| Назва                       | Запит                                                                                                                       |
|:----------------------------|:----------------------------------------------------------------------------------------------------------------------------|
| Всі користувачі             | `curl -i http://localhost:3000/users`                                                                                       |
| Створити користувача        | `curl -i -X POST http://localhost:3000/users`                                                                               |
| Отримати одного користувача | `curl -i http://localhost:3000/users/`                                                                                      |
| Змінити дані користувача    | ` curl -i -X PUT  http://localhost:3000/users/ <id>  \ -H "Content-Type: application/json" \ -d '{"name":"Updated Name"}' ` |
| Видалити користувача        | `curl -i -X DELETE http://localhost:3000/users/`                                                                            |
