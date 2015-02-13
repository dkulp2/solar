Template.ContractsCid.helpers(
{
    addingContract: function() { return this.selectedCid == "new" },
    editingContract: function() { console.log(this); return this.edit },
    thisContract: function() {
        return this.contracts.findOne(this.selectedCid);
    },
    partnerOptions: function() {
        return this.partners.find().map(function(p) {
            return { label: p.name, value: p._id };
        });
    },
    editUrl: function() {
        return Router.current().originalUrl + '/edit';
    }
});

Template.ContractsCid.events({
    'click .edit-contract': function(event,template) {
        Router.go('/contracts/' + this._id + '/edit');
    }
});

Template.ContractsSidebar.helpers(
{
    activeContract: function(selectedCid, cid) {
        if (selectedCid == cid) { 
            return "active"; 
        } else { 
            return "" ;
        }; 
    },
    allContracts: function() {
        return this.contracts.find({});
    }
});

Template.ContractsSidebar.events({
    'click .contractListItem': function (event,template) {
        Session.set("selectedContract", this._id); // only used if returning stateless
    }
});

Template.ContractForm.helpers({
    thisContract: function() { return Contracts.findOne() }
});

AutoForm.hooks({
    insertContractsForm: {
        onSuccess: function(operation, result, template) {
            Router.go('/contracts/' + Contracts.findOne(result)._id)
        }
    }
});
