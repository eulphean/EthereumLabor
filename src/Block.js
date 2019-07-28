// Block definition. 
// Something has changed. 
// New chang.
class Block {
    constructor(num, hash) {
      this.blockSize = 100; 
      this.position = [random(displayWidth - this.blockSize), random(displayHeight - this.blockSize)];
      this.col = color(random(255),random(255),random(255), 255);
      this.blockNumber = num; 
      this.hash = hash;
    }
  
    draw() {
      fill(this.col);
      noStroke();
      rect(this.position[0], this.position[1], this.blockSize, this.blockSize);
    }
};