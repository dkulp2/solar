solar
=====

Solar DIRECT Project Using Meteor

This is a sample project exploring the Meteor system for web app generation.


Overview
--------

This meteor app uses Router to render different pages depending on
URLs.  URL mappings are found in lib/router.js.

A template is a piece of HTML that is rendered with substitutions
based on the current state, e.g. user-specific data.  Each template is
defined in an HTML file inside a tag called 'template', e.g. <template
name="Cover">...</template> and is located by convention in a file
with the same lower-cased name, e.g. cover.html.  But not always!

The main so-called "layout template" that the application is rendered
within is called "AppBody".  The pre-login routes use a layout
template called "Cover".

There is a route-specific template that is rendered within the layout
template wherever the "{{> yield}}" is found.  For example,

	   Router.route('/learn', { layoutTemplate: 'Cover' });

tells Meteor to use the template Learn.  To reduce proliferation of
files for tiny pieces, I put the Learn template in cover.html, too.

A cheatsheet for Iron Router:

https://gentlenode.com/journal/meteor-11-iron-router-cheatsheet/18

Multiple Layouts
----------------

A route can have multiple layout regions, e.g. a main section and a
sidebar that might vary depending on the route.  For example, the
contracts route uses both templates "Contracts" (implicitly named from
the route name) and a second template called "ContractsSidebar".

    Router.route('contracts', {	// Contract details (Customer Account ID, Credit %, Price Per KwH, Date).  Each contract between two account IDs has a separate ID.
	yieldRegions: {
	    'ContractsSidebar': { to: "sidebar" }
	},
        data: {  // provide the context for evaluating so-called identifiers within the template.
	    'hasSidebar': true,
		'contracts': [ { contractId: 0, withAcctId: 456, year: 2014 }, { contractId: 1, withAcctId: 456, year: 2015 } ]
	}
    });

The Contracts template is the primary template associated with the
route and is inserted within the Layout Template (AppBody) where the
nameless yield is found.  The code above says that the template
ContractsSidebar should be inserted in AppBody where the `{{> yield
region="sidebar"}}` is found.


Directory Structure
===================

Code is shared on both the server and client with the exception that
files under client/ are only read by the frontend and server/ by the
backend.  By convention, I use lib/ for common code and public/ for
resources such as images, CSS, etc.  Do not use the directory layout
when referencing resources, e.g. just "solar-1.jpg", not
"public/solar-1.jpg".

All .js files are read at startup, so splitting them into separate
files is only for clarity.

By convention, each layout html file has a corresponding js file,
e.g. contracts.html and contracts.js, that contains helper routines
for rendering that is specific to that layout.  See more in the next
section.

How It Works
============

State
-----

State is typically managed through the use of session variables.  It
is possible to also store variables in a collection associated with
the user ID, which then causes reaction in all open sessions.
Defaults are set in solar.js, e.g.

	 Session.setDefault("selectedContract", 0);

and

	Session.get("selectedContract")


Collections
-----------

Meteor currently uses only MongoDB as its backend store.  (I'm looking
forward to the addition of other relational databases.)  Mongo
provides fast blob access by key ID.  A collection contains
"documents" that have arbitrary name/value pairs.

A record set is a filtered view of a collection.

The server calls `Meteor.publish(recordset)` and the client calls
`Meteor.subscribe(recordset)`.  In development mode, all collections
are available.  

The security model is designed so that database access is only through
published recordsets. The find() filters associated with the recordsets can limit the documents to only the safe ones. (See collections.js.)

This app uses the following record sets that correspond to the
same-named collections, routes and layouts:

* profiles - a wrapper around Meteor.users for storing user-specific data such as WMECO account ID and password.
* contacts
* contracts


Templates, Context and CSS
--------------------------

