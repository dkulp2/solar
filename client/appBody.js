// A hook that is called after the template is created.
Template.AppBody.created = function () { 
    Template.setCSS("customCSS-2","appBody")
}; 

// Helpers are names that can be inserted into the HTML as {{sample}}.
// They might be data or functions.
Template.AppBody.helpers(
{
    sample: [ 1, 2, 3 ],
     other: function() { return "hello"; }
});

Template.AppBody.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
      console.log("Setting counter to " + Session.get("counter"));
    }
  });
