// Author:    Pedro Tomé
// URL:       https://github.com/pmtome
// Copyright: Free software. Give credit. Don't steal.


var DEFAULT_SQRT_N = 16;
var DEFAULT_PIXEL_COLOR = {r:255, g:255, b:255, a:1};
var DEFAULT_SELECTED_COLOR = {r:0, g:0, b:0, a:0.33};
var DEFAULT_RANDOM_MODE_STATE = false;


var Settings = {
    SqrtN: DEFAULT_SQRT_N,
    Color: Object.assign({}, DEFAULT_SELECTED_COLOR),
    RandomModeActive: DEFAULT_RANDOM_MODE_STATE
};


$(document).ready(function() {
    /* Get input HTML elements */
    var $sqrtN       = $("#sqrtN");
    var $colorBox    = $("#colorBox");
    var $randomMode  = $("#randomMode");
    var $opacity     = $("#opacity");
    var $clearButton = $("#clearButton");

    var sketchboard = new Sketchboard($("#sketchContainer"));


    /* Set defaults */
    $sqrtN.val(DEFAULT_SQRT_N);
    $colorBox.paintCSS(Object.assign({}, DEFAULT_SELECTED_COLOR, {a:1}));  // Ignore opacity
    $randomMode.prop("checked", DEFAULT_RANDOM_MODE_STATE);
    $opacity.val(100 * DEFAULT_SELECTED_COLOR.a + "%");
    for (var i = 0; i < DEFAULT_SQRT_N * DEFAULT_SQRT_N; i++) {
        sketchboard.addPixel(new SketchPixel());
    }


    /* Create new sketch board if $sqrtN is changed */
    $sqrtN.pressEnter(function() {
        var userInput = $sqrtN.val();
        if (isNaN(userInput) || userInput < 1 || userInput > 100) {
            $sqrtN.val(Settings.SqrtN);
            return;
        }

        Settings.SqrtN = Math.round(userInput);
        $sqrtN.val(Settings.SqrtN);

        sketchboard.deletePixels();
        for (var i = 0; i < Settings.SqrtN * Settings.SqrtN; i++) {
            sketchboard.addPixel(new SketchPixel());
        }
    });


    /* Attach ColorPicker to $colorBox */
    $colorBox.ColorPicker({
        color: "#" + rgb2hex(Object.assign({}, Settings.Color, {a:1})),

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

            // Overwrite Settings.Color's RGB properties but keep the A property
            Object.assign(Settings.Color, rgb);
        }
    });


    /* Enable random colors if the $randomMode checkbox is active */
    $randomMode.change(function() {
        Settings.RandomModeActive = this.checked;
    });


    /* Update the selected color's opacity if $opacity is changed */
    $opacity.pressEnter(function() {
        var userInput = $opacity.val().replace(/\%$/, '');
        if (isNaN(userInput) || userInput < 1 || userInput > 100) {
            $opacity.val(Settings.Color.a * 100 + "%");
            return;
        }

        Settings.Color.a = Math.round(userInput) / 100;
        $opacity.val(Math.round(userInput) + "%");
    });

    
    /* Clear the sketchboard if the $clearButton is pressed */
    $clearButton.click(function() {
        sketchboard.setPixelsColor(Object.assign({}, DEFAULT_PIXEL_COLOR));
    });
});


$.fn.paintCSS = function(color) {
    $(this).css("background-color", "rgba(" + Object.values(color).join() + ")");
};


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


function rgb2hex(rgb) {
// Source: Lance Vick, https://gist.github.com/lrvick/2080648
    var bin = rgb.r << 16 | rgb.g << 8 | rgb.b;
    return (function(h){
            return new Array(7-h.length).join("0")+h;
    })(bin.toString(16).toUpperCase());
}