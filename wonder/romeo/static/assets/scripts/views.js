angular.module('RomeoApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('account.html',
    "<div class=\"section\">\n" +
    "  <ul id=\"breadcrumb\" class=\"inner\">\n" +
    "    <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\n" +
    "    <li><span class=\"divider\">/</span> <span>My Account</span></li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"page-account\" class=\"section\" ng-controller=\"AccountController\">\n" +
    "\t<div class=\"inner\">\n" +
    "\t\t<h1>My Account</h1>\n" +
    "\n" +
    "\t\t<nav id=\"account-nav\">\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li><a ng-click=\"accountNav('personal')\" ng-class=\"{ selected: viewing == 'personal' }\">Personal Details</a></li>\n" +
    "\t\t\t\t<li><a ng-click=\"accountNav('stats')\" ng-class=\"{ selected: viewing == 'stats' }\">Account Stats</a></li>\n" +
    "\t\t\t\t<li><a ng-click=\"accountNav('payment')\" ng-class=\"{ selected: viewing == 'payment' }\">Payment Info</a></li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</nav>\n" +
    "\n" +
    "\t\t<div class=\"inner account-personal\" ng-if=\"viewing == 'personal'\">\n" +
    "\t\t\t<div class=\"avatar inline-block\">\n" +
    "\t\t\t\t<span class=\"icon-user2\">\n" +
    "\t\t\t\t\t<a href=\"/#/account\">Change Avatar</a>\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<form class=\"inline-block\" ng-submit=\"saveUser($event)\">\n" +
    "\t\t\t\t<div class=\"row left half-width\">\n" +
    "\t\t\t\t\t<label>First Name</label>\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"user.firstName\">\n" +
    "\t\t\t\t</div><!--\n" +
    "\t\t\t\t--><div class=\"row half-width\">\n" +
    "\t\t\t\t\t<label>Last Name</label>\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"user.lastName\">\n" +
    "\t\t\t\t</div><!--\n" +
    "\t\t\t\t--><div class=\"row left half-width\">\n" +
    "\t\t\t\t\t<label>Location</label>\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"user.location\">\n" +
    "\t\t\t\t</div><!--\n" +
    "\t\t\t\t--><div class=\"row half-width\">\n" +
    "\t\t\t\t\t<label>Email address <span>(<a ng-click=\"changeEmailAddress($event)\">Change?</a>)</span></label>\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"user.email\" class=\"pl-disabled\" ng-click=\"changeEmailAddress($event)\">\n" +
    "\t\t\t\t</div><!--\n" +
    "\t\t\t\t--><div class=\"row left half-width\">\n" +
    "\t\t\t\t\t<label>Username <span>(<a ng-click=\"changeUsername($event)\">Change?</a>)</span></label>\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"user.username\" class=\"pl-disabled\" ng-click=\"changeUsername($event)\">\n" +
    "\t\t\t\t</div><!--\n" +
    "\t\t\t\t--><div class=\"row half-width\">\n" +
    "\t\t\t\t\t<label>Password <span>(<a ng-click=\"changePassword($event)\">Change?</a>)</span></label>\n" +
    "\t\t\t\t\t<input type=\"password\" ng-model=\"user.password\" class=\"pl-disabled\" ng-click=\"changePassword($event)\">\n" +
    "\t\t\t\t</div><!--\n" +
    "\t\t\t\t--><div class=\"row half-width\">\n" +
    "\t\t\t\t\t<input type=\"submit\" value=\"Update my details\" ng-class=\"{ active: checkEquals(blueprint,user) }\">\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div><!--\n" +
    "\t\t--><div class=\"inner account-stats\" ng-if=\"viewing == 'stats'\">\n" +
    "\t\t\t<div class=\"account-stats-left\">\n" +
    "\t\t\t\t<h2>Account info</h2>\n" +
    "\t\t\t\t<p>Views left: <span>200,000</span></p>\n" +
    "\t\t\t\t<p>Encoding time left: <span>84.5 hrs</span></p>\n" +
    "\t\t\t\t<p>Total videos: <span>12</span></p>\n" +
    "\t\t\t\t<p><a href=\"#\">Refer a friend</a></p>\n" +
    "\t\t\t</div><!--\n" +
    "\t\t\t--><div class=\"account-stats-right\">\n" +
    "\t\t\t\t<div class=\"pie\">\n" +
    "\t\t\t\t\t<div class=\"inner-left\"></div>\n" +
    "\t\t\t\t\t<div class=\"inner-bottom\"></div>\n" +
    "\t\t\t\t\t<label>25% used</label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<a href=\"#\" class=\"big-button\">Upgrade to PRO</a>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"clear\"></div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('analytics.html',
    "<div class=\"section\">\n" +
    "    <ul id=\"breadcrumb\" class=\"inner\">\n" +
    "        <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\n" +
    "        <li><span class=\"divider\">/</span><span>Stats</span></li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"page-stats\" class=\"section\" ng-controller=\"AnalyticsController\">\n" +
    "\n" +
    "    <div class=\"inner\" ng-if=\"isState('complete')\">\n" +
    "\n" +
    "        <!-- Header -->\n" +
    "        <div id=\"analytics-header\">\n" +
    "            <!--  Title -->\n" +
    "            <h1 id=\"analytics-title\">Stats for {{ video.title }}</h1>\n" +
    "\n" +
    "            <!-- Tabs -->\n" +
    "            <div id=\"analytics-tabs\">\n" +
    "                <ul>\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection('overview') }\">\n" +
    "                        <a href=\"/#/analytics/{{ video.videoID }}/overview\" class=\"icon-analytics\">Overview</a>\n" +
    "                    </li>\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection('performance') }\">\n" +
    "                        <a href=\"/#/analytics/{{ video.videoID }}/performance\" class=\"icon-graph\">Performance</a>\n" +
    "                    </li>\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection('geographic') }\">\n" +
    "                        <a href=\"/#/analytics/{{ video.videoID }}/geographic\" class=\"icon-earth\">Geographic</a>\n" +
    "                    </li>\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection('engagement') }\">\n" +
    "                        <a href=\"/#/analytics/{{ video.videoID }}/engagement\" class=\"icon-user\">Engagement</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Date Range -->\n" +
    "            <div id=\"analytics-date\">\n" +
    "                <div id=\"analytics-date-selected\">\n" +
    "                    <span>{{ analytics.dateRange.from | formatDate }} - {{ analytics.dateRange.to | formatDate }}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Top Panel -->\n" +
    "        <div id=\"analytics-top-panel\">\n" +
    "            <div pl-analytics-overview ng-if=\"isSection('overview')\"></div>\n" +
    "            <div pl-analytics-performance-chart ng-if=\"isSection('performance')\"></div>\n" +
    "            <div pl-analytics-geographic-map ng-if=\"isSection('geographic')\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Bottom Panel -->\n" +
    "        <div id=\"analytics-bottom-panel\">\n" +
    "            <div pl-analytics-fields-key ng-if=\"isSection('performance') || isSection('geographic')\"></div>\n" +
    "            <div pl-analytics-fields-chooser ng-if=\"isSection('performance') || isSection('geographic')\"></div>\n" +
    "            <div pl-analytics-results ng-if=\"isSection('performance') || isSection('geographic')\"></div>\n" +
    "            <!-- Engagement Bottom Here -->\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Footer -->\n" +
    "        <div id=\"analytics-footer\">\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('dashboard.html',
    "<div class=\"section\">\n" +
    "  <ul id=\"breadcrumb\" class=\"inner\">\n" +
    "    <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\n" +
    "    <li><span class=\"divider\">/</span> <span>Dashboard</span></li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"page-dashboard\" class=\"section\" ng-controller=\"DashboardController\">\n" +
    "\t<div class=\"inner\">\n" +
    "\t\t<h1>Welcome to Romeo</h1>\n" +
    "\t\t<!-- <h2>What would you like to do?</h2> -->\n" +
    "\t\t<a href=\"/#/library\" class=\"big-button\">Show me my videos</a>\n" +
    "\t\t<p>or</p>\n" +
    "\t\t<a href=\"/#/upload\" class=\"big-button\">Add a new video</a>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('library.html',
    "<div class=\"section\">\n" +
    "    <ul id=\"breadcrumb\" class=\"inner\">\n" +
    "        <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\n" +
    "        <li><span class=\"divider\">/</span> <span>Library</span></li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"page-collections\" class=\"section\" ng-controller=\"LibraryController\">\n" +
    "    <div class=\"inner\">\n" +
    "    \t<h1>Manage your videos &amp; collections</h1>\n" +
    "\n" +
    "\t\t<div id=\"library-left\">\n" +
    "\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t<a class=\"icon-cross clear-filter\" ng-click=\"clearFilter($event)\" ng-class=\"{ show: filter.searchtext.length > 0 }\"></a>\n" +
    "\t\t\t\t<input type=\"text\" class=\"filter right\" placeholder=\"Filter Videos\" ng-model=\"filter.searchtext\" pl-focus-field>\n" +
    "\t\t\t\t<a class=\"button icon-list right\"></a>\n" +
    "\t\t\t\t<a class=\"button icon-layout right\"></a>\n" +
    "\t\t\t\t<h2 ng-show=\"selectedItems.length == 0\">Videos</h2>\n" +
    "\t\t\t\t<div id=\"selection-status\" ng-class=\"{ show: selectedItems.length > 0 }\">\n" +
    "\t\t\t\t\t<span>{{ selectedItems.length }} video<span ng-show=\"selectedItems.length > 1\">s</span> selected: <a ng-click=\"showAddToCollectionForm($event)\">Add to a collection</a> / <a href=\"#\">View analytics</a></span>\n" +
    "\t\t\t\t</div>\t\t\t\t\n" +
    "\t\t\t\t<div class=\"clear\"></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div id=\"collection-filter\" ng-class=\"{ show: filter.collection != null }\">\n" +
    "\t\t\t\t<span>Showing videos from the collection \"{{ collections[filter.collection].label }}\" ( <a ng-click=\"clearFilter($event, 'collection')\">clear filter</a> )</span>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div id=\"filter-status\" ng-class=\"{ show: filter.searchtext.length > 0 }\" class=\"border-top\">\n" +
    "\t\t\t\t<span>Filtering results for \"{{ filter.searchtext }}\" ( <a ng-click=\"clearFilter($event, 'search')\">clear filter</a> )</span>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div id=\"search-status\" ng-class=\"{ show: filter.numresults == 0 }\">\n" +
    "\t\t\t\t<span>Your search for {{ filter.searchtext }} returned {{ filter.numresults }} results (<a ng-click=\"clearFilter($event, 'search')\">Clear search</a>).</span>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<ul id=\"video-list\" ng-class=\"{ loading: loading }\">\n" +
    "\t            <li pl-draggable draggable=\"true\" ng-repeat=\"(key, video) in filter.results\" class=\"row\" data-id=\"{{ key }}\" style=\"background: transparent url({{ video.thumbnail }}) center center no-repeat; background-size: 100% auto;\">\n" +
    "\t            \t<div class=\"content\">\n" +
    "\t\t\t\t\t\t<span class=\"title\">{{ video.title }}</span>\n" +
    "\t\t\t\t\t\t<span class=\"number-of-collections\">( in <span pl-tooltip=\"{{ listCollections(video.collections) }}\" ng-class=\"{ active: listCollections(video.collections).length > 0}\">{{ video.collections.length }} collections</span> )</span>\n" +
    "\t\t                <!-- <div class=\"inline-wrapper\">\n" +
    "\t\t                    <span class=\"title\"><a href=\"/#/video/{{ key }}\">{{ video.title }}</a></span>\n" +
    "\t\t                    <ul class=\"collections\">\n" +
    "\t\t                    \t<li class=\"label\">Collections ( {{ video.collections.length }} ) :</li>\n" +
    "\t\t                        <li ng-repeat=\"collection in video.collections\" class=\"collection\">\n" +
    "\t\t                            <a class=\"label\" ng-click=\"filterByCollection($event, collection.id)\">{{ collection }}</a>\n" +
    "\t\t                        </li>\n" +
    "\t\t                    </ul>\n" +
    "\t\t                </div> -->\n" +
    "\t\t                <a href=\"/#/video/{{ key }}\" class=\"button edit\"><span class=\"icon-info\"></span></a>\n" +
    "\t\t                <a href=\"/#/analytics/{{ key }}/overview\" class=\"button analytics\" title=\"View analytics for this video\"><span title=\"View analytics for this video\" class=\"icon-pie\"></span></a>\n" +
    "\t\t                <div data-id=\"{{ key }}\" class=\"pl-checkbox\"></div>\t            \t\t\n" +
    "\t            \t</div>\n" +
    "\t            </li>\n" +
    "\t           \t\n" +
    "\t        </ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div id=\"library-right\">\n" +
    "\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t<h2>Collections</h2>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<ul class=\"library-left\" id=\"collection-list\" ng-class=\"{ loading: loading }\">\n" +
    "\t\t\t\t<li class=\"all-videos\" ng-class=\"{ highlighted: filter.collection == null }\" ng-click=\"clearFilter($event)\"><span>All videos</span></li>\n" +
    "                <li pl-droppable ng-repeat=\"(key, collection) in collections\" data-collection=\"{{ $index }}\" ng-class=\"{ highlighted: filter.collection == key }\">\n" +
    "                    <span class=\"title\" ng-click=\"filterByCollection($event, key)\">{{ collection.label }}</span>\n" +
    "                    <a class=\"info\" ng-click=\"editCollection($event, collection.label, $index)\">Edit</a>\n" +
    "                </li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div id=\"library-content-left\"></div>\n" +
    "\t\t<div id=\"library-content-right\"></div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('modal-add-to-collection.html',
    "<h2>Add videos to a collection</h2>\n" +
    "<form name\"editCollectionForm\" ng-submit=\"submitAddToCollectionForm(data)\">\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<label>Select a collection:</label>\n" +
    "\t\t<select class=\"actions\" ng-options=\"collection.label for collection in data.collections\" ng-model=\"data.selectedAction\" pl-toolbar-dropdown></select>\n" +
    "\t\t<!-- <input type=\"text\" ng-model=\"data.name\" pl-focus-field/> -->\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<input type=\"submit\" value=\"Add to {{ data.selectedAction.title }}\" />\n" +
    "\t</div>\t\n" +
    "\t<div class=\"clear\"></div>\n" +
    "</form>\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-change-email-address.html',
    "<h2>Change E-mail Address</h2>\n" +
    "<form name\"changeEmailAddress\" ng-submit=\"saveEmailAddress(data)\">\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<label>New E-mail Address</label>\n" +
    "\t\t<input type=\"text\" ng-model=\"data.email\" pl-focus-field/>\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<input type=\"submit\" value=\"Save\" />\n" +
    "\t</div>\t\n" +
    "\t<div class=\"clear\"></div>\n" +
    "</form>\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-change-password.html',
    "<h2>Change Password</h2>\n" +
    "<form name\"changePassword\" ng-submit=\"savePassword(data)\">\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<label>New password</label>\n" +
    "\t\t<input type=\"text\" ng-model=\"data.password1\" pl-focus-field />\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<label>confirm new password</label>\n" +
    "\t\t<input type=\"text\" ng-model=\"data.password2\" />\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<input type=\"submit\" value=\"Save\" />\n" +
    "\t</div>\t\n" +
    "\t<div class=\"clear\"></div>\n" +
    "</form>\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>\n"
  );


  $templateCache.put('modal-change-username.html',
    "<h2>Change Username</h2>\n" +
    "<form name\"changeUsername\" ng-submit=\"saveUsername(data)\">\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<label>New Username</label>\n" +
    "\t\t<input type=\"text\" ng-model=\"data.username\" pl-focus-field/>\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<input type=\"submit\" value=\"Save\" />\n" +
    "\t</div>\t\n" +
    "\t<div class=\"clear\"></div>\n" +
    "</form>\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-edit-collection.html',
    "<h2>Edit Collection</h2>\n" +
    "<form name\"editCollectionForm\" ng-submit=\"updateCollection(data)\">\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<label>Collection Name: \n" +
    "\t\t\t<span><a ng-click=\"deleteCollection($event, data)\">Delete Collection</a></span>\n" +
    "\t\t</label>\n" +
    "\t\t<input type=\"text\" ng-model=\"data.name\" pl-focus-field/>\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<input type=\"submit\" value=\"Save\" />\n" +
    "\t</div>\t\n" +
    "\t<div class=\"clear\"></div>\n" +
    "</form>\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-new-collection.html',
    "<h2>New Collection</h2>\n" +
    "<form name\"newCollectionForm\" ng-submit=\"saveCollection(data)\">\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<label>Collection Name:</label>\n" +
    "\t\t<input type=\"text\" ng-model=\"data.name\" pl-focus-field/>\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<input type=\"submit\" value=\"save\" />\n" +
    "\t</div>\n" +
    "\t<div class=\"clear\"></div>\n" +
    "</form>\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('upload.html',
    "<div class=\"section\">\n" +
    "  <ul id=\"breadcrumb\" class=\"inner\">\n" +
    "    <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\n" +
    "    <li><span class=\"divider\">/</span> <span>Upload</span></li>\n" +
    "   </ul>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"page-upload\" class=\"section\" ng-controller=\"UploadController\">\n" +
    "\t<div class=\"inner\">\n" +
    "\t\t<h1>Upload your content to Romeo</h1>\n" +
    "\n" +
    "\t\t<!-- STAGE ONE -->\n" +
    "\t\t<div class=\"inner half-width centered\" ng-if=\"fileDropped == false\">\n" +
    "\t\t\t<div id=\"upload-dropzone\" class=\"pl-upload-dropzone\">\n" +
    "\t\t\t\t<label>\n" +
    "\t\t\t\t\tDrag your videos here to upload and transcode them.<br/>\n" +
    "\t\t\t\t\t<input type=\"file\" onchange=\"angular.element(this).scope().fileNameChanged()\">\n" +
    "\t\t\t\t</label>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div><!--\n" +
    "\t\t<div class=\"inner half-width\" ng-if=\"fileDropped == false\">\n" +
    "\t\t\t<div id=\"upload-instructions\">\n" +
    "\t\t\t\t<div class=\"tooltip\">\n" +
    "\t\t\t\t\t<h4><span class=\"icon-info\"></span>Uploading your content is easy</h4>\n" +
    "\t\t\t\t\t<ul>\n" +
    "\t\t\t\t\t\t<li>&bull; Lorem ipsum dolor sit amet, consectetur adipisicing elit.</li>\n" +
    "\t\t\t\t\t\t<li>&bull; Quos, doloremque aperiam molestias magni dolore beatae enim non dolorem.</li>\n" +
    "\t\t\t\t\t\t<li>&bull; Ipsum facere aperiam saepe voluptate magnam minima velit ratione ad ea qui.</li>\n" +
    "\t\t\t\t\t</ul>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>-->\n" +
    "\t\t<!-- END OF STAGE ONE -->\n" +
    "\n" +
    "\t\t<!-- STAGE TWO -->\n" +
    "\t\t<div class=\"inner\" ng-if=\"fileDropped == true\">\n" +
    "\t\t\t<div id=\"upload-progress-wrapper\">\n" +
    "\t\t\t\t<div class=\"bar\">\n" +
    "\t\t\t\t\t<div class=\"progress\"></div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"percentage\">Uploading...</div>\n" +
    "\t\t\t</div><!--\n" +
    "\t\t\t--><div id=\"upload-info-wrapper\">\n" +
    "\t\t\t\t<h2>Tell us about your content...</h2>\n" +
    "\t\t\t\t<form ng-submit=\"createVideo(data)\">\n" +
    "\t\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t\t<label>Video Title</label>\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"newVideo.title\" pl-focus-field>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t\t<label>Video Description</label>\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"newVideo.description\">\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t\t<label>Video Category</label>\n" +
    "\t\t\t\t\t\t<select ng-model=\"newVideo.category\">\n" +
    "\t\t\t\t            <option value=\"\" default=\"\" selected=\"\"></option>\n" +
    "\t\t\t\t            \n" +
    "\t\t\t\t            <optgroup label=\"Food\">\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"11\">Chefs &amp; Recipes</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"12\">Wine &amp; Drink</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"113\">Healthy Eats</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"10\">Baking</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t            </optgroup>\n" +
    "\t\t\t\t            \n" +
    "\t\t\t\t            <optgroup label=\"Culture\">\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"114\">Men's Fashion</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"56\">Fashion</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"51\">The Arts</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"54\">LIterature</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"50\">Culture Shock</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"112\">Filmmakers</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"52\">Architecture &amp; Design</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"102\">Galleries</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"105\">Nature &amp; Science</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"53\">News Stand</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t            </optgroup>\n" +
    "\t\t\t\t            \n" +
    "\t\t\t\t            <optgroup label=\"Mind\">\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"60\">Inspirational</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"64\">Life Skills</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"63\">Causes</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"61\">Education</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"110\">Technology</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"65\">Business</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"108\">Travel &amp; Adventure</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t            </optgroup>\n" +
    "\t\t\t\t            \n" +
    "\t\t\t\t            <optgroup label=\"Entertainment\">\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"106\">Animation &amp; Shorts</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"41\">Interviews</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"42\">Classic Clips</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"43\">Vintage Videos</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"44\">Music</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t            </optgroup>\n" +
    "\t\t\t\t            \n" +
    "\t\t\t\t            <optgroup label=\"Wellness\">\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"23\">Beauty</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"21\">Fitness</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"20\">Wellness</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"22\">Yoga &amp; Meditation</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t            </optgroup>\n" +
    "\t\t\t\t            \n" +
    "\t\t\t\t            <optgroup label=\"Home &amp; Family\">\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"33\">How-To</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"104\">Environment</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"30\">Homes &amp; Gardens</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t                <option value=\"31\">i-Nanny</option>\n" +
    "\t\t\t\t              \n" +
    "\t\t\t\t            </optgroup>\n" +
    "\t\t\t\t          </select>\n" +
    "\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t\t<label>Add your video to a collection</label>\n" +
    "\t\t\t\t\t\t<select class=\"actions\" ng-options=\"collection.title for collection in collections\" ng-model=\"newVideo.collections\"></select>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t\t<input type=\"submit\" value=\"Publish\">\t\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</form>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t</div>\n" +
    "\t\t<!-- END OF STAGE TWO -->\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('video.html',
    "<div class=\"section\">\n" +
    "  <ul id=\"breadcrumb\" class=\"inner\">\n" +
    "    <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\n" +
    "    <li><span class=\"divider\">/</span> <a href=\"/#/library\">Library</a></li>\n" +
    "    <li><span class=\"divider\">/</span> <span>{{ $rootScope.pagetitle }}</span></li>\n" +
    "   </ul>\n" +
    "</div>\n" +
    "\n" +
    "<div id=\"page-video-single\" class=\"section\" ng-controller=\"VideoController\">\n" +
    "\t<div class=\"inner\">\n" +
    "\t\t<h1>{{ video.title }}</h1>\n" +
    "\t\t\n" +
    "\t\t<div class=\"inner half-width left\">\n" +
    "\t\t\t<h3>Edit your video details</h3>\n" +
    "\t\t\t<form action=\"#\">\n" +
    "\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t<label>Video Title</label>\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"video.title\" />\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t<label>Video Description</label>\n" +
    "\t\t\t\t\t<textarea name=\"\" id=\"\" ng-model=\"video.description\"></textarea>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"row half-width left\"><label>Mood</label><input type=\"text\" placeholder=\"Intrigued\" /></div><!--\n" +
    "\t\t\t\t--><div class=\"row half-width\"><label>Click to more link</label><input type=\"text\" placeholder=\"www.google.com\"/></div>\n" +
    "\t\t\t\t<!-- <div class=\"row\"><label>Video</label><input type=\"text\" /></div> -->\n" +
    "\t\t\t\t<div class=\"row half-width left\">\n" +
    "\t\t\t\t\t<label>Video Thumbnail</label>\n" +
    "\t\t\t\t\t<div class=\"thumbnail-picker\">\n" +
    "\t\t\t\t\t\t<span class=\"icon-pictures\"></span>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div><!--\n" +
    "\t\t\t\t--><div class=\"row half-width\">\n" +
    "\t\t\t\t\t<label>Meta data</label><input class=\"margin-bottom\" type=\"text\"/>\n" +
    "\t\t\t\t\t<label>Content data</label><input type=\"text\"/>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div><!--\n" +
    "\t\t--><div class=\"inner half-width right\">\n" +
    "\t\t\t<div class=\"wonder-embed\">\n" +
    "\t\t\t\t<iframe src=\"http://wonderpl.com/embed/viwAdAYl4is9rfPwmRE39MXA/\" width=\"100%\" height=\"100%\" frameborder=\"0\" allowfullscreen></iframe>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<h3>Customise your embeddable player</h3>\n" +
    "\t\t\t<div id=\"customize-player\">\n" +
    "\t\t\t\t<form action=\"\">\n" +
    "\t\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t\t<label>Embed Link</label>\n" +
    "\t\t\t\t\t\t<!-- <input type=\"text\" value=\"wonderpl.com/embed/vieasdasdads\"> -->\n" +
    "\n" +
    "\t\t\t\t\t\t<!-- <iframe src=\"//player.vimeo.com/video/88737187?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=c9ff23\" width=\"443\" height=\"197\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href=\"http://vimeo.com/88737187\">Made in Tohoku</a> from <a href=\"http://vimeo.com/theinouebrothers\">The Inoue Brothers</a> on <a href=\"https://vimeo.com\">Vimeo</a>.</p> -->\n" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" value=\"<iframe src=&quot;(( embedurl ))&quot; width=&quot;100%&quot; height=&quot;100%&quot; frameborder=&quot;0&quot; allowfullscreen></iframe>\" />\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t\t<input type=\"text\" placeholder=\"Width\" class=\"dimension\" /><input type=\"text\" placeholder=\"Height\" class=\"dimension height\" />\n" +
    "\t\t\t\t\t\t<span class=\"padding top\">\n" +
    "\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"inline-block margin-right\" /><label class=\"inline-block\">Maintain aspect-ratio?</label>\t\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</form>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div id=\"top-right-links\">\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<!-- <li><a href=\"#\"></a></li> -->\n" +
    "\t\t\t\t<!-- <li><a href=\"/#/tools/{{ video.id }}\"><span class=\"icon-tools\"></span>Monetization Tools</a></li> -->\n" +
    "\t\t\t\t<li><a href=\"/#/analytics/{{ video.id }}\"><span class=\"icon-graph\"></span>View Analytics</a></li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );

}]);
