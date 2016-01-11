
var extend = require('extend');

var defaults = {
	gfm: true
};

var options = extend(true, {
	converters: [
		{
			filter: 'pre',
			replacement: function (innerHTML) {
				debugger;
				return '```\n' + innerHTML + '\n```';
			}
		},
		{
			filter: 'spoiler',
			replacement: function (innerHTML) {
				return '\n>! ' + (innerHTML || '').split('\n').join('\n>! ');
			}
		},
		{
			filter: 'strike',
			replacement: function (innerHTML) {
				return '~~' + innerHTML + '~~';
			}
		},
		{
			filter: ['html', 'body', 'span', 'div', 'small'],
			replacement: function(innerHTML) {
				return innerHTML;
			}
		},
		{
			filter: ['head', 'script', 'style', 'link', 'meta', 'input', 'textarea', 'button'],
			replacement: function() {
				return '';
			}
		}
	]
}, defaults);

module.exports = options;
