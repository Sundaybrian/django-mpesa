## push config vars

- `heroku config:set $(cat .env | sed '/^$/d; /#[[:print:]]*$/d')`

## steps

- [*] stk
- [] deploy
  [] new heroku
  [] git push https://heroku:$HEROKU_API_KEY@git.heroku.com/$HEROKU_APP_NAME.git HEAD:master -f
- [] callback url
- [] setup mongoose
- [] lnm schema
- [] save lnm transaction
- [] clean up
