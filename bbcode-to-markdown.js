
var htmlToMd = require('html-md');
var jsdom = require("jsdom-nogyp");

var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();


var bbcodejs = require('bbcodejs');
var newTags = require('./newTags');
var parser = new bbcodejs.Parser();

newTags.forEach(function(tag, i) {
	parser.registerTag(tag.name, tag.klass);
});

(function(module) {

	var urlRegExp = /\[url=\\"(.*)\\"\]/gi;
	var convertBbcodeToHml = function (str) {
		str = str.replace(urlRegExp, '[url=$1]')
		str = parser.toHTML(str);
		str = entities.decode(str);
		return str;
	};

	var brRegExp = /<br\s*[\/]?>/gmi;
	var convertHtmlToMarkdown = function(str) {
		var window = jsdom.jsdom(null, null, {features: {FetchExternalResources: false}}).parentWindow;

		str = (str || '').replace(brRegExp, '\n');
		str = htmlToMd(str, {window: window});

		// Important! Prevents memory leaks. Thanks to @Fidelix
		// https://github.com/akhoury/nodebb-plugin-import/issues/124
		window.close();
		return str;
	};

	var convertBbcodeToMarkdown = function(str) {
		str = convertHtmlToMarkdown(convertBbcodeToHml(str));
		return str;
	};

	// backward compatible
	var convert = convertBbcodeToMarkdown;

	// expose some more functions and aliases
	convert.bbcodeToHTML = convertBbcodeToHml;
	convert.bbcodeToMarkdown = convertBbcodeToMarkdown;
	convert.htmlToMarkdown = convertHtmlToMarkdown;
	convert.decodeEntities = entities.decode.bind(entities);

	module.exports = convert;

})(module);
