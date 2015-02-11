Template.ContractsCid.helpers(
{
    thisContract: function() {
        return(_.first(_.where(this.contracts,{cid: this.selectedCid})));
    }
});

Template.ContractsSidebar.helpers(
{
    activeContract: function(selectedCid) {
        if (selectedCid == this.cid) { 
            return "active"; 
        } else { 
            return "" ;
        }; 
    }
});

Template.ContractsSidebar.events({
    'click': function (event,template) {
        Session.set("selectedContract", this.cid); // only used if returning stateless
    }
  });
