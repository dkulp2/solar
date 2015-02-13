// On the server, profiles are just a different view of Meteor.users
// that includes additional data regarding login to WMECO.  Password
// should be stored on server, but not accessible by client.  It can
// be reset.
Meteor.publish("profiles", function () {
    if (this.userId) {
	return Meteor.users.find({_id: this.userId},
				 {fields: { 'emails': 1, 'profile': 1, 'accountId': 1}});
    } else {
	this.ready();
    }
});

// TODO: create the collection in MongoDB so that we can define the indices
Meteor.publish("contracts", function() {
    if (this.userId) {
        return Contracts.find({acctId: this.userId});
    } else {
        this.ready();
    }
});

Meteor.publish("partner", function() {
    if (this.userId) {
        return Partners.find({userId: this.userId});
    } else {
        this.ready();
    }
});
