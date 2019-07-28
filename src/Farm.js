// A cell is a spot in the farm that can be planted with a transaction. 
class Cell {
    // Receive the xPos and yPos of the cell in the farm. 
    constructor(x, y) {
        // Location. 
        this.xPos = x,  
        this.yPos = y;
        // Assign a random shade when initiating the cell. 
        this.col = 50;
        // Crop is not planted yet. 
        this.isPlanted = false; 
        // Transaction hash of the transaction.  
        this.txHash = ''; 
    }    

    draw(w, h) {
        push();
            // Translate to the center of the cell. 
            translate(this.xPos + w/2, this.yPos + h/2);
            stroke(0);
            fill(this.col);
            ellipse(0, 0, w, h); // Rather than rectangles, these will be circles actually at the center of the cell. 
        pop();
    }
}

// A 2D farm covering the screen.
// This farm will be planted with transactions. 
class Farm {
    constructor() {
      this.cellWidth = 10; 
      this.cellHeight = 10;
      this.columns = displayWidth/this.cellWidth; 
      this.rows = displayHeight/this.cellHeight;
      this.cells = [];   

      console.log('Display Width: ' + displayWidth);
      console.log('Display Height: ' + displayHeight);
      console.log('Rows: ' + this.rows);
      console.log('Columns: ' + this.columns);
      console.log('Total Items: ' + this.rows*this.columns);

      // Create the cells in the farm. 
      for (var i = 0; i < this.columns; i++) {
        this.cells[i] = []; // 2D array assign.
        for (var j = 0; j < this.rows; j++) {
          var xPos = i * this.cellWidth;
          var yPos = j * this.cellHeight; 
          var cell = new Cell(xPos, yPos);
          this.cells[i][j] = cell;
        }
      }
    }
  
    draw() {
      for (var i = 0; i < this.columns; i++) {
        for (var j = 0; j < this.rows; j++) {
           this.cells[i][j].draw(this.cellWidth, this.cellHeight);
        }
      }
    }

    plantTransaction(txHash) {
        // TODO: Every cell that is planted with a transaction must contain 
        // link to the etherscan with that pending transaction.
        // Get a random cell from the farm. 
        // Plant the transaction
        var cell = this.getRandomCell(); 

        // Plant the transaction in that cell by updating these parameters. 
        cell.isPlanted = true; 
        cell.col = color(0, 255, 0);
        cell.txHash = txHash; 
    }

    getRandomCell() {
        var xRand = Math.floor(random(this.columns));
        var yRand = Math.floor(random(this.rows));
        console.log('Calculated x, y: ' + xRand + ', ' + yRand);

        // Keep looping till a dead crop is found. 
        while(this.cells[xRand][yRand].isPlanted) {
            xRand = Math.floor(random(this.columns));
            yRand = Math.floor(random(this.rows));
            console.log('Calculated x, y: ' + xRand + ', ' + yRand);
        }

        console.log('Found a random cell at: ' + xRand + ', ' + yRand);
        return this.cells[xRand][yRand]; 
    }
  }