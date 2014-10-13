## Front-end documentation

### Setting up your machine

The app is setup to use <b>Grunt</b> as it's task runner, which is responsible for compiling and minifying the angular templates, compiling the SCSS (compass), linting the javascript and also for running any unit tests that are specified.

To setup your front-end workflow, first check out the project and get all of the back-end hoopla up and running.  Then you will need to navigate to the root of the project in your terminal and run <code>npm install</code>. If you don't have Node installed, go and install it and run that command again.  As described above, you will need Grunt installed, which you can do by running <code>npm install -g grunt-cli</code>.  In order for grunt to compile the SCSS, you will also need to ensure that you have Compass installed.  To do this, simply run <code>gem system -update</code>, followed by <code>gem install compass</code> (possibly requiring sudo). Now <em>assuming everything has gone brilliantly</em>, you can run <code>grunt watch</code> to start make Grunt listen for changes to your source template and scss files.

### Optional extra packages

There are a couple of extra packages you might want to install on your development machine:

Bower to manage javascript third-party code dependency, <code>npm install -g bower</code>

Karma to run our front-end unit tests, <code>npm install -g karma-cli</code>


### App architecture


Angular template files:

- <code>/wonder/romeo/static/views/</code>

Angular application scripts:

- <code>/wonder/romeo/static/assets/app</code>
- <code>/wonder/romeo/static/assets/common</code>
- <code>/wonder/romeo/static/assets/scripts</code>
	- <code>app.js</code>

Any app module should live in the app folder (f.e. login or search), there should be no relationship between the different app modules. Any common code or other dependency should be handled by code in the common folder. This means that any module can be removed or added as needed, without affecting the rest of the application.

For the views in app and common we use the following naming convertion:

- <name of module>.tmpl.html
    - An app module (called in association with a controller)
- <name of directive>.dir.html
    - Any html associated with a directive
- <name of directive>.modal.html
    - For html modals

Any html file not following the naming convention above will not be included in the template cache by the grunt task.


SCSS (compass) source files:

- <code>/wonder/romeo/static/scss/</code>

For page or directive specific css it can go into the relevant folder, where the html is stored (app or common)


Asset files (scripts, images, fonts etc):

- <code>/wonder/romeo/static/assets/</code>

App index page:

- <code>/wonder/romeo/templates/root/app.html</code>

### Routing

Currently there are only a few pages that make up the app:

- <code>/login</code> - the main entry-point for the site ( resolve securityAuthorizationProvider.requireXXX will redirect users back here if the user isn't logged in or don't have the right credentials).
- <code>/video</code> - where users can create and upload videos for the Romeo platform.
- <code>/video/{id}</code> - where users can edit their videos or view other users public videos.
- <code>/video/{id}/comments</code> - where users can collaborate on videos.
- <code>/organise/{filter}/{id}</code> - where users can manage their videos and organise them into collections
- <code>/profile</code> - where users edit their profile
- <code>/settings</code> - where users edit their account settings (email, password)

### Services

I have tried to separate all of the main concerns of the app into different services.  Anything that requires an actual request to be made to the web services is abstracted away in the web services, so the controllers have simple get and update methods they can use via these services. The main services used by the app go as follows:

##### Main services

- SecurityService - used by the route controller to manage access to the pages of the app, and also by the user and account services to get the current logged in users data
- VideoService - used by controllers for retrieving and manipulating video records.
- TagService - used by controllers for retrieving and manipulating tag records.
- AccountService - used by controllers for retrieving and manipulating account data.
- UserService - used by controllers for retrieving and manipulating user data.
- DataService - DEPRECATED: used by services for making any http requests to the web services that requires authentication before the call.

##### Other services

There are a number of other services used by the app, several of which are currently used because they were built for an earlier prototype ( e.g. the Drag and Drop service and directives). I will list them all here for transparency:

- $modal - a simple modal service for loading and displaying templates from the $templateCache.
- $tooltip - a service for displaying tooltips (works with tooltip directives)
- FlashService - used for displaying notifications ( i.e. "Saved" ).
- DragDropService - a service for controlling draggable and droppable elements (works with drag and drop directives)
- prettydate - a service that takes a standard date object and returns a nice "x minutes ago" string
- animLoop - a basic rendering pipeline - allows you to add functions to a request animation frame loop, useful for animating things with javascript.

### Controllers

##### OrganiseController

This controller deals with manage videos and tags, so it includes the VideoService and TagService as dependencies.

##### VideoController

The core features of this page are uploading video files, giving them some meta data, collaborate on the video via comments, transfer videos to publishers.

##### ProfileController

This controller deals with uploading cover image, avatar and the public profile information. It also deals with the connections between users.

##### LoginController

This controller deals with everything sign in and sign up related, like creating accounts.



===

If you have any questions or anything isn't clear, you can reach me on [dave@darve.co.uk](mailto:dave@darve.co.uk)
