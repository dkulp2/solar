Template.CustomersPid.helpers(
{
    addingCustomer: function() { return this.selectedPid == 'new' },
    editingCustomer: function() { return this.edit; },
    thisCustomer: function() {
        return this.customers.findOne(this.selectedPid);
    },
    editUrl: function() {
        return Router.current().originalUrl + '/edit';
    },
    beforeRemove: function() {
        return function(collection, id) { 
            var self = this;
            // TODO: warn if there are contracts with this customer
            bootbox.confirm("Are you sure you want to delete the information for "+
                            collection.findOne(id).name + "?", 
                            function(confirmed) {
                                if (confirmed) {
                                    self.remove(); 
                                }
                            });
        }
    },
    afterRemove: function() {
        return function(result) {
            // result is always 1 and 'this' is the Window. Must use
            // global because no reference to template.
            Router.go("/customers/"+Customers.findOne()._id);
        }
    }
});

Template.CustomersPid.events({
    'click .edit-customer': function(event,template) {
        Router.go('/customers/' + this._id + '/edit');
    },
    'click .delete-customer': function(event,template) {
    },
});

Template.CustomersSidebar.helpers(
{
    activeCustomer: function(selectedPid, pid) {
        if (selectedPid == pid) { 
            return "active"; 
        } else { 
            return "" ;
        }; 
    },
    allCustomers: function() {
        return this.customers.find({});
    }
});

Template.CustomersSidebar.events({
    'click customerListItem': function (event,template) {
        Session.set("selectedCustomer", this._id); // only used if returning stateless
    }
});

AutoForm.hooks({
    CustomersForm: {
        onSuccess: function(operation, result, template) {
            var id;
            if (operation == 'update') {
                id = template.data.doc._id;
            } else if (operation == 'insert') {
                id = Customers.findOne(result)._id;
            }

            Router.go('/customers/' + id);
        }
    }
});

