// Application routing logic:
//
// / - cover splash.  User can sign up or login.  If logged in then go to /acct
// /acct - a dashboard showing all the user's account information
// /contract=:id - add or edit a contract
// /customer=:id - show the details and history of contracts with partner
// /facility=:id - add or edit a energy facility

// Although not strictly necessary, Router is typically configured at startup with a default layoutTemplate and
// a template for 404 (notFoundTemplate) and waiting on subscriptions (loadingTemplate).
Router.configure({
	// if most of your routes use the same outermost template, then specify
	layoutTemplate: 'AppBody'

	// if URL doesn't match, just show homepage splash.  Or maybe redirect to "/"?
	//  notFoundTemplate: 'notFoundTemplate'
});


// Routes are set through multiple calls to Router.route for each
// different path.  Router will magically infer the "name" of the
// route by CamelCase-ing the route.  The template is the name.  A
// layout template is the parent template that this route renders to.
// The layout template will have a "yield" that inserts the route's
// template.  The 2nd param to Router.route is either options for
// layout or a function that calls this.render, etc.  I prefer the
// first, declarative approach.

// These first few routes are part of the intro splash screen.
Router.route('/', { layoutTemplate: 'Cover', name:'Splash' });  // name is explicit here.  Usually derived from route path.
Router.route('/learn', { layoutTemplate: 'Cover' });  // defaults to 'Learn' template
Router.route('/contact', { layoutTemplate: 'Cover' }); // defaults to 'Contact' template

// These routes are part of the main appBody display.
Router.route('acct');		// The dashboard.  id for the account is derived from the login.  perhaps an admin could specify an id param?
Router.route('profile');  // Account details -- Name, Billing Address, WMECO Account ID, WMECO Password

Router.route('contracts', function() {
    sc = Session.get("selectedContract");
    if (typeof sc == 'undefined' || 0==Contracts.find(sc).count()) {
        if (0==Contracts.find().count()) {
            Session.set("selectedContract", 'new');
        } else {
            Session.set("selectedContract", Contracts.findOne()._id);
        }
    }
    this.redirect('/contracts/' + Session.get("selectedContract"));
});
Router.route('contracts/:_id', {	
    //If multiple routes share common control, you can specify a
    // controller and factor out the commonality like this:
    // controller: 'specialController'  (See http://www.manuel-schoebel.com/blog/iron-router-tutorial)
    path: /^\/contracts\/(new|\w+)(\/(edit|\w+))?/,
    name: 'ContractsCid',
    yieldTemplates: {
	ContractsSidebar: { to: "sidebar" },
        InvoiceDetail: { to: "invoice" }
    },
    // provide the context for evaluating so-called identifiers within
    // the template.  if there were no parameters, then we could just
    // provide an assoc array value.  instead, we need a function, so
    // that we have access to this.params.
    data: function() { 
        console.log(this.params);
        return {
            newContract: this.params[0] == 'new',
            selectedCid: this.params[0],
            invoiceId: this.params[2],
            edit: this.params[2] == 'edit',
	    hasSidebar: true,
            contracts: Contracts,
            customers: Customers,
            facilities: Facilities
        }
    }
});

Router.route('customers', function() {
    sp = Session.get("selectedCustomer");
    if (typeof sp == 'undefined' || 0==Customers.find(sp).count()) {
        if (0==Customers.find().count()) {
            Session.set("selectedCustomer", 'new');
        } else {
            Session.set("selectedCustomer", Customers.findOne()._id);
        }
    }
    this.redirect('/customers/' + Session.get("selectedCustomer"));
});
Router.route('customers/:_id', {
    // all the iron router docs regarding regex are wrong, e.g.
    // http://www.manuel-schoebel.com/blog/iron-router-tutorial
    // says that I can just use 'customers/:id/edit?'.  Nope.
    path: /^\/customers\/(\w+)(\/edit)?/,
    name: 'CustomersPid',
    yieldTemplates: {
	CustomersSidebar: { to: "sidebar" }
    },
    data: function() {
        return {
            selectedPid: this.params[0],
            edit: this.params[1] != undefined,
	    hasSidebar: true,
	    customers: Customers
        }
    }
});

Router.route('facility', function() {
    sp = Session.get("selectedFacility");
    if (typeof sp == 'undefined' || 0==Facilities.find(sp).count()) {
        if (0==Facilities.find().count()) {
            Session.set("selectedFacility", 'new');
        } else {
            Session.set("selectedFacility", Facilities.findOne()._id);
        }
    }
    this.redirect('/facility/' + Session.get("selectedFacility"));
});
Router.route('facility/:_id', {
    path: /^\/facility\/(\w+)(\/edit)?/,
    name: 'FacilityId',
    yieldTemplates: {
	FacilitiesSidebar: { to: "sidebar" }
    },
    data: function() {
        return {
            selectedPid: this.params[0],
            edit: this.params[1] != undefined,
	    hasSidebar: true,
	    facilities: Facilities
        }
    }
});

if (Meteor.isClient) {
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}
