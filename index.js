const request 			= require('request-promise');
const extend 			= require('extend');
const chalk       	= require('chalk');
const Clui        	= require('clui');
const Spinner     	= Clui.Spinner;
const EventEmitter 	= require('events').EventEmitter || require('events');
const emitter 			= new EventEmitter();
const Promise 			= require('bluebird');

const config = {
	updateUrl: 'https://api.telegram.org/bot<bot-token>/getUpdates',
	hookUrl: '',
	offset: 0,
	settings: {
		interval: 1000,
		timeout: 0
	}
}

const checkUpdates = (processed) => {

	return ( new Promise((resolve,reject) => {

		let formData = {};

		if (config.settings.timeout !== undefined) formData.timeout = config.settings.timeout;
	   if (config.offset !== undefined) formData.offset = config.offset;
	   if (config.limit !== undefined) formData.limit = config.limit;

      request({
	    	method: 'GET',
	    	json: true,
	    	formData: formData,
	    	uri: config.updateUrl
	   })
		.then((data) => {
			resolve(data.result);
		})
		.catch((error) => {
			reject(error);
		});

   }));
}

module.exports = (botToken, hookUrl, options) => {

	try {

		if(!botToken){
			throw 'Please add your bot token.';
		}

		if(!hookUrl){
			throw 'Please add your hook url.';
		}

		config.updateUrl = 'https://api.telegram.org/bot' + botToken + '/getUpdates';
		config.hookUrl = hookUrl;
		config.settings = extend( true, config.settings, options);

		let status = new Spinner( chalk.blue('Listening...'), ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);

	   Promise.resolve([])
	   	.then( function loop(processed) {

	    		status.start();

		    	return checkUpdates(processed)

		        	.then((results) => {

		        		if(results.length > 0){

		        			status.stop();
		        			status.message( chalk.blue('Forwarding ' + results.length + ' message(s)') );
		        			status.start();

		        			let forwards = Promise.each(results, item => {

		        					status.stop();
		        					emitter.emit('data', item);
		        					status.start();

						        	// console.log(item.update_id);

						        	if(item.update_id >= config.offset){
					 					config.offset = item.update_id + 1;
					 				}

						        	return request({
										method: 'POST',
										url: config.hookUrl,
										json: true,
										body: item
							    	})
							    	.then((data) => {

							    		status.stop();
		        						emitter.emit('forwarded', data);
					        			status.message( chalk.blue('Listening...') );
					        			status.start();
							    		return true;
							    	})
							    	.catch((error) => {
							    		status.stop();
		        						emitter.emit('forward.error', error);
					        			status.message( chalk.blue('Listening...') );
					        			status.start();
							    		return true;
							    	});

					    	});

					    	return forwards;
		        		} else {
		        			return [];
		        		}

		            
		        	})
		        	.catch((error) => {
		        		status.stop();
     					emitter.emit('error', error);
     					status.start();
		            return processed;
		        	})
		        	.delay(config.settings.interval)
		        	.then(loop);
			});

	} catch (err) {
		console.error(err);
	}

	return emitter;
};