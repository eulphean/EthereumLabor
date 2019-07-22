var startButton; 
var stopButton; 
var projectId = '24b152bca7704bf39741eed185972f92';

// Ethereum subscriptions only work with a Websocket Provider
// This kind of a provider is available in Web3 release/1.0.
var web3Provider = new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/' + projectId);
var web3 = new Web3(web3Provider);

var blockSize = 100; 
var txSize = 10; 

var txSubscription;
var blockSubscription;

// Collections of Blocks and Transactions
var transactions = []; 
var blocks = [];

// Transaction object
class Transaction {
  constructor(hash) {
    this.position = [random(displayWidth - txSize), random(displayHeight - txSize)];
    this.col = color(random(255),random(255),random(255), 255);
    this.hash = hash;
  }

  draw() {
    fill(this.col);
    noStroke();
    //rect(posX, posY, width, height);
    ellipse(this.position[0], this.position[1], txSize, txSize);
  }
}

// Block object [Block should contain a list of transactions]
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

// ------------------------------- Sketch Setup ------------------------------
function setup() {
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

  createCanvas(displayWidth, displayHeight); 
  background(100);
}

// ------------------------------- Sketch Draw (loop) ------------------------
function draw() {
  background(100);

  for (var i = 0; i < transactions.length; i++) {
    transactions[i].draw();
  }

  for (var i = 0; i < blocks.length; i++) {
    blocks[i].draw();
  }
}


// ------------------------------- Button Callbacks ------------------------------
function onStart() {
  // Subscribe to new transactions. 
  //console.log("Subscribing to pending transactions.");
  txSubscription = web3.eth.subscribe('pendingTransactions', function (error, result) {
  }).on("data", function (transactionHash) {
    //console.log('Transaction Hash: ' + transactionHash);

    // Create new transaction instance. 
    var t = new Transaction(transactionHash);
    transactions.push(t);
  }); 

  // Subscribe to new Ethereum blocks. 
  //console.log("Subscribing to New Blocks.");
  blockSubscription = web3.eth.subscribe('newBlockHeaders', function (error, result) {    
  }).on("data", function (block) {
    //console.log('New Block - Number: ' + block.number + ' Hash: ' + block.hash);

    // Create new block instance.
    var b = new Block(block.number, block.hash);
    blocks.push(b);

    // Empty the transactions
    transactions.length = 0;
  }); 
}

function onStop() {
  // Reset canvas
  clear();
  background(100);

  //console.log("Stop tracking...")
  
  // Unsubscribe from transactions. 
  txSubscription.unsubscribe(function (error, success) {
    transactions.length = 0; 
    //if (success)
      //console.log('Successfully unsubscribed from transactions. ');
  });

  // Unsubscribe from new blocks. 
  blockSubscription.unsubscribe(function (error, success) {
    blocks.length = 0;
    //if (success)
      //console.log('Successfully unsubscribed from new blocks.');
  });
}