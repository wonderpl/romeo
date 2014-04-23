angular.module('RomeoApp').run(['$templateCache', function($templateCache) {   'use strict';

  $templateCache.put('account.html',
    "<!-- <div class=\"section\">\r" +
    "\n" +
    "  <ul id=\"breadcrumb\" class=\"inner\">\r" +
    "\n" +
    "    <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\r" +
    "\n" +
    "    <li><span class=\"divider\">/</span> <span>My Account</span></li>\r" +
    "\n" +
    "  </ul>\r" +
    "\n" +
    "</div> -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"page-account\" class=\"section\" ng-controller=\"AccountController\">\r" +
    "\n" +
    "    <div class=\"background\"></div>\r" +
    "\n" +
    "    <div class=\"avatar\">\r" +
    "\n" +
    "        <span class=\"icon-user2\"></span>\r" +
    "\n" +
    "        <label for=\"avatar-picker\">Change<br>Avatar</label>\r" +
    "\n" +
    "        <input id=\"avatar-picker\" type=\"file\" style=\"visibility:hidden\" onchange=\"angular.element(this).scope().changeAvatar(this.files[0])\"/>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\t<div class=\"inner\">\r" +
    "\n" +
    "\t\t<h1>(~ user.firstName ~) (~ user.lastName ~)</h1>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<!--\r" +
    "\n" +
    "\t\t<nav id=\"account-nav\">\r" +
    "\n" +
    "\t\t\t<ul>\r" +
    "\n" +
    "\t\t\t\t<li><a ng-click=\"accountNav('personal')\" ng-class=\"{ selected: viewing == 'personal' }\">Personal Details</a></li>\r" +
    "\n" +
    "\t\t\t\t<li><a ng-click=\"accountNav('stats')\" ng-class=\"{ selected: viewing == 'stats' }\">Account Stats</a></li>\r" +
    "\n" +
    "\t\t\t\t<li><a ng-click=\"accountNav('payment')\" ng-class=\"{ selected: viewing == 'payment' }\">Payment Info</a></li>\r" +
    "\n" +
    "\t\t\t</ul>\r" +
    "\n" +
    "\t\t</nav>\r" +
    "\n" +
    "-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<div class=\"inner account-personal\" ng-if=\"viewing == 'personal'\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t<form class=\"inline-block\" ng-submit=\"updateUser($event)\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"row full-width\">\r" +
    "\n" +
    "\t\t\t\t\t<label>LOCATION</label>\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"user.location\" ng-change=\"changed('location', user.location)\"/>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "                <div class=\"row full-width\">\r" +
    "\n" +
    "                    <label>USERNAME</label>\r" +
    "\n" +
    "                    <input type=\"text\" ng-model=\"user.username\" ng-change=\"changed('username', user.username)\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"row full-width\">\r" +
    "\n" +
    "                    <label>EMAIL ADDRESS</label>\r" +
    "\n" +
    "                    <input type=\"text\" ng-model=\"user.email\" ng-change=\"changed('email', user.email)\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"row full-width\">\r" +
    "\n" +
    "                    <label>PASSWORD</label>\r" +
    "\n" +
    "                    <input type=\"password\" ng-model=\"user.password\" ng-change=\"changed('password', user.password)\"/>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"row full-width\">\r" +
    "\n" +
    "                    <label for=\"form-submit\"><span class=\"wp-button\">Save</span></label>\r" +
    "\n" +
    "                    <input id=\"form-submit\" type=\"submit\" style=\"visibility: hidden\">\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\t\t\t</form>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"inner account-stats\" ng-if=\"viewing == 'stats'\">\r" +
    "\n" +
    "\t\t\t<div class=\"account-stats-left\">\r" +
    "\n" +
    "\t\t\t\t<h2>Account info</h2>\r" +
    "\n" +
    "\t\t\t\t<p>Views left: <span>200,000</span></p>\r" +
    "\n" +
    "\t\t\t\t<p>Encoding time left: <span>84.5 hrs</span></p>\r" +
    "\n" +
    "\t\t\t\t<p>Total videos: <span>12</span></p>\r" +
    "\n" +
    "\t\t\t\t<p><a href=\"#\">Refer a friend</a></p>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"account-stats-right\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"pie\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"inner-left\"></div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"inner-bottom\"></div>\r" +
    "\n" +
    "\t\t\t\t\t<label>25% used</label>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<a href=\"#\" class=\"big-button\">Upgrade to PRO</a>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div class=\"clear\"></div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('analytics.html',
    "<!-- <div class=\"section\">\r" +
    "\n" +
    "    <ul id=\"breadcrumb\" class=\"inner\">\r" +
    "\n" +
    "        <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\r" +
    "\n" +
    "        <li><span class=\"divider\">/</span><span>Stats</span></li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    " -->\r" +
    "\n" +
    "<div id=\"page-stats\" class=\"section\" ng-controller=\"AnalyticsController\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"inner\" ng-if=\"analytics.state === analytics.States.COMPLETE\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- Header -->\r" +
    "\n" +
    "        <div id=\"analytics-header\">\r" +
    "\n" +
    "            <!--  Title -->\r" +
    "\n" +
    "            <h1 id=\"analytics-title\">Stats for (~ analytics.video.title ~)</h1>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- Tabs -->\r" +
    "\n" +
    "            <div id=\"analytics-tabs\">\r" +
    "\n" +
    "                <ul>\r" +
    "\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection(analytics.Sections.OVERVIEW) }\">\r" +
    "\n" +
    "                        <a href=\"/#/analytics/(~ analytics.video.videoID ~)/overview\" class=\"icon-analytics\">Overview</a>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection(analytics.Sections.PERFORMANCE) }\">\r" +
    "\n" +
    "                        <a href=\"/#/analytics/(~ analytics.video.videoID ~)/performance\" class=\"icon-graph\">Performance</a>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection(analytics.Sections.GEOGRAPHIC) }\">\r" +
    "\n" +
    "                        <a href=\"/#/analytics/(~ analytics.video.videoID ~)/geographic\" class=\"icon-earth\">Geographic</a>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                    <li class=\"analytics-tabs-tab\" ng-class=\"{ selected: isSection(analytics.Sections.ENGAGEMENT) }\">\r" +
    "\n" +
    "                        <a href=\"/#/analytics/(~ analytics.video.videoID ~)/engagement\" class=\"icon-user\">Engagement</a>\r" +
    "\n" +
    "                    </li>\r" +
    "\n" +
    "                </ul>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- Date Range -->\r" +
    "\n" +
    "            <div id=\"analytics-date\">\r" +
    "\n" +
    "                <div id=\"analytics-date-selected\">\r" +
    "\n" +
    "                    <span>Date: (~ analytics.dateFrom | date: 'shortDate' ~) - (~ analytics.dateTo | date: 'shortDate' ~)</span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- Top Panel -->\r" +
    "\n" +
    "        <div id=\"analytics-top-panel\">\r" +
    "\n" +
    "            <div pl-analytics-overview ng-if=\"isSection(analytics.Sections.OVERVIEW)\"></div>\r" +
    "\n" +
    "            <div pl-analytics-performance-chart ng-if=\"isSection(analytics.Sections.PERFORMANCE)\"></div>\r" +
    "\n" +
    "            <div pl-analytics-geographic-map ng-if=\"isSection(analytics.Sections.GEOGRAPHIC)\"></div>\r" +
    "\n" +
    "            <div pl-analytics-engagement-video-segment ng-if=\"isSection(analytics.Sections.ENGAGEMENT)\"></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- Bottom Panel -->\r" +
    "\n" +
    "        <div id=\"analytics-bottom-panel\" class=\"flip-container\">\r" +
    "\n" +
    "            <div pl-analytics-fields-key ng-if=\"isSection(analytics.Sections.PERFORMANCE) || isSection(analytics.Sections.GEOGRAPHIC)\"></div>\r" +
    "\n" +
    "            <div class=\"flipper\">\r" +
    "\n" +
    "                <div pl-analytics-results-table ng-if=\"isSection(analytics.Sections.PERFORMANCE) || isSection(analytics.Sections.GEOGRAPHIC)\" class=\"flipper-front front\"></div>\r" +
    "\n" +
    "                <div pl-analytics-fields-chooser ng-if=\"isSection(analytics.Sections.PERFORMANCE) || isSection(analytics.Sections.GEOGRAPHIC)\" class=\"flipper-back back\"></div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <!-- Engagement Bottom Here -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- Footer -->\r" +
    "\n" +
    "        <div id=\"analytics-footer\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('dashboard.html',
    "<div class=\"section\">\r" +
    "\n" +
    "  <ul id=\"breadcrumb\" class=\"inner\">\r" +
    "\n" +
    "    <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\r" +
    "\n" +
    "    <li><span class=\"divider\">/</span> <span>Dashboard</span></li>\r" +
    "\n" +
    "  </ul>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"page-dashboard\" class=\"section\" ng-controller=\"DashboardController\">\r" +
    "\n" +
    "\t<div class=\"inner\">\r" +
    "\n" +
    "\t\t<h1>Welcome to Romeo</h1>\r" +
    "\n" +
    "\t\t<!-- <h2>What would you like to do?</h2> -->\r" +
    "\n" +
    "\t\t<a href=\"/#/library\" class=\"big-button\">Show me my videos</a>\r" +
    "\n" +
    "\t\t<p>or</p>\r" +
    "\n" +
    "\t\t<a href=\"/#/upload\" class=\"big-button\">Add a new video</a>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('library.html',
    "<!-- <div class=\"section\">\r" +
    "\n" +
    "    <ul id=\"breadcrumb\" class=\"inner\">\r" +
    "\n" +
    "        <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\r" +
    "\n" +
    "        <li><span class=\"divider\">/</span> <span>Library</span></li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</div> -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"page-collections\" class=\"section\" ng-controller=\"LibraryController\">\r" +
    "\n" +
    "    <div class=\"inner\">\r" +
    "\n" +
    "    \t<h1>Manage your videos &amp; collections</h1>\r" +
    "\n" +
    "\t\t<div id=\"top-right-links\">\r" +
    "\n" +
    "\t\t\t<ul>\r" +
    "\n" +
    "\t\t\t\t<li><a href=\"/#/upload\"><span class=\"icon-upload2\"></span> Upload a new video</a></li>\r" +
    "\n" +
    "\t\t\t</ul>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<div id=\"library-left\">\r" +
    "\n" +
    "\t\t\t<div class=\"toolbar\">\r" +
    "\n" +
    "\t\t\t\t<a class=\"icon-cross clear-filter\" ng-click=\"clearFilter($event)\" ng-class=\"{ show: filter.searchtext.length > 0 }\"></a>\r" +
    "\n" +
    "\t\t\t\t<input type=\"text\" class=\"filter right\" placeholder=\"Filter Videos\" ng-model=\"filter.searchtext\" pl-focus-field>\r" +
    "\n" +
    "\t\t\t\t<a class=\"button icon-list right\" ng-click=\"changeView( 'list' )\" ng-class=\"{ active: viewType == 'list' }\"></a>\r" +
    "\n" +
    "\t\t\t\t<a class=\"button icon-layout right\" ng-click=\"changeView( 'grid' )\" ng-class=\"{ active: viewType == 'grid' }\"></a>\r" +
    "\n" +
    "\t\t\t\t<h2 ng-show=\"selectedItems.length == 0\">Videos</h2>\r" +
    "\n" +
    "\t\t\t\t<div id=\"selection-status\" ng-class=\"{ show: selectedItems.length > 0 }\">\r" +
    "\n" +
    "\t\t\t\t\t<span>(~ selectedItems.length ~) video<span ng-show=\"selectedItems.length > 1\">s</span> selected: <a ng-click=\"showAddToCollectionForm($event)\">Add to a collection</a><!-- / <a ng-click=\"showRemoveFromCollectionForm($event)\">Remove from a collection</a>--></span>\r" +
    "\n" +
    "\t\t\t\t</div>\t\t\t\t\r" +
    "\n" +
    "\t\t\t\t<div class=\"clear\"></div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\r" +
    "\n" +
    "\t\t\t<div id=\"collection-filter\" ng-class=\"{ show: filter.collection != null }\">\r" +
    "\n" +
    "\t\t\t\t<span>Showing videos from the collection \"(~ collections[filter.collection].label ~)\" ( <a ng-click=\"clearFilter($event, 'collection')\">clear filter</a> )</span>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t<div id=\"filter-status\" ng-class=\"{ show: filter.searchtext.length > 0 }\" class=\"border-top\">\r" +
    "\n" +
    "\t\t\t\t<span>Filtering results for \"(~ filter.searchtext ~)\" ( <a ng-click=\"clearFilter($event, 'search')\">clear filter</a> )</span>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t<div id=\"search-status\" ng-class=\"{ show: filter.numresults == 0 }\">\r" +
    "\n" +
    "\t\t\t\t<span>Your search for (~ filter.searchtext ~) returned (~ filter.numresults ~) results (<a ng-click=\"clearFilter($event, 'search')\">Clear search</a>).</span>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t<div id=\"video-view\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<div id=\"library-right\">\r" +
    "\n" +
    "\t\t\t<div class=\"toolbar\">\r" +
    "\n" +
    "\t\t\t\t<h2>Collections</h2>\r" +
    "\n" +
    "\t\t\t\t<a class=\"button icon-add-to-list right\" ng-click=\"showNewCollectionForm($event)\"></a>\r" +
    "\n" +
    "\t\t\t\t<div class=\"clear\"></div>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<ul class=\"library-left\" id=\"collection-list\" ng-class=\"{ loading: loading }\">\r" +
    "\n" +
    "\t\t\t\t<li class=\"all-videos\" ng-class=\"{ highlighted: filter.collection == null }\" ng-click=\"clearFilter($event)\"><span>All videos</span></li>\r" +
    "\n" +
    "                <li pl-droppable ng-repeat=\"(key, collection) in collections\" data-collection=\"(~ key ~)\" ng-class=\"{ highlighted: filter.collection == key }\">\r" +
    "\n" +
    "                    <span class=\"title\" ng-click=\"filterByCollection($event, key)\">(~ collection.label ~)</span>\r" +
    "\n" +
    "                    <a class=\"info\" ng-click=\"showEditCollectionForm($event, collection.label, key)\">Edit</a>\r" +
    "\n" +
    "                </li>\r" +
    "\n" +
    "\t\t\t</ul>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<div id=\"library-content-left\"></div>\r" +
    "\n" +
    "\t\t<div id=\"library-content-right\"></div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('loading.html',
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"page-loading\" class=\"page section\" ng-controller=\"LoadingController\">\r" +
    "\n" +
    "\t<div class=\"inner\">\r" +
    "\n" +
    "\t\t<h1>One moment please...</h1>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('login.html',
    "\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"page-login\" class=\"page section\" ng-controller=\"LoginController\" autocomplete=\"off\">\r" +
    "\n" +
    "\t<div class=\"inner\">\r" +
    "\n" +
    "\t\t<h1>Login</h1>\r" +
    "\n" +
    "\t\t<form ng-submit=\"login()\">\r" +
    "\n" +
    "\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t<label for=\"username\">Username</label>\r" +
    "\n" +
    "\t\t\t\t<input type=\"text\" id=\"login-username\" name=\"username\" ng-model=\"username\" autocomplete=\"off\">\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t<label for=\"password\">Password</label>\r" +
    "\n" +
    "\t\t\t\t<input type=\"password\" id=\"login-password\" name=\"password\" ng-model=\"password\" autocomplete=\"off\">\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t<button type=\"submit\" pl-progress-button>\r" +
    "\n" +
    "\t\t\t\t\t<span class=\"label\">Login</span>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"progress\"></div>\r" +
    "\n" +
    "\t\t\t\t</button>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</form>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('modal-add-to-collection.html',
    "<h2>Add videos to a collection</h2>\r" +
    "\n" +
    "<form name\"editCollectionForm\" ng-submit=\"submitAddToCollectionForm(data)\">\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<label>Select a collection:</label>\r" +
    "\n" +
    "\t\t<select class=\"actions\" ng-options=\"collection.label for collection in data.collections\" ng-model=\"data.selectedAction\" pl-toolbar-dropdown></select>\r" +
    "\n" +
    "\t\t<!-- <input type=\"text\" ng-model=\"data.name\" pl-focus-field/> -->\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<input type=\"submit\" value=\"Add to (~ data.selectedAction.title ~)\" />\r" +
    "\n" +
    "\t</div>\t\r" +
    "\n" +
    "\t<div class=\"clear\"></div>\r" +
    "\n" +
    "</form>\r" +
    "\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-change-email-address.html',
    "<h2>Change E-mail Address</h2>\r" +
    "\n" +
    "<form name\"changeEmailAddress\" ng-submit=\"saveEmailAddress(data)\">\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<label>New E-mail Address</label>\r" +
    "\n" +
    "\t\t<input type=\"text\" ng-model=\"data.email\" pl-focus-field/>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<input type=\"submit\" value=\"Save\" />\r" +
    "\n" +
    "\t</div>\t\r" +
    "\n" +
    "\t<div class=\"clear\"></div>\r" +
    "\n" +
    "</form>\r" +
    "\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-change-password.html',
    "<h2>Change Password</h2>\r" +
    "\n" +
    "<form name\"changePassword\" ng-submit=\"savePassword(data)\">\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<label>New password</label>\r" +
    "\n" +
    "\t\t<input type=\"text\" ng-model=\"data.password1\" pl-focus-field />\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<label>confirm new password</label>\r" +
    "\n" +
    "\t\t<input type=\"text\" ng-model=\"data.password2\" />\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<input type=\"submit\" value=\"Save\" />\r" +
    "\n" +
    "\t</div>\t\r" +
    "\n" +
    "\t<div class=\"clear\"></div>\r" +
    "\n" +
    "</form>\r" +
    "\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>\r" +
    "\n"
  );


  $templateCache.put('modal-change-username.html',
    "<h2>Change Username</h2>\r" +
    "\n" +
    "<form name\"changeUsername\" ng-submit=\"saveUsername(data)\">\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<label>New Username</label>\r" +
    "\n" +
    "\t\t<input type=\"text\" ng-model=\"data.username\" pl-focus-field/>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<input type=\"submit\" value=\"Save\" />\r" +
    "\n" +
    "\t</div>\t\r" +
    "\n" +
    "\t<div class=\"clear\"></div>\r" +
    "\n" +
    "</form>\r" +
    "\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-edit-collection.html',
    "<h2>Edit Collection</h2>\r" +
    "\n" +
    "<form name\"editCollectionForm\" ng-submit=\"submitEditCollectionForm(data)\">\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<label>Collection Name: \r" +
    "\n" +
    "\t\t\t<span><a ng-click=\"deleteCollection($event, data)\">Delete Collection</a></span>\r" +
    "\n" +
    "\t\t</label>\r" +
    "\n" +
    "\t\t<input type=\"text\" ng-model=\"data.name\" pl-focus-field/>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<input type=\"submit\" value=\"Save\" />\r" +
    "\n" +
    "\t</div>\t\r" +
    "\n" +
    "\t<div class=\"clear\"></div>\r" +
    "\n" +
    "</form>\r" +
    "\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-new-collection.html',
    "<h2>New Collection</h2>\r" +
    "\n" +
    "<form name\"newCollectionForm\" ng-submit=\"submitNewCollectionForm(data)\">\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<label>Collection Name:</label>\r" +
    "\n" +
    "\t\t<input type=\"text\" ng-model=\"data.name\" pl-focus-field />\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<input type=\"submit\" value=\"save\" />\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"clear\"></div>\r" +
    "\n" +
    "</form>\r" +
    "\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-show-all-collections.html',
    "<h2>Edit Collections</h2>\r" +
    "\n" +
    "<form name\"editCollectionForm\" ng-submit=\"closeModal($event)\">\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<label>Collections featuring (~ data.video.title ~):</label>\r" +
    "\n" +
    "\t\t<ul class=\"collection-list\">\r" +
    "\n" +
    "\t\t\t<li ng-repeat=\"collection in data.video.collections\">\r" +
    "\n" +
    "\t\t\t\t(~ collections[collection].label ~) <span>( <a ng-click=\"removeFromCollection($event, data.id, collection)\">Remove</a> )</span>\r" +
    "\n" +
    "\t\t\t</li>\r" +
    "\n" +
    "\t\t</ul>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"row\">\r" +
    "\n" +
    "\t\t<input type=\"submit\" value=\"Save\" />\r" +
    "\n" +
    "\t</div>\t\r" +
    "\n" +
    "\t<div class=\"clear\"></div>\r" +
    "\n" +
    "</form>\r" +
    "\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('modal-show-categories.html',
    "<h2>Choose a category</h2>\r" +
    "\n" +
    "<div id=\"category-list\">\r" +
    "\n" +
    "\t<ul ng-repeat=\"category in categories\">\r" +
    "\n" +
    "\t\t<li class=\"heading f-serif\">(~ category.name ~)</li>\r" +
    "\n" +
    "\t\t<li ng-repeat=\"subcategory in category.sub_categories\" data-id=\"(~ subcategory.id ~)\" ng-click=\"chooseCategory($event)\" class=\"category\">(~ subcategory.name ~)</li>\r" +
    "\n" +
    "\t</ul>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>"
  );


  $templateCache.put('upload.html',
    "<!-- <div class=\"section\">\r" +
    "\n" +
    "  <ul id=\"breadcrumb\" class=\"inner\">\r" +
    "\n" +
    "    <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\r" +
    "\n" +
    "    <li><span class=\"divider\">/</span> <span>Upload</span></li>\r" +
    "\n" +
    "   </ul>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    " -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div id=\"page-upload\" class=\"section\" ng-controller=\"UploadController\">\r" +
    "\n" +
    "\t<div class=\"inner\">\r" +
    "\n" +
    "\t\t<!-- <h1>Upload your content to Romeo</h1> -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<div class=\"inner centered\">\r" +
    "\n" +
    "\t\t\t<!-- <div class=\"avatar\"><img src=\"/static/assets/img/tom.jpg\" width=\"64\" alt=\"\" /></div> -->\r" +
    "\n" +
    "\t\t\t<div id=\"upload-draft-status\" class=\"f-serif\">\r" +
    "\n" +
    "\t\t\t\t<span>\r" +
    "\n" +
    "\t\t\t\t\tAutosaved: 5 Mins Ago.\r" +
    "\n" +
    "\t\t\t\t</span>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<form id=\"upload-form\" ng-submit=\"saveMetaData($event)\">\r" +
    "\n" +
    "\t\t\t\t<div id=\"upload-dropzone\" class=\"pl-upload-dropzone\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"message f-serif\">\r" +
    "\n" +
    "\t\t\t\t\t\t<span class=\"upper\">Drag &amp; drop your video here</span>\r" +
    "\n" +
    "\t\t\t\t\t\t<span class=\"icon-drag\"></span>\r" +
    "\n" +
    "\t\t\t\t\t\t<span class=\"lower\">or choose a video from <span class=\"highlight\">your computer</span></span>\t\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"file\" id=\"file-input\" onchange=\"angular.element(this).scope().fileSelected()\">\r" +
    "\n" +
    "\t\t\t\t\t<div id=\"thumbnail\"></div>\r" +
    "\n" +
    "\t\t\t\t\t<div id=\"upload-status\">\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"prompt show\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<a ng-click=\"proceedUpload($event)\" class=\"proceed\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\tUpload\r" +
    "\n" +
    "\t\t\t\t\t\t\t</a>\r" +
    "\n" +
    "\t\t\t\t\t\t\t<a ng-click=\"proceedUpload($event)\" class=\"cancel\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t\tCancel\r" +
    "\n" +
    "\t\t\t\t\t\t\t</a>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t\t<div class=\"progress\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<div class=\"bar\"></div>\r" +
    "\n" +
    "\t\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"row\" id=\"title-row\">\r" +
    "\n" +
    "\t\t\t\t\t<pre id=\"upload-title\" type=\"text\" placeholder=\"Video Title\" pl-content-editable-placeholder pl-focus-field contenteditable></pre>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"row\" id=\"upload-buttons\">\r" +
    "\n" +
    "\t\t\t\t\t<a href=\"#\"></a>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"row f-serif\" id=\"description-row\">\r" +
    "\n" +
    "\t\t\t\t\t<pre id=\"upload-description\" placeholder=\"Add a description.  This is going to be your space to share insights into your video - blogs, recipes, ideas and more.\" pl-content-editable-placeholder contenteditable></pre>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"row\" id=\"category-row\">\r" +
    "\n" +
    "\t\t\t\t\t<a id=\"category-chooser\" ng-click=\"showCategories()\" class=\"f-sans\">(~ chosenCategory.label || 'Choose a category...' ~)<span class=\"icon-select\"></span></a>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "<!-- \t\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"submit\" value=\"Save\">\r" +
    "\n" +
    "\t\t\t\t</div> -->\r" +
    "\n" +
    "\t\t\t</form>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t\r" +
    "\n" +
    "\t\t<!-- STAGE ONE -->\r" +
    "\n" +
    "<!-- \t\t<div class=\"inner centered\" ng-if=\"fileDropped == false\">\r" +
    "\n" +
    "\t\t\t<div id=\"upload-dropzone\" class=\"pl-upload-dropzone\">\r" +
    "\n" +
    "\t\t\t\t<label>\r" +
    "\n" +
    "\t\t\t\t\tChoose your files below to upload them.<br/>\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"file\" onchange=\"angular.element(this).scope().fileNameChanged()\">\r" +
    "\n" +
    "\t\t\t\t</label>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div> -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<div class=\"inner\" ng-if=\"fileDropped == true\">\r" +
    "\n" +
    "\t\t\t<div id=\"upload-progress-wrapper\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"bar\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"progress\"></div>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"percentage\">Uploading...</div>\r" +
    "\n" +
    "\t\t\t</div><!--\r" +
    "\n" +
    "\t\t\t--><div id=\"upload-info-wrapper\">\r" +
    "\n" +
    "\t\t\t\t<h2>Tell us about your content...</h2>\r" +
    "\n" +
    "\t\t\t\t<form ng-submit=\"createVideo(data)\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label>Video Title</label>\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"newVideo.title\" pl-focus-field>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label>Video Description</label>\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" ng-model=\"newVideo.description\">\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label>Video Category</label>\r" +
    "\n" +
    "\t\t\t\t\t\t<select ng-model=\"newVideo.category\">\r" +
    "\n" +
    "\t\t\t\t            <option value=\"\" default=\"\" selected=\"\"></option>\r" +
    "\n" +
    "\t\t\t\t            \r" +
    "\n" +
    "\t\t\t\t            <optgroup label=\"Food\">\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"11\">Chefs &amp; Recipes</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"12\">Wine &amp; Drink</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"113\">Healthy Eats</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"10\">Baking</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t            </optgroup>\r" +
    "\n" +
    "\t\t\t\t            \r" +
    "\n" +
    "\t\t\t\t            <optgroup label=\"Culture\">\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"114\">Men's Fashion</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"56\">Fashion</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"51\">The Arts</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"54\">LIterature</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"50\">Culture Shock</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"112\">Filmmakers</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"52\">Architecture &amp; Design</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"102\">Galleries</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"105\">Nature &amp; Science</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"53\">News Stand</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t            </optgroup>\r" +
    "\n" +
    "\t\t\t\t            \r" +
    "\n" +
    "\t\t\t\t            <optgroup label=\"Mind\">\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"60\">Inspirational</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"64\">Life Skills</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"63\">Causes</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"61\">Education</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"110\">Technology</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"65\">Business</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"108\">Travel &amp; Adventure</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t            </optgroup>\r" +
    "\n" +
    "\t\t\t\t            \r" +
    "\n" +
    "\t\t\t\t            <optgroup label=\"Entertainment\">\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"106\">Animation &amp; Shorts</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"41\">Interviews</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"42\">Classic Clips</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"43\">Vintage Videos</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"44\">Music</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t            </optgroup>\r" +
    "\n" +
    "\t\t\t\t            \r" +
    "\n" +
    "\t\t\t\t            <optgroup label=\"Wellness\">\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"23\">Beauty</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"21\">Fitness</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"20\">Wellness</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"22\">Yoga &amp; Meditation</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t            </optgroup>\r" +
    "\n" +
    "\t\t\t\t            \r" +
    "\n" +
    "\t\t\t\t            <optgroup label=\"Home &amp; Family\">\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"33\">How-To</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"104\">Environment</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"30\">Homes &amp; Gardens</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t                <option value=\"31\">i-Nanny</option>\r" +
    "\n" +
    "\t\t\t\t              \r" +
    "\n" +
    "\t\t\t\t            </optgroup>\r" +
    "\n" +
    "\t\t\t\t          </select>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label>Add your video to a collection</label>\r" +
    "\n" +
    "\t\t\t\t\t\t<select class=\"actions\" ng-options=\"collection.label for collection in collections\" ng-model=\"newVideo.collections\"></select>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"submit\" value=\"Publish\">\t\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</form>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t\t<!-- END OF STAGE TWO -->\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('video-list-grid.html',
    "<ul id=\"video-list-grid\" class=\"library\" ng-class=\"{ loading: loading }\">\r" +
    "\n" +
    "    <li pl-draggable draggable=\"true\" ng-repeat=\"(key, video) in filter.results\" class=\"row\" data-id=\"(~ key ~)\" style=\"background: transparent url((~ video.thumbnail ~)) center center no-repeat; background-size: 100% auto;\">\r" +
    "\n" +
    "        <div class=\"content\">\r" +
    "\n" +
    "            <span class=\"title\">(~ video.title ~)</span>\r" +
    "\n" +
    "            <span class=\"number-of-collections\" ng-click=\"showAllCollections($event,key)\">( in <span ng-class=\"{ active: video.collections.length > 0}\">(~ video.collections.length ~) collections</span> )</span>\r" +
    "\n" +
    "            <a href=\"/#/video/(~ key ~)\" class=\"button edit\"><span class=\"icon-info\"></span></a>\r" +
    "\n" +
    "            <a href=\"/#/analytics/(~ key ~)/overview\" class=\"button analytics\" title=\"View analytics for this video\"><span title=\"View analytics for this video\" class=\"icon-pie\"></span></a>\r" +
    "\n" +
    "            <div data-id=\"(~ key ~)\" class=\"pl-checkbox\"></div>                     \r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "</ul>"
  );


  $templateCache.put('video-list-list.html',
    "<ul id=\"video-list-list\" class=\"library\" ng-class=\"{ loading: loading }\">\r" +
    "\n" +
    "    <li ng-repeat=\"(key, video) in filter.results\" class=\"row\" data-id=\"(~ key ~)\">\r" +
    "\n" +
    "        <span class=\"title\"><a href=\"/#/video/(~ key ~)\">(~ video.title ~)</a></span>\r" +
    "\n" +
    "        <span class=\"number-of-collections\" ng-click=\"showAllCollections($event,key)\">( in <span ng-class=\"{ active: video.collections.length > 0}\">(~ video.collections.length ~) collections</span> )</span>\r" +
    "\n" +
    "        <a href=\"/#/video/(~ key ~)\" class=\"button edit\"><span class=\"icon-info\"></span></a>\r" +
    "\n" +
    "        <a href=\"/#/analytics/(~ key ~)/overview\" class=\"button analytics\" title=\"View analytics for this video\"><span title=\"View analytics for this video\" class=\"icon-pie\"></span></a>\r" +
    "\n" +
    "        <div data-id=\"(~ key ~)\" class=\"pl-checkbox\"></div>                     \r" +
    "\n" +
    "    </li>\r" +
    "\n" +
    "</ul>"
  );


  $templateCache.put('video.html',
    "<!-- <div class=\"section\">\r" +
    "\n" +
    "  <ul id=\"breadcrumb\" class=\"inner\">\r" +
    "\n" +
    "    <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\r" +
    "\n" +
    "    <li><span class=\"divider\">/</span> <a href=\"/#/library\">Library</a></li>\r" +
    "\n" +
    "    <li><span class=\"divider\">/</span> <span>(~ $rootScope.pagetitle ~)</span></li>\r" +
    "\n" +
    "   </ul>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    " -->\r" +
    "\n" +
    "<div id=\"page-video-single\" class=\"section\" ng-controller=\"VideoController\">\r" +
    "\n" +
    "\t<div class=\"inner\">\r" +
    "\n" +
    "\t\t<h1>(~ video.title ~)</h1>\r" +
    "\n" +
    "\t\t\r" +
    "\n" +
    "\t\t<div class=\"inner half-width left\">\r" +
    "\n" +
    "\t\t\t<h3>Edit your video details</h3>\r" +
    "\n" +
    "\t\t\t<form action=\"#\">\r" +
    "\n" +
    "\t\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t\t<label>Video Title</label>\r" +
    "\n" +
    "\t\t\t\t\t<input type=\"text\" ng-model=\"video.title\" />\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t\t<label>Video Description</label>\r" +
    "\n" +
    "\t\t\t\t\t<textarea name=\"\" id=\"\" ng-model=\"video.description\"></textarea>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t<div class=\"row half-width left\"><label>Mood</label><input type=\"text\" placeholder=\"Intrigued\" /></div><!--\r" +
    "\n" +
    "\t\t\t\t--><div class=\"row half-width\"><label>Click to more link</label><input type=\"text\" placeholder=\"www.google.com\"/></div>\r" +
    "\n" +
    "\t\t\t\t<!-- <div class=\"row\"><label>Video</label><input type=\"text\" /></div> -->\r" +
    "\n" +
    "\t\t\t\t<div class=\"row half-width left\">\r" +
    "\n" +
    "\t\t\t\t\t<label>Video Thumbnail</label>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"thumbnail-picker\">\r" +
    "\n" +
    "\t\t\t\t\t\t<span class=\"icon-pictures\"></span>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</div><!--\r" +
    "\n" +
    "\t\t\t\t--><div class=\"row half-width\">\r" +
    "\n" +
    "\t\t\t\t\t<label>Meta data</label><input class=\"margin-bottom\" type=\"text\"/>\r" +
    "\n" +
    "\t\t\t\t\t<label>Content data</label><input type=\"text\"/>\r" +
    "\n" +
    "\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t</form>\r" +
    "\n" +
    "\t\t</div><!--\r" +
    "\n" +
    "\t\t--><div class=\"inner half-width right\" style=\"padding-top: 57px;\">\r" +
    "\n" +
    "\t\t\t<div class=\"wonder-embed\">\r" +
    "\n" +
    "\t\t\t\t<iframe src=\"http://wonderpl.com/embed/viwAdAYl4is9rfPwmRE39MXA/\" width=\"100%\" height=\"100%\" frameborder=\"0\" allowfullscreen></iframe>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t\t<div id=\"customize-player\">\r" +
    "\n" +
    "\t\t\t\t<form action=\"\">\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t\t\t<label>Embed Link</label>\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- <input type=\"text\" value=\"wonderpl.com/embed/vieasdasdads\"> -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t\t<!-- <iframe src=\"//player.vimeo.com/video/88737187?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=c9ff23\" width=\"443\" height=\"197\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href=\"http://vimeo.com/88737187\">Made in Tohoku</a> from <a href=\"http://vimeo.com/theinouebrothers\">The Inoue Brothers</a> on <a href=\"https://vimeo.com\">Vimeo</a>.</p> -->\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" value=\"<iframe src=&quot;(( embedurl ))&quot; width=&quot;100%&quot; height=&quot;100%&quot; frameborder=&quot;0&quot; allowfullscreen></iframe>\" />\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t\t<div class=\"row\">\r" +
    "\n" +
    "\t\t\t\t\t\t<input type=\"text\" placeholder=\"Width\" class=\"dimension\" /><input type=\"text\" placeholder=\"Height\" class=\"dimension height\" />\r" +
    "\n" +
    "\t\t\t\t\t\t<span class=\"padding top\">\r" +
    "\n" +
    "\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"inline-block margin-right\" /><label class=\"inline-block\">Maintain aspect-ratio?</label>\t\r" +
    "\n" +
    "\t\t\t\t\t\t</span>\r" +
    "\n" +
    "\t\t\t\t\t</div>\r" +
    "\n" +
    "\t\t\t\t</form>\r" +
    "\n" +
    "\t\t\t</div>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "\t\t<div id=\"top-right-links\">\r" +
    "\n" +
    "\t\t\t<ul>\r" +
    "\n" +
    "\t\t\t\t<!-- <li><a href=\"#\"></a></li> -->\r" +
    "\n" +
    "\t\t\t\t<!-- <li><a href=\"/#/tools/(~ video.id ~)\"><span class=\"icon-tools\"></span>Monetization Tools</a></li> -->\r" +
    "\n" +
    "\t\t\t\t<li><a href=\"/#/analytics/(~ video.id ~)\"><span class=\"icon-graph\"></span>View Analytics</a></li>\r" +
    "\n" +
    "\t\t\t</ul>\r" +
    "\n" +
    "\t\t</div>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );
} ]);