Template.CustomersPid.helpers(
{
    thisCustomer: function() {
        console.log(this);
        return(_.first(_.where(this.customers,{pid: this.selectedPid})));
    }
});

Template.CustomersSidebar.helpers(
{
    activeCustomer: function(selectedPid) {
        if (selectedPid == this.pid) { 
            return "active"; 
        } else { 
            return "" ;
        }; 
    }
});

Template.CustomersSidebar.events({
    'click': function (event,template) {
        Session.set("selectedCustomer", this.pid); // only used if returning stateless
    }
  });
