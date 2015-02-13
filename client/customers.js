Template.PartnersPid.helpers(
{
    addingPartner: function() { return this.selectedPid == 'new' },
    editingPartner: function() { console.log(this); return this.edit },
    thisPartner: function() {
        return this.partners.findOne(this.selectedPid);
    },
    editUrl: function() {
        return Router.current().originalUrl + '/edit';
    }
});

Template.PartnersPid.events({
    'click .edit-partner': function(event,template) {
        Router.go('/partners/' + this._id + '/edit');
    }
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
            } else {
                console.log("HOW DO I FIND THE DELETE ID");
            }

            Router.go('/partners/' + id);
        }
    }
});

