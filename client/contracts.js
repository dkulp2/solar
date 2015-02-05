Template.ContractsSidebar.helpers(
{
    activeContract: function(contractId) { if (Session.get("selectedContract") == contractId) { return "active"; } else { return "" }; }
});

Template.ContractsSidebar.events({
	'click': function (event,template) {
	//	Session.set("selectedContract", FIXME -- how do I determine which was selected from the event alone?  Do I have to hide an id in the tag?  Or is the second template argument used?  http://docs.meteor.com/#/full/eventmaps);
	    console.log(event);
	    console.log(template);
    }
  });
