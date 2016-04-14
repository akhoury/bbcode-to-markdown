var bbcode = require('bbcodejs');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

// todo: move these to a .json file
var liTags = ['li'];
var newLineTags = ['br'];
var ignoredTags = [
	'time',
	'attach',

	// http://forum.thesettlersonline.net/misc.php?do=bbcode
	'sigpic',
	'thread',
	'post',
	'clear'
];
var anameTags = ['aname']; // see [jumpto]
var imageTags = ['ifl', 'ifr'];
var codeTags = ['php', 'html'];

var strikeTags = ['strike'];
var quoteTags = ['quote'];
var simpleTags = ['spoiler'];
var maybeSelfAttrTags = [];
var maybeSelfAttrAnchorTags = ['ftp', 'anchor', 'iurl', 'email', 'u', 'jumpto'];
var contentOnlyTags = [
	'youtube',
    'soundcloud',
    'vimeo',
    'font',
    'video',
    'embed',
    'flash',
    'bdo',
    'left',
    'center',
    'right',
    'me',
    'nobbc',
    'mumble',
    'presentation',
    'rtl',
    'align',
    'ltr',
    'shadow',
    'sub',
    'sup',
    'abbr',
    'acronym',
    'tt',
    'color',
    'colour',
    'glow',
    'move',
    'u',
    'indent',

	// http://forum.thesettlersonline.net/misc.php?do=bbcode
    'highlight',
    'noparse',

    // list of colors from http://if.invisionfree.com/topic/423042/1/
    'Aliceblue', 'Antiquewhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'Blanchedalmond', 'Blue',
    'Blueviolet', 'Brown', 'Burlywood', 'Cadetblue', 'Chartreuse', 'Chocolate', 'Coral', 'Cornflowerblue', 'Cornsilk',
    'Crimson', 'Cyan', 'Darkblue', 'Darkcyan', 'Darkgoldenrod', 'Darkgray', 'Darkgreen', 'Darkkhaki', 'Darkmagenta',
    'Darkolivegreen', 'Darkorange', 'Darkorchid', 'Darkred', 'Darksalmon', 'Darkseagreen', 'Darkslateblue', 'Darkslategray',
    'Darkturquoise', 'Darkviolet', 'Deeppink', 'Deepskyblue', 'Dimgray', 'Dodgerblue', 'Firebrick', 'Floralwhite', 'Forestgreen',
    'Fuchsia', 'Gainsboro', 'Ghostwhite', 'Gold', 'Goldenrod', 'Gray', 'Green', 'Greenyellow', 'Honeydew', 'Hotpink', 'Indianred',
    'Indigo', 'Ivory', 'Khaki', 'Lavender', 'Lavenderblush', 'Lawngreen', 'Lemonchiffon', 'Lightblue', 'Lightcoral', 'Lightcyan',
    'Lightgoldenrodyellow', 'Lightgray', 'Lightpink', 'Lightsalmon', 'Lightseagreen', 'Lightskyblue', 'Lightslategray', 'Lightsteelblue',
    'Lightyellow', 'Lime', 'Limegreen', 'Linen', 'Magenta', 'Maroon', 'Mediumaquamarine', 'Mediumblue', 'Mediumorchid',
    'Mediumpurple', 'Mediumseagreen', 'Mediumslateblue', 'Mediumspringgreen', 'Mediumturquoise', 'Mediumvioletred', 'Midnightblue',
    'Mintcream', 'Mistyrose', 'Moccasin', 'Navajowhite', 'Navy', 'Oldlace', 'Olive', 'Olivedrab', 'Orange', 'Orangered',
    'Orchid', 'Palegoldenrod', 'Palegreen', 'Paleturquoise', 'Palevioletred', 'Papayawhip', 'Peachpuff', 'Peru', 'Pink',
    'Plum', 'Powderblue', 'Purple', 'Red', 'Rosybrown', 'Royalblue', 'Saddlebrown', 'Salmon', 'Sandybrown', 'Seagreen',
    'Seashell', 'Sienna', 'Silver', 'Skyblue', 'Slateblue', 'Slategray', 'Snow', 'Springgreen', 'Steelblue', 'Tan', 'Teal',
    'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'Whitesmoke', 'Yellow', 'Yellowgreen'
];

