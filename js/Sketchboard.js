// Author:    Pedro Tomé
// URL:       https://github.com/pmtome
// Copyright: Free software. Give credit. Don't steal.


function Sketchboard($sketchContainer) {
    var $this = $sketchContainer;
    var pixels = [];


    this.addPixel = function(pixel) {
        pixels.push(pixel);
        $this.append(pixel.cssElement());
    }


    this.deletePixels = function() {
        for (var i = 0; i < pixels.length; i++) {
            pixels[i].delete();
        }
        pixels = [];
    }


    this.setPixelsColor = function(color) {
        for (var i = 0; i < pixels.length; i++) {
            pixels[i].setColor(color);
        }
    }
}