## Front-end documentation

### Setting up your machine

The app is setup to use <b>Grunt</b> as it's task runner, which is responsible for compiling and minifying the angular templates, compiling the SCSS (compass), linting the javascript and also for running any unit tests that are specified.

To setup your front-end workflow, first check out the project and get all of the back-end hoopla up and running.  Then you will need to navigate to the root of the project in your terminal and run <code>npm install</code>. If you don't have Node installed, go and install it and run that command again.  As I described above, you will need Grunt installed, which you can do by running <code>npm install -g grunt-cli</code>.  In order for grunt to compile the SCSS, you will also need to ensure that you have Compass installed.  To do this, simply run <code>gem system -update</code>, followed by <code>gem install compass</code> (possibly requiring sudo). Now <em>assuming everything has gone brilliantly</em>, you can run <code>grunt watch</code> to start make Grunt listen for changes to your source template and scss files.

### App architecture

Angular template files:

- <code>/wonder/romeo/static/views/</code>

Angular application scripts:

- <code>/wonder/romeo/static/assets/scripts/</code>
	- <code>app.js</code>
	- <code>controllers/controllers.js</code>
	- <code>services/services.js</code>
	- <code>services/stats-services.js</code>
	- <code>directives/directives.js</code>
	- <code>filters/filters.js</code>

SCSS (compass) source files:

- <code>/wonder/romeo/static/scss/</code>

Asset files (scripts, images, fonts etc):

- <code>/wonder/romeo/static/assets/</code>

Main flask layout template (ignore base.html):

- <code>/wonder/romeo/templates/layout.html</code>

App index page:

- <code>/wonder/romeo/templates/romeo/index.html</code>

All of the app script files follow a convention of wrapping everything in a closure with some handy shorthand variable names:

<code>(function (w, d, ng, ns, m) {<br/>
	// CODE <br/>
})(window, document, window.angular, 'RomeoApp', 'stats-services');
</code>

### Routing

Currently there are only a few pages that make up the app:

- <code>/login</code> - the main entry-point for the site ( AuthService will redirect users back here if it cannot find a session url in their local storage ).
- <code>/account</code> - for managing profile data.
- <code>/upload</code> - where users can create and upload new videos for the Romeo platform.
- <code>/manage/{filter}/{id}</code> - where users can manage their videos and organise them into collections
- <code>/analytics/{type}/{id}</code> - where users can view the analytics data on their uploaded video content

### Services

I have tried to separate all of the main concerns of the app into different services.  Anything that requires an actual request to be made to the web services is abstracted away in the web services, so the controllers have simple get and update methods they can use via these services. The main services used by the app go as follows:

##### Main services

- AuthService - used by the route controller to manage access to the pages of the app, and also by the other services to get session data when making requests to the web services. As far as the AuthService is concerned, HTTP cookie or not, if it can't find a session_url in local storage then the user is not logged in and will be re-directed to the login page.
- VideoService - used by controllers for retrieving and manipulating video records.
- TagService - used by controllers for retrieving and manipulating tag records.
- AccountService - used by controllers for retrieving and manipulating account / user data.
- DataService - used by services for doing making any actual http requests to the web services.

<strong>Note: </strong>The only service out of the above that is injected into the MainController is the AuthService - this was done specifically so authentication happens before any part of the app tries to access the web services.

##### Other services

There are a number of other services used by the app, several of which are currently used because they were built for an earlier prototype ( e.g. the Drag and Drop service and directives). I will list them all here for transparency:

- $modal - a simple modal service for loading and displaying templates from the $templateCache.
- $tooltip - a service for displaying tooltips (works with tooltip directives)
- FlashService - used for displaying notifications ( i.e. "Saved" ). Currently a bit borked while Mike styles it.
- DragDropService - a service for controlling draggable and droppable elements (works with drag and drop directives)
- prettydate - a service that takes a standard date object and returns a nice "x minutes ago" string
- animLoop - a basic rendering pipeline - allows you to add functions to a request animation frame loop, useful for animating things with javascript. 

##### Interacting with the Web Services

As I described above, whenever want to make a request to the actual web services we go via one of the main services ( e.g. VideoService ).  When a page such as the Manage page loads, it instantiates the VideoService which then loads all of the videos available for the current user and adds them to the $rootScope as <code>$rootScope.Videos</code>.  The same convention applies for Tags ( TagService adds them to the rootscope as <code>$rootScope.Tags</code>) and User ( AccountService adds user details to the rootscope as <code>$rootScope.User</code>).  When the app initialises, rootscope has these attributes present (Videos, Tags and User) but they are just empty objects, which allows our templates to be aware of whether any content has been loaded or not. 

### Controllers

##### MainController

The main controller for the app - contains a lot of core listeners for things like route changing etc.

##### ManageController

##### AccountController

##### UploadController

The core features of this page are implemented i.e. adding uploading video files and giving them some meta data, however there are features that are not fully implemented yet.  For example the Quick Share - the idea that when a user starts uploading a video they can generate an embeddable link for that video, enter in some email addresses and it will send it off when the video is ready.  The functionality for this is mainly built via the QuickShare directive.

<b>Gotchas</b>

- This page has a few clear states, i.e. empty, file chosen, uploading, processing, thumbnail chosen and finished.
- In order to create a video record via the web services, it needs to have a title.  Therefore, if someone goes onto the page, adds a description, a category and even starts uploading a file before they set the title, the controller is going to cache everything the user has entered but not make an actual post request until they've entered a title.


### Directives
