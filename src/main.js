// Transaction Farm: This farm is maintained by two parallel processes. 
// [Planting]: The planting process takes incoming pending transactions 
// and renders them as green dots in the farm. 
// [Mining]: Starting from the latest block, transactions are obtained for every
// new block by querying for it every interval. Once a new block is obtained in 
// the canonical chain, transactions are extracted from it and compared with the 
// planted transactions in the farm. The transactions that are mined are turned red. 

// Metrics: The metrics are calculated by 3 different strategies.
// [New Block Headers]: These are events triggered when a new block is mined. Metrics 
// like Best Block, Last Block time are calculated with this. 
// [Block Interval]: When a [New Block Header] event is triggered, it's not necessary
// that this new block on the chain is synced on with this node. Thus, getBlock('latest')
// could still return the previous block. Therefore, another interval based method is used
// to query for new blocks. Using this, we set the difficulty and average hash rate of the 
// system. 
// [Eth Price & Market Cap]: For this, I'll be using an CoinCap API. 
// [Farm Capacity]: (unsure) Based on the capacity of the farm, we will be able to calculate
// how much of the farm capacity is active right now. This will be a very dynamic number. 
// [Wattage]: For this, I'll use the average number of kWH/difficulty in the link I have. 
// Through that difficulty, this kWH can be assumbed and extrapolated. 
var startButton; 
var stopButton; 

// Ethereum controller
var ethereum;
// Transaction farm
var farm; 
// Keep track of the latest block number. 
var currentBlockNum = -1; 
// Interval instance to keep track of the next block that I will query. 
var newBlockInterval; 

// Raw states. 
var initialDraw = true; 
var isTracking = false; 
var isVisible = true; 

// Global colors
var bgColor;
var defaultCellColor; 
var cellStrokeColor; 
var plantColor;
var mineColor; 
var metricsTileHeight; 
var metricsSubTileBorderWidth; 

// GUI Variables. 
var gui; 
// Farm capacity. 
var farmCapacity = 50; // Default value. 
// Cell size 
var cellSize = 10; // Default value. 
var startStop = false; 
var resetFarm = false; 
var hideLabel = 'Press h to hide GUI and cursor';
// Height of the metrics container
var metricsContainerPosition = 200; 
var metricsContainerOpacity = 0.5; 

// Metrics
var metrics; 

// ------------------------------- Sketch Setup ------------------------------
function setup() {
  // Define global variables here. 
  bgColor = color(0,0,0);
  defaultCellColor = color(36, 36, 36); 
  cellStrokeColor = color(0,0,0);
  plantColor = color(100, 148, 6); 
  mineColor = /*color(255, 0, 0);*/ color(216, 216, 220); 
  metricsTileHeight = 75; 
  metricsSubTileBorderWidth = '0.1px'; // 2 pixels

  // Canvas where all the visualization is running. 
  createCanvas(displayWidth, displayHeight); 
  background(bgColor);

  // Initialize Ethereum controller.
  ethereum = new Ethereum();
  farm = new Farm(cellSize);

  // Metrics container
  metrics = new Metrics();

  // Initialize GUI
  sliderRange(1, 90, 1);
  gui = createGui('Ethereum Labor', 20, 20);
  gui.addGlobals('farmCapacity');
  sliderRange(5, 15, 5);
  gui.addGlobals('cellSize', 'resetFarm');
  gui.addGlobals('startStop', 'hideLabel');
  sliderRange(0, displayHeight-metricsTileHeight, 1); 
  gui.addGlobals('metricsContainerPosition');
  sliderRange(0, 1, 0.05);
  gui.addGlobals('metricsContainerOpacity');
}

// ------------------------------- Sketch Draw (loop) ------------------------
function draw() {
  if (initialDraw) {
    // Optimization: Render the farm once and stop. 
    farm.draw();
    initialDraw = false; 
  }

  // For every GUI change, draw is called. 
  farm.setFarmCapacity(farmCapacity);

  // Dingy logic to start/stop tracking based on 
  // a GUI button. 
  if (startStop) {
    if (isTracking == false) {
      startTracking(); 
      isTracking = true; 
    }
  } else {
    if (isTracking) {
      stopTracking(); 
      isTracking = false; 
    }
  }

  // Reset the farm
  if (resetFarm) {
    background(bgColor);
    farm.recreateFarm();
    resetFarm = !resetFarm; 
    // Redraw the farm. 
    initialDraw = true; 
  }

  // Set metrics tile's position.
  metrics.setDynamicStyles(metricsContainerOpacity, metricsContainerPosition);
}

// ------------------------------- Ethereum Subsribe Callbacks -----------------
function onPendingTransaction(txHash) {
  // Plant this transaction in the farm. 
  farm.plant(txHash); 
}

function onNewBlockHeader(block) {
  console.log('New Block Header Received: ' + block.number);
  // Update Last Block Time, Best Block. 
}

// ------------------------------- Button Callbacks ------------------------------
function startTracking() {
  console.log('Start tracking...');
  
  // Subsribe to new blocks and pending transactions. 
  ethereum.subscribe(onPendingTransaction, onNewBlockHeader);

  // Set Starting Block number from where I'll beging tracking transactions. 
  ethereum.getLatestBlock(setStartBlock);
}

function stopTracking() {
  console.log('Stop tracking...');
  // Unsubscribe from pending transactions and new blocks. 
  ethereum.unsubscribe();

  // Clear interval for the new blocks method. 
  clearInterval(newBlockInterval);

  // Unpluck all the transactions from the farm. 
  farm.clearFarm();
}

// ------------------------------- Critical Callbacks ------------------------------
function setStartBlock(blockNum) {
  currentBlockNum = blockNum;
  console.log('Starting Block Number: ' + currentBlockNum); 

  // Start querying for transactions starting with this block num
  // Set an interval method to query for new blocks in the cononical chain. 
  newBlockInterval = setInterval(function() {
    // console.log('Query for Block: ' + currentBlockNum);
    ethereum.getBlockByNum(currentBlockNum, onTransactionsInNewBlock);
  }, 1000);
}

function onTransactionsInNewBlock(minedTransactions) {
    // Update Difficulty, Hash Rate

    // Mine these completed transactions in the farm.  
    farm.mine(minedTransactions); 

    // Update currentBlockNum to query next block. 
    currentBlockNum = currentBlockNum + 1; 
}

function keyPressed() {
  isVisible = !isVisible; 
  if (isVisible) {
    gui.show();
    cursor();
  } else {
    gui.hide();
    noCursor();
  }
}