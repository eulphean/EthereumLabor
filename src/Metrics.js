class Metrics {
    constructor() {
        this.container = createDiv(''); 
        
        // Basic container styles. 
        this.container.size(displayWidth, metricsTileHeight); 
        this.container.style('background-color', 'black');

        // Create sub containers in this. 
        this.subContainers = [];
        this.subWidth = displayWidth/4; 
        this.subHeight = metricsTileHeight; 
        this.createSubContainers(); 
    }

    setDynamicStyles(opacity, yPosition) {
        // Update container and sub containers
        this.container.position(0, yPosition);
        this.container.style('opacity', opacity);
    }

    createSubContainers() {
        // Create 4 sub containers to show metrics. 
        for (var i = 0; i < 4; i++) {
            var div = createDiv('');
            div.parent(this.container);
            div.style('border-style', 'solid');
            div.style('border-color', '#0C0C0C'); 
            div.style('border-width', metricsSubTileBorderWidth);
            div.size(this.subWidth, this.subHeight);
            div.position(i*this.subWidth, 0);
            // Set Some styles.
            this.subContainers.push(div);
        }
    }
}