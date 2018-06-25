#!/usr/bin/env node

const pkg         	= require('./package.json');
const program 		= require('commander');
const telehook 		= require('./index');
const chalk       	= require('chalk');

const runTelehook = (token, hook, config) => {

	console.log();

	let run = telehook(token, hook, config);

	run.on('data', function(data){
		console.group();
		console.log(chalk.green("+++++++++++++++++\nDATA RECEIVED\n+++++++++++++++++"));
		console.log(chalk.white(JSON.stringify(data, null, 2)));
		console.groupEnd();
	})

	run.on('error', function(error){
		console.group();
		console.log(chalk.red("+++++++++++++++++\nERROR\n+++++++++++++++++"));
		console.error(error);
		console.groupEnd();
	})

	run.on('forwarded', function(data){
		console.log();
		console.log(chalk.green('✔') + chalk.blue(' forwarded'));
		console.log();
	})

	run.on('forward.error', function(error){
		console.group();
		console.log(chalk.red("+++++++++++++++++\nFORWARD ERROR\n+++++++++++++++++"));
		console.error(error);
		console.groupEnd();
	})
}

program
	.version(pkg.version)
	.description(pkg.description);

program
	.command('run <token> <hook>')
	.alias('r')
	.option(
		'-i, --interval [interval]',
		'Set the interval'
	)
	.option(
		'-t, --timeout [timeout]',
		'Set the timeout'
	)
	.action(function (token, hook, options) {
  		
  		let config = {};
  		
  		if(options.interval){
  			config.interval = parseInt(options.interval);
  		}

  		if(options.timeout){
  			config.timeout = parseInt(options.timeout);
  		}

  		runTelehook(token, hook, config);
  	});

program.parse(process.argv);