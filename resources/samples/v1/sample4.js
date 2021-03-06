'use strict'

const chalk = require('chalk')

let smashgg = require('../../../src/v1')
let Tournament = smashgg.Tournament;
let Event = smashgg.Event;
let winston = require('winston')
winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
	level: 'verbose',
	colorize: true,
	timestamp: true,
	json: false
})

(async function(){
	try{
		let t = await Tournament.getTournament('tbh7')

		let sets = await t.getAllSets()
		console.log('TBH7 set count: ' + chalk.green(sets.length))

		return true
	} catch(e){
		console.error(e)
		process.exit(1)
	}
})()