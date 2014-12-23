// HACK: Multi-page app with different CSS files must be loaded
// programmatically
// https://stackoverflow.com/questions/15369021/conditionally-include-css-files-with-meteor
// But you need to remove the other CSS or the two will be combined.
// For generality, let's define a custom class and remove all except
// our unique ID.
Template.setCSS = function(id,cssfile) {
    customCSSTags = $('head link').filter(".customCSS");
    customCSSTags.not("#"+id).remove();
    if (customCSSTags.filter("#"+id).length == 0) {
	$('head').append('<link class="customCSS" id="'+id+'" rel="stylesheet" href="'+cssfile+'.css"/>');
    }
    _.each($('link').filter(".customCSS"), function(a) { console.log(a)});
};

