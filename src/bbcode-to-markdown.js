
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

		str = (str || '').replace(brRegExp, '\n');
		str = htmlMd(str, {window: window});

		// Important! Prevents memory leaks. Thanks to @Fidelix
		// https://github.com/akhoury/nodebb-plugin-import/issues/124
		window.close();
		return str;
	};

	var urlRegExp = /\[url=\\"(.*)\\"\]/gi;
	var convertBbcodeToHml = function (str) {
		str = str.replace(urlRegExp, '[url=$1]');
		str = parser.toHTML(str);
		str = entities.decode(str);
		return str;
	};

	var convertHtmlToMarkdown = function(str, options) {
		var md = str;
		try {
			md = toMarkdown(str, extend(true, {}, newToMarkdownOptions, options));
		} catch(e) {
			// fallback to htmlMdjs if toMarkdown fails
			md = htmlMdjs(str);
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
