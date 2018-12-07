const { Board } = require('./Board');
const { printInstructions} = require('./static');

class Game {

	constructor(gameConfiguration) {
		this.board = new Board(gameConfiguration);

	}

	interpretCommand(command) {
		const column = command[0];
		const row = command[1];
		const action = command[2];
		switch (action) {
		case 'U':
			this.board.uncoverSpace(column, row);
			if (!this.board.gameOver) {
				printInstructions();
			}
			break;
		case 'M':
			this.board.markSpace(column, row);
			if (!this.board.gameOver) {
				printInstructions();
			}
			break;
		}
	}

	reDrawBoard() {
		if (!this.board.gameOver) {
			this.board.printViewBoardToConsole();
			printInstructions();
		} else {
			this.board.printViewBoardToConsole();
		}
	}


}


module.exports = {
	Game
};