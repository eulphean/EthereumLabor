// Transaction definition
class Transaction {
    constructor(hash) {
        this.txSize = 10; 
        this.position = [random(displayWidth - this.txSize), random(displayHeight - this.txSize)];
        this.col = color(random(255),random(255),random(255), 255);
        this.hash = hash;
    }

    draw() {
        fill(this.col);
        noStroke();
        //rect(posX, posY, width, height);
        ellipse(this.position[0], this.position[1], this.txSize, this.txSize);
    }
}