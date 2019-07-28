var startButton; 
var stopButton; 

// Collections of Blocks and Transactions
// Instances of Block.js & Transaction.js
var transactions = []; 
var blocks = [];

// Ethereum controller
// Check Ethereum.js
var ethereum;

// ------------------------------- Sketch Setup ------------------------------
function setup() {
  // Canvas where all the visualization is running. 
  createCanvas(displayWidth, displayHeight); 
  background(100);

  // Initialize Ethereum controller.
  ethereum = new Ethereum();
  
  // Start button
  var col = color(153, 255, 153);
  startButton = createButton('Start');
  startButton.position(20, 20);
  startButton.size(80, 40)
  startButton.style('background-color', col)
  startButton.mousePressed(onStart);

  // Stop button
  col = color(255, 102, 102);
  stopButton = createButton('Stop');
  stopButton.position(120, 20);
  stopButton.size(80, 40);
  stopButton.style('background-color', col);
  stopButton.mousePressed(onStop); 
}

// ------------------------------- Sketch Draw (loop) ------------------------
function draw() {
  background(100);

  // Draw transactions. 
  for (var i = 0; i < transactions.length; i++) {
    transactions[i].draw();
  }

  // Draw blocks. 
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].draw();
  }
}

// ------------------------------- Ethereum Subsribe Callbacks -----------------
function onTransactionSubscribe(transactionHash) {
  console.log('Transaction Hash: ' + transactionHash);
      
  // Create new transaction instance. 
  var t = new Transaction(transactionHash);
  transactions.push(t);
}

function onBlockSubscribe(block) {
  console.log('New Block - Number: ' + block.number + ' Hash: ' + block.hash);

  // Create new block instance.
  var b = new Block(block.number, block.hash);
  blocks.push(b);

  // Empty the transactions
  transactions.length = 0;
}

// ------------------------------- Ethereum Unsubscribe Callbacks ---------------
function onTransactionUnsubscribe() {
  transactions.length = 0; 
}

function onBlockUnsubscribe() {
  blocks.length = 0; 
}

// ------------------------------- Button Callbacks ------------------------------
function onStart() {
  // Subsribe
  ethereum.subscribe(onTransactionSubscribe, onBlockSubscribe);
}

function onStop() {
  // Unsubscribe
  ethereum.unsubscribe(onTransactionUnsubscribe, onBlockUnsubscribe)

  // Reset canvas
  background(100);
}