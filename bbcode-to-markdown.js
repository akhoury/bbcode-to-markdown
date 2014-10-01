var htmlToMd = require('html-md-optional_window'),
    bbcodejs = require('bbcodejs'),
    Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities(),
    window = require("jsdom-nogyp").jsdom(null, null, {features: {FetchExternalResources: false}}).parentWindow,

// use a fake window, which will avoid jsdom.jsdom().createWindow() every time, much, much faster, and avoids memory leaks
    convertHtmlToMd =  (function() {
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
        return function(str, cb) {
            str = (str || '').replace(brRe, '[br].[/br]');
            str = str.replace(/\[url=\\"(.*)\\"\]/gi, '[url=$1]');
            str = parser.toHTML(str);
            str = entities.decode(str);
            str = convertHtmlToMd(str);
            return str;
        };
    })();

module.exports = convertBBCodeToMd;
