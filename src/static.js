exports.clearConsole = function () {
	process.stdout.write('\u001B[2J\u001B[0;0f');
};

exports.printInstructions = function () {
	process.stdout.write(
		'Type a command. The commands are as follows: 1 2 U\n' +
		'The first number represents the Column number\n' +
		'The Second number represents the Row number\n' +
		'The Third letter represents: "U" to uncover the space, "M" to mark the space\n'
	);
};

exports.loseMessage = function () {
	process.stdout.write('OOPS, you found a mine, game over:(\n');
};

exports.winMessage = function () {
	process.stdout.write('You are a master in this game, winner winner chicken dinner\n');
};