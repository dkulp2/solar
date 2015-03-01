// Create object corresponding to a collection document, so I can
// add additional helper methods and all modifications can be easily
// logged.

// OUR customer -- the energy producer.  Has same ID as login user.
Producer = function(doc) { _.extend(this, doc); }
_.extend(Producer.prototype, {});
Producers = new Meteor.Collection("producers", { transform: function(doc) { return new Producer(doc); } });

// Facilities -- the solar arrays
Facility = function(doc) { _.extend(this, doc); }
_.extend(Facility.prototype, {
    producer: function() {
        return Producers.findOne(this.producer_id);
    },
    host_customer: function() {
        return Customers.findOne(this.host_customer_id);
    },
});

Facilities = new Meteor.Collection("facilities", { transform: function(doc) { return new Facility(doc); } });

// The entities involved in contract relationships
Customer = function(doc) { _.extend(this, doc); }
_.extend(Customer.prototype, {});
Customers = new Meteor.Collection('customers', { transform: function(doc) { return new Customer(doc); } });

// The Customer/Facility relationship
Contract = function(doc) { _.extend(this, doc); }
_.extend(Contract.prototype, {
    notactive: function() { return !this.active; },
    customer: function() {
        // returns Customer object from ID
        return Customers.findOne(this.customer_id);
    },
    facility: function() {
        return Facilities.findOne(this.facility_id);
    },
    invoices: function() {
        return Invoices.find({contract_id: this._id});
    },
    invoice_count: function() { return this.invoices().count(); },
    year: function() { return this.contract_date.getFullYear(); },
    contract_date_fmt: function() { return this.contract_date.format("longDate"); }
});

// Instantiate the Contracts MongoDB collection and include a
// transform to wrap the results in an extendable object, here
// Contract.
Contracts = new Mongo.Collection('contracts', {
    transform: function (doc) { 
        return new Contract(doc); 
    } 
});

// Invoices are periodic billings for a contract
Invoice = function(doc) { _.extend(this, doc); }
_.extend(Invoice.prototype, {
    contract: function() { return Contracts.findOne(this.contract_id); },
    activity_begin_fmt: function() { return this.activity_begin.format("shortDate"); },
    activity_end_fmt: function() { return this.activity_end.format("shortDate"); },
    invoice_date_fmt: function() { return this.invoice_date.format("shortDate"); }
});
Invoices = new Meteor.Collection("invoices", { transform: function(doc) { return new Invoice(doc); } });

var Schemas = {};

AddressSchema = new SimpleSchema({
    street: {
        type: String,
        label: "Street",
        max: 100
    },
    street2: {
        type: String,
        max: 100,
        label: "Line 2 (optional)",
        optional: true
    },
    city: {
        type: String,
        label: "Town",
        max: 50
    },
    state: {
        type: String,
        label: "State",
        defaultValue: 'MA',
        allowedValues: [ "AL","AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY" ],
        autoform: {
            options: [
                {label: "Alabama", value: "AL"}, 
                {label: "Alaska", value: "AK"}, 
                {label: "Arizona", value: "AZ"}, 
                {label: "Arkansas", value: "AR"}, 
                {label: "California", value: "CA"}, 
                {label: "Colorado", value: "CO"}, 
                {label: "Connecticut", value: "CT"}, 
                {label: "Delaware", value: "DE"}, 
                {label: "Florida", value: "FL"}, 
                {label: "Georgia", value: "GA"}, 
                {label: "Hawaii", value: "HI"}, 
                {label: "Idaho", value: "ID"}, 
                {label: "Illinois", value: "IL"}, 
                {label: "Indiana", value: "IN"}, 
                {label: "Iowa", value: "IA"}, 
                {label: "Kansas", value: "KS"}, 
                {label: "Kentucky", value: "KY"}, 
                {label: "Louisiana", value: "LA"}, 
                {label: "Maine", value: "ME"}, 
                {label: "Maryland", value: "MD"}, 
                {label: "Massachusetts", value: "MA"}, 
                {label: "Michigan", value: "MI"}, 
                {label: "Minnesota", value: "MN"}, 
                {label: "Mississippi", value: "MS"}, 
                {label: "Missouri", value: "MO"}, 
                {label: "Montana", value: "MT"}, 
                {label: "Nebraska", value: "NE"}, 
                {label: "Nevada", value: "NV"}, 
                {label: "New Hampshire", value: "NH"}, 
                {label: "New Jersey", value: "NJ"}, 
                {label: "New Mexico", value: "NM"}, 
                {label: "New York", value: "NY"}, 
                {label: "North Carolina", value: "NC"}, 
                {label: "North Dakota", value: "ND"}, 
                {label: "Ohio", value: "OH"}, 
                {label: "Oklahoma", value: "OK"}, 
                {label: "Oregon", value: "OR"}, 
                {label: "Pennsylvania", value: "PA"}, 
                {label: "Rhode Island", value: "RI"}, 
                {label: "South Carolina", value: "SC"}, 
                {label: "South Dakota", value: "SD"}, 
                {label: "Tennessee", value: "TN"}, 
                {label: "Texas", value: "TX"}, 
                {label: "Utah", value: "UT"}, 
                {label: "Vermont", value: "VT"}, 
                {label: "Virginia", value: "VA"}, 
                {label: "Washington", value: "WA"}, 
                {label: "West Virginia", value: "WV"}, 
                {label: "Wisconsin", value: "WI"}, 
                {label: "Wyoming", value: "WY"}
            ]
        }
    },
    zip: {
        type: String,
        label: "Zip Code",
        regEx: /^[0-9]{5}(-[0-9]{4})?$/
    }
});


