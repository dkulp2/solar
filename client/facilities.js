Template.FacilityId.helpers(
{
    addingFacility: function() { return this.selectedPid == 'new' },
    editingFacility: function() { return this.edit; },
    thisFacility: function() {
        return this.facilities.findOne(this.selectedPid);
    },
    editUrl: function() {
        return Router.current().originalUrl + '/edit';
    },
    beforeRemove: function() {
        return function(collection, id) { 
            var self = this;
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
            Router.go("/facilities/"+Facilities.findOne()._id);
        }
    }
});

Template.FacilityId.events({
    'click .edit-facility': function(event,template) {
        Router.go('/facility/' + this._id + '/edit');
    },
    'click .delete-facility': function(event,template) {
    },
});

Template.FacilitiesSidebar.helpers(
{
    activeFacility: function(selectedPid, pid) {
        if (selectedPid == pid) { 
            return "active"; 
        } else { 
            return "" ;
        }; 
    },
    allFacilities: function() {
        return this.facilities.find({});
    }
});

Template.FacilitiesSidebar.events({
    'click facilityListItem': function (event,template) {
        Session.set("selectedFacility", this._id); // only used if returning stateless
    }
});

AutoForm.hooks({
    FacilitiesForm: {
        onSuccess: function(operation, result, template) {
            var id;
            if (operation == 'update') {
                id = template.data.doc._id;
            } else if (operation == 'insert') {
                id = Facilities.findOne(result)._id;
            }

            Router.go('/facility/' + id);
        }
    }
});

