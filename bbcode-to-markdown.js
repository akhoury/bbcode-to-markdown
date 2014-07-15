var htmlToMd = require('html-md-optional_window'),
    bbcodejs = require('bbcodejs'),

    window = require("jsdom").jsdom(null, null, {features: {FetchExternalResources: false}}).createWindow(),

// use a fake window, which will avoid jsdom.jsdom().createWindow() every time, much, much faster, and avoids memory leaks
    convertHtmlToMd =  (function(){
        return function(str){
            return htmlToMd(str, {window: window})
        }
    })(),

    newTags = require('./newTags'),

    convertBBCodeToMd = (function() {
        var parser = new bbcodejs.Parser();
        newTags.forEach(function(tag, i) {
            parser.registerTag(tag.name, tag.klass);
        });

        var brRe = /<br\s*[\/]?>/gmi;
        return function(str) {
            str = (str || '').replace(brRe, '[br].[/br]');
            return convertHtmlToMd(
                parser.toHTML(str)
            );
        };
    })();

module.exports = convertBBCodeToMd;

