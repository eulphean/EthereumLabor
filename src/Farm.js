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
        this.animateTimer = null; 
    }    

    draw() {
        push();
            // Translate to the center of the cell. 
            translate(this.xPos + cellSize/2, this.yPos + cellSize/2);
            stroke(cellStrokeColor);
            fill(this.col);
            ellipse(0, 0, cellSize, cellSize, 200); // Rather than rectangles, these will be circles actually at the center of the cell. 
        pop();
    }

    set(finalColor, planted, tx, shouldAnimate, animationPeriod) {
        // Begin animation interval if I want to animate 
        if (shouldAnimate)
            this.animateTimer = setInterval(this.animate.bind(this), animationPeriod, finalColor);
        else 
            this.col = finalColor; 

        this.isPlanted = planted; 
        this.txHash = tx; 
    }

    // lerp from current color to the final color. 
    animate(finalColor) {
        this.col = lerpColor(this.col, finalColor, 0.3); 
        if (this.isColorSame(this.col, finalColor)) {
            clearInterval(this.animateTimer); 
        } else 
            this.draw(cellSize, cellSize); // Keep drawing till animation is not finished. 
    }

    isColorSame(x, y) {
        let thresh = 0.2; 
        // Make sure RGB are equal values. 
        return (abs(x.levels[0] - y.levels[0]) <= thresh && 
                    abs(x.levels[1] - y.levels[1]) <= thresh && 
                        abs(x.levels[2] >= y.levels[2]) <= thresh); 
    }
}

// A 2D farm as the background of this machine. 
// This farm will be planted with transactions. 
// Then these transactions will be mined. 
class Farm {
    constructor() {
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
      this.setFarmStats();
      
      // Kill this cell in about 3 minutes
      this.killMinutes = 2; 
    }
  
    draw() {
      for (var i = 0; i < this.columns; i++) {
        for (var j = 0; j < this.rows; j++) {
           this.cells[i][j].draw();
        }
      }
    }

    kill(cell) {
        //console.log('Killing planted cell.');
        // Reset cell. 
        clearTimeout(cell.deathTimeout); 
        clearInterval(cell.animateTimer); // Reset animation
        cell.set(defaultCellColor, false, '', true, 100)

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
            //console.log('Planting a transaction');

            // Reset the animation (it could be a mined cell)
            clearInterval(cell.animateTimer);
            cell.set(plantColor, true, txHash, true, 200); // Begin animating. 
            cell.deathTimeout = setTimeout(this.kill.bind(this), this.killMinutes * 60 * 1000, cell); // Kill this transaction after 10 minutes
            
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
                            return t.hash === hash;
                        });
                        
                        // Mine that cell if this transaction is found in mined block. 
                        if (found) {
                            //console.log('Mining transaction.');
                            // Reset cell. 
                            clearInterval(this.cells[i][j].animateTimer); // Reset animation (it's a planted cell)
                            clearTimeout(this.cells[i][j].deathTimeout);
                            this.cells[i][j].set(mineColor, false, '', true, 200); // Begin animating.
                            
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
                this.cells[i][j].set(defaultCellColor, false, '', false, 0);
                clearTimeout(this.cells[i][j].deathTimeout); 
                clearInterval(this.cells[i][j].animateTimer);

                // Redraw cell. 
                this.cells[i][j].draw();
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

    calcRowsColumns() {
        this.columns = displayWidth/cellSize; 
        this.rows = displayHeight/cellSize;
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
              var xPos = i * cellSize;
              var yPos = j * cellSize; 
              var cell = new Cell(xPos, yPos);
              this.cells[i][j] = cell;
            }
          }
    }

    getCapacity() {
        var capacity = (this.plantedCells/this.totalCells) * 100;
        return capacity.toFixed(1);  
    }
  }