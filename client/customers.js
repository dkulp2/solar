Template.PartnersPid.helpers(
{
    addingPartner: function() { return this.selectedPid == 'new' },
    editingPartner: function() { return this.edit; },
    thisPartner: function() {
        return this.partners.findOne(this.selectedPid);
    },
    editUrl: function() {
        return Router.current().originalUrl + '/edit';
    },
    beforeRemove: function() {
        return function(collection, id) { 
            var self = this;
            // TODO: warn if there are contracts with this partner
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
            Router.go("/partners/"+Partners.findOne()._id);
        }
    }
});

Template.PartnersPid.events({
    'click .edit-partner': function(event,template) {
        Router.go('/partners/' + this._id + '/edit');
    },
    'click .delete-partner': function(event,template) {
    },
});

Template.PartnersSidebar.helpers(
{
    activePartner: function(selectedPid, pid) {
        if (selectedPid == pid) { 
            return "active"; 
        } else { 
            return "" ;
        }; 
    },
    allPartners: function() {
        return this.partners.find({});
    }
});

Template.PartnersSidebar.events({
    'click partnerListItem': function (event,template) {
        Session.set("selectedPartner", this._id); // only used if returning stateless
    }
});

AutoForm.hooks({
    insertPartnersForm: {
        onSuccess: function(operation, result, template) {
            var id;
            if (operation == 'update') {
                id = template.data.doc._id;
            } else if (operation == 'insert') {
                id = Partners.findOne(result)._id;
            }

            Router.go('/partners/' + id);
        }
    }
});

