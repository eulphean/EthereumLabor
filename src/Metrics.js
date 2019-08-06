// [div]
// [[[Title][Metric]][[Title][Metric]][[Title][Metric]][[Title][Metric]][[Title][Metric]]]
class Tile {
    constructor (title) {
        this.parent = createDiv();
        this.parent.style('display', 'flex'); 
        this.parent.style('flex-direction', 'row'); 
        this.parent.style('align-items', 'center');
        this.parent.size(displayWidth/5, metricsTileHeight);

        var title = this.createMetricDiv(title); 
        var metric = this.createMetricDiv('');
        this.children = [title, metric]; 

        // Hide this metric for now. 
        this.parent.hide();
    }

    createMetricDiv(innerText) {
        var child = createDiv(innerText); 
        child.style('flex-grow', '1'); 
        child.style('text-align', 'center');
        child.style('font-size', '25px');
        child.style('font-family', 'Menlo-Regular');
        child.style('color', '#DCDCDC');
        child.parent(this.parent); 
        return child; 
    }

    // Set the parent node for this container
    setParent(parent) {
        this.parent.parent(parent);
        this.parent.show();
        // Some bug in p5.js where hide() reset the display to block
        // So, I reset the display of this container back to flex.
        this.parent.style('display', 'flex'); 
    }

    setPosition(x, y) {
        this.parent.position(x, y);
    }
}; 

class Metrics {
    constructor() {
        // Container of all the metrics. 
        this.parent = createDiv(''); 

        // Containers styles 
        this.parent.size(displayWidth, metricsTileHeight); 
        this.parent.style('background-color', 'black');
        this.parent.style('display', 'flex');

        // Create all metrics tiles and hide them. 
        this.bestBlock = new Tile('Best Block'); 
        this.lastBlockTime = new Tile('Last Block');
        this.farmCapacity = new Tile('Farm Capacity');
        this.avgHashRate = new Tile('Avg Hash Rate');
        this.difficulty = new Tile('Difficulty');
        this.ethPrice = new Tile('ETH Price');
        this.ethMarketCap = new Tile('ETH Market Cap');
        this.maxFarmCapacity = new Tile('Max Farm Capacity'); 

        // Set initial children. 
        this.children = [this.bestBlock, this.lastBlockTime, this.farmCapacity, this.avgHashRate, this.difficulty];
        this.showChildren(); 
    }

    setDynamicStyles(opacity, yPosition) {
        // Update container and sub containers
        this.parent.position(0, yPosition);
        this.parent.style('opacity', opacity);
    }

    showChildren() {
        for (let i = 0; i < this.children.length; i++) {
            var c = this.children[i]; 
            c.setParent(this.parent);
        }
    }
}