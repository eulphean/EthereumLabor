// 
class Crop {
    // Receive the xPos and yPos of the cell in the farm. 
    constructor(x, y) {
        this.xPos = x,  
        this.yPos = y;
        this.col = random(255); // Assign a random color to this crop for now. 
    }    

    draw(w, h) {
        push();
            translate(this.xPos, this.yPos);
            fill(this.col);
            rect(0, 0, w, h); // Rather than rectangles, these will be circles actually at the center of the cell. 
        pop();
    }
}

// A 2D farm covering the screen.
// This farm will be planted with transactions. 
class Farm {
    constructor() {
      this.cellWidth = 5; 
      this.cellHeight = 5;
      this.columns = displayWidth/this.cellWidth; 
      this.rows = displayHeight/this.cellHeight;
      this.crops = [];   

      console.log('Display Width: ' + displayWidth);
      console.log('Display Height: ' + displayHeight);
      console.log('Rows: ' + this.rows);
      console.log('Columns: ' + this.columns);
      console.log('Total Items: ' + this.rows*this.columns);

      // Create the cells in the farm. 
      for (var i = 0; i < this.rows; i++) {
        this.crops[i] = []; // 2D array assign.
        for (var j = 0; j < this.columns; j++) {
          var xPos = j * this.cellWidth;
          var yPos = i * this.cellHeight; 
          var crop = new Crop(xPos, yPos);
          this.crops[i][j] = crop;
        }
      }
    }
  
    draw() {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
           this.crops[i][j].draw(this.cellWidth, this.cellHeight);
        }
      }
    }
  }