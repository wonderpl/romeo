angular.module('RomeoApp').run(['$templateCache', function($templateCache) {   'use strict';

  $templateCache.put('account.html',
    "<div id=\"page-account\" class=\"section\" ng-controller=\"AccountCtrl\">\n" +
    "\n" +
    "    <div id=\"edit-profile-cover-image\" style=\"background-image: url((~ User.profile_cover ~));\">\n" +
    "        <div class=\"edit-background\" ng-class=\"{ show: isEditable }\"></div>\n" +
    "        <span class=\"upload-target\" ng-show=\"isEditable && !coverImageUploading\"></span>\n" +
    "        <span class=\"account-upload-spinner\" ng-show=\"coverImageUploading\"></span>\n" +
    "        <input type=\"file\" id=\"edit-profile-cover-image-choose-background\" ng-file-select=\"coverImageSelected($files)\" ng-show=\"isEditable\" />\n" +
    "\n" +
    "        <div id=\"edit-profile-avatar\" style=\"background-image: url((~ User.avatar ~));\">\n" +
    "            <div class=\"edit-background\" ng-class=\"{ show: isEditable }\"></div>\n" +
    "            <span class=\"upload-target\" ng-show=\"isEditable && !avatarUploading\"></span>\n" +
    "            <span class=\"account-upload-spinner\" ng-show=\"avatarUploading\"></span>\n" +
    "            <input type=\"file\" id=\"edit-profile-avatar-choose-avatar\" ng-file-select=\"avatarImageSelected($files)\" ng-show=\"isEditable\" />\n" +
    "        </div>\n" +
    "        <a ng-click=\"toggleEditable()\" ng-class=\"{ active: isEditable }\" class=\"wp-button\" id=\"toggle-editable-button\">(~ isEditable ? \"Stop Editing\" : \"Edit Profile\" ~)</a>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- <div class=\"background\" style=\"background-image: url((~ User.profile_cover ~));\">\n" +
    "        <div ng-if=\"isEditable\" class=\"edit-text\"><input id=\"profile-picker\" type=\"file\" class=\"hidden-input\"/></div>\n" +
    "    </div> -->\n" +
    "\n" +
    "<!--     <div class=\"avatar\" style=\"background-image: url((~ User.avatar ~));\">\n" +
    "        <div ng-if=\"isEditable\" class=\"avatar-change\">\n" +
    "            <label for=\"avatar-picker\" class=\"icon-export\">&nbsp;</label>\n" +
    "            <input id=\"avatar-picker\" type=\"file\" class=\"hidden-input\" />\n" +
    "        </div>\n" +
    "    </div> -->\n" +
    "    <!-- <div ng-if=\"isLoggedIn\" class=\"edit-icons\">\n" +
    "\n" +
    "    </div> -->\n" +
    "    <div class=\"inner\" id=\"edit-profile-details\">\n" +
    "        <div class=\"row\">\n" +
    "            <input type=\"text\" id=\"edit-profile-name\" ng-model=\"User.display_name\" data-model=\"display_name\" placeholder=\"Your Full Name\" ng-class=\"{ disabled: !isEditable }\" auto-save-field disable-new-lines />\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <input type=\"text\" id=\"edit-profile-username\" class=\"disabled\" value=\"@(~ User.name ~)\" data-model=\"name\" placeholder=\"Your Username\" auto-save-field disable-new-lines />\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <textarea type=\"text\" id=\"edit-profile-description\" ng-model=\"User.description\" data-model=\"description\" placeholder=\"Describe yourself in a few words\" ng-class=\"{ disabled: !isEditable }\" auto-save-field disable-new-lines></textarea\n" +
    "        </div>\n" +
    "\n" +
    "        <!--<div class=\"row\">\n" +
    "            <pre id=\"edit-profile-name\" ng-class=\"{ disabled: !isEditable }\" placeholder=\"Your Full Name\" ng-paste=\"cleanPaste($event)\" data-model=\"display_name\" pl-content-editable-placeholder contenteditable auto-save-field disableNewLines>(~ User.display_name ~)</pre>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <pre id=\"edit-profile-username\" ng-class=\"{ disabled: !isEditable }\" placeholder=\"Your Username\" ng-paste=\"cleanPaste($event)\" data-model=\"name\" pl-content-editable-placeholder contenteditable auto-save-field disableNewLines>(~ User.name ~)</pre>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <pre id=\"edit-profile-description\" ng-class=\"{ disabled: !isEditable }\" placeholder=\"Describe yourself in a few words\" ng-paste=\"cleanPaste($event)\" data-model=\"description\" pl-content-editable-placeholder contenteditable auto-save-field disableNewLines>(~ User.description ~)</pre>\n" +
    "        </div>-->\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('analytics.html',
    "<!-- <div class=\"section\">\n" +
    "    <ul id=\"breadcrumb\" class=\"inner\">\n" +
    "        <li class=\"home\"><a href=\"/#/\" class=\"icon-home\"></a></li>\n" +
    "        <li><span class=\"divider\">/</span><span>Stats</span></li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    " -->\n" +
    "<div id=\"page-stats\" class=\"section\" ng-controller=\"AnalyticsCtrl\">\n" +
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
    "<div id=\"page-dashboard\" class=\"section\" ng-controller=\"DashboardCtrl\">\n" +
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
    "<div id=\"page-collections\" class=\"section\" ng-controller=\"LibraryCtrl\">\n" +
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
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"clear\"></div>\n" +
    "\t\t\t</div>\n" +
    "\n" +
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
    "<div id=\"page-loading\" class=\"page section\" ng-controller=\"LoadingCtrl\">\n" +
    "\t<div class=\"inner\">\n" +
    "\t\t<h1>One moment please...</h1>\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('login.html',
    "\n" +
    "\n" +
    "<div id=\"page-login\" class=\"page section\" ng-controller=\"LoginCtrl\" autocomplete=\"off\">\n" +
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


  $templateCache.put('manage.html',
    "<div id=\"page-manage\" class=\"section\" ng-controller=\"ManageCtrl\">\n" +
    "\n" +
    "    <div class=\"inner\">\n" +
    "\n" +
    "\t\t<div id=\"manage-top\">\n" +
    "\t\t\t<div id=\"manage-top-left\">\n" +
    "\t\t\t\t<h2>All Videos &raquo; <span class=\"highlighted\">(~ currentFilter.name ~)</span></h2>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div id=\"manage-top-right\" class=\"icon-search\">\n" +
    "\t\t\t\t<input type=\"text\" id=\"manage-search-videos\" placeholder=\"Search\" ng-model=\"searchText\" />\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"clear\"></div>\n" +
    "\t\t</div><!-- end of top section -->\n" +
    "\n" +
    "\t\t<div id=\"manage-body\">\n" +
    "\t\t\t<div id=\"manage-left\">\n" +
    "\t\t\t\t<h3>Manage</h3>\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li><a ng-click=\"changeFilter('none')\" ng-class=\"{ highlighted: currentFilter.slug == 'none' }\">All videos</a></li>\n" +
    "\t\t\t\t\t<li><a ng-click=\"changeFilter('uploads')\" ng-class=\"{ highlighted: currentFilter.slug == 'uploads' }\">Uploads in progress</a></li>\n" +
    "\t\t\t\t\t<li><a ng-click=\"changeFilter('recent')\" ng-class=\"{ highlighted: currentFilter.slug == 'recent' }\">Recently added videos</a></li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t\t<h3>Collections not visible in app</h3>\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li ng-repeat=\"tag in Tags | filter: { public: false }\"><a href=\"/#/manage/collection/(~ tag.id ~)\">(~ tag.label ~)</a></li>\n" +
    "\t\t\t\t\t<li><a ng-click=\"showAddNewCollectionForm(false)\" class=\"highlighted\">Create a private collection</a></li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t\t<h3>Collections visible in app</h3>\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li ng-repeat=\"tag in Tags | filter: { public: true }\"><a href=\"/#/manage/collection/(~ tag.id ~)\">(~ tag.label ~)</a></li>\n" +
    "\t\t\t\t\t<li><a ng-click=\"showAddNewCollectionForm(true)\"class=\"highlighted\">Create a public collection</a></li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div><!-- end of manage body left section -->\n" +
    "\t\t\t<div id=\"manage-right\" ng-class=\"{ loading: isEmpty(Videos) }\">\n" +
    "\t\t\t\t<div id=\"manage-toolbar\"></div>\n" +
    "\t\t\t\t<div id=\"manage-search-results\">\n" +
    "\t\t\t\t\t<ul>\n" +
    "\t\t\t\t\t\t<li ng-repeat=\"video in Videos | filter: { title: searchText }\" pl-draggable draggable=\"true\">\n" +
    "\t\t\t\t\t\t\t<a class=\"title\">(~ video.title | elipsis:20 ~)</a>\n" +
    "\t\t\t\t\t\t\t<div class=\"frame\" style=\"background: black url((~ video.thumbnails.items[0].url ~)) center center no-repeat; background-size: cover;\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"actions\">\n" +
    "\t\t\t\t\t\t\t\t\t<a ng-click=\"showAddToCollectionForm(video.id)\">Add to a collection</a>\n" +
    "\t\t\t\t\t\t\t\t\t<a href=\"/#/analytics/(~ video.id ~)/overview\">Show me analytics</a>\n" +
    "\t\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t</ul>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"clear\"></div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('modal-add-to-collection.html',
    "<h2>Add videos to a collection</h2>\n" +
    "<div class=\"modal-content\">\n" +
    "\t<form name\"addToCollectionForm\" ng-submit=\"submitAddToCollectionForm(data)\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<label>Select a collection:</label>\n" +
    "\t\t\t<select class=\"actions\" ng-options=\"tag.label for tag in data.tags\" ng-model=\"data.chosenTag\" pl-toolbar-dropdown></select>\n" +
    "\t\t\t<!-- <input type=\"text\" ng-model=\"data.name\" pl-focus-field/> -->\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<input type=\"submit\" value=\"Add to collection\" />\n" +
    "\t\t</div>\t\n" +
    "\t\t<div class=\"clear\"></div>\n" +
    "\t</form>\n" +
    "\t<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>\n" +
    "</div>"
  );


  $templateCache.put('modal-change-email-address.html',
    "<h2>Change E-mail Address</h2>\n" +
    "<div class=\"modal-content\">\n" +
    "\t<form name\"changeEmailAddress\" ng-submit=\"saveEmailAddress(data)\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<label>New E-mail Address</label>\n" +
    "\t\t\t<input type=\"text\" ng-model=\"data.email\" pl-focus-field/>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<input type=\"submit\" value=\"Save\" />\n" +
    "\t\t</div>\t\n" +
    "\t\t<div class=\"clear\"></div>\n" +
    "\t</form>\n" +
    "\t<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>\n" +
    "</div>"
  );


  $templateCache.put('modal-change-password.html',
    "<h2>Change Password</h2>\n" +
    "<div class=\"modal-content\">\n" +
    "\t<form name\"changePassword\" ng-submit=\"savePassword(data)\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<label>New password</label>\n" +
    "\t\t\t<input type=\"text\" ng-model=\"data.password1\" pl-focus-field />\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<label>confirm new password</label>\n" +
    "\t\t\t<input type=\"text\" ng-model=\"data.password2\" />\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<input type=\"submit\" value=\"Save\" />\n" +
    "\t\t</div>\t\n" +
    "\t\t<div class=\"clear\"></div>\n" +
    "\t</form>\n" +
    "\t<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>\n" +
    "</div>"
  );


  $templateCache.put('modal-change-username.html',
    "<h2>Change Username</h2>\n" +
    "<div class=\"modal-content\">\n" +
    "\t<form name\"changeUsername\" ng-submit=\"saveUsername(data)\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<label>New Username</label>\n" +
    "\t\t\t<input type=\"text\" ng-model=\"data.username\" pl-focus-field/>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<input type=\"submit\" value=\"Save\" />\n" +
    "\t\t</div>\t\n" +
    "\t\t<div class=\"clear\"></div>\n" +
    "\t</form>\n" +
    "\t<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>\n" +
    "</div>"
  );


  $templateCache.put('modal-edit-collection.html',
    "<h2>Edit Collection</h2>\n" +
    "<div class=\"modal-content\">\n" +
    "\t<form name\"editCollectionForm\" ng-submit=\"submitEditCollectionForm(data)\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<label>Collection Name: \n" +
    "\t\t\t\t<span><a ng-click=\"deleteCollection($event, data)\">Delete Collection</a></span>\n" +
    "\t\t\t</label>\n" +
    "\t\t\t<input type=\"text\" ng-model=\"data.name\" pl-focus-field/>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<input type=\"submit\" value=\"Save\" />\n" +
    "\t\t</div>\t\n" +
    "\t\t<div class=\"clear\"></div>\n" +
    "\t</form>\n" +
    "\t<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>\n" +
    "</div>"
  );


  $templateCache.put('modal-new-collection.html',
    "<h2>Create New Collection</h2>\n" +
    "<div class=\"modal-content\">\n" +
    "\t<form name\"newCollectionForm\" ng-submit=\"submitAddNewCollectionForm(data)\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<!-- <label>Collection Name:</label> -->\n" +
    "\t\t\t<input type=\"text\" ng-model=\"data.label\" pl-focus-field placeholder=\"Collections Name\"/>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<!-- <label>Collection Description:</label> -->\n" +
    "\t\t\t<input type=\"text\" ng-model=\"data.description\" placeholder=\"Collection Description\"/>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<input type=\"submit\" value=\"save\" />\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"clear\"></div>\n" +
    "\t</form>\n" +
    "\t<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>\n" +
    "</div>"
  );


  $templateCache.put('modal-preview-image-picker.html',
    "<h2>Pick a thumbnail</h2>\n" +
    "<div class=\"modal-content\">\n" +
    "\t<div class=\"preview-image-frame\" style=\"background: transparent url((~ previewImages[previewIndex].url ~)) center center no-repeat; background-size: cover;\" ng-click=\"previewImageChosen()\"></div>\n" +
    "\t<div class=\"preview-image-controls f-sans\">\n" +
    "\t\t<p>Frame: (~ previewIndex+1 ~) / (~ previewImages.length ~)</p>\n" +
    "\t\t<a class=\"left\" ng-click=\"previewImageNav('left')\">&lt;</a><!--\n" +
    "\t\t--><a class=\"right\" ng-click=\"previewImageNav('right')\">&gt;</a>\n" +
    "\t</div>\n" +
    "\t<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>\n" +
    "</div>"
  );


  $templateCache.put('modal-show-all-collections.html',
    "<h2>Edit Collections</h2>\n" +
    "<div class=\"modal-content\">\n" +
    "\t<form name\"editCollectionForm\" ng-submit=\"closeModal($event)\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<label>Collections featuring (~ data.video.title ~):</label>\n" +
    "\t\t\t<ul class=\"collection-list\">\n" +
    "\t\t\t\t<li ng-repeat=\"collection in data.video.collections\">\n" +
    "\t\t\t\t\t(~ collections[collection].label ~) <span>( <a ng-click=\"removeFromCollection($event, data.id, collection)\">Remove</a> )</span>\n" +
    "\t\t\t\t</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<input type=\"submit\" value=\"Save\" />\n" +
    "\t\t</div>\t\n" +
    "\t\t<div class=\"clear\"></div>\n" +
    "\t</form>\n" +
    "\t<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>\n" +
    "</div>"
  );


  $templateCache.put('modal-show-categories.html',
    "<h2>Select a category</h2>\n" +
    "<div class=\"modal-content\">\n" +
    "\t<div id=\"category-list\">\n" +
    "\t\t<ul ng-repeat=\"category in categories\">\n" +
    "\t\t\t<li class=\"heading f-sans\">(~ category.name ~)</li>\n" +
    "\t\t\t<li ng-repeat=\"subcategory in category.sub_categories\" data-id=\"(~ subcategory.id ~)\" ng-click=\"chooseCategory($event)\" class=\"category\">(~ subcategory.name ~)</li>\n" +
    "\t\t</ul>\n" +
    "\t</div>\n" +
    "\t<a class=\"icon-cross close-modal\" ng-click=\"closeModal()\"></a>\n" +
    "</div>"
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
    "\t\t\t\t<button>(~ file.upload.progress <= 50 ? 'Send ( when video is ready )' : 'Send' ~) </button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>"
  );


  $templateCache.put('upload.html',
    "\n" +
    "<div id=\"page-upload\" class=\"section\" ng-controller=\"UploadCtrl\">\n" +
    "\t<div class=\"inner\">\n" +
    "\t\t<quick-share></quick-share>\n" +
    "\t\t<div class=\"inner centered\">\n" +
    "\t\t\t<!-- <div class=\"avatar\"><img src=\"/static/assets/img/tom.jpg\" width=\"64\" alt=\"\" /></div> -->\n" +
    "\t\t\t<div id=\"upload-draft-status\" class=\"f-serif\">\n" +
    "\t\t\t\t<span>\n" +
    "\t\t\t\t\t(~ status.saved != null ? 'Saved: ' + status.saved : 'Tip: Did you know that you can add your own logo to our player?' ~)\n" +
    "\t\t\t\t</span>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<form id=\"upload-form\" ng-submit=\"saveMetaData($event)\">\n" +
    "\t\t\t\t<div class=\"row\" id=\"title-row\">\n" +
    "\t\t\t\t\t<pre id=\"upload-title\" type=\"text\" ng-paste=\"cleanPaste($event)\" placeholder=\"Video Title\" data-model=\"title\" pl-content-editable-placeholder pl-focus-field contenteditable auto-save-field></pre>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div id=\"upload-dropzone\" class=\"pl-upload-dropzone\" ng-class=\"{ dashedborder : file.state == 'empty' }\">\n" +
    "\n" +
    "\t\t\t\t\t<div class=\"backgrounds\">\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state == 'uploading' || file.state == 'complete'\" class=\"thumbnail-background\"></div>\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state != 'empty' && file.thumbnail == null\" class=\"confirm-background\"></div>\n" +
    "\t\t\t\t\t\t<div class=\"chosen-background\" ng-show=\"chosenPreviewImage != null\" style=\"background: black url((~ chosenPreviewImage ~)) center center no-repeat; background-size: cover;\"></div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t<div class=\"dialogs\">\n" +
    "\n" +
    "\t\t\t\t\t\t<span ng-show=\"file.state == 'empty'\" class=\"empty-upper f-sans\">Drag &amp; drop your video here</span>\n" +
    "\t\t\t\t\t\t<span ng-show=\"file.state == 'empty'\" class=\"empty-icon icon-drag\"></span>\n" +
    "\t\t\t\t\t\t<span ng-show=\"file.state == 'empty'\" class=\"empty-lower f-sans\">or choose a video from your computer</span>\n" +
    "\n" +
    "\t\t\t\t\t\t<input ng-show=\"file.state == 'empty' || file.state == 'chosen'\" type=\"file\" id=\"file-input\" ng-file-select=\"fileSelected($files)\" ng-file-drop=\"fileSelected($files)\">\n" +
    "\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state == 'chosen'\" class=\"confirm-label f-serif\">Is \"(~ file.name ~)\" correct?</div>\n" +
    "\t\t\t\t\t\t<a ng-show=\"file.state == 'chosen'\" class=\"confirm-cancel\">Choose a different file</a><!--\n" +
    "\t\t\t\t\t\t--><a ng-show=\"file.state == 'chosen'\" class=\"confirm-proceed\" ng-click=\"startUpload()\">Upload</a>\n" +
    "\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state == 'uploading'\" class=\"progress-bar\">\n" +
    "\t\t\t\t\t\t\t<div class=\"inner-wrapper\">\n" +
    "\t\t\t\t\t\t\t\t<div class=\"inner\" style=\"width: (~ file.upload.progress ~)%;\"></div>\n" +
    "\t\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state == 'uploading'\" class=\"progress-percentage f-serif\">(~ file.upload.progress | wholeNumber ~)%</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state == 'processing'\" class=\"processing-loading\"></div>\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state == 'processing'\" class=\"processing-message f-sans\">Your video has finished uploading and is now processing, this may take some time...</div>\n" +
    "\n" +
    "\t\t\t\t\t\t<a ng-show=\"file.state == 'complete'\" class=\"upload-complete icon-upload-complete\"></a>\n" +
    "\t\t\t\t\t\t<div ng-show=\"file.state == 'complete'\" class=\"upload-complete-message f-sans\">Great, your video has finished processing and is ready, now you can pick a thumbnail</div>\n" +
    "\t\t\t\t\t\t<a ng-show=\"file.state == 'complete' && file.thumbnail == null\" ng-class=\"{ enabled: file.upload.progress >= 55 }\" class=\"progress-pick-a-thumbnail\" ng-click=\"showPreviewImageChooser()\">Let's pick a thumbnail</a>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"row\" id=\"click-to-more-wrapper\">\n" +
    "\t\t\t\t\t<a class=\"wp-button\" id=\"click-to-more\" ng-click=\"toggleClickToMore()\">(~ clickToMore.text.length == 0 ? \"Add a link...\" : clickToMore.text ~)</a>\n" +
    "\t\t\t\t\t<div id=\"click-to-more-form\" ng-class=\"{ show: showClickToMore }\">\n" +
    "\t\t\t\t\t\t<div id=\"click-to-more-text\" class=\"icon-text click-to-more-row\">\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" ng-model=\"clickToMore.text\" placeholder=\"Create a custom button...\">\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div id=\"click-to-more-link\" class=\"icon-hyperlink click-to-more-row \">\n" +
    "\t\t\t\t\t\t\t<input type=\"text\" ng-model=\"clickToMore.link\" placeholder=\"http://google.com/\">\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"row f-serif\" id=\"description-row\">\n" +
    "\t\t\t\t\t<pre id=\"upload-description\" placeholder=\"Video description\" ng-paste=\"cleanPaste($event)\" data-model=\"description\" pl-content-editable-placeholder contenteditable auto-save-field></pre>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"row\" id=\"category-row\">\n" +
    "\t\t\t\t\t<a id=\"category-chooser\" ng-click=\"showCategories()\" class=\"f-sans\">(~ chosenCategory.label || 'Select a category' ~)<span>(~ chosenCategory.label != undefined ? '...' : '+' ~)</span></a>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t\t<h2>Customise your embedded player by adding your logo</h2>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div id=\"wonderplayer\" class=\"web-lite-player\" style=\"background: black url((~ chosenPreviewImage ~)) center center no-repeat; background-size: cover;\">\n" +
    "\t\t\t\t\t<div id=\"wonder-wrapper\">\n" +
    "\t\t\t\t\t\t<div id=\"wonder-loader\" class=\"youtube f-sans f-uppercase\"><span></span></div>\n" +
    "\t\t\t\t\t\t<img class=\"yt-play-button\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABHCAYAAADx2uLMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABbdJREFUeNrsXV1MW2UYfnta2gJt+Rs6wub4izNbHWD4LYUxuNiiMXHeiPHaay9MvMNr4+Kd3uzOZYkSuRhisuCFSxYEh4CQjGXRCDOKaOTH9Y+eUorv+/UrnjUttsg43zn9nuTha3t+cnifvuf93u87/V7L3t4e5Akr8iVkPbIcaUc60lq75n0Rb1PbFE1Ln1l4q6RttyETvKXtqQvd0+x/EOhYlZ8feEvv4/xYamN8v5hm/0SGz2N8G3GHtzEN1bT2b+QKch65m49xbXns+zJyCOlDNoJELvgZOY0cQX6VywGWHDzkDeR73CskDg/ylg+5OIcSpAH5EfI1acsjxS3ku8jlfARpQ36JrJH2eypYQ76KnMtFkA7kt3nGF4n8scPj8az2w/Seihd5W4pxLKDe5wS3eVYPoR5Bl7TVseI7ZHcmD3lHiqELurjtn/AQD/JX3kocPwLI09SmPGRIiqErPDzf279lvSltojuGUresamwfIUukTXRFGFlHHtIqxRACpcgWEqRW2kIYnFK4MhJiwE2CFEs7CAMHCeKSdhAnjshbloCCyFuWOCiRHiKghwibg6yt/Qnr6xuFJIiLBHGKenULC/dhePgDuHt3CuLxeCEI4hRakOJiJ2xsbMGNG1/AtWsfw9TUTEF0ex2iXp3FYgG32wUnTlTC6uofcPPmKArzCczOLphWEJvIghBSM5ouVynQy5WVX2B5+RF6y/cwMNALXu8LUhD9PAagrMwDu7u78ODBj7C09BCam70wONgHZ882SkH08hhFUaCioowF+sXF+/Dw4U9w4cJ56O/3QVNTveEFsRvxykkYq9UKlZUVKMwuxpUfmMe0tHjh4kUf1NWdNqwgRUb+SiWFUaC8POkxk5P30GuWoK2tmcWYkyefMdK/Y009YW4K2Gw21iNTVRXu3JlkvbGenk6MMb1MMAOgyLC3rIM8xm63ozBVEI2qMDHxDczPL0JXVzv09nahMB7hPcSUTymSMA6HHZxOB0Qi2zA2dhtmZubRYzrA5+sAj0fIWQeL6R8ZTQrjYAwEgjA6Og7T07PoLZ3IbiaaQLAbPqjng5ISJxuO2dzcgpGRMRRmDvr6uqG11Yse4xbiGhX475+GmchbYD/rr66uZBn/9eufwvj41+J0TCDP38AZGZTpkyihUJgF/IaGM9xDXhQqhuwUiiCRSBTC4QjU1taA39/JxBAshiRIEIu5vcKC3hCFYDAMNTXPwpUrg6ynJWgvK0aCxM0rhIoeEWY5ycBAH+tZiZ4gkiAxswmhqjH0iCAGbxdcvjzAhlBoMNIAiNvM1MuisazHj4PgdpdCf7+fDZkYbCwrbvigTh5Bo72U9FGe4fd38NHe5wz5nSJBVOMKEWdCUBbe3t6CXtFj9PkQ1XAxhISgGcNAIIQ5RQKam8/zGcMmM9x1WS8raqRMOxAIsPGpc+eeN+OcelT4WxZ5BIGy60QiAfX1Z+DSpR5oa2sxY29dFVoQ8oRgMMREaWykYQ4fS+pMDLEF2d6OQlVVOQwNvc6EoBlBk0MVOobQAwvUe6JMu0DAYkhE1KujsacCQ5iy9DBICCVIRNpBCiKRGRESJCTtIJaHbEs7iNPTl0FdLIRIkFVpB2Hwu1wNSKD4AXw1oL+QM9IeuoM0WE9N334m7aE7Pqc/2jUXf0O6pV10QRB5CjRrLtIijMPSLrrhfa6BXLdXAGRdt5fwNnJT2ujYsMltvo9Ma7/TQvxTUEA/U9AJOa39DnwHcqE1abOnhjVu49n0DdmeWqQyCn5I1rqQOFrc4rady7TxoMdIqeDIVeRbkKwOI/H/MM9teRWyFHPJFkOy4RVILocta1DlDqpBdY8n3kdWgyod2iptFTz4O+HfamzaCm32DO8VyFytTeHnsMKTVdqs/Pz5VmkjqJrj6AGvGA+mCj93lG/PVqUt9T69Mlu211G+7xYcskrbPwIMAEmT3tvASzM4AAAAAElFTkSuQmCC\"/>\n" +
    "\n" +
    "\t\t\t\t\t\t<div id=\"wonder-controls\">\n" +
    "\t\t\t\t\t\t    <a class=\"play wonder-play player-icon-play\"></a>\n" +
    "\t\t\t\t\t\t    <a class=\"pause wonder-pause player-icon-pause hidden\"></a>\n" +
    "\t\t\t\t\t\t    <a class=\"volume wonder-volume vol-3\">\n" +
    "\t\t\t\t\t\t        <img class=\"vol-1\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAoCAYAAABq13MpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGBJREFUeNrs17EJgFAMBND/HcZacC+ntLJyo5gRxEYO3sGVgVeEQGZVjbQsIzDQ0NDQ0NDQ0NDQ0Jnoq7unodfukbge55eh+eNju3XvNLTrAQ0NDQ0NDQ0NDQ39Lo8AAwCo8wyaUULIQwAAAABJRU5ErkJggg==\" />\n" +
    "\t\t\t\t\t\t        <img class=\"vol-2\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAoCAYAAABq13MpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATNJREFUeNrsmLFKA0EQhnOaQlKo4APEwkIQsRILX8BO0iZV0BfIS1ilsbC2UcFW0EJs1CdQLKxTBCs9bEzwcP2OXGBykOOu2lmYHz7YKRa+O2Z3joucc7XQslALMCZt0iZt0iZt0vPyBCewXnlnOsY9EbtJfqEPjbJ7I4/fHjGsiPoFDuBDc3tcwo+od+AWGprbI6UJz242Z5rbY5oleID9rE5gG941X3kjaItWqcNRCPf0AK5FfRjKcLkT642iA6lJeijWEayFIJ1/s0kI0rti/V00ZLRIL0JX1I/pCNEu3csO3zQXmidiSgcSMRHfoF60x6fsFlzlRvgY9jSP8S9YFfUfHMO55q+819wDtMoI+5a+h084hU24KbvRZ3sswzijUiL7a2rSJm3SJm3SJk3+BRgA8LFe4j8YonoAAAAASUVORK5CYII=\" />\n" +
    "\t\t\t\t\t\t        <img class=\"vol-3\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAoCAYAAABq13MpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbhJREFUeNrs2c8rRFEUB/B53qSYaRYyVopSimTBhJRZ2diJlLAQs1IWFkr5H6xYYKOslGKNJfm5YGespPGzEDUZmeb53rq3jjtvyu6dU3PqU+dMM/U16d33zjie54WkVUVIYAUdug/WISEpdAxScA7HMCjt36MHdmAfGjiHvoc767V+uISBkp9SV4+AuTAOGe9v5WHK7zMcQhsxWLGCF/QfxDa0MQHfJLjqu+l7HKaHi7qKbIOr51togRznw2UXFsjcCPNmcBgf4w7s6auJqiw0wwPnY1x9m7OQ13ME5iTce1zDFpknISzhhmmV9LWQlBD6CJ7JLCJ0AU7InJByP31F+lYpoZ9IH5cS+oP0USmhq0j/KSV0PenfpIRuI/2NhNAqY5LMFxJCq8B1ZD6QEHqG9C9wyD10OwyTeQN+ON9Pu/r4NoucL2iCR87f9KK1eVpSgbmsEPyM6idxU2mo5vw0ntI7D1NZ6OC6QojCms/CZojj3qMSpn02TDkY47hh6oJXr7gy9oKGCvrqEYca6wlcLWk64VTCqlftp3thxHomLKpwwEHfYRk24ezfW5zyD0Xl0KXrV4ABABBpntz13cW2AAAAAElFTkSuQmCC\" />\n" +
    "\t\t\t\t\t\t    </a>\n" +
    "\t\t\t\t\t\t    <a class=\"wonder-logo\" target=\"_blank\" style=\"background: transparent url((~ existingCustomLogo || customLogo.data ~)) center center no-repeat; background-size: cover;\"></a>\n" +
    "\t\t\t\t\t\t    <input class=\"wonder-logo-chooser\" type=\"file\" ng-file-select=\"customLogoSelected($files)\" ng-file-drop=\"customLogoSelected($files)\">\n" +
    "\t\t\t\t\t\t    <a class=\"fullscreen wonder-fullscreen player-icon-fullscreen\"></a>\n" +
    "\t\t\t\t\t\t    <!-- <span class=\"wonder-timer\">--:--</span> -->\n" +
    "\t\t\t\t\t\t    <div class=\"scrubber vid loading\">\n" +
    "\t\t\t\t\t\t        <div class=\"scrubber-progress vid\"></div>\n" +
    "\t\t\t\t\t\t        <div class=\"scrubber-buffer\"></div>\n" +
    "\t\t\t\t\t\t        <a class=\"scrubber-handle vid player-icon-circle\"></a>\n" +
    "\t\t\t\t\t\t        <span class=\"scrubber-timer\"></span>\n" +
    "\t\t\t\t\t\t    </div>\n" +
    "\t\t\t\t\t\t    <div class=\"scrubber-target vid\">\n" +
    "\t\t\t\t\t\t        <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNGRUU0MzZGNkVGMTExRTNBQ0EzQjkyRDVDNTJFOTJCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNGRUU0MzcwNkVGMTExRTNBQ0EzQjkyRDVDNTJFOTJCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0ZFRTQzNkQ2RUYxMTFFM0FDQTNCOTJENUM1MkU5MkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0ZFRTQzNkU2RUYxMTFFM0FDQTNCOTJENUM1MkU5MkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz62H+JlAAAARUlEQVR42uzPQREAAAgDINc/9Mzg14MGpO18EBERERERERERERERERERERERERERERERERERERERERERERERERGRixVgABLFlZ3XwPXxAAAAAElFTkSuQmCC\" class=\"scrubber-trans vid\" width=\"100%\" height=\"100%\" />\n" +
    "\t\t\t\t\t\t    </div>\n" +
    "\t\t\t\t\t\t    <div class=\"scrubber vol\">\n" +
    "\t\t\t\t\t\t        <div class=\"scrubber-progress vol\"></div>\n" +
    "\t\t\t\t\t\t        <a class=\"scrubber-handle vol player-icon-circle\"></a>\n" +
    "\t\t\t\t\t\t    </div>\n" +
    "\t\t\t\t\t\t    <div class=\"scrubber-target vol\">\n" +
    "\t\t\t\t\t\t        <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNGRUU0MzZGNkVGMTExRTNBQ0EzQjkyRDVDNTJFOTJCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNGRUU0MzcwNkVGMTExRTNBQ0EzQjkyRDVDNTJFOTJCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0ZFRTQzNkQ2RUYxMTFFM0FDQTNCOTJENUM1MkU5MkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0ZFRTQzNkU2RUYxMTFFM0FDQTNCOTJENUM1MkU5MkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz62H+JlAAAARUlEQVR42uzPQREAAAgDINc/9Mzg14MGpO18EBERERERERERERERERERERERERERERERERERERERERERERERERGRixVgABLFlZ3XwPXxAAAAAElFTkSuQmCC\" class=\"scrubber-trans vid\" width=\"100%\" height=\"100%\" />\n" +
    "\t\t\t\t\t\t    </div>\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t\t<div class=\"row\" id=\"customize-your-player\">\n" +
    "\t\t\t\t\t<h2>Add your own logo to the player</h2>\n" +
    "\t\t\t\t\t<input type=\"file\" ng-file-select=\"customLogoSelected($files)\" ng-file-drop=\"customLogoSelected($files)\">\n" +
    "\t\t\t\t\t<div id=\"custom-logo-status\">\n" +
    "\t\t\t\t\t\t<p ng-show=\"customLogo.status == 'error'\">Sorry, your logo is too large! Please reduce it's dimensions.</p>\n" +
    "\t\t\t\t\t\t<p ng-show=\"customLogo.status == 'error'\">Sorry, your logo is too large! Please reduce it's dimensions.</p>\n" +
    "\t\t\t\t\t\t<p ng-show=\"customLogo.status == 'error'\">Sorry, your logo is too large! Please reduce it's dimensions.</p>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t<button ng-click=\"saveCustomLogo()\">Save logo</button>\n" +
    "\t\t\t\t</div>\n" +
    "\n" +
    "\t\t\t</form>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t</div>\n" +
    "</div>"
  );


  $templateCache.put('video-comments.html',
    "<section class=\"video-feedback\">\n" +
    "\n" +
    "  <section class=\"video-feedback__form\">\n" +
    "    <textarea class=\"video-feedback__input js-feeback-input\"></textarea>\n" +
    "    <button class=\"video-feedback__button\" ng-click=\"addComment\">submit</button>\n" +
    "  </section>\n" +
    "\n" +
    "  <!-- https://www.brainyquote.com/quotes/topics/topic_inspirational.html -->\n" +
    "  <section class=\"video-feedback__comments\">\n" +
    "    <ul class=\"video-feedback__comments-list\">\n" +
    "      <li class=\"video-feedback__comment video-feedback__comment--active\" data-id=\"12\" data-time=\"30\">\n" +
    "        <a href=\"#\" class=\"video-feedback__comment-time js-comment-time-link\">0:30</a>\n" +
    "        <span class=\"video-feedback__comment-message\">It is during our darkest moments that we must focus to see the light.</span>\n" +
    "        <span class=\"video-feedback__comment-author\">Aristotle Onassis</span>\n" +
    "        <span class=\"video-feedback__comment-date\">A fortnight ago</span>\n" +
    "        <a class=\"video-feedback__reply-link\" ng-click=\"showReply(12)\">reply</a>\n" +
    "        <section class=\"video-feedback__reply-form js-reply-form-12\">\n" +
    "          <textarea class=\"video-feedback__reply-text\"></textarea>\n" +
    "          <a class=\"video-feedback__reply-cancel\" ng-click=\"hideReply(12)\">cancel</a>\n" +
    "          <button class=\"video-feedback__reply-submit\">submit</button>\n" +
    "        </section>\n" +
    "        <ul class=\"video-feedback__comment-replies\">\n" +
    "          <li class=\"video-feedback__comment-reply\" data-id=\"27\">\n" +
    "            <span class=\"video-feedback__reply-message\">The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.</span>\n" +
    "            <span class=\"video-feedback__reply-author\">Helen Keller</span>\n" +
    "            <span class=\"video-feedback__reply-date\">Over a week ago</span>\n" +
    "          </li>\n" +
    "          <li class=\"video-feedback__comment-reply\" data-id=\"29\">\n" +
    "            <span class=\"video-feedback__reply-message\">We can't help everyone, but everyone can help someone.</span>\n" +
    "            <span class=\"video-feedback__reply-author\">Ronald Reagan</span>\n" +
    "            <span class=\"video-feedback__reply-date\">Yesterday</span>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </li>\n" +
    "      <li class=\"video-feedback__comment\" data-id=\"38\" data-time=\"105\">\n" +
    "        <a href=\"#\" class=\"video-feedback__comment-time js-comment-time-link\">1:45</a>\n" +
    "        <span class=\"video-feedback__comment-message\">What we need is more people who specialize in the impossible.</span>\n" +
    "        <span class=\"video-feedback__comment-author\">Theodore Roethke</span>\n" +
    "        <span class=\"video-feedback__comment-date\">Just now</span>\n" +
    "        <a class=\"video-feedback__reply-link\" ng-click=\"showReply(38)\">reply</a>\n" +
    "        <section class=\"video-feedback__reply-form js-reply-form-38\">\n" +
    "          <textarea class=\"video-feedback__reply-text\"></textarea>\n" +
    "          <a class=\"video-feedback__reply-cancel\" ng-click=\"hideReply(38)\">cancel</a>\n" +
    "          <button class=\"video-feedback__reply-submit\">submit</button>\n" +
    "        </section>\n" +
    "        <ul class=\"video-feedback__comment-replies\"></ul>\n" +
    "      </li>\n" +
    "      <li class=\"video-feedback__comment\" data-id=\"31\" data-time=\"550\">\n" +
    "        <a href=\"#\" class=\"video-feedback__comment-time js-comment-time-link\">9:10</a>\n" +
    "        <span class=\"video-feedback__comment-message\">Learning how to be still, to really be still and let life happen - that stillness becomes a radiance.</span>\n" +
    "        <span class=\"video-feedback__comment-author\">Morgan Freeman</span>\n" +
    "        <span class=\"video-feedback__comment-date\">Half an hour ago</span>\n" +
    "        <a class=\"video-feedback__reply-link\" ng-click=\"showReply(31)\">reply</a>\n" +
    "        <section class=\"video-feedback__reply-form js-reply-form-31\">\n" +
    "          <textarea class=\"video-feedback__reply-text\"></textarea>\n" +
    "          <a class=\"video-feedback__reply-cancel\" ng-click=\"hideReply(31)\">cancel</a>\n" +
    "          <button class=\"video-feedback__reply-submit\">submit</button>\n" +
    "        </section>\n" +
    "        <ul class=\"video-feedback__comment-replies\"></ul>\n" +
    "      </li>\n" +
    "\n" +
    "\n" +
    "      <li class=\"video-feedback__comment video-feedback__comment--active\" data-id=\"(~ comment.id ~)\" data-time=\"(~ comment.time ~)\" ng-repeat=\"comment in comments\">\n" +
    "        <a href=\"#\" class=\"video-feedback__comment-time js-comment-time-link\">(~ comment.prettyVideoTime ~)</a>\n" +
    "        <span class=\"video-feedback__comment-message\">(~ comment.text ~)</span>\n" +
    "        <span class=\"video-feedback__comment-author\">(~ comment.author ~)</span>\n" +
    "        <span class=\"video-feedback__comment-date\">(~ comment.prettyTimestamp ~)</span>\n" +
    "        <a class=\"video-feedback__reply-link\" ng-click=\"showReply(comment.id)\">reply</a>\n" +
    "        <section class=\"video-feedback__reply-form js-reply-form-(~ comment.id ~)\">\n" +
    "          <textarea class=\"video-feedback__reply-text\"></textarea>\n" +
    "          <a class=\"video-feedback__reply-cancel\" ng-click=\"hideReply(comment.id)\">cancel</a>\n" +
    "          <button class=\"video-feedback__reply-submit\">submit</button>\n" +
    "        </section>\n" +
    "        <ul class=\"video-feedback__comment-replies\">\n" +
    "          <li class=\"video-feedback__comment-reply\" data-id=\"(~ reply.id ~)\" ng-repeat=\"reply in comment.replies\">\n" +
    "            <span class=\"video-feedback__reply-message\">(~ reply.text ~)</span>\n" +
    "            <span class=\"video-feedback__reply-author\">(~ reply.author ~)</span>\n" +
    "            <span class=\"video-feedback__reply-date\">(~ reply.prettyTimestamp ~)</span>\n" +
    "          </li>\n" +
    "        </ul>\n" +
    "      </li>\n" +
    "\n" +
    "\n" +
    "    </ul>\n" +
    "  </section>\n" +
    "</section>"
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


  $templateCache.put('video-player.html',
    "<section class=\"video-player\">\n" +
    "  <div class=\"video-player__iframe-container\">\n" +
    "    <iframe class=\"video-player__frame\" src=\"(~ url ~)\"  width=\"100%\" height=\"100%\" frameborder=\"0\" allowfullscreen></iframe>\n" +
    "  </div>\n" +
    "</section>"
  );


  $templateCache.put('video-share.html',
    "<section class=\"video-share\">\n" +
    "  <ul class=\"video-share__controls\">\n" +
    "    <li class=\"video-share__control\">\n" +
    "      <a class=\"video-share__link video-share__link--embed\" href=\"#\">embed</a>\n" +
    "    </li>\n" +
    "    <li class=\"video-share__control\">\n" +
    "      <a class=\"video-share__link video-share__link--twitter\" href=\"#\">twitter</a>\n" +
    "    </li>\n" +
    "    <li class=\"video-share__control\">\n" +
    "      <a class=\"video-share__link video-share__link--facebook\" href=\"#\">facebook</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</section>"
  );


  $templateCache.put('video.html',
    "<section class=\"video-view-control-panel\">\n" +
    "  <ul class=\"video-view-control-panel__modes\">\n" +
    "    <li class=\"video-view-control-panel__mode\">\n" +
    "      <a href=\"#\" class=\"video-view-control-panel__link\">edit</a>\n" +
    "    </li>\n" +
    "    <li class=\"video-view-control-panel__mode\">\n" +
    "      <a href=\"#\" class=\"video-view-control-panel__link\">review</a>\n" +
    "    </li>\n" +
    "    <li class=\"video-view-control-panel__mode\">\n" +
    "      <a href=\"#\" class=\"video-view-control-panel__link\">comment</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</section>\n" +
    "\n" +
    "<section class=\"main-view video-view\" ng-controller=\"VideoCtrl\">\n" +
    "\n" +
    "  <video-player url=\"http://localhost:5000/embed/viwAdAYl4is9rfPwmRE39MXA/?controls=1\"></video-player>\n" +
    "\n" +
    "  <input ng-model=\"color\" />\n" +
    "  <input color-picker ng-model=\"color\" />\n" +
    "\n" +
    "  <section class=\"video-more\">\n" +
    "    <p class=\"video-more__link\" medium-editor ng-model=\"more\"></p>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"video-view__description\" medium-editor ng-model=\"text\"></section>\n" +
    "\n" +
    "  <video-share></video-share>\n" +
    "\n" +
    "  <section video-comments></section>\n" +
    "\n" +
    "</section>\n" +
    "\n" +
    "<div id=\"page-video-single\" class=\"section\" ng-controller=\"VideoCtrl\">\n" +
    "\n" +
    "  <div class=\"inner\">\n" +
    "    <h1>(~ video.title ~)</h1>\n" +
    "\n" +
    "    <div class=\"inner half-width left\">\n" +
    "      <h3>Edit your video details</h3>\n" +
    "      <form action=\"#\">\n" +
    "        <div class=\"row\">\n" +
    "          <label>Video Title</label>\n" +
    "          <input type=\"text\" ng-model=\"video.title\" />\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "          <label>Video Description</label>\n" +
    "          <textarea name=\"\" id=\"\" ng-model=\"video.description\"></textarea>\n" +
    "        </div>\n" +
    "        <div class=\"row half-width left\"><label>Mood</label><input type=\"text\" placeholder=\"Intrigued\" /></div><!--\n" +
    "        --><div class=\"row half-width\"><label>Click to more link</label><input type=\"text\" placeholder=\"www.google.com\"/></div>\n" +
    "        <!-- <div class=\"row\"><label>Video</label><input type=\"text\" /></div> -->\n" +
    "        <div class=\"row half-width left\">\n" +
    "          <label>Video Thumbnail</label>\n" +
    "          <div class=\"thumbnail-picker\">\n" +
    "            <span class=\"icon-pictures\"></span>\n" +
    "          </div>\n" +
    "        </div><!--\n" +
    "        --><div class=\"row half-width\">\n" +
    "          <label>Meta data</label><input class=\"margin-bottom\" type=\"text\"/>\n" +
    "          <label>Content data</label><input type=\"text\"/>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </div><!--\n" +
    "    --><div class=\"inner half-width right\" style=\"padding-top: 57px;\">\n" +
    "      <div class=\"wonder-embed\">\n" +
    "        <iframe class=\"video-player__frame\" src=\"//localhost:5000/embed/viwAdAYl4is9rfPwmRE39MXA/\" width=\"100%\" height=\"100%\" frameborder=\"0\" allowfullscreen></iframe>\n" +
    "      </div>\n" +
    "      <div id=\"customize-player\">\n" +
    "        <form action=\"\">\n" +
    "          <div class=\"row\">\n" +
    "            <label>Embed Link</label>\n" +
    "            <!-- <input type=\"text\" value=\"wonderpl.com/embed/vieasdasdads\"> -->\n" +
    "\n" +
    "            <!-- <iframe src=\"//player.vimeo.com/video/88737187?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=c9ff23\" width=\"443\" height=\"197\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href=\"http://vimeo.com/88737187\">Made in Tohoku</a> from <a href=\"http://vimeo.com/theinouebrothers\">The Inoue Brothers</a> on <a href=\"https://vimeo.com\">Vimeo</a>.</p> -->\n" +
    "\n" +
    "            <input type=\"text\" value=\"<iframe src=&quot;(( embedurl ))&quot; width=&quot;100%&quot; height=&quot;100%&quot; frameborder=&quot;0&quot; allowfullscreen></iframe>\" />\n" +
    "          </div>\n" +
    "          <div class=\"row\">\n" +
    "            <input type=\"text\" placeholder=\"Width\" class=\"dimension\" /><input type=\"text\" placeholder=\"Height\" class=\"dimension height\" />\n" +
    "            <span class=\"padding top\">\n" +
    "              <input type=\"checkbox\" class=\"inline-block margin-right\" /><label class=\"inline-block\">Maintain aspect-ratio?</label>\n" +
    "            </span>\n" +
    "          </div>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div id=\"top-right-links\">\n" +
    "      <ul>\n" +
    "        <!-- <li><a href=\"#\"></a></li> -->\n" +
    "        <!-- <li><a href=\"/#/tools/(~ video.id ~)\"><span class=\"icon-tools\"></span>Monetization Tools</a></li> -->\n" +
    "        <li><a href=\"/#/analytics/(~ video.id ~)\"><span class=\"icon-graph\"></span>View Analytics</a></li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n"
  );
} ]);