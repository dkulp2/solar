Meteor.publish("producers", function () {
    if (this.userId) {
        return Producers.find(this.userId);
    } else {
	this.ready();
    }
});

Meteor.publish("contracts", function() {
    if (this.userId) {
        return Contracts.find({/* TODO find only contracts for this producer's facilities */});
    } else {
        this.ready();
    }
});

Meteor.publish("customers", function() {
    if (this.userId) {
        return Customers.find({producer_id: this.userId});
    } else {
        this.ready();
    }
});

Meteor.publish("facilities", function() {
    if (this.userId) {
        return Facilities.find({producer_id: this.userId});
    } else {
        this.ready();
    }
});

Meteor.publish("invoices", function() {
    if (this.userId) {
        // TODO: search for invoices with contract IDs that belong to this.userId
        return Invoices.find({});
    } else {
        this.ready();
    }
});
