// Author:    Pedro Tomé
// URL:       https://github.com/pmtome
// Copyright: Free software. Give credit. Don't steal.


function Sketchboard($sketchContainer) {
    this.$this = $sketchContainer;
    this.pixels = [];
}


Sketchboard.prototype.addPixel = function(pixel) {
    this.pixels.push(pixel);
    this.$this.append(pixel.cssElement());
};


Sketchboard.prototype.deletePixels = function() {
    for (var i = 0; i < this.pixels.length; i++) {
        this.pixels[i].delete();
    }
    this.pixels = [];
};


Sketchboard.prototype.setPixelsColor = function(color) {
    for (var i = 0; i < this.pixels.length; i++) {
        this.pixels[i].setColor(color);
    }
};