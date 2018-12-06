class Board {

	constructor(gameConfiguration) {
		this.width = gameConfiguration.width;
		this.height = gameConfiguration.height;
		this.minesNumber = gameConfiguration.minesNumber;
		this.totalSpacesNumber = this.width * this.height;
		this.indexOfSurroundingSpaces = [
			{row: -1, col: -1},
			{row: -1, col: 0},
			{row: -1, col: 1},
			{row: 0, col: -1},
			{row: 0, col: 1},
			{row: 1, col: -1},
			{row: 1, col: 0},
			{row: 1, col: 1},
		];
	}

	generateEmptyBoard() {
		let board= [];
		// Generate Rows
		for (let i = 0; i < this.height; i++) {
			board[i] = [];
			// Generate Columns
			for (let j = 0; j < this.width; j++) {
				board[i][j] = 0;
			}
		}
		return board;
	}

	theSpaceisInBounds(row, col) {
		let rowInBounds = row >= 0 && row < this.height;
		let colInBounds = col >= 0 && col < this.width;
		return rowInBounds && colInBounds;
	}
}

module.exports = {
	Board
};