Dynamic behavior is achieved through a complex interaction between
templates, helpers (JS functions) associated with templates, the data
collections that are in scope depending on collection iterators
(phew!) and clever CSS.  What does this all mean?  Here's an example.
In contracts.html:

    <template name="ContractsSidebar">
    {{#each contracts}}
    <li class="{{activeContract contractId}}"><a href="#">{{withAcctId}} FY{{year}}</a></li>
    {{/each}}
    </template>

And in contracts.js:

    Template.ContractsSidebar.helpers(
    {
	activeContract: function(contractId) { 
          if (Session.get("selectedContract") == contractId) 
            { return "active"; } 
          else 
            { return "" }; 
        }
    });

`contracts` is a MongoDB collection.  The template iterates over each
document in the record set and the data members of that document are now in
scope.  One of the members of a `contracts` collection is
`contractId`.  When the template is rendered, the helper
`activeContract` is called with a parameter of contractId.  That
parameter is compared to the global state variable "selectedContract".
If they are the same, then an "active" string is returned, which gets
inserted as the name of the CSS class.  Then when you dig into the
CSS, you'll find a nested state just for nav-sidebar that causes that
HTML element to be highlighted:

    .nav-sidebar > .active > a,
    .nav-sidebar > .active > a:hover,
    .nav-sidebar > .active > a:focus {
      color: #fff;
      background-color: #428bca;
    }

The Reactive Magic
------------------

The magic of meteor happens because it will re-render parts of code
when values change.  For example, here, somehow meteor knows that the
session variable "selectedContract" can trigger changes, so when that
value changes in the database, its value is propogated to the client,
and any code that is dependent on that value is re-rendered.  So, from
the console you can type:

    Session.set("selectedContract", 1)

and immediately the second contract will be highlighted.

Events
------

The second part of meteor is handling events on HTML elements in a way
that allows for changes to data (that then can have cascading effects
on display, etc.).  There are numerous events and an event can be
defined within a specific layout.  For example:

    Template.ContractsSidebar.events({
	    'click': function (event,template) {
               Session.set("selectedContract", this.cid);
            }, ... })

means that the anonymous function will be called when the user clicks
on any element within the ContractsSidebar layout.  You can add CSS
classes to narrow the event, e.g. 'click .my-list'.

But the real magic is "this", which is the object that was used as the
context during the *rendering*.  In this case, it's the contracts
document used in the #each iteration, above!  Very cool.


Multiple CSS Files
==================

For this app I wanted two CSS files: one for the splash and another
for the app.  By default, any CSS file(s?) that is in the top-level
app directory are used for all routes.  I had to come up with a
workaround so that the CSS was set differently depending on the route.
This is non-trivial because meteor does not "load" a new page, it just
uses javascript on the client to replace the DOM.  Typically the CSS
is set once (magically) at app startup.

My hack registers a function that is called when the Layout Template
is changed.  A Layout Template has a "created" function that can be
defined and called.  E.g.

    Template.Cover.created = function () { 
	Template.setCSS("customCSS-1","cover")
    }; 

I then defined a special function I called Template.setCSS(id,cssfile)
that directly modifies the DOM using jQuery (see utilities.js).

Schema and Forms
================

User input is key to the utility of most apps.  In Solar I want to
collect information from the user about customers and contract
details.  These are done using HTML forms.  I'll use bootstrap's
classes for good looking forms and "autoform" to provide mapping
between forms and collections as well as form validation.  It's a
feature rich package with some impressive add-ons like a fancy
datetime picker.

In addition, autoform uses Collection2, which is written by the same
author as autoform.  It includes a simple schema description language
so that the fields in a collection can be described and validated on
both the client and server.



Styling
=======

This is perhaps my weakest part.  I don't understand CSS well and I'm
unfamiliar with the different frameworks.  To lower the learning
curve, I'm using bootstrap, which is a set of configurable classes
that can be assigned to HTML elements.  There are other frameworks
that also look amazing, like Semantic UI, but not for now.

Currency
--------

The input element for money should only allow 2 decimal significance.
I'm not sure how to do this.  There is something called webshims that
somehow does this http://jsfiddle.net/trixta/UC6tG/light/.  Or maybe
using Collections2 validations I can just call toFixed(2).


Security
========

Haven't considered this, yet.  See allow, permit docs for MongoDB on
server-side and then see https://atmospherejs.com/ongoworks/security.


Misc
====

The Candian Eugenics Archives http://eugenicsarchive.ca/ is an
extremely impressive and responsive web application.  It is a great
example of a good modern browser-based UI, IMO.