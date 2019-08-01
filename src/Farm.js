// A cell is a spot in the farm that can be planted with a transaction. 
class Cell {
    // Receive the xPos and yPos of the cell in the farm. 
    constructor(x, y) {
        // Location. 
        this.xPos = x,  
        this.yPos = y;
        // Assign a random shade when initiating the cell. 
        this.col = defaultCellColor; 
        // Crop is not planted yet. 
        this.isPlanted = false; 
        // Transaction hash of the transaction.  
        this.txHash = ''; 
        // Death timer variable
        this.deathTimeout = null; 
    }    

    draw(w, h) {
        push();
            // Translate to the center of the cell. 
            translate(this.xPos + w/2, this.yPos + h/2);
            stroke(cellStrokeColor);
            strokeWeight(0.5); 
            fill(this.col);
            ellipse(0, 0, w, h); // Rather than rectangles, these will be circles actually at the center of the cell. 
        pop();
    }

    set(color, planted, tx) {
        this.col = color; 
        this.isPlanted = planted; 
        this.txHash = tx; 
    }
}

// A 2D farm as the background of this machine. 
// This farm will be planted with transactions. 
// Then these transactions will be mined. 
class Farm {
    constructor(cellSize) {
      this.cellWidth = cellSize; 
      this.cellHeight = cellSize;
      this.calcRowsColumns();
      this.cells = [];   

      console.log('Display Width: ' + displayWidth);
      console.log('Display Height: ' + displayHeight);
      console.log('Rows: ' + this.rows);
      console.log('Columns: ' + this.columns);
      console.log('Total Items: ' + this.rows*this.columns);

      // Create the cells in the farm. 
      this.createCells(); 
      
      // Farm stats. 
      this.setFarmState();
    }
  
    draw() {
      for (var i = 0; i < this.columns; i++) {
        for (var j = 0; j < this.rows; j++) {
           this.cells[i][j].draw(this.cellWidth, this.cellHeight);
        }
      }
    }

    kill(cell) {
        console.log('Killing planted cell.');
        // Reset cell. 
        cell.set(defaultCellColor, false, '')
        clearTimeout(cell.deathTimeout);
        // Redraw cell. 
        cell.draw(this.cellWidth, this.cellHeight);

        // Killed. 
        this.plantedCells--; 
    }

    plant(txHash) {
        // Are we allowed to plant? 
        if (this.plantedCells < this.maxCells) {
            // Calculate available cells. 
            // Get a random cell from the farm. 
            // Plant the transaction
            var cell = this.getRandomCell(); 

            // Plant the transaction in that cell by updating these parameters. 
            // set(color, isPlanted, txHash)
            // setTimeout(callback, timeout, parameter)
            cell.set(color(0, 255, 0), true, txHash);
            cell.deathTimeout = setTimeout(this.kill.bind(this), 5 * 60 * 1000, cell); // Kill this transaction after 10 minutes

            // Redraw cell. 
            cell.draw(this.cellWidth, this.cellHeight);
            
            // Planted. 
            this.plantedCells++; 
        }
    }

    mine(transactions) {
        if (transactions.length > 0) {
            // console.log('Mining Farm.');
            for (var i =0; i < this.columns; i++) {
                for (var j = 0; j < this.rows; j++) {
                    if (this.cells[i][j].isPlanted) {
                        var hash = this.cells[i][j].txHash; 
                        var found = transactions.find(function(t) {
                            return t === hash;
                        });
                        
                        // Mine that cell if this transaction is found in mined block. 
                        if (found) {
                            // console.log('Transaction found');
                            // Reset cell. 
                            this.cells[i][j].set(color(255, 0, 0), false, '');
                            clearTimeout(this.cells[i][j].deathTimeout);
                            
                            // Redraw cell.
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

    clearFarm() {
        // Redraw grid. 
        for (var i=0; i < this.columns; i++) {
            for (var j = 0; j < this.rows; j++) {
                // Reset cell.
                this.cells[i][j].set(defaultCellColor, false, '');
                clearTimeout(this.cells[i][j].deathTimeout); 

                // Redraw cell. 
                this.cells[i][j].draw(this.cellWidth, this.cellHeight);
            }
        }

        this.setFarmStats(); 
    }

    recreateFarm() {
        // Recalculate rows and columns in case cellSize has changed. 
        this.calcRowsColumns();

        // Recreate the cells. 
        this.createCells();

        // Reset farm stats.
        this.setFarmStats();
    }

    setFarmCapacity(capacity) {
        // Capacity is a number between 0-100
        this.maxCells = int((capacity / 100) * this.totalCells); 
        // console.log('Set Farm Capacity (%, maxCells): ' + capacity + '%' + ', ' + this.maxCells);
    }

    setCellSize(size) {
        this.cellWidth = size; 
        this.cellHeight = size; 
    }

    calcRowsColumns() {
        this.columns = displayWidth/this.cellWidth; 
        this.rows = displayHeight/this.cellHeight;
    }

    setFarmStats() {
        this.totalCells = this.rows * this.columns;  
        this.plantedCells = 0; 
        this.maxCells = this.totalCells; // Max available cells for planting. 
    }

    createCells() {
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
  }