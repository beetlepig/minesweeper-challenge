const { clearConsole, printInstructions, loseMessage, winMessage } = require('./static');

class Board {

	constructor(gameConfiguration) {
		this.width = gameConfiguration.width;
		this.height = gameConfiguration.height;
		this.minesNumber = gameConfiguration.minesNumber;
		this.totalSpacesNumber = this.width * this.height;
		this.uncoveredCount = 0;
		this.correctPlacedFlags = 0;
		this.winningUncoveredCount = this.totalSpacesNumber - this.minesNumber;
		this.gameOver = null;
		// this index represents the 8 positions that surrounds a space, first number is column and the second is row
		this.indexOfSurroundingSpaces = [
			[0, 1],			// Top position
			[1, 1],			// Upper Right position
			[1, 0],			// Right position
			[1, -1],		// Bottom Right position
			[0, -1],		// Bottom position
			[-1, -1],		// Bottom Left position
			[-1, 0],		// Left position
			[-1, 1],		// Top Left position
		];
		this.mine = '*';
		this.mineBoard = this.placeMinesAndNumbersOnBoard();

		// VIEW BOARD
		this.flag = 'P';
		this.disabledSpace = '-';
		this.coveredSpace = '.';
		this.viewBoard = this.generateNewViewBoard();


		this.printViewBoardToConsole();
		printInstructions();
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

	generateNewViewBoard() {
		let viewBoard = [];

		for (let i = 0; i < this.height; i++) {
			viewBoard[i] = [];
			for (let j = 0; j < this.width; j++) {
				viewBoard[i][j] = this.coveredSpace;
			}
		}
		return viewBoard;
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
				board[row][column] = this.mine;
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
				if (board[row][column] === this.mine) {
					continue;
				}

				// Keep track of number of bombs adjacent to current indices
				let numOfBombsInVicinity = 0;

				// Iterate over 8 surround squares
				this.indexOfSurroundingSpaces.forEach(relIndex => {
					let colToCheck = column + relIndex[0];
					let rowToCheck = row + relIndex[1];
					// If the space to check is out of bounds (outside the board), continue to the next iteration
					if (!this.theSpaceIsInBounds(rowToCheck, colToCheck)) return;
					// if in the space to check are a mine, increment the counter
					if (board[rowToCheck][colToCheck] === this.mine) {
						numOfBombsInVicinity++;
					}
				});

				// Label space with result
				board[row][column] = numOfBombsInVicinity;
			}
		}
	}

	printViewBoardToConsole() {

		// Clear the console before printing
		clearConsole();

		// Make copy of board for purpose of printing with cursor
		const board = JSON.parse(JSON.stringify(this.viewBoard));

		for (let i = 0; i < this.width; i++) {
			if ( i === 0) {
				process.stdout.write('  ');
			}
			process.stdout.write(`${i} `);
			if (i === this.width - 1) {
				process.stdout.write('\n');
			}
		}

		// Print updated viewboard with cursor location to console
		board.forEach((row, index) => {
			process.stdout.write(`${index} `);
			process.stdout.write(row.join(' ')+ '\n');
		});

		if (this.gameOver === 'winner') {
			winMessage();
		} else if (this.gameOver === 'looser') {
			loseMessage();
		}
	}

	markSpace (columnNumber, rowNumber) {

		// If the space is uncovered and unmarked, mark it
		if (this.viewBoard[rowNumber][columnNumber] === this.coveredSpace) {
			this.viewBoard[rowNumber][columnNumber] = this.flag;

			if (this.checkMarkValidity(columnNumber, rowNumber)) {
				this.correctPlacedFlags++;
			}
		} else if (this.viewBoard[rowNumber][columnNumber] === this.flag) {
			// If marked, unmark it
			this.viewBoard[rowNumber][columnNumber] = this.coveredSpace;

			if (this.checkMarkValidity(columnNumber, rowNumber)) {
				this.correctPlacedFlags--;
			}

		}
		this.printViewBoardToConsole();
		this.checkForWinGame();
	}
	// checks if a mark was placed or removed from a bomb space
	checkMarkValidity(columnNumber, rowNumber) {
		return this.mineBoard[rowNumber][columnNumber] === this.mine;
	}

	isSpaceMarked (columnNumber, rowNumber) {
		return this.viewBoard[rowNumber][columnNumber] === this.flag;
	}

	uncoverSpace(columnNumber, rowNumber) {
		// Do not uncover marked spaces
		if (this.isSpaceMarked(columnNumber, rowNumber)) {
			return;
		}

		// Call game over if mine detected
		if (this.mineBoard[rowNumber][columnNumber] === this.mine) {
			this.loseGame();
			return;
		}


		// If space is anything but a zero, uncover it. If the space has been previously uncovered, not do anything
		if (this.mineBoard[rowNumber][columnNumber] !== 0) {
			if (this.viewBoard[rowNumber][columnNumber] !== this.mineBoard[rowNumber][columnNumber]) {
				this.viewBoard[rowNumber][columnNumber] = this.mineBoard[rowNumber][columnNumber];
				this.uncoveredCount++;
				this.printViewBoardToConsole();
				this.checkForWinGame();
			} else {
				this.printViewBoardToConsole();
			}
			return;
		}

		// If space is zero, uncover adjacent spaces as well. If the space has been previously uncovered, not do anything
		if (this.mineBoard[rowNumber][columnNumber] === 0) {
			if (this.viewBoard[rowNumber][columnNumber] !== this.disabledSpace) {
				this.uncoverAdjacentSpaces(rowNumber, columnNumber);
				this.printViewBoardToConsole();
				this.checkForWinGame();
			} else {
				this.printViewBoardToConsole();
			}
		}
	}

	// Function to uncover adjacent spaces if space is not adjacent to any bombs
	uncoverAdjacentSpaces(rowNumber, columnNumber) {
		// Space is a zero (not adjacent to any bombs)
		// Uncover, increase count
		this.viewBoard[rowNumber][columnNumber] = this.disabledSpace;
		this.uncoveredCount++;

		// Check Adjacent Squares.  Uncover all non-bombs, and recurse on zeros

		this.indexOfSurroundingSpaces.forEach(relIndex => {
			let colToCheck = columnNumber + relIndex[0];
			let rowToCheck = rowNumber + relIndex[1];
			if (!this.theSpaceIsInBounds(rowToCheck, colToCheck)) return; // if the space to check is out of bounds, go to next iteration
			if (this.viewBoard[rowToCheck][colToCheck] !== this.coveredSpace) return; // If the space to check was previously uncovered, go to next iteration
			if (this.mineBoard[rowToCheck][colToCheck] === this.mine) return; // If the space to check is a mine, go to next iteration
			if (this.mineBoard[rowToCheck][colToCheck] > 0) { // If the space to check is a number, discover the number in viewBoard
				this.viewBoard[rowToCheck][colToCheck] = this.mineBoard[rowToCheck][colToCheck];
				this.uncoveredCount++;  // and increase the count
			} else { // Space equals zero, so recurse
				this.uncoverAdjacentSpaces(rowToCheck, colToCheck);
			}
		});
	}



	theSpaceIsInBounds(row, col) {
		let rowInBounds = row >= 0 && row < this.height;
		let colInBounds = col >= 0 && col < this.width;
		return rowInBounds && colInBounds;
	}


	checkForWinGame() {
		if (this.uncoveredCount >= this.winningUncoveredCount) {
			this.winGame();
		} else if (this.correctPlacedFlags >= this.minesNumber) {
			this.winGame();
		}
	}


	loseGame() {
		// Print uncovered view board to console, showing bombs.
		this.viewBoard = this.mineBoard;
		this.viewBoard = this.viewBoard.map(row => {
			return row.map((value) => {
				if (value === 0) {
					return this.disabledSpace;
				} else {
					return value;
				}
			});
		});
		this.gameOver = 'looser';
		this.printViewBoardToConsole();
	}

	winGame() {
		// Print modified board to console, showing flags.
		this.viewBoard = this.mineBoard;
		this.viewBoard = this.viewBoard.map(row => {
			return row.map( value => {
				if (value === 0) {
					return this.disabledSpace;
				} else if (value === this.bomb) {
					return this.flag;
				} else {
					return value;
				}
			});
		});
		this.gameOver = 'winner';
		this.printViewBoardToConsole();
	}

}

module.exports = {
	Board
};