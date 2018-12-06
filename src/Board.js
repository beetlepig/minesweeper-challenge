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
		this.bomb = '*';
		this.mineBoard = this.placeMinesAndNumbersOnBoard();
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

	placeMinesAndNumbersOnBoard() {
		// Get an empty board
		const board= this.generateEmptyBoard();

		// Generate random coordinates for place the mine
		for (let i = 0; i < this.minesNumber; i++) {
			const row = Math.floor(Math.random() * this.height);
			const column = Math.floor(Math.random() * this.width);
			// If no mine at coordinate (matrix indices), place mine
			if (board[row][column] === 0) {
				board[row][column] = this.bomb;
			} else {
				// If there is a mine in the space, retry with other coordinates
				i--;
			}
		}
		// Generate proximity numbers
		this.determineMineProximityNumbers(board);

		return board;
	}

	determineMineProximityNumbers(board) {

		for (let row = 0; row < this.height; row++) {
			for (let column = 0; column < this.width; column++) {

				// Skip over mines
				if (board[row][column] === this.bomb) {
					continue;
				}

				// Keep track of number of bombs adjacent to current indices
				let numOfBombsInVicinity = 0;

				// Iterate over 8 surround squares
				this.indexOfSurroundingSpaces.forEach(relIndex => {
					let rowToCheck = row + relIndex.row;
					let colToCheck = column + relIndex.col;
					// If the space to check is out of bounds (outside the board), continue to the next iteration
					if (!this.theSpaceIsInBounds(rowToCheck, colToCheck)) return;
					// if in the space to check are a bomb, increment the counter
					if (board[rowToCheck][colToCheck] === this.bomb) {
						numOfBombsInVicinity++;
					}
				}, this);

				// Label space with result
				board[row][column] = numOfBombsInVicinity;
			}
		}
	}

	theSpaceIsInBounds(row, col) {
		let rowInBounds = row >= 0 && row < this.height;
		let colInBounds = col >= 0 && col < this.width;
		return rowInBounds && colInBounds;
	}
}

module.exports = {
	Board
};