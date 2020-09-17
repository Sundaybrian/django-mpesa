## push config vars

- `heroku config:set $(cat .env | sed '/^$/d; /#[[:print:]]*$/d')`

## steps

- [*] stk
- [*] deploy
  [*] new heroku
  [*] git push https://heroku:$HEROKU_API_KEY@git.heroku.com/$HEROKU_APP_NAME.git HEAD:master -f
- [] setup mongoose
- [] lnm schema
- [] save lnm transaction
- [*] callback url
  [] persist data to mongo
  [] incase user terminates payment
  [] some other kind of error
- [] tests
- [] clean up


## docker

* sudo docker-compose up
* sudo docker-compose down