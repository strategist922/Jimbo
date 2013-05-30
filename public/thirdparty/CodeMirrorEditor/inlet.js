window.isWidgetOpen = false;
//////////////////////////////
//////////////////////////////
//////////////////////////////
//Converters
//////////////////////////////
//////////////////////////////
//////////////////////////////
var isHex = function(hex, marker) {
    var color, match, _ref;
    if (marker == null) {
        marker = true;
    }
    match = ( _ref = hex.match(/^#?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/)) != null ? _ref.slice(1) :
    void 0;
    if (match == null) {
        return false;
    }
    color = _.compact(match).join('');
    if (marker) {
        return '#' + color;
    } else {
        return color;
    }
}
var hexToRgb = function(hex) {
    var c, color;
    hex = this.isHex(hex, false);
    if (!hex) {
        return false;
    }
    if (hex.length !== 6) {
        hex = ((function() {
                var _i, _len, _results;
                _results = [];
                for ( _i = 0, _len = hex.length; _i < _len; _i++) {
                    c = hex[_i];
                    _results.push("" + c + c);
                }
                return _results;
            })()).join('');
    }
    color = hex.match(/#?(.{2})(.{2})(.{2})/).slice(1);
    return color = ((function() {
            var _i, _len, _results;
            _results = [];
            for ( _i = 0, _len = color.length; _i < _len; _i++) {
                c = color[_i];
                _results.push(parseInt(c, 16));
            }
            return _results;
        })()).concat([1]);
}

var isRgb = function(rgb) {
    var c, match, valid, _ref;
    if ( typeof rgb === 'string') {
        match = ( _ref = rgb.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(0?\.?\d+)?\s*\)$/)) != null ? _ref.slice(1) :
        void 0;
        if (match == null) {
            return false;
        }
        rgb = (function() {
            var _i, _len, _ref1, _results;
            _ref1 = _.compact(match);
            _results = [];
            for ( _i = 0, _len = _ref1.length; _i < _len; _i++) {
                c = _ref1[_i];
                _results.push(parseFloat(c));
            }
            return _results;
        })();
    }
    if (rgb[3] == null) {
        rgb[3] = 1;
    }
    valid = rgb[0] <= 255 && rgb[1] <= 255 && rgb[2] <= 255 && rgb[3] <= 1;
    if (valid) {
        return rgb;
    } else {
        return false;
    }
}
var isHsl = function(hsl) {
    var c, match, valid, _ref;
    if ( typeof hsl === 'string') {
        match = ( _ref = hsl.match(/hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\%\s*,\s*(\d{1,3})\%\s*,?\s*(0?\.?\d+)?\s*\)$/)) != null ? _ref.slice(1) :
        void 0;
        if (match == null) {
            return false;
        }
        hsl = (function() {
            var _i, _len, _ref1, _results;
            _ref1 = _.compact(match);
            _results = [];
            for ( _i = 0, _len = _ref1.length; _i < _len; _i++) {
                c = _ref1[_i];
                _results.push(parseFloat(c));
            }
            return _results;
        })();
    }
    if (hsl[3] == null) {
        hsl[3] = 1;
    }
    valid = hsl[0] <= 360 && hsl[1] <= 100 && hsl[2] <= 100 && hsl[3] <= 1;
    if (valid) {
        return hsl;
    } else {
        return false;
    }
}
var rgbToHex = function(rgb) {

    var c, hex, i;
    if ( typeof rgb === 'string') {
        rgb = this.isRgb(rgb);
    }
    if (rgb) {
        hex = (function() {
            var _i, _len, _ref, _results;
            _ref = rgb.slice(0, 3);
            _results = [];
            for ( _i = 0, _len = _ref.length; _i < _len; _i++) {
                c = _ref[_i];
                _results.push(parseFloat(c).toString(16));
            }
            return _results;
        })();
        hex = (function() {
            var _i, _len, _results;
            _results = [];
            for ( _i = 0, _len = hex.length; _i < _len; _i++) {
                c = hex[_i];
                if (c.length === 1) {
                    _results.push("0" + c);
                } else {
                    _results.push(c);
                }
            }
            return _results;
        })();
        hex = hex.join('');
        if (_.compact((function() {
            var _i, _len, _ref, _results;
            _ref = hex.match(/.{1,2}/g);
            _results = [];
            for ( _i = 0, _len = _ref.length; _i < _len; _i++) {
                i = _ref[_i];
                _results.push(i[0] === i[1]);
            }
            return _results;
        })()).length === 3) {
            return "#" + hex[0] + hex[2] + hex[4];
        } else {
            return "#" + hex;
        }
    }

}

var hueToRgb = function(p, q, h) {
    if (h < 0) {
        h += 1;
    }
    if (h > 1) {
        h -= 1;
    }
    if ((h * 6) < 1) {
        return p + (q - p) * h * 6;
    } else if ((h * 2) < 1) {
        return q;
    } else if ((h * 3) < 2) {
        return p + (q - p) * ((2 / 3) - h) * 6;
    } else {
        return p;
    }
}

