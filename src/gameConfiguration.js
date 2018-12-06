async function askForInitialParameters(rl) {
	let width = 5, height = 5, minesNumber = 5;
	try {
		await promptForBoardWidth(rl).then((_width) => {
			width = parseInt(_width);
		});

		await promptForBoardHeight(width, rl).then((_height) => {
			height = parseInt(_height);
		});

		await  promptForMinesNumber(width, height, rl).then((_mines) => {
			minesNumber = parseInt(_mines);
		});
		return Promise.resolve({width, height, minesNumber});
	} catch (e) {
		return Promise.reject(new Error(e));
	}
}

function promptForBoardWidth(rl) {
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

function promptForBoardHeight(width, rl) {
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

function promptForMinesNumber(width, height, rl) {
	const maxMinesNumber = Math.floor((width * height) * 0.15);
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

module.exports = {
	askForInitialParameters
};