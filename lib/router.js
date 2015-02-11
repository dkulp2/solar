// Application routing logic:
//
// / - cover splash.  User can sign up or login.  If logged in then go to /acct
// /acct=:id - a dashboard showing all the user's account information
// /contract=:id - add or edit a contract
// /customer=:id - show the details and history of contracts with customer

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
    if (typeof Session.get("selectedContract") == 'undefined') {
        Session.set("selectedContract", "0");  // replace with Contracts.findOne().cid
    }
    this.redirect('/contracts/' + Session.get("selectedContract"));
});
Router.route('contracts/:cid', {	// Contract details (Customer Account ID, Credit %, Price Per KwH, Date).  Each contract between two account IDs has a separate ID.

    //If multiple routes share common control, you can specify a
    // controller and factor out the commonality like this:
    // controller: 'specialController'  (See http://www.manuel-schoebel.com/blog/iron-router-tutorial)
    name: 'ContractsCid',
    yieldRegions: {
	ContractsSidebar: { to: "sidebar" }
    },
    // provide the context for evaluating so-called identifiers within
    // the template.  if there were no parameters, then we could just
    // provide an assoc array value.  instead, we need a function, so
    // that we have access to this.params.
    data: function() { 
        return {  
            selectedCid: this.params.cid,
	    hasSidebar: true,
	    // later we'll use
	    // 'contracts': Contracts.find({}) 
	    contracts: [ { cid: '0', withAcctId: '456', year: 2014, credit_pct: 5, price_per_kwh: 4 }, { cid: '1', withAcctId: '456', year: 2015, credit_pct: 5.5, price_per_kwh: 3.9 } ]
        }
    }
});

Router.route('customers', function() {
    if (typeof Session.get("selectedCustomer") == 'undefined') {
        Session.set("selectedCustomer", "123");  // replace with Customers.findOne().pid
    }
    this.redirect('/customers/' + Session.get("selectedCustomer"));
});
Router.route('customers/:pid', {
    name: 'CustomersPid',
    yieldRegions: {
	CustomersSidebar: { to: "sidebar" }
    },
    data: function() {
        return {
            selectedPid: this.params.pid,
	    hasSidebar: true,
	    customers: [ { name: 'David Kulp', pid: '123', address: '183 Phillips Rd<br>Shelburne Falls, MA 01370', eid: 'WMECO-9876' }, { name: 'Jim Cutler', pid: '456', address: '421 Beldingville Rd.<br>Shelburne Falls, MA 01370', eid: 'WMECO-54321' } ]
        }
    }
});

if (Meteor.isClient) {
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}
