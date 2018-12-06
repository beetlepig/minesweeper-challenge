const readLine = require('readline');

const rl = readLine.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true
});

async function init() {
	try {
		await askForInitialParameters();
	} catch (e) {
		process.stdout.write(`${e}\n`);
		process.stdout.write('Retying...');
		setTimeout(() => {
			init();
		}, 5000);
	}
}

async function askForInitialParameters() {
	let width, height, minesNumber;
	try {
		await promptForBoardWidth().then((_width) => {
			width = _width;
		});

		await promptForBoardHeight(width).then((_height) => {
			height = _height;
		});

		await  promptForMinesNumber(width, height).then((_mines) => {
			minesNumber = _mines;
		});
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
				resolve(answer);
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
				resolve(answer);
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
				resolve(answer);
			} else {
				reject('This seems to be a invalid input, make sure that you enter a number between the requested Mines range :p\n');
			}
		});
	});
}

init();