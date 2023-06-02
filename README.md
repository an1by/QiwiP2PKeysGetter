# QiwiP2PKeys by [An1by](https://aniby.net/)
### Взамен на мануал буду рад звездочке ♥
## Инструкция по запуску
### JavaScript
1. Устанавливаем Node.js (желательно последнюю версию LTS).
2. Скачиваем репозиторий, либо же всю папку [JavaScript](./javascript).
3. Открываем консоль(cmd.exe для Windows, любой терминал для Linux), переходим в папку с файлами и прописываем команду `npm i`.
4. После загрузки библиотек прописываем `node .` там же для запуска программы.
5. Переходим к инструкции по использованию.
## Инструкция по использованию
### Получаем HEAD-токен (1 часть)
1. Входим в аккаунт банка QIWI. 
2. Копируем оттуда номер телефона с кодом страны. Пример: `+79995554433`
3. Входим в меню разработчика *(ПКМ в любом месте -> Просмотреть код, или F12)*
4. Открываем вкладку `Консоль (Console)` и вписываем в нее следующее: 
```javascript
JSON.parse(window.localStorage['oauth-token-head'])['access_token']
```
Нажимаем Enter, получаем первую часть HEAD-токена.
5. Вписываем полученное значение в программу.
### Получаем HEAD-токен (2 часть)
1. В том же меню разработчика открываем вкладку `Приложение (Application)`.
2. В столбце `Name` ищем `token-tail-web-qw` и в той же строке выбираем его `Value` и копируем.
3. Полученное значение вписываем в программу.
### Подтверждение аутентификации
1. Ждем код подтверждения на введеный номер телефона.
2. Вписываем полученный код в программу.
### Создание самого токена
1. Вписываем придуманное из головы название токена.
2. Вписываем ссылку на страницу, по которой вы будете ловить уведомления о платежах (`serverNotificationsUrl`).
3. Получаем в консоли пару желанных ключей: `secretKey` и `publicKey`.
