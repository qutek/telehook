const telehook = require('./'); // require('telehook')

var hook = telehook('YOUR_BOT:API_KEY', 'http://localhost/your-hook/');
hook.on('data', function(data){
	console.log('data');
	console.log(data);
})

hook.on('error', function(error){
	console.log('error');
	console.log('ERROR: ' + error);
})

hook.on('forwarded', function(data){
	console.log('forwarded');
})

hook.on('forward.error', function(error){
	console.log('forward.error');
	console.log('FORWARD ERROR: ' + error);
})