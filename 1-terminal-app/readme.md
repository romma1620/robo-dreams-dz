# Habit terminal app
В межах даного завдання було виконано невеликий terminal application, який симулює щоденник звичок.

---
## Приклади команд:
* Для створення: `node index.js add --name "test" --freq daily`
* Для отримання списку всіх елементів: `node index.js list`
* Відмітити виконану: `node index.js done --id 2`
* Вивести статистику відносно тижня та місяця: `node index.js stats`
* Видалити елемент: `node index.js delete --id 2`
* Внести зміни в елемент: `node index.js update --id 2 --name "updated test 2" --freq daily`

##### Для запуску lint: `npm run lint`

#### Для того, щоб змістити час виконання звички потрібно перед виконанням команд задати значення змінної середовища за допомогою команди:
Наприклад`$env:DATE_OFFSET=1` для зміщення на 1 день