var hslToRgb = function(hsl) {
    var a, b, bt, g, gt, hue, lum, p, q, r, rt, sat;
    if ( typeof hsl === 'string') {
        hsl = this.isHsl(hsl);
    }
    if (!hsl) {
        return false;
    }
    hue = parseInt(hsl[0]) / 360;
    sat = parseInt(hsl[1]) / 100;
    lum = parseInt(hsl[2]) / 100;
    q = lum <= .5 ? lum * (1 + sat) : lum + sat - (lum * sat);
    p = 2 * lum - q;
    rt = hue + (1 / 3);
    gt = hue;
    bt = hue - (1 / 3);
    r = Math.round(this.hueToRgb(p, q, rt) * 255);
    g = Math.round(this.hueToRgb(p, q, gt) * 255);
    b = Math.round(this.hueToRgb(p, q, bt) * 255);
    a = parseFloat(hsl[3]) || 1;
    return [r, g, b, a];
}
var hslToHex = function(hsl) {
    if ( typeof hsl === 'string') {
        hsl = this.isHsl(hsl);
    }
    if (!hsl) {
        return false;
    }
    return this.rgbToHex(this.hslToRgb(hsl));
}
//////////////////////////////
//////////////////////////////
//////////////////////////////
//Converters
//////////////////////////////
//////////////////////////////
//////////////////////////////

var Inlet = (function() {
    function inlet(ed) {
        var editor = ed;
        var slider;
        var picker;

        var wrapper = editor.getWrapperElement();
        $(wrapper).on("mousedown", onClick);
        var parent = $(editor.getWrapperElement()).parents()[0];
        var _id = editor.jimboType;

        if ($(".inlet_slider").size() === 0) {
            var slider_node = document.createElement("div");
            slider_node.className = "inlet_slider";
            $("#editorArea").append(slider_node);
            slider = $(slider_node);
            slider.slider();
            slider.css('visibility', 'hidden');
        } else {
            slider = $(".inlet_slider");
            slider.css('visibility', 'hidden');
        }
        
        picker = new thistle.Picker('rgb(128,128,128)');
        $(picker.el).attr("id", _id + "_colorPicker").css("display", "none");
        $(parent).append(picker.el);
        picker.on('changed', function(inp1, inp2) {
            var hslColor = picker.getCSS();            
            var newcolor = hslToHex(hslColor).substring(1);
            

            var cursor = editor.getCursor();
            var token = editor.getTokenAt(cursor);

            var start = {
                "line" : cursor.line,
                "ch" : token.start
            };
            var end = {
                "line" : cursor.line,
                "ch" : token.end
            };
            start.ch = start.ch + token.string.indexOf("#");
                        
            end.ch = (token.string.indexOf('"') != -1)? (start.ch + token.string.length - 2) : (start.ch + token.string.length);

            editor.replaceRange('#' + newcolor.toUpperCase(), start, end);
        });

        picker.on('closed', function() {
            isWidgetOpen = false;            
        });

        function onClick(ev) {
            isWidgetOpen = false;
            var cursor = editor.getCursor(true);
            var token = editor.getTokenAt(cursor);

            if (token.type === "number") {
                var cursorOffset = editor.cursorCoords(true, "page");
                var value = parseFloat(token.string);
                var sliderRange;

                if (value === 0) {
                    sliderRange = [-100, 100];
                } else {
                    sliderRange = [-value * 3, value * 5];
                }

                var slider_min = _.min(sliderRange);
                var slider_max = _.max(sliderRange);
                slider.slider('option', 'min', slider_min);
                slider.slider('option', 'max', slider_max);

                if ((slider_max - slider_min) > 20) {
                    slider.slider('option', 'step', 1);
                } else {
                    slider.slider('option', 'step', (slider_max - slider_min) / 200);
                }
                slider.slider('option', 'value', value);

                var y_offset = 15;
                var sliderTop = cursorOffset.top - y_offset;
                var sliderLeft = cursorOffset.left - slider.width() / 2;

                slider.offset({
                    top : sliderTop - 10,
                    left : sliderLeft
                });

                slider.slider('option', 'slide', function(event, ui) {
                    var mcursor = editor.getCursor(true);
                    var mtoken = editor.getTokenAt(cursor);
                    var start = {
                        "line" : mcursor.line,
                        "ch" : mtoken.start
                    };
                    var end = {
                        "line" : mcursor.line,
                        "ch" : mtoken.end
                    };
                    editor.replaceRange(String(ui.value.toFixed(2)), start, end);
                });

                slider.css('visibility', 'visible');
                $("#colorPicker").css("display", "none");
                isWidgetOpen = true;
            } else {
                var cursorOffset = editor.cursorCoords(true, "local");
                var match = token.string.match(/#+(([a-fA-F0-9]){3}){1,2}/);
                if (match) {
                    var color = match[0];
                    //color = color.slice(1, color.length);                    
                    picker.setCSS(color);

                    var top = cursorOffset.top - 100;
                    var left = cursorOffset.left - 150;
                    $("#" + _id + "_colorPicker").css('position', "absolute");
                    $("#" + _id + "_colorPicker").css('top', top);
                    $("#" + _id + "_colorPicker").css('z-index', 100);
                    $("#" + _id + "_colorPicker").css('left', left);
                    $("#" + _id + "_colorPicker").show(100);                    
                    
                    isWidgetOpen = true;
                } else {
                    $("#" + _id + "_colorPicker").css("display", "none");
                    isWidgetOpen = false;
                }
                slider.css('visibility', 'hidden');
            }
        }

    }

    return inlet;
})();
