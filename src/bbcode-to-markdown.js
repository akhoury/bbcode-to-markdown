
var extend = require('extend');
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

	var urlRegExp = /\[url=\\"(.*)\\"\]/gi;
	var convertBbcodeToHml = function (str) {
		str = str.replace(urlRegExp, '[url=$1]');
		str = parser.toHTML(str);
		str = entities.decode(str);
		return str;
	};

	var convertHtmlToMarkdown = function(str, options) {
		return toMarkdown(str, extend(true, {}, newToMarkdownOptions, options));
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
