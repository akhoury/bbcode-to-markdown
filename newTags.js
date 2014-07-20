var bbcode = require('bbcodejs'),
    newTags = [],

// coffee spits that
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },


    ContentOnlyTag = (function(_super) {
        __extends(ContentOnlyTag, _super);
        function ContentOnlyTag() {
            ContentOnlyTag.__super__.constructor.apply(this, arguments);
        }
        ContentOnlyTag.prototype._toHTML = function() {
            return this.renderer.strip(this.getContent(true));
        };
        return ContentOnlyTag;
    })(bbcode.Tag),

    NewlineTag = (function(_super) {
        __extends(NewlineTag, _super);
        function NewlineTag() {
            NewlineTag.__super__.constructor.apply(this, arguments);
        }
        NewlineTag.prototype._toHTML = function() {
            return '<br>';
        };
        return NewlineTag;
    })(bbcode.Tag),

    IgnoredTag = (function(_super) {
        __extends(IgnoredTag, _super);
        function IgnoredTag() {
            IgnoredTag.__super__.constructor.apply(this, arguments);
        }
        IgnoredTag.prototype._toHTML = function() {
            return '';
        };
        return IgnoredTag;
    })(bbcode.Tag),

    QuoteTag = (function(_super) {
        __extends(QuoteTag, _super);

        function QuoteTag() {
            QuoteTag.__super__.constructor.apply(this, arguments);
            this.STRIP_INNER = true;
            this.STRIP_OUTER = true;
        }

        QuoteTag.prototype._toHTML = function() {
            var citation = this.params['quote'] || this.params['author'],
				pieces = [];

			if (citation) {
				pieces.push('<small>');
				pieces.push('@' + citation + ' said:<br>');
				pieces.push('</small>');
			}

            pieces.push('<blockquote>' + this.getContent() + '</blockquote>');
            return pieces;
        };

        return QuoteTag;

    })(bbcode.Tag),

    MaybeSelfAttrTag = (function(_super) {
        __extends(MaybeSelfAttrTag, _super);
        function MaybeSelfAttrTag() {
            MaybeSelfAttrTag.__super__.constructor.apply(this, arguments);
        }
        MaybeSelfAttrTag.prototype._toHTML = function() {
            var selfAttrValue = this.params[this.name];
            return (selfAttrValue ? selfAttrValue + ' ' : '') + this.renderer.strip(this.getContent(true));
        };
        return MaybeSelfAttrTag;
    })(bbcode.Tag),

    LiTag = (function(_super) {
        __extends(LiTag, _super);
        function LiTag() {
            LiTag.__super__.constructor.apply(this, arguments);
        }
        LiTag.prototype._toHTML = function() {
            return '- ' + this.renderer.strip(this.getContent(true)) + '<br>';
        };
        return LiTag;
    })(bbcode.Tag);



newTags.push({name: 'youtube', klass: ContentOnlyTag});
newTags.push({name: 'soundcloud', klass: ContentOnlyTag});
newTags.push({name: 'vimeo', klass: ContentOnlyTag});
newTags.push({name: 'font', klass: ContentOnlyTag});
newTags.push({name: 'embed', klass: ContentOnlyTag});
newTags.push({name: 'flash', klass: ContentOnlyTag});
newTags.push({name: 'bdo', klass: ContentOnlyTag});
newTags.push({name: 'left', klass: ContentOnlyTag});
newTags.push({name: 'right', klass: ContentOnlyTag});
newTags.push({name: 'me', klass: ContentOnlyTag});
newTags.push({name: 'nobbc', klass: ContentOnlyTag});
newTags.push({name: 'rtl', klass: ContentOnlyTag});
newTags.push({name: 'ltr', klass: ContentOnlyTag});
newTags.push({name: 'shadow', klass: ContentOnlyTag});
newTags.push({name: 'sub', klass: ContentOnlyTag});
newTags.push({name: 'abbr', klass: ContentOnlyTag});
newTags.push({name: 'tt', klass: ContentOnlyTag});
newTags.push({name: 'color', klass: ContentOnlyTag});
newTags.push({name: 'colour', klass: ContentOnlyTag});

