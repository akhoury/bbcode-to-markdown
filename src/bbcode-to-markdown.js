
var extend = require('extend');
var htmlMd = require('html-md.js');
var toMarkdown = require('to-markdown');
var jsdom = require("jsdom-nogyp");

var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

var bbcodejs = require('bbcodejs');
var newBBCodeTags = require('./newBBCodeTags');
var parser = new bbcodejs.Parser();

newBBCodeTags.forEach(function(tag, i) {
    parser.registerTag(tag.name, tag.klass);
});

var newToMarkdownOptions = require('./newToMarkdownOptions');

(function(module) {

    var brRegExp = /<br\s*[\/]?>/gmi;
    var htmlMdjs = function (str) {
        var window = jsdom.jsdom(null, null, {features: {FetchExternalResources: false}}).parentWindow;

        var newStr = (str || '').replace(brRegExp, '\n');
        newStr = htmlMd(newStr, {window: window});

        // Important! Prevents memory leaks. Thanks to @Fidelix
        // https://github.com/akhoury/nodebb-plugin-import/issues/124
        process.nextTick(function() {
            window.close();
        });
        return newStr;
    };

    var urlRegExp = /\[url=\\"(.*)\\"\]/gi;
    var convertBbcodeToHml = function (str, options) {
        var opt = extend(true, {decode: true}, options);

        str = str.replace(urlRegExp, '[url=$1]');
        str = parser.toHTML(str);

        if (opt.decode) {
            str = entities.decode(str);
        }
        return str;
    };

    var convertHtmlToMarkdown = function(str, options) {
        var md = str;
        var opt = extend(true, {fallback: true, decode: true, gfm: true}, newToMarkdownOptions, options);

        if (opt.decode) {
            str = entities.decode(str);
        }

        try {
            md = toMarkdown(str, opt);
        } catch(e) {
            if (opt.fallback) {
                // fallback to htmlMdjs if toMarkdown fails
                md = htmlMdjs(str);
            }
        }
        return md;
    };

    var convertBbcodeToMarkdown = function(str, options) {
        return convertHtmlToMarkdown(convertBbcodeToHml(str), options);
    };

    // backward compatible
    var convert = convertBbcodeToMarkdown;

    // expose some more functions and aliases
    convert.bbcodeToHTML = convertBbcodeToHml;
    convert.bbcodeToMarkdown = convertBbcodeToMarkdown;
    convert.convertHtmlToMarkdown = convertHtmlToMarkdown;

    convert.htmlToMarkdown = toMarkdown;
    convert.decodeEntities = entities.decode.bind(entities);

    module.exports = convert;

})(module);
