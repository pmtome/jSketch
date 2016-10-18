var DEFAULT_SQRT_N = 16;
var DEFAULT_PIXEL_RGBA = {r:255, g:255, b:255, a:1};
var DEFAULT_PAINTBRUSH_RGBA = {r:0, g:0, b:0, a:0.33};
var DEFAULT_RANDOM_STATE = false;

var RANDOM_MODE_ACTIVE = DEFAULT_RANDOM_STATE;


$(document).ready(function() {
    var currentSqrtN = DEFAULT_SQRT_N;
    var paintbrushRGBA = DEFAULT_PAINTBRUSH_RGBA;


    // Get input objects
    var $sqrtN = $("#sqrtN");
    var $colorBox = $("#colorBox");
    var $randomColor = $("#randomColor");
    var $opacity = $("#opacity");
    var $clearButton = $("#clearButton");


    // Set defaults
    $sqrtN.val(DEFAULT_SQRT_N);
    $colorBox.css("background-color", "#" + rgb2hex(DEFAULT_PAINTBRUSH_RGBA.r, DEFAULT_PAINTBRUSH_RGBA.g, DEFAULT_PAINTBRUSH_RGBA.b));
    $randomColor.prop("checked", DEFAULT_RANDOM_STATE);
    $opacity.val(100 * DEFAULT_PAINTBRUSH_RGBA.a + "%");
    var $pixels = drawSketchboard(DEFAULT_SQRT_N, DEFAULT_PIXEL_RGBA, DEFAULT_PAINTBRUSH_RGBA);


    // Create new sketch board if $sqrtN is changed
    $sqrtN.pressEnter(function() {
        var userInput = $sqrtN.val();
        if (isNaN(userInput) || userInput < 1 || userInput > 100) {
            $sqrtN.val(currentSqrtN);
            return;
        }

        currentSqrtN = Math.round(userInput);
        $pixels.remove();
        $pixels = drawSketchboard(currentSqrtN, DEFAULT_PIXEL_RGBA, paintbrushRGBA);
        $sqrtN.val(currentSqrtN);
    });


    // Attach ColorPicker to $colorBox
    $colorBox.ColorPicker({
        color: "#" + rgb2hex(DEFAULT_PAINTBRUSH_RGBA.r, DEFAULT_PAINTBRUSH_RGBA.g, DEFAULT_PAINTBRUSH_RGBA.b),

        onShow: function(colpkr) {
            $(colpkr).fadeIn(100);
            return false;
        },

        onHide: function(colpkr) {
            $(colpkr).fadeOut(100);
            return false;
        },

        onChange: function(hsb, hex, rgb) {
            $colorBox.css("background-color", "#" + hex);
            paintbrushRGBA.r = rgb.r;
            paintbrushRGBA.g = rgb.g;
            paintbrushRGBA.b = rgb.b;
        }
    });


    // Enable random colors if the $randomColor checkbox is active
    $randomColor.change(function() {
        RANDOM_MODE_ACTIVE = this.checked;
    });


    // Update the paintbrush's opacity if $opacity is changed
    $opacity.pressEnter(function() {
        var userInput = $opacity.val().replace(/\%$/, '');
        if (isNaN(userInput) || userInput < 1 || userInput > 100) {
            $opacity.val(paintbrushRGBA.a * 100 + "%");
            return;
        }

        paintbrushRGBA.a = Math.round(userInput) / 100;
        $opacity.val(Math.round(userInput) + "%");
    });

    
    // Clear the sketchboard if the $clearButton is pressed
    $clearButton.click(function() {
        $pixels.css("background-color", "rgba("+DEFAULT_PIXEL_RGBA.r+","+DEFAULT_PIXEL_RGBA.g+","+DEFAULT_PIXEL_RGBA.b+","+DEFAULT_PIXEL_RGBA.a+")");
    });
});


function drawSketchboard(sqrtN, pixelColor, paintbrushColor) {
    // Create sqrtN^2 pixels
    for (var i = 0; i < sqrtN * sqrtN; i++) {
        var newPixel = "<div class='sketchPixel'></div>";
        $("#sketchContainer").append(newPixel);
    }
    var $pixels = $(".sketchPixel");

    // Resize pixels
    $pixels.css("height", "calc(100% / " + sqrtN + ")");
    $pixels.css("width", "calc(100% / " + sqrtN + ")");

    // Color pixels
    $pixels.css("background-color", "rgba("+pixelColor.r+","+pixelColor.g+","+pixelColor.b+","+pixelColor.a+")");

    
    // Enable painting behavior (change color on hover)
    $pixels.mouseenter(function() {
        paintPixel($(this), paintbrushColor);
    });


    return $pixels;
}


function paintPixel($pixel, paintbrushColor) {
    if (RANDOM_MODE_ACTIVE) {
        // Override paintbrushColor with a random color
        paintbrushColor.r = getRandomIntInclusive(0, 255);
        paintbrushColor.g = getRandomIntInclusive(0, 255);
        paintbrushColor.b = getRandomIntInclusive(0, 255);

        // Apply it to the colorBox
        $("#colorBox").css("background-color", "#" + rgb2hex(paintbrushColor.r, paintbrushColor.g, paintbrushColor.b));
    }

    
    // Get the current pixel color
    var pixelCSS = $pixel.css("background-color");
    var rgbArray = pixelCSS.match(/[0-9]+/g);
    var pixelColor = {
        r: rgbArray[0],
        g: rgbArray[1],
        b: rgbArray[2],
        a: (rgbArray[3] !== undefined) ? rgbArray[3] : 1,
    };

    // Mix the current pixel color with the new one
    var mixture = mixRGBA(pixelColor, paintbrushColor);

    // Apply the color mixture to the CSS element
    $pixel.css("background-color", "rgba("+mixture.r+","+mixture.g+","+mixture.b+","+mixture.a+")");
}


function mixRGBA(color1, color2) {
// Source: Niet the Dark Absol, http://stackoverflow.com/a/26318627
    return {
        r: Math.round(color1.r * color1.a * (1 - color2.a)  +  color2.r * color2.a),
        g: Math.round(color1.g * color1.a * (1 - color2.a)  +  color2.g * color2.a),
        b: Math.round(color1.b * color1.a * (1 - color2.a)  +  color2.b * color2.a),
        a: color1.a * (1 - color2.a) + color2.a
    };
}


function rgb2hex(r, g, b) {
// Source: Lance Vick, https://gist.github.com/lrvick/2080648
    var bin = r << 16 | g << 8 | b;
    return (function(h){
            return new Array(7-h.length).join("0")+h;
    })(bin.toString(16).toUpperCase());
}


$.fn.pressEnter = function(fn) {  
// Source: Neal, http://stackoverflow.com/a/6524584
    return this.each(function() {  
        $(this).bind('enterPress', fn);
        $(this).keyup(function(e){
            if(e.keyCode == 13)
            {
              $(this).trigger("enterPress");
            }
        })
    });  
 };


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}