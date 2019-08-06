// [div]
// [[[Title][Metric]][[Title][Metric]][[Title][Metric]][[Title][Metric]][[Title][Metric]]]
class Metrics {
    constructor() {
        this.container = createDiv(''); 

        // Containers styles 
        this.container.size(displayWidth, metricsTileHeight); 
        this.container.style('background-color', 'black');

        // Create 5 sub containers
        this.subContainers = [];
        this.subWidth = displayWidth/5; 
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
        for (var i = 0; i < 5; i++) {
            var metricParent = createDiv('');
            metricParent.style('display', 'flex'); 
            metricParent.style('flex-direction', 'row'); 
            metricParent.style('align-items', 'center');
            metricParent.parent(this.container);
            metricParent.size(this.subWidth, this.subHeight);
            metricParent.position(i*this.subWidth, 0);

            // Create div (title)
            this.createMetricDiv('Best Block', metricParent);

            // Create div (metric) 
            this.createMetricDiv('812042', metricParent);

            // Store this div. 
            this.subContainers.push(metricParent);
        }
    }

    createMetricDiv(title, parent) {
        var div = createDiv(title); 
        div.style('flex-grow', '1'); 
        div.style('text-align', 'center');
        div.style('font-size', '25px');
        div.style('font-family', 'Menlo-Regular');
        div.style('color', '#DCDCDC');
        div.parent(parent); 
    }
}