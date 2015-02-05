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


// Routes are set through multiple calls to Router.route for each different path.
// Router will magically infer the "name" of the route by CamelCase-ing the route.
// The template is the name.  A layout template is the parent template that this route renders to.
// The layout template will have a "yield" that inserts the route's template.
// The 2nd param to Router.routeis either options for layout or a function that calls this.render, etc.

// These first few routes are part of the intro splash screen.
Router.route('/', { layoutTemplate: 'Cover', name:'Splash' });
Router.route('/learn', { layoutTemplate: 'Cover' });  // defaults to 'Learn' template
Router.route('/contact', { layoutTemplate: 'Cover' }); // defaults to 'Contact' template

// These routes are part of the main appBody display.
Router.route('acct');		// The dashboard.  id for the account is derived from the login.  perhaps an admin could specify an id param?
Router.route('profile');  // Account details -- Name, Billing Address, WMECO Account ID, WMECO Password

Router.route('contracts', {	// Contract details (Customer Account ID, Credit %, Price Per KwH, Date).  Each contract between two account IDs has a separate ID.
	yieldRegions: {
	    'ContractsSidebar': { to: "sidebar" }
	},
        data: {  // provide the context for evaluating so-called identifiers within the template.
	    'hasSidebar': true,
		'contracts': [ { contractId: 0, withAcctId: 456, year: 2014 }, { contractId: 1, withAcctId: 456, year: 2015 } ]
	}
    });
Router.route('customers', {
	yieldRegions: {
	    'CustomersSidebar': { to: "sidebar" }
	},
	data: {
	    'hasSidebar': true,
		'customers': [ { name: 'David', acctId: 123 }, { name: 'Jim', acctId: 456 } ]
	}
    });

if (Meteor.isClient) {
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}
