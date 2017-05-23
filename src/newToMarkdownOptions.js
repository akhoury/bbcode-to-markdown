
module.exports = {
    converters: [
        {
            filter: 'pre',
            replacement: function (innerHTML) {
                return '```\n' + innerHTML + '\n```';
            }
        },
        {
            filter: 'spoiler',
            replacement: function (innerHTML) {
                return '\n>! ' + (innerHTML || '').split(/\n[\n]+/).join('\n>! ');
            }
        },
        {
            filter: 'strike',
            replacement: function (innerHTML) {
                return '~~' + innerHTML + '~~';
            }
        },
        {
            filter: ['html', 'body', 'span', 'div', 'small', 'font', 'article', 'section', 'u']
				.concat(
					// weird tags i came across
					['messagetemplate', 'zone', 'item', 'content']
				),
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
};
