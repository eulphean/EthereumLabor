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

// A 2D farm as the background of this machine. 
// This farm will be planted with transactions. 
// Then these transactions will be mined. 
class Farm {
    constructor() {
      this.cellWidth = 5; 
      this.cellHeight = 5;
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
      
      // Farm stats. 
      this.totalCells = this.rows * this.columns;  
      this.plantedCells = 0; 
      this.maxCells = this.totalCells; // Max available cells for planting. 
    }
  
    draw() {
      for (var i = 0; i < this.columns; i++) {
        for (var j = 0; j < this.rows; j++) {
           this.cells[i][j].draw(this.cellWidth, this.cellHeight);
        }
      }
    }

    plant(txHash) {
        // Are we allowed to plant? 
        if (this.plantedCells < this.maxCells) {
            // Calculate available cells. 
            // Get a random cell from the farm. 
            // Plant the transaction
            var cell = this.getRandomCell(); 

            // Plant the transaction in that cell by updating these parameters. 
            cell.isPlanted = true; 
            cell.col = color(0, 255, 0);
            cell.txHash = txHash; 

            // Redraw this cell. 
            cell.draw(this.cellWidth, this.cellHeight);
            
            // Planted. 
            this.plantedCells++; 
        }
    }

    getRandomCell() {
        var xRand = Math.floor(random(this.columns));
        var yRand = Math.floor(random(this.rows));

        // Keep looping till a dead crop is found. 
        while(this.cells[xRand][yRand].isPlanted) {
            xRand = Math.floor(random(this.columns));
            yRand = Math.floor(random(this.rows));
        }

        return this.cells[xRand][yRand]; 
    }

    mineFarm(transactions) {
        if (transactions.length > 0) {
            console.log('Mining Farm.');
            for (var i =0; i < this.columns; i++) {
                for (var j = 0; j < this.rows; j++) {
                    if (this.cells[i][j].isPlanted) {
                        var hash = this.cells[i][j].txHash; 
                        var found = transactions.find(function(t) {
                            return t === hash;
                        });
                        
                        // Mine that cell if this transaction is found in mined block. 
                        if (found) {
                            console.log('Transaction found');
                            this.cells[i][j].col = color(255, 0, 0); 
                            this.cells[i][j].isPlanted = false; // Run an animation to unplant this block. 
                            this.cells[i][j].txHash = '';
                            
                            // Redraw this cell
                            this.cells[i][j].draw(this.cellWidth, this.cellHeight);
                            
                            // Mined.
                            this.plantedCells--; 
                        }
                    }
                }
            }
        } else {
            console.log('Skip Mining: No transactions to mine.');
        }
    }

    clearFarm() {
        for (var i=0; i < this.columns; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.cells[i][j].isPlanted = false;
                this.cells[i][j].col = 50; 
                this.cells[i][j].txHash = '';

                // Redraw this cell. 
                this.cells[i][j].draw(this.cellWidth, this.cellHeight);
            }
        }
    }

    setFarmCapacity(capacity) {
        // Capacity is a number between 0-100
        this.maxCells = int((capacity / 100) * this.totalCells); 
        console.log('Set Farm Capacity (%, maxCells): ' + capacity + '%' + ', ' + this.maxCells);
    }
  }