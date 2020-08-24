## push config vars

- `heroku config:set $(cat .env | sed '/^$/d; /#[[:print:]]*$/d')`
