// Block definition.
class Block {
    constructor(num, hash) {
      this.position = [random(displayWidth - blockSize), random(displayHeight - blockSize)];
      this.col = color(random(255),random(255),random(255), 255);
      this.blockNumber = num; 
      this.hash = hash;
    }
  
    draw() {
      fill(this.col);
      noStroke();
      rect(this.position[0], this.position[1], blockSize, blockSize);
    }
}