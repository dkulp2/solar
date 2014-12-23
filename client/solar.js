if (Meteor.isClient) {
  // set some global vars
  Session.setDefault("counter", 0);
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
