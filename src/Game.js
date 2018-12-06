const { Board } = require('./Board');

class Game {

	constructor(gameConfiguration) {
		this.board = new Board(gameConfiguration);

	}

	interpretCommand(command) {
		process.stdout.write( `user input: ${JSON.stringify(command)}\n`);
	}


}


module.exports = {
	Game
};