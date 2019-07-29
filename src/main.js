var startButton; 
var stopButton; 

// Ethereum controller
// Check Ethereum.js
var ethereum;

// Transaction farm
// Check Farm.js
var farm; 

// ------------------------------- Sketch Setup ------------------------------
function setup() {
  // Canvas where all the visualization is running. 
  createCanvas(displayWidth, displayHeight); 
  background(0);

  // Initialize Ethereum controller.
  ethereum = new Ethereum();
  farm = new Farm();
  
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
  farm.draw();

  let fps = frameRate();
  fill(255);
  stroke(0);
  text("FPS: " + fps.toFixed(2), 20, height - 50);

  noLoop();
}

// ------------------------------- Ethereum Subsribe Callbacks -----------------
function onTransactionData(txHash) {
  // console.log('Transaction Hash: ' + txHash);
      
  // Plan this conversation. 
  farm.plantTransaction(txHash); 
}

function onBlockData(block) {
  console.log('New Block Received: ' + block.number);

  // Add a timeout function giving the node time to sync the blockchain before 
  // I fetch detailed information about the block. 
  setTimeout(function() {
    ethereum.getBlockTransactions(block.number, onTransactionsInBlock);
  }, 500);
}

function onTransactionsInBlock(transactions) {
  farm.mineFarm(transactions); 
}

// ------------------------------- Ethereum Unsubscribe Callbacks ---------------
function onTransactionUnsubscribe() {
}

function onBlockUnsubscribe() {
}

// ------------------------------- Button Callbacks ------------------------------
function onStart() {
  console.log('Start tracking...');
  // Subsribe
  ethereum.subscribe(onTransactionData, onBlockData);
}

function onStop() {
  console.log('Stop tracking...');
  // Unsubscribe
  ethereum.unsubscribe(onTransactionUnsubscribe, onBlockUnsubscribe);

  // Unpluck all the transactions from the farm. 
  farm.clearFarm();
}


  // Go Extract the actual block
  // Extract all the transactions hashes
  // Compare these transactions with the transactions in the farm
  // Mark the transactions that are mined with their state, change their color as well. 
  // Complex logic. 

  // After this, transaction farm will be done once. 

  // Create the frame for the putting the metrics. 

  // Add some animation to make the transaction farm pretty.

  // Can we optimize the loop, I feel it's making it real slow. 

  // Push the updates to website.

  // Send it to Stephanie.

  // Work on this all day today so I can finish it in time. 

  // Tuesday, Wednesday (Grants)
  // Dundee, Neon Festival (REACT) - AR Grant
  // Images ($1000 E comission)
  // AI & Blockchain (Thoughtworks)