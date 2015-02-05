// set some global vars for UI management
Session.setDefault("selectedContract", 1);
Session.setDefault("selectedCustomer", null);

// subscribe to collections from server
Meteor.subscribe("profiles");

