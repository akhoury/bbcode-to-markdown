var bbcode = require('bbcodejs'),
    newTags = [],

// coffee spits that
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },


// youtube, vimeo, soundcloud
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
				pieces.push('</small>1');
			}

            pieces.push('<blockquote>' + this.getContent() + '</blockquote>');
            return pieces;
        };

        return QuoteTag;

    })(bbcode.Tag);



newTags.push({name: 'youtube', klass: ContentOnlyTag});
newTags.push({name: 'soundcloud', klass: ContentOnlyTag});
newTags.push({name: 'vimeo', klass: ContentOnlyTag});
newTags.push({name: 'font', klass: ContentOnlyTag});
newTags.push({name: 'embed', klass: ContentOnlyTag});
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