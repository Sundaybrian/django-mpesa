## push config vars

- `heroku config:set $(cat .env | sed '/^$/d; /#[[:print:]]*$/d')`

## steps

- [*] stk
- [] deploy
  [] new heroku
  []
- [] callback url
- [] setup mongoose
- [] lnm schema
- [] save lnm transaction
- [] clean up
