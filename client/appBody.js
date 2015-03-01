// A hook that is called after the template is created.
Template.AppBody.created = function () { 
    Template.setCSS("customCSS-2","appBody")
}; 

// Helpers are names that can be inserted into the HTML as {{sample}}.
// They might be data or functions.
Template.AppBody.helpers(
{
});

Template.AppBody.events({
});
