const readLine = require('readline');

const rl = readLine.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true
});

function init() {

	askForInitialParameters().then( gameConfiguration => {
		listenForUserSubmit(gameConfiguration);
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
			process.stdout.write( `${f}\n`);
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
				resolve('valid command');
			}
		} else {
			reject('invalid command');
		}

		process.stdout.write( `user input: ${JSON.stringify(commandFixedString)}\n`);
	});
}

async function askForInitialParameters() {
	let width = 5, height = 5, minesNumber = 5;
	try {
		await promptForBoardWidth().then((_width) => {
			width = parseInt(_width);
		});

		await promptForBoardHeight(width).then((_height) => {
			height = parseInt(_height);
		});

		await  promptForMinesNumber(width, height).then((_mines) => {
			minesNumber = parseInt(_mines);
		});
		return Promise.resolve({width, height, minesNumber});
	} catch (e) {
		return Promise.reject(new Error(e));
	}
}

function promptForBoardWidth() {
	return new Promise((resolve, reject) => {
		process.stdout.write('\u001B[2J\u001B[0;0f');
		process.stdout.write('This is the Karlos version of Minesweeper, running in Nodejs \n');
		rl.question('How many Columns do you want the board to have? Type a number between 5 and 15\n', answer => {
			if (answer >= 5 && answer <= 15) {
				resolve(Math.floor(parseInt(answer)));
			} else {
				reject('This seems to be a invalid input, make sure that you enter a number between the requested width range :p\n');
			}
		});
	});
}

function promptForBoardHeight(width) {
	return new Promise((resolve, reject) => {
		process.stdout.write('\u001B[2J\u001B[0;0f');
		process.stdout.write( `Columns: ${width}\n`);
		rl.question('How many Rows do you want the board to have? Type a number between 5 and 15\n', answer => {
			if (answer >= 5 && answer <= 15) {
				resolve(Math.floor(parseInt(answer)));
			} else {
				reject('This seems to be a invalid input, make sure that you enter a number between the requested height range :p\n');
			}
		});
	});
}

function promptForMinesNumber(width, height) {
	const maxMinesNumber = Math.floor((width * height) * 0.6);
	return new Promise((resolve, reject) => {
		process.stdout.write('\u001B[2J\u001B[0;0f');
		process.stdout.write( `Columns: ${width}  Rows: ${height}\n`);
		rl.question(`How many Mines do you want the board to have? Type a number between 1 and ${maxMinesNumber}\n`, answer => {
			if (answer >= 1 && answer <= maxMinesNumber) {
				resolve(Math.floor(parseInt(answer)));
			} else {
				reject('This seems to be a invalid input, make sure that you enter a number between the requested Mines range :p\n');
			}
		});
	});
}

init();