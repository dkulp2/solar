Profiles = new Meteor.Collection("profiles");

// The entities involved in contract relationships
Partners = new Meteor.Collection('partners');

// Create object corresponding to a collection document, so I can
// add additional helper methods.
Contract = function(doc) {
    _.extend(this, doc);
};
_.extend(Contract.prototype, {
    partner: function() {
        // returns Partner object
        return Partners.findOne(this.withAcctId);
    },
    year: function() { return this.contract_date.getFullYear() }
});

// Instantiate the Contracts MongoDB collection and include a
// transform to wrap the results in an extendable object, here
// Contract.
Contracts = new Mongo.Collection('contracts', {
    transform: function (doc) { 
        return new Contract(doc); 
    } 
});


var Schemas = {};

Schemas.Partners = new SimpleSchema({
    name: {
        type: String,
        label: "Partner Full Name"
    },
    address: {
        type: String,
        label: "Partner Address"
    },
    eid: {
        type: String,
        label: "Electric Utility Account ID"
    }
});
Partners.attachSchema(Schemas.Partners);

Schemas.Contracts = new SimpleSchema({
    withAcctId: {
        type: String,
        label: "Account ID of Contract Partner"
    },
    contract_date: {
        type: Date,
        label: "Contract Date"
    },
    credit_pct: {
        type: Number,
        decimal: true,
        label: "Credit Percentage",
        min: 0,
        max: 100,
        autoform: {
            step: "0.1"
        }
    },
    price_per_kwh: {
        type: Number,
        decimal: true,
        label: "Price per kilowatt-hour",
        min: 0
    },
});
Contracts.attachSchema(Schemas.Contracts);

