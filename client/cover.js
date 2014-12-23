// HACK: Multi-page app with different CSS files must be loaded programmatically.
// See appBody.js
Template.Cover.created = function () { 
    Template.setCSS("customCSS-1","cover")
}; 

