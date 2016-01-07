
var extend = require('extend');

var defaults = {
	gfm: true
};

var options = extend(true, {
	converters: [
		{
			filter: 'pre',
			replacement: function (content) {
				debugger;
				return '```\n' + content + '\n```';
			}
		}
		//, {
		//	filter: 'spoiler',
		//	replacement: function (content) {
		//		return '\n>! ' + content.split('\n').join('\n>! ');
		//	}
		//}
	]
}, defaults);

module.exports = options;