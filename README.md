# Telehook.js

Telegram bot development tool for triggering localhost / non-https hook with [getUpdates](https://core.telegram.org/bots/api#getupdates)


## Installation
>$ `npm install telehook --save`

or install as global to use Telehook CLI
>$ `npm install -g telehook`
    
## Example
```js
const telehook = require('telehook');

var hook = telehook('YOUR_BOT:API_KEY', 'http://localhost/your-hook/', {
  interval: 1000,
  timeout: 0
});
hook.on('data', function(data){
	console.group('RECEIVED');
	console.log(data);
	console.groupEnd();
})

hook.on('error', function(error){
	console.group('ERROR');
	console.error(error);
	console.groupEnd();
})

hook.on('forwarded', function(data){
	console.log('forwarded');
})

hook.on('forward.error', function(error){
	console.group('FORWARD ERROR');
	console.error(error);
	console.groupEnd();
})
```

## CLI
Make sure you have install Telehook CLI with
> $ `npm install -g telehook`

use command run and pass the bot api key as well as the hook ur.
```sh
telehook run <botToken> <hookUrl>
```
### Options
- `-i, --interval`  *(To set the interval for checking updates, default to 1000 (1 second)*
- `-t, --timeout`  *(To set the timout request while checking updates, default to 0*

## License

MIT