// colors, from http://if.invisionfree.com/topic/423042/1/
var colors = ['Aliceblue', 'Antiquewhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'Blanchedalmond', 'Blue', 'Blueviolet', 'Brown', 'Burlywood', 'Cadetblue', 'Chartreuse', 'Chocolate', 'Coral', 'Cornflowerblue', 'Cornsilk', 'Crimson', 'Cyan', 'Darkblue', 'Darkcyan', 'Darkgoldenrod', 'Darkgray', 'Darkgreen', 'Darkkhaki', 'Darkmagenta', 'Darkolivegreen', 'Darkorange', 'Darkorchid', 'Darkred', 'Darksalmon', 'Darkseagreen', 'Darkslateblue', 'Darkslategray', 'Darkturquoise', 'Darkviolet', 'Deeppink', 'Deepskyblue', 'Dimgray', 'Dodgerblue', 'Firebrick', 'Floralwhite', 'Forestgreen', 'Fuchsia', 'Gainsboro', 'Ghostwhite', 'Gold', 'Goldenrod', 'Gray', 'Green', 'Greenyellow', 'Honeydew', 'Hotpink', 'Indianred', 'Indigo', 'Ivory', 'Khaki', 'Lavender', 'Lavenderblush', 'Lawngreen', 'Lemonchiffon', 'Lightblue', 'Lightcoral', 'Lightcyan', 'Lightgoldenrodyellow', 'Lightgray', 'Lightpink', 'Lightsalmon', 'Lightseagreen', 'Lightskyblue', 'Lightslategray', 'Lightsteelblue', 'Lightyellow', 'Lime', 'Limegreen', 'Linen', 'Magenta', 'Maroon', 'Mediumaquamarine', 'Mediumblue', 'Mediumorchid', 'Mediumpurple', 'Mediumseagreen', 'Mediumslateblue', 'Mediumspringgreen', 'Mediumturquoise', 'Mediumvioletred', 'Midnightblue', 'Mintcream', 'Mistyrose', 'Moccasin', 'Navajowhite', 'Navy', 'Oldlace', 'Olive', 'Olivedrab', 'Orange', 'Orangered', 'Orchid', 'Palegoldenrod', 'Palegreen', 'Paleturquoise', 'Palevioletred', 'Papayawhip', 'Peachpuff', 'Peru', 'Pink', 'Plum', 'Powderblue', 'Purple', 'Red', 'Rosybrown', 'Royalblue', 'Saddlebrown', 'Salmon', 'Sandybrown', 'Seagreen', 'Seashell', 'Sienna', 'Silver', 'Skyblue', 'Slateblue', 'Slategray', 'Snow', 'Springgreen', 'Steelblue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'Whitesmoke', 'Yellow', 'Yellowgreen'];
colors.forEach(function(color) {
    newTags.push({name: color, klass: ContentOnlyTag});
    newTags.push({name: color.toLowerCase(), klass: ContentOnlyTag});
    newTags.push({name: color.toUpperCase(), klass: ContentOnlyTag});
});


newTags.push({name: 'li', klass: LiTag});

newTags.push({name: 'ftp', klass: MaybeSelfAttrTag});
newTags.push({name: 'anchor', klass: MaybeSelfAttrTag});

newTags.push({name: 'br', klass: NewlineTag});
newTags.push({name: 'time', klass: IgnoredTag});
newTags.push({name: 'quote', klass: QuoteTag});


module.exports = newTags;



/*
 //            // this.params['src'] || this.params[this.name],
 //          var width = this.params['width'] || '420',
 //                height = this.params['height'] || '315';
 //
 //            return '<iframe src="' + src + '" width="' + width + '" heigth="' + height + '" frameborder="0" allowfullscreen></iframe>';
 */
