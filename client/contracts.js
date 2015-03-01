// Some helper functions that are used in many forms.
// TODO: put in lib/ to share with customers
// TODO: factor out most of the commonality between contracts and partners, i.e. remove selectedCid vs selectedPid, set base of URL in data (/contracts or /partners), etc.
editingContract = function() { return this.edit; };
editUrl = function() { return Router.current().originalUrl + '/edit'; };
thisContract = function() { return this.contracts.findOne(this.selectedCid); };
addingContract = function() { return this.newContract };

Template.ContractsCid.helpers(
{
    editingContract: editingContract,
    editUrl: editUrl,
    thisContract: thisContract,
    addingContract: addingContract,
    // I posted a question: http://stackoverflow.com/questions/28506166/how-do-i-evaluate-arbitrary-expressions-in-a-spacebars-argument
    modifyingContract: function() { return editingContract.call(this) || addingContract.call(this) },
    beforeRemove: function() {
        return function(collection, id) { 
            var self = this;
            bootbox.confirm("Are you sure you want to delete this contract?", 
                            function(confirmed) {
                                if (confirmed) {
                                    self.remove(); 
                                }
                            });
        }
    },
    afterRemove: function(result) {
        return function(result) {
            Router.go("/contracts/"+Contracts.findOne()._id);
        }
    },
    addingInvoice: function() { return Session.get("adding_invoice"); },
    showAddInvoice: function() {
        // display an add button if not automatic billing and not currently adding an invoice
        return !this.automatic && !Session.get("adding_invoice");
    }
});

Template.ContractsCid.events({
    'click .edit-contract': function(event,template) {
        Router.go('/contracts/' + this._id + '/edit');
    },
    'click .add-invoice': function(event, template) {
        Session.set("adding_invoice", true);
    }
});

Template.ContractsSidebar.helpers(
{
    selectedContract: function(selectedCid, cid) {
        if (selectedCid == cid) { 
            return "active"; 
        } else { 
            return "" ;
        }; 
    },
    disabledContract: function() {
        return this.active?"":"disabled";
    },
    allContracts: function() {
        return this.contracts.find();
    }
});

Template.ContractsSidebar.events({
    'click .contractListItem': function (event,template) {
        Session.set("selectedContract", this._id); // only used if returning stateless
    }
});

Template.ContractForm.helpers({
    customerOptions: function() {
        return this.customers.find().map(function(p) {
            return { label: p.name, value: p._id };
        });
    },
    facilityOptions: function() {
        return this.facilities.find().map(function(p) {
            return { label: p.name, value: p._id };
        });
    },
    editingContract: editingContract,
    thisContract: thisContract,
    formType: function() { return this.edit?'update':'insert'; },
    headerLabel: function() { return this.edit?'Modify Contract':'New Contract...'; },
    submitLabel: function() { return this.edit?'Update':'Create'; }
});

AutoForm.hooks({
    insertContractsForm: {
        onSuccess: function(operation, result, template) {
            console.log(operation,result);
            var id;
            if (operation == 'update') {
                id = template.data.doc._id;
            } else if (operation == 'insert') {
                id = Contracts.findOne(result)._id;
            }

            Router.go('/contracts/' + id);
        }
    }
});
