var htmlToMd = require('html-md-optional_window'),
    bbcodejs = require('bbcodejs'),
    Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities(),
    jsdom = require("jsdom-nogyp"),

    convertHtmlToMd =  (function() {
        return function(str) {
            var window = jsdom.jsdom(null, null, {features: {FetchExternalResources: false}}).parentWindow;
            str = htmlToMd(str, {window: window});
            
            // Important! Prevents memory leaks. Thanks to @Fidelix
            // https://github.com/akhoury/nodebb-plugin-import/issues/124
            window.close();
            
            return str;
        }
    })(),

    newTags = require('./newTags'),

    convertBBCodeToMd = (function() {
        var parser = new bbcodejs.Parser();
        newTags.forEach(function(tag, i) {
            parser.registerTag(tag.name, tag.klass);
        });

        var brRe = /<br\s*[\/]?>/gmi;
		var urlRe = /\[url=\\"(.*)\\"\]/gi;
		
        var fn = function(str) {
            str = (str || '').replace(brRe, '\n\r');
            str = str.replace(urlRe, '[url=$1]');
            
            str = parser.toHTML(str);
            str = entities.decode(str);
            str = convertHtmlToMd(str);

            return str;
        };

        // expose some functions
        
        fn.bbcodeToHTML = parser.toHTML.bind(parser);
        fn.htmlToMarkdown = convertHtmlToMd;
        fn.bbcodeToMarkdown = fn;
        fn.decodeEntities = entities.decode.bind(entities);

        return fn;
    })();


module.exports = convertBBCodeToMd;
