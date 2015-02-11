// set some global vars for UI management
Session.setDefault("selectedContract", 0);
Session.setDefault("selectedCustomer", null);

// subscribe to collections from server
Meteor.subscribe("profiles");
Meteor.subscribe("contracts");
Meteor.subscribe("customers");