// coffeescripts spits that, so ama use it
var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
var __hasProp = Object.prototype.hasOwnProperty;
var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child };

// new tag Classes
var ContentOnlyTag = (function(_super) {
        __extends(ContentOnlyTag, _super);
        function ContentOnlyTag() {
            ContentOnlyTag.__super__.constructor.apply(this, arguments);
        }
        ContentOnlyTag.prototype._toHTML = function() {
            return this.getContent();
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
            var citation = this.params['quote'] || this.params['author'] || this.params['user'],
                pieces = [];

            if (citation) {
                pieces.push('<small>');
                pieces.push('@' + entities.decode(citation).replace(/\"/g, '').split(',')[0].split(';')[0] + ' said:');
                pieces.push('</small><br>');
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
            return (selfAttrValue ? selfAttrValue + ' ' : '') + this.renderer.strip(this.getContent());
        };
        return MaybeSelfAttrTag;
    })(bbcode.Tag),

    MaybeSelfAttrAnchorTag = (function(_super) {
        __extends(MaybeSelfAttrAnchorTag, _super);
        function MaybeSelfAttrAnchorTag() {
				MaybeSelfAttrAnchorTag.__super__.constructor.apply(this, arguments);
		}
		MaybeSelfAttrAnchorTag.prototype._toHTML = function() {
			var url = this.params[this.name] || this.params['url'] || this.params['link'];
			var content = this.getContent() || '';

            return (url ? '<a href="' + url + '" target="_blank">' + (content || url) + '</a>' : content);
        };
        return MaybeSelfAttrAnchorTag;
    })(bbcode.Tag),

    LiTag = (function(_super) {
        __extends(LiTag, _super);
        function LiTag() {
            LiTag.__super__.constructor.apply(this, arguments);
        }
        LiTag.prototype._toHTML = function() {
            return '<li>' + this.getContent() + '</li>';
        };
        return LiTag;
    })(bbcode.Tag),

	AnameTag = (function(_super) {
        __extends(AnameTag, _super);
        function AnameTag() {
			AnameTag.__super__.constructor.apply(this, arguments);
        }
		AnameTag.prototype._toHTML = function() {
            return '<div id="' + this.getContent() + '"></div>';
        };
        return AnameTag;
    })(bbcode.Tag),

	StrikeTag = (function(_super) {
        __extends(StrikeTag, _super);
        function StrikeTag() {
			StrikeTag.__super__.constructor.apply(this, arguments);
        }
        return StrikeTag;
    })(bbcode.createSimpleTag('strike')),

    CodeTag = (function(_super) {
        __extends(CodeTag, _super);
        function CodeTag() {
			CodeTag.__super__.constructor.apply(this, arguments);
        }
        return CodeTag;
    })(bbcode.BUILTIN.code),

	ImageTag = (function(_super) {
        __extends(ImageTag, _super);
        function ImageTag() {
			ImageTag.__super__.constructor.apply(this, arguments);
        }
        return ImageTag;
    })(bbcode.BUILTIN.img);

var newTags = [];

var pushTag = function(name, klass) {
    if (name && klass) {
        newTags.push({name: name.toLowerCase(), klass: klass});
        newTags.push({name: name.toUpperCase(), klass: klass});
    }
};
var pushTags = function(names, sameKlass) {
    if (!Array.isArray(names) && names && typeof names === 'string') {
        names = [names];
    }
    if (names && names.length && sameKlass) {
        names.forEach(function(name) {
            pushTag(name, sameKlass);
        });
    }
};

simpleTags.forEach(function(tag) {
    pushTag(tag, bbcode.createSimpleTag(tag));
});

pushTags(contentOnlyTags, ContentOnlyTag);
pushTags(anameTags, AnameTag);
pushTags(codeTags, CodeTag);
pushTags(strikeTags, StrikeTag);
pushTags(imageTags, ImageTag);
pushTags(liTags, LiTag);
pushTags(newLineTags, NewlineTag);
pushTags(ignoredTags, IgnoredTag);
pushTags(quoteTags, QuoteTag);
pushTags(maybeSelfAttrTags, MaybeSelfAttrTag);
pushTags(maybeSelfAttrAnchorTags, MaybeSelfAttrAnchorTag);

module.exports = newTags;
