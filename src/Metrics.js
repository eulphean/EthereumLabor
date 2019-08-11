// [div]
// [[[Title][Metric]][[Title][Metric]][[Title][Metric]][[Title][Metric]][[Title][Metric]]]
class Tile {
    constructor (title, isLegend, colr = color(0)) { // Default color. 
        this.parent = createDiv();
        this.parent.style('display', 'flex'); 
        this.parent.style('flex-direction', 'row'); 
        this.parent.style('align-items', 'center');
        // this.parent.size(displayWidth/5, metricsTileHeight);

        // Check if we are creating a metric div or a legend div.  
        var title = this.createTitleDiv(title); 
        var valDiv = isLegend ? this.createCircularDiv(colr) : this.createMetricDiv(''); 

        this.children = [title, valDiv]; 
    }

    createCircularDiv(colr) {
        var child = createDiv(); 
        child.style('margin-left', '15px');
        child.style('height', '20px');
        child.style('width', '20px');
        child.style('border-radius', '50%');
        child.style('background', colr); 
        child.parent(this.parent);
        return child; 
    }

    createTitleDiv(innerText) {
        var child = createDiv(innerText); 
        // child.style('margin-left', '40px');
        child.style('text-align', 'center');
        child.style('font-size', '25px');
        child.style('font-family', 'Menlo-Regular');
        child.style('color', '#DCDCDC');
        child.parent(this.parent); 
        return child; 
    }

    createMetricDiv(innerText) {
        var child = createDiv(innerText); 
        child.style('margin-left', '15px');
        child.style('text-align', 'center');
        child.style('font-size', '25px');
        child.style('font-family', 'Menlo-Regular');
        child.style('color', '#DCDCDC');
        child.parent(this.parent); 
        return child; 
    }

    setParent(parent) {
        this.parent.parent(parent);
    }
}; 

class Metrics {
    constructor() {
        // Container of metrics and lenged tiles. 
        this.parent = createDiv(''); 

        // Containers styles 
        this.parent.size(displayWidth, metricsTileHeight); 
        this.parent.style('background-color', 'black');
        this.parent.style('display', 'flex');

        // Legend tiles
        this.pendingTransactions = new Tile('Pending Transactions', true, plantColor);
        this.minedTransactions = new Tile('Mined Transactions', true, mineColor); 

        // Metrics tiles
        this.lastBlockTime = new Tile('Last Block', false);
        this.electricityConsumed = new Tile('Electricity Consumed', false); // Use the number of transactions mined every block to calculate this number. 
        this.ethPrice = new Tile('ETH Price', false);

        // Set all divs for this metrics container. 
        this.children = [this.pendingTransactions, this.minedTransactions, this.lastBlockTime, this.electricityConsumed, this.ethPrice];
        
        // Set the parent for all these child divs. 
        for (let i = 0; i < this.children.length; i++) {
            var c = this.children[i]; 
            c.setParent(this.parent);
        }
    }

    setDynamicStyles(opacity, yPosition) {
        // Update container and sub containers
        this.parent.position(0, yPosition);
        this.parent.style('opacity', opacity);
    }
}

// Create all metrics tiles and hide them. 
// this.bestBlock = new Tile('Best Block'); 
// this.farmCapacity = new Tile('Farm Capacity');
// this.avgHashRate = new Tile('Avg Hash Rate');
// this.difficulty = new Tile('Difficulty');
// this.ethPrice = new Tile('ETH Price');
// this.ethMarketCap = new Tile('ETH Market Cap');
// this.maxFarmCapacity = new Tile('Max Farm Capacity'); 