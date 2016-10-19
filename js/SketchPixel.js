// Author:    Pedro Tomé
// URL:       https://github.com/pmtome
// Copyright: Free software. Give credit. Don't steal.


/* Don't confuse setColor() with paint():
 *   setColor() forces a specified background color, and
 *   paint() mixes the selected color (Settings.Color)
 *   with the current background color of the pixel.
 */


function SketchPixel() {
    var $this = $("<div class='sketchPixel'></div>");

    $this.css("height", "calc(100% / " + Settings.SqrtN + ")");
    $this.css("width",  "calc(100% / " + Settings.SqrtN + ")");


    $this.mouseenter(this, function(event) {
        // event.data is the 'this' pixelObject passed on to mouseenter()
        event.data.paint();
    });


    this.cssElement = function() {
        return $this;
    };


    this.delete = function() {
        $this.remove();
    };
    

    this.setColor = function(color) {
        $this.paintCSS(color);
    }


    this.paint = function() {
        if (Settings.RandomModeActive) {
            /* Override the selected color with a random color */
            Settings.Color.r = getRandomIntInclusive(0, 255);
            Settings.Color.g = getRandomIntInclusive(0, 255);
            Settings.Color.b = getRandomIntInclusive(0, 255);

            /* Apply it to the colorBox */
            $("#colorBox").paintCSS(Object.assign({}, Settings.Color, {a:1}));
        }

        /* Get the current pixel color */
        var pixelCSS = $this.css("background-color");
        var rgbaArray = pixelCSS.match(/[0-9]+/g);
        var currentPixelColor = {
            r: rgbaArray[0],
            g: rgbaArray[1],
            b: rgbaArray[2],
            a: (rgbaArray[3] !== undefined) ? rgbaArray[3] : 1,
        };

        /* Mix the current pixel color with the new one */
        var mixture = mixRGBA(currentPixelColor, Settings.Color);

        /* Apply the color mixture to the CSS element */
        $this.paintCSS(mixture);
    };
}


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function mixRGBA(baseColor, addedColor) {
// Source: Niet the Dark Absol, http://stackoverflow.com/a/26318627
    return {
        r: Math.round(baseColor.r * baseColor.a * (1 - addedColor.a)  +  addedColor.r * addedColor.a),
        g: Math.round(baseColor.g * baseColor.a * (1 - addedColor.a)  +  addedColor.g * addedColor.a),
        b: Math.round(baseColor.b * baseColor.a * (1 - addedColor.a)  +  addedColor.b * addedColor.a),
        a: baseColor.a * (1 - addedColor.a) + addedColor.a
    };
}