Schemas.Producers = new SimpleSchema({
    _id: { type: String, index: 1, autoValue: function(doc) { return this.userId } },
    name: { type: String, label: "Contact" },
    business: { type: String, label: "Business Name" },
    email: { type: String, label: "Customer Email" },
    mailing: { type: AddressSchema },
    billing: { type: AddressSchema, optional: true }
});
Producers.attachSchema(Schemas.Producers);

customerOptions = function() {
    return Customers.find().map(function(p) {
        return { label: p.name, value: p._id };
    });
}

Schemas.Facilities = new SimpleSchema({
    producer_id: { type: String, index: 1, autoValue: function(doc) { return this.userId } },  // force
    name: { type: String, label: "Energy Facility Name" },
    utility: { type: String, label: "Load Area", allowedValues: ['WMECO'], defaultValue: 'WMECO' },
    host_customer_id: { type: String, label: "Host Account", index: 1, autoform: { options: customerOptions }  },
    meter: { type: String, label: "Host Meter Number" },
    location: { type: AddressSchema }
});
Facilities.attachSchema(Schemas.Facilities);

// Customer can be person or business.  
Schemas.Customers = new SimpleSchema({
    producer_id: { type: String, index: 1, autoValue: function(doc) { return this.userId } }, // force
    utility_acct: { type: String, label: "Utility Account Number" },
    name: { type: String, label: "Customer or Contact Name" },
    business: { type: String, label: "Business ", optional: true },
    email: { type: String, label: "Email" },
    mailing: { type: AddressSchema },
    billing: { type: AddressSchema }
});
Customers.attachSchema(Schemas.Customers);

validCustomer = function() {
    return Customers.find({_id: this.value, producer_id: Meteor.userId() })?1:"Invalid Customer";
}
validFacility = function() {
    return Facilities.find({_id: this.value, producer_id: Meteor.userId() })?1:"Invalid Facility";
}

Schemas.Contracts = new SimpleSchema({
    customer_id: { type: String, label: "Customer", index: 1, custom: validCustomer },
    facility_id: { type: String, label: "Facility", index: 1, custom: validFacility },
    contract_date: { type: Date, label: "Contract Date" },
    credit_pct: { type: Number, decimal: true, label: "Credit Percentage",
                  min: 0, max: 100, autoform: { step: "0.1" } },
    price_per_kwh: { type: Number, decimal: true, label: "Price per kilowatt-hour", min: 0 },
    billing_day: { type: Number, decimal: false, label: "Billing Day",
                   min: 1, max: 28, defaultValue: 1,
                   allowedValues: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]
    },
    automatic: { type: Boolean, label: "Automatic Electronic Invoicing?", defaultValue: true },
    active: { type: Boolean, label: "Is this contract currently active?", defaultValue: true }
});
Contracts.attachSchema(Schemas.Contracts);

nextInvoiceNumber = function(doc) {
    // TODO: call a server method to retrieve an auto-increment value.
    // http://docs.mongodb.org/manual/tutorial/create-an-auto-incrementing-field/
    return _.max(Invoices.find().map(function(i) { return i.invoice_number }))+1;
}

Schemas.Invoices = new SimpleSchema({
    contract_id: { type: String, label: "Contract", index: 1 },
    invoice_number: { type: Number, label: "Invoice Number", unique: true, autoValue: nextInvoiceNumber }, // generated
    activity_begin: { type: Date, label: "First Day" },
    activity_end: { type: Date, label: "Last Day" }, // inclusive
    invoice_date: { type: Date, label: "Invoice Date" },
    total_kwh: { type: Number, decimal: true, label: "Kilowatt-Hours" },
    total_credited: { type: Number, decimal: true, label: "Credit Amount" }
});
Invoices.attachSchema(Schemas.Invoices);
