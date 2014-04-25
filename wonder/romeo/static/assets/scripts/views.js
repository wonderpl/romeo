angular.module('RomeoApp').run(['$templateCache', function($templateCache) {   'use strict';

  $templateCache.put('account.html',
    "<!-- <div class=\"section\">\n" +
    "  <ul id=\"breadcrumb\" class=\"inner\">\n" +
    "    <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\n" +
    "    <li><span class=\"divider\">/</span> <span>My Account</span></li>\n" +
    "  </ul>\n" +
    "</div> -->\n" +
    "\n" +
    "<div id=\"page-account\" class=\"section\" ng-controller=\"AccountController\">\n" +
    "    <div class=\"background\"></div>\n" +
    "    <div class=\"avatar\">\n" +
    "        <span class=\"icon-user2\"></span>\n" +
    "        <label for=\"avatar-picker\">Change<br>Avatar</label>\n" +
    "        <input id=\"avatar-picker\" type=\"file\" style=\"visibility:hidden\" onchange=\"angular.element(this).scope().changeAvatar(this.files[0])\"/>\n" +
    "    </div>\n" +
    "\t<div class=\"inner\">\n" +
    "\t\t<h1>(~ user.firstName ~) (~ user.lastName ~)</h1>\n" +
    "\n" +
    "<!--\n" +
    "\t\t<nav id=\"account-nav\">\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li><a ng-click=\"accountNav('personal')\" ng-class=\"{ selected: viewing == 'personal' }\">Personal Details</a></li>\n" +
    "\t\t\t\t<li><a ng-click=\"accountNav('stats')\" ng-class=\"{ selected: viewing == 'stats' }\">Account Stats</a></li>\n" +
    "\t\t\t\t<li><a ng-click=\"accountNav('payment')\" ng-class=\"{ selected: viewing == 'payment' }\">Payment Info</a></li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</nav>\n" +
    "-->\n" +
    "\n" +
    "\t\t<div class=\"inner account-personal\" ng-if=\"viewing == 'personal'\">\n" +
    "\n" +
    "\t\t\t<form class=\"inline-block\" ng-submit=\"updateUser($event)\">\n" +
    "\t\t\t\t<div class=\"row full-width\">\n" +
    "\t\t\t\t\t<label>LOCATION</label>\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"user.location\" ng-change=\"changed('location', user.location)\"/>\n" +
    "\t\t\t\t</div>\n" +
    "                <div class=\"row full-width\">\n" +
    "                    <label>USERNAME</label>\n" +
    "                    <input type=\"text\" ng-model=\"user.username\" ng-change=\"changed('username', user.username)\"/>\n" +
    "                </div>\n" +
    "                <div class=\"row full-width\">\n" +
    "                    <label>EMAIL ADDRESS</label>\n" +
    "                    <input type=\"text\" ng-model=\"user.email\" ng-change=\"changed('email', user.email)\"/>\n" +
    "                </div>\n" +
    "                <div class=\"row full-width\">\n" +
    "                    <label>PASSWORD</label>\n" +
    "                    <input type=\"password\" ng-model=\"user.password\" ng-change=\"changed('password', user.password)\"/>\n" +
    "                </div>\n" +
    "                <div class=\"row full-width\">\n" +
    "                    <label for=\"form-submit\"><span class=\"wp-button\">Save</span></label>\n" +
    "                    <input id=\"form-submit\" type=\"submit\" style=\"visibility: hidden\">\n" +
    "                </div>\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"inner account-stats\" ng-if=\"viewing == 'stats'\">\n" +
    "\t\t\t<div class=\"account-stats-left\">\n" +
    "\t\t\t\t<h2>Account info</h2>\n" +
    "\t\t\t\t<p>Views left: <span>200,000</span></p>\n" +
    "\t\t\t\t<p>Encoding time left: <span>84.5 hrs</span></p>\n" +
    "\t\t\t\t<p>Total videos: <span>12</span></p>\n" +
    "\t\t\t\t<p><a href=\"#\">Refer a friend</a></p>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"account-stats-right\">\n" +
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
    "</div>\n"
  );


  $templateCache.put('analytics.html',
    "<!-- <div class=\"section\">\n" +
    "    <ul id=\"breadcrumb\" class=\"inner\">\n" +
    "        <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\n" +
    "        <li><span class=\"divider\">/</span><span>Stats</span></li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    " -->\n" +
    "<div id=\"page-stats\" class=\"section\" ng-controller=\"AnalyticsController\">\n" +
    "\n" +
    "    <div class=\"inner\" ng-if=\"analytics.state === analytics.States.COMPLETE\">\n" +
    "\n" +
    "        <!-- Header -->\n" +
    "        <div id=\"analytics-header\">\n" +
    "            <!--  Title -->\n" +
    "            <h1 id=\"analytics-title\">Stats for (~ analytics.video.title ~)</h1>\n" +
    "\n" +
    "            <!-- Tabs -->\n" +
    "            <div id=\"analytics-tabs\">\n" +
    "                <ul>\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection(analytics.Sections.OVERVIEW) }\">\n" +
    "                        <a href=\"/#/analytics/(~ analytics.video.videoID ~)/overview\" class=\"icon-analytics\">Overview</a>\n" +
    "                    </li>\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection(analytics.Sections.PERFORMANCE) }\">\n" +
    "                        <a href=\"/#/analytics/(~ analytics.video.videoID ~)/performance\" class=\"icon-graph\">Performance</a>\n" +
    "                    </li>\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection(analytics.Sections.GEOGRAPHIC) }\">\n" +
    "                        <a href=\"/#/analytics/(~ analytics.video.videoID ~)/geographic\" class=\"icon-earth\">Geographic</a>\n" +
    "                    </li>\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection(analytics.Sections.ENGAGEMENT) }\">\n" +
    "                        <a href=\"/#/analytics/(~ analytics.video.videoID ~)/engagement\" class=\"icon-user\">Engagement</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Date Range -->\n" +
    "            <div id=\"analytics-date\">\n" +
    "                <div id=\"analytics-date-selected\">\n" +
    "                    <span>Date: (~ analytics.dateFrom | date: 'shortDate' ~) - (~ analytics.dateTo | date: 'shortDate' ~)</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Top Panel -->\n" +
    "        <div id=\"analytics-top-panel\">\n" +
    "            <div pl-analytics-overview ng-if=\"isSection(analytics.Sections.OVERVIEW)\"></div>\n" +
    "            <div pl-analytics-performance-chart ng-if=\"isSection(analytics.Sections.PERFORMANCE)\"></div>\n" +
    "            <div pl-analytics-geographic-map ng-if=\"isSection(analytics.Sections.GEOGRAPHIC)\"></div>\n" +
    "            <div pl-analytics-engagement-video-segment ng-if=\"isSection(analytics.Sections.ENGAGEMENT)\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Bottom Panel -->\n" +
    "        <div id=\"analytics-bottom-panel\" class=\"flip-container\">\n" +
    "            <div pl-analytics-fields-key ng-if=\"isSection(analytics.Sections.PERFORMANCE) || isSection(analytics.Sections.GEOGRAPHIC)\"></div>\n" +
    "            <div class=\"flipper\">\n" +
    "                <div pl-analytics-results-table ng-if=\"isSection(analytics.Sections.PERFORMANCE) || isSection(analytics.Sections.GEOGRAPHIC)\" class=\"flipper-front front\"></div>\n" +
    "                <div pl-analytics-fields-chooser ng-if=\"isSection(analytics.Sections.PERFORMANCE) || isSection(analytics.Sections.GEOGRAPHIC)\" class=\"flipper-back back\"></div>\n" +
    "            </div>\n" +
    "            <!-- Engagement Bottom Here -->\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Footer -->\n" +
    "        <div id=\"analytics-footer\">\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n"
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
    "<!-- <div class=\"section\">\n" +
    "    <ul id=\"breadcrumb\" class=\"inner\">\n" +
    "        <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\n" +
    "        <li><span class=\"divider\">/</span> <span>Library</span></li>\n" +
    "    </ul>\n" +
    "</div> -->\n" +
    "\n" +
    "<div id=\"page-collections\" class=\"section\" ng-controller=\"LibraryController\">\n" +
    "    <div class=\"inner\">\n" +
    "    \t<h1>Manage your videos &amp; collections</h1>\n" +
    "\t\t<div id=\"top-right-links\">\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li><a href=\"/#/upload\"><span class=\"icon-upload2\"></span> Upload a new video</a></li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\t\t<div id=\"library-left\">\n" +
    "\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t<a class=\"icon-cross clear-filter\" ng-click=\"clearFilter($event)\" ng-class=\"{ show: filter.searchtext.length > 0 }\"></a>\n" +
    "\t\t\t\t<input type=\"text\" class=\"filter right\" placeholder=\"Filter Videos\" ng-model=\"filter.searchtext\" pl-focus-field>\n" +
    "\t\t\t\t<a class=\"button icon-list right\" ng-click=\"changeView( 'list' )\" ng-class=\"{ active: viewType == 'list' }\"></a>\n" +
    "\t\t\t\t<a class=\"button icon-layout right\" ng-click=\"changeView( 'grid' )\" ng-class=\"{ active: viewType == 'grid' }\"></a>\n" +
    "\t\t\t\t<h2 ng-show=\"selectedItems.length == 0\">Videos</h2>\n" +
    "\t\t\t\t<div id=\"selection-status\" ng-class=\"{ show: selectedItems.length > 0 }\">\n" +
    "\t\t\t\t\t<span>(~ selectedItems.length ~) video<span ng-show=\"selectedItems.length > 1\">s</span> selected: <a ng-click=\"showAddToCollectionForm($event)\">Add to a collection</a><!-- / <a ng-click=\"showRemoveFromCollectionForm($event)\">Remove from a collection</a>--></span>\n" +
    "\t\t\t\t</div>\t\t\t\t\n" +
    "\t\t\t\t<div class=\"clear\"></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t\n" +
    "\t\t\t<div id=\"collection-filter\" ng-class=\"{ show: filter.collection != null }\">\n" +
    "\t\t\t\t<span>Showing videos from the collection \"(~ collections[filter.collection].label ~)\" ( <a ng-click=\"clearFilter($event, 'collection')\">clear filter</a> )</span>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div id=\"filter-status\" ng-class=\"{ show: filter.searchtext.length > 0 }\" class=\"border-top\">\n" +
    "\t\t\t\t<span>Filtering results for \"(~ filter.searchtext ~)\" ( <a ng-click=\"clearFilter($event, 'search')\">clear filter</a> )</span>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div id=\"search-status\" ng-class=\"{ show: filter.numresults == 0 }\">\n" +
    "\t\t\t\t<span>Your search for (~ filter.searchtext ~) returned (~ filter.numresults ~) results (<a ng-click=\"clearFilter($event, 'search')\">Clear search</a>).</span>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<div id=\"video-view\"></div>\n" +
    "\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div id=\"library-right\">\n" +
    "\t\t\t<div class=\"toolbar\">\n" +
    "\t\t\t\t<h2>Collections</h2>\n" +
    "\t\t\t\t<a class=\"button icon-add-to-list right\" ng-click=\"showNewCollectionForm($event)\"></a>\n" +
    "\t\t\t\t<div class=\"clear\"></div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<ul class=\"library-left\" id=\"collection-list\" ng-class=\"{ loading: loading }\">\n" +
    "\t\t\t\t<li class=\"all-videos\" ng-class=\"{ highlighted: filter.collection == null }\" ng-click=\"clearFilter($event)\"><span>All videos</span></li>\n" +
    "                <li pl-droppable ng-repeat=\"(key, collection) in collections\" data-collection=\"(~ key ~)\" ng-class=\"{ highlighted: filter.collection == key }\">\n" +
    "                    <span class=\"title\" ng-click=\"filterByCollection($event, key)\">(~ collection.label ~)</span>\n" +
    "                    <a class=\"info\" ng-click=\"showEditCollectionForm($event, collection.label, key)\">Edit</a>\n" +
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


  $templateCache.put('loading.html',
    "\n" +
    "\n" +
    "<div id=\"page-loading\" class=\"page section\" ng-controller=\"LoadingController\">\n" +
    "\t<div class=\"inner\">\n" +
    "\t\t<h1>One moment please...</h1>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('login.html',
    "\n" +
    "\n" +
    "<div id=\"page-login\" class=\"page section\" ng-controller=\"LoginController\" autocomplete=\"off\">\n" +
    "\t<div class=\"inner\">\n" +
    "\t\t<h1>Login</h1>\n" +
    "\t\t<form ng-submit=\"login()\">\n" +
    "\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t<label for=\"username\">Username</label>\n" +
    "\t\t\t\t<input type=\"text\" id=\"login-username\" name=\"username\" ng-model=\"username\" autocomplete=\"off\">\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t<label for=\"password\">Password</label>\n" +
    "\t\t\t\t<input type=\"password\" id=\"login-password\" name=\"password\" ng-model=\"password\" autocomplete=\"off\">\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t<button type=\"submit\" pl-progress-button>\n" +
    "\t\t\t\t\t<span class=\"label\">Login</span>\n" +
    "\t\t\t\t\t<div class=\"progress\"></div>\n" +
    "\t\t\t\t</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</form>\n" +
    "\t</div>\n" +
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
    "\t\t<input type=\"submit\" value=\"Add to (~ data.selectedAction.title ~)\" />\n" +
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
    "<form name\"editCollectionForm\" ng-submit=\"submitEditCollectionForm(data)\">\n" +
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
    "<form name\"newCollectionForm\" ng-submit=\"submitNewCollectionForm(data)\">\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<label>Collection Name:</label>\n" +
    "\t\t<input type=\"text\" ng-model=\"data.name\" pl-focus-field />\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<input type=\"submit\" value=\"save\" />\n" +
    "\t</div>\n" +
    "\t<div class=\"clear\"></div>\n" +
    "</form>\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-show-all-collections.html',
    "<h2>Edit Collections</h2>\n" +
    "<form name\"editCollectionForm\" ng-submit=\"closeModal($event)\">\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<label>Collections featuring (~ data.video.title ~):</label>\n" +
    "\t\t<ul class=\"collection-list\">\n" +
    "\t\t\t<li ng-repeat=\"collection in data.video.collections\">\n" +
    "\t\t\t\t(~ collections[collection].label ~) <span>( <a ng-click=\"removeFromCollection($event, data.id, collection)\">Remove</a> )</span>\n" +
    "\t\t\t</li>\n" +
    "\t\t</ul>\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<input type=\"submit\" value=\"Save\" />\n" +
    "\t</div>\t\n" +
    "\t<div class=\"clear\"></div>\n" +
    "</form>\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-show-categories.html',
    "<h2>Choose a category</h2>\n" +
    "<div id=\"category-list\">\n" +
    "\t<ul ng-repeat=\"category in categories\">\n" +
    "\t\t<li class=\"heading f-serif\">(~ category.name ~)</li>\n" +
    "\t\t<li ng-repeat=\"subcategory in category.sub_categories\" data-id=\"(~ subcategory.id ~)\" ng-click=\"chooseCategory($event)\" class=\"category\">(~ subcategory.name ~)</li>\n" +
    "\t</ul>\n" +
    "</div>\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('upload-quick-share-reecipients.html',
    ""
  );


  $templateCache.put('upload-quick-share.html',
    "\n" +
    "<div id=\"quick-share\" class=\"f-serif\" ng-class=\"{ show: showQuickShare }\">\n" +
    "\t<form ng-submit=\"submitQuickShareForm\">\n" +
    "\t\t<div id=\"quick-share-recipients\">\n" +
    "\t\t\t<tags-input ng-model=\"shareAddresses\" placeholder=\"Your recipient(s) email addresses\"></tags-input>\n" +
    "\t\t</div>\n" +
    "\t\t<div id=\"quick-share-body\">\n" +
    "\t\t\t<textarea class=\"message f-serif\" name=\"message\">Hey, you should totally check out my new video on Wonder PL.</textarea>\n" +
    "\t\t\t<div class=\"link\"><a href=\"#\">http://wndr.pl/s?v=554D4B</a></div>\n" +
    "\t\t\t<div class=\"controls\">\n" +
    "\t\t\t\t<button>Send</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('upload.html',
    "\n" +
    "<div id=\"page-upload\" class=\"section\" ng-controller=\"UploadController\">\n" +
    "\t<div class=\"inner\">\n" +
    "\t\t<quick-share></quick-share>\n" +
    "\t\t<div class=\"inner centered\">\n" +
    "\t\t\t<!-- <div class=\"avatar\"><img src=\"/static/assets/img/tom.jpg\" width=\"64\" alt=\"\" /></div> -->\n" +
    "\t\t\t<div id=\"upload-draft-status\" class=\"f-serif\">\n" +
    "\t\t\t\t<span>\n" +
    "\t\t\t\t\tAutosaved: 5 Mins Ago.\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<form id=\"upload-form\" ng-submit=\"saveMetaData($event)\">\n" +
    "\t\t\t\t<div id=\"upload-dropzone\" class=\"pl-upload-dropzone\" ng-class=\"{ dashedborder : file.state == 'empty' }\">\n" +
    "\n" +
    "\t\t\t\t\t<div class=\"backgrounds\">\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state == 'uploading' || file.state == 'complete'\" class=\"thumbnail-background\"></div>\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state != 'empty' && file.thumbnail == null\" class=\"confirm-background\"></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t<div class=\"dialogs\">\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<span ng-show=\"file.state == 'empty'\" class=\"empty-upper f-serif\">Drag &amp; drop your video here</span>\n" +
    "\t\t\t\t\t\t<span ng-show=\"file.state == 'empty'\" class=\"empty-icon icon-drag\"></span>\n" +
    "\t\t\t\t\t\t<span ng-show=\"file.state == 'empty'\" class=\"empty-lower f-serif\">or choose a video from <span class=\"highlight\">your computer</span></span>\n" +
    "\n" +
    "\t\t\t\t\t\t<input ng-show=\"file.state != 'uploading'\" type=\"file\" id=\"file-input\" upload-file-input>\n" +
    "\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state == 'chosen'\" class=\"confirm-label f-serif\">Is \"(~ file.name ~)\" correct?</div>\n" +
    "\t\t\t\t\t\t<a ng-show=\"file.state == 'chosen'\" class=\"confirm-cancel\">Choose a different file</a>\n" +
    "\t\t\t\t\t\t<a ng-show=\"file.state == 'chosen'\" class=\"confirm-proceed\" ng-click=\"startUpload()\">Upload this file</a>\n" +
    "\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state == 'uploading'\" class=\"progress-bar\">\n" +
    "\t\t\t\t\t\t\t<div class=\"inner-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"inner\" style=\"width: (~ file.upload.progress ~)%;\"></div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state == 'uploading'\" class=\"progress-percentage f-serif\">(~ file.upload.progress | wholeNumber ~)%</div>\n" +
    "\t\t\t\t\t\t<a ng-show=\"file.state == 'uploading'\" ng-class=\"{ enabled: file.upload.progress >= 55 }\" class=\"progress-pick-a-thumbnail\" ng-click=\"showThumbnailChooser()\">Pick a thumbnail</a>\n" +
    "\n" +
    "\t\t\t\t\t\t<a ng-show=\"file.state == 'complete'\" class=\"upload-complete icon-upload-complete\"></a>\n" +
    "\n" +
    "\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"row\" id=\"title-row\">\n" +
    "\t\t\t\t\t<pre id=\"upload-title\" type=\"text\" placeholder=\"Video Title\" pl-content-editable-placeholder pl-focus-field contenteditable></pre>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"row\" id=\"upload-buttons\">\n" +
    "\t\t\t\t\t<a href=\"#\"></a>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"row f-serif\" id=\"description-row\">\n" +
    "\t\t\t\t\t<pre id=\"upload-description\" placeholder=\"Add a description.  This is going to be your space to share insights into your video - blogs, recipes, ideas and more.\" pl-content-editable-placeholder contenteditable></pre>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"row\" id=\"category-row\">\n" +
    "\t\t\t\t\t<a id=\"category-chooser\" ng-click=\"showCategories()\" class=\"f-sans\">(~ chosenCategory.label || 'Choose a category...' ~)<span class=\"icon-select\"></span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "<!-- \t\t\t\t<video id=\"video\" src=\"\" video-thumbnail-grabber preload></video>\n" +
    "\t\t\t\t<canvas id=\"canvas\"></canvas> -->\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\t\t\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('video-list-grid.html',
    "<ul id=\"video-list-grid\" class=\"library\" ng-class=\"{ loading: loading }\">\n" +
    "    <li pl-draggable draggable=\"true\" ng-repeat=\"(key, video) in filter.results\" class=\"row\" data-id=\"(~ key ~)\" style=\"background: transparent url((~ video.thumbnail ~)) center center no-repeat; background-size: 100% auto;\">\n" +
    "        <div class=\"content\">\n" +
    "            <span class=\"title\">(~ video.title ~)</span>\n" +
    "            <span class=\"number-of-collections\" ng-click=\"showAllCollections($event,key)\">( in <span ng-class=\"{ active: video.collections.length > 0}\">(~ video.collections.length ~) collections</span> )</span>\n" +
    "            <a href=\"/#/video/(~ key ~)\" class=\"button edit\"><span class=\"icon-info\"></span></a>\n" +
    "            <a href=\"/#/analytics/(~ key ~)/overview\" class=\"button analytics\" title=\"View analytics for this video\"><span title=\"View analytics for this video\" class=\"icon-pie\"></span></a>\n" +
    "            <div data-id=\"(~ key ~)\" class=\"pl-checkbox\"></div>                     \n" +
    "        </div>\n" +
    "    </li>\n" +
    "</ul>"
  );


  $templateCache.put('video-list-list.html',
    "<ul id=\"video-list-list\" class=\"library\" ng-class=\"{ loading: loading }\">\n" +
    "    <li ng-repeat=\"(key, video) in filter.results\" class=\"row\" data-id=\"(~ key ~)\">\n" +
    "        <span class=\"title\"><a href=\"/#/video/(~ key ~)\">(~ video.title ~)</a></span>\n" +
    "        <span class=\"number-of-collections\" ng-click=\"showAllCollections($event,key)\">( in <span ng-class=\"{ active: video.collections.length > 0}\">(~ video.collections.length ~) collections</span> )</span>\n" +
    "        <a href=\"/#/video/(~ key ~)\" class=\"button edit\"><span class=\"icon-info\"></span></a>\n" +
    "        <a href=\"/#/analytics/(~ key ~)/overview\" class=\"button analytics\" title=\"View analytics for this video\"><span title=\"View analytics for this video\" class=\"icon-pie\"></span></a>\n" +
    "        <div data-id=\"(~ key ~)\" class=\"pl-checkbox\"></div>                     \n" +
    "    </li>\n" +
    "</ul>"
  );


  $templateCache.put('video.html',
    "<!-- <div class=\"section\">\n" +
    "  <ul id=\"breadcrumb\" class=\"inner\">\n" +
    "    <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\n" +
    "    <li><span class=\"divider\">/</span> <a href=\"/#/library\">Library</a></li>\n" +
    "    <li><span class=\"divider\">/</span> <span>(~ $rootScope.pagetitle ~)</span></li>\n" +
    "   </ul>\n" +
    "</div>\n" +
    " -->\n" +
    "<div id=\"page-video-single\" class=\"section\" ng-controller=\"VideoController\">\n" +
    "\t<div class=\"inner\">\n" +
    "\t\t<h1>(~ video.title ~)</h1>\n" +
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
    "\t\t--><div class=\"inner half-width right\" style=\"padding-top: 57px;\">\n" +
    "\t\t\t<div class=\"wonder-embed\">\n" +
    "\t\t\t\t<iframe src=\"http://wonderpl.com/embed/viwAdAYl4is9rfPwmRE39MXA/\" width=\"100%\" height=\"100%\" frameborder=\"0\" allowfullscreen></iframe>\n" +
    "\t\t\t</div>\n" +
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
    "\t\t\t\t<!-- <li><a href=\"/#/tools/(~ video.id ~)\"><span class=\"icon-tools\"></span>Monetization Tools</a></li> -->\n" +
    "\t\t\t\t<li><a href=\"/#/analytics/(~ video.id ~)\"><span class=\"icon-graph\"></span>View Analytics</a></li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>"
  );
} ]);