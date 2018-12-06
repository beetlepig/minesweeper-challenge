const readLine = require('readline');
const { askForInitialParameters } = require('./gameConfiguration');
const { Game } = require('./Game');
let gameInstance;

const rl = readLine.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true
});

function init() {

	askForInitialParameters(rl).then( gameConfiguration => {
		listenForUserSubmit(gameConfiguration);
		gameInstance = new Game(gameConfiguration);

	}).catch(e => {
		process.stdout.write(`${e}\n`);
		process.stdout.write('Retying...');
		setTimeout(() => {
			init();
		}, 5000);
	});

}

function listenForUserSubmit (gameConfiguration) {

	rl.on('line', (command) => {
		process.stdout.write('\u001B[2J\u001B[0;0f');

		checkUserCommand(gameConfiguration, command).then((f) => {
			const {message, commandFixed} = f;
			process.stdout.write( `${message}\n`);
			gameInstance.interpretCommand(commandFixed);
		}).catch((r) => {
			process.stdout.write( `${r}\n`);
		});

	});
}

function checkUserCommand(gameConfiguration, command) {
	const {width, height} = gameConfiguration;
	const commandPattern = /^([0-9]{1,2},[0-9]{1,2},[UM])$/;

	return new Promise((resolve, reject) =>{

		const commandFixedArray = command.trim().split(' ').map((char, index) => {
			if (index < 2) {
				return parseInt(char);
			} else {
				return char;
			}
		});

		const commandFixedString = commandFixedArray.toString();

		if (commandPattern.test(commandFixedString)) {
			if (commandFixedArray[0] > width || commandFixedArray[1] > height) {
				reject('invalid coordinates');
			} else {
				resolve({message: 'valid command', commandFixed: commandFixedArray});
			}
		} else {
			reject('invalid command');
		}
	});
}

init();