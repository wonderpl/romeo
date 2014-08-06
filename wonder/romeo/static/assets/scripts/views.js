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


  $templateCache.put('add-collaborator.html',
    "<section class=\"add-collaborator\">\n" +
    "\n" +
    "  <header class=\"video-extended-controls__section-header\" ng-click=\"showCollaborator = !showCollaborator\">\n" +
    "    <h4 class=\"video-extended-controls__section-header-title\">\n" +
    "      Collaborators\n" +
    "    </h4>\n" +
    "  </header>\n" +
    "\n" +
    "  <section class=\"video-add-collaborators\">\n" +
    "\n" +
    "    <label class=\"video-add-collaborators__label\">\n" +
    "      Name\n" +
    "      <input class=\"video-add-collaborators__input\" ng-model=\"collaborator.name\" />\n" +
    "    </label>\n" +
    "    <label class=\"video-add-collaborators__label\">\n" +
    "      Email\n" +
    "      <input class=\"video-add-collaborators__input\" ng-model=\"collaborator.email\" />\n" +
    "    </label>\n" +
    "    <label class=\"video-add-collaborators__label\">Permissions</label>\n" +
    "    <label class=\"video-add-collaborators__label--inline\">\n" +
    "      <input class=\"video-add-collaborators__checkbox\" type=\"checkbox\" ng-model=\"collaborator.can_comment\" />\n" +
    "      Allow to comment\n" +
    "    </label>\n" +
    "    <label class=\"video-add-collaborators__label--inline\">\n" +
    "      <input class=\"video-add-collaborators__checkbox\" type=\"checkbox\" ng-model=\"collaborator.can_download\" />\n" +
    "      Allow to download source\n" +
    "    </label>\n" +
    "\n" +
    "  </section>\n" +
    "\n" +
    "  <div class=\"video-add-collaborators__messages\">\n" +
    "    <p ng-show=\"collaboratorAdded\">New collaborator has been added.</p>\n" +
    "    <p class=\"video-add-collaborators__message--error\" ng-show=\"errors\">An error occured. Collaborator not added.</p>\n" +
    "  </div>\n" +
    "  <a class=\"btn btn--positive\" ng-click=\"add()\">Send Request</a>\n" +
    "\n" +
    "</section>\n" +
    "\n" +
    "\n" +
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


  $templateCache.put('category-add-video.html',
    "<section class=\"video-edit-categories\">\n" +
    "\n" +
    "  <header class=\"video-extended-controls__section-header\" ng-click=\"showCategory = !showCategory\">\n" +
    "    <h4 class=\"video-extended-controls__section-header-title\">\n" +
    "      (~ selectedCategory ? 'In Category:' : 'Add video to category' ~)\n" +
    "    </h4>\n" +
    "    <span ng-show=\"selectedCategory\" class=\"video-edit-categories__selected-category\">\n" +
    "      <span ng-bind-html=\"selectedName\"></span>\n" +
    "      <span class=\"video-edit-categories__remove-category\" ng-click=\"removeCategory(category.id, $event)\">&times;</span>\n" +
    "    </span>\n" +
    "  </header>\n" +
    "\n" +
    "  <div class=\"video-edit-categories__categories\">\n" +
    "    <div class=\"video-edit-categories__category\"\n" +
    "      ng-class=\"{ 'video-edit-categories__category--active' : categoryActive === category.id }\"\n" +
    "      ng-repeat-start=\"category in categories | filter: videoPriority\"\n" +
    "      ng-click=\"setCategoryActive(category.id)\">\n" +
    "      (~ category.name ~)\n" +
    "    </div>\n" +
    "    <ul class=\"video-edit-categories__subcategories\"\n" +
    "      ng-repeat-end data-parent-id=\"(~ category.id ~)\"\n" +
    "      ng-class=\"{ 'video-edit-categories__subcategories--active' : categoryActive === category.id }\">\n" +
    "      <!-- (~ category.name ~) -->\n" +
    "      <li ng-repeat=\"subcategory in category.sub_categories\"\n" +
    "        ng-class=\"{'video-edit-categories__subcategory--active' : selectedCategory === subcategory.id }\"\n" +
    "        class=\"video-edit-categories__category video-edit-categories__subcategory\"\n" +
    "        ng-click=\"selectCategory(subcategory.id, $event)\">(~ subcategory.name ~)</li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('collection-add-video.html',
    "<section class=\"collection-add-video\" ng-class=\"{ 'collection-add-video--modal' : isModal }\">\n" +
    "\n" +
    "  <a class=\"modal__close\" ng-show=\"isModal\" ng-click=\"close()\">&times;</a>\n" +
    "\n" +
    "  <header class=\"video-extended-controls__section-header\"\n" +
    "    ng-click=\"showCollection = !showCollection\">\n" +
    "    <h4 class=\"video-extended-controls__section-header-title\">\n" +
    "      <span ng-if=\"!video || !video.tags || !video.tags.items || video.tags.items.length === 0\">\n" +
    "        Add video to collection\n" +
    "      </span>\n" +
    "      <span ng-if=\"video.tags.items.length === 1\">\n" +
    "        In Collection:\n" +
    "      </span>\n" +
    "      <span ng-if=\"video.tags.items.length > 1\">\n" +
    "        In Collections:\n" +
    "      </span>\n" +
    "    </h4>\n" +
    "\n" +
    "    <ul ng-show=\"video.tags.items.length\" class=\"video-edit-collections__assigned-tags\">\n" +
    "      <li ng-repeat=\"tag in video.tags.items\" class=\"video-edit-collections__assigned-tag\">\n" +
    "        <span class=\"\" ng-bind-html=\"tag.label\"></span>\n" +
    "        <span class=\"video-edit-collections__remove-tag\" ng-click=\"removeTag(tag.id, $event)\">&times;</span>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "\n" +
    "  </header>\n" +
    "\n" +
    "  <section class=\"video-edit-collections\">\n" +
    "\n" +
    "    <ul class=\"video-edit-collections__options\">\n" +
    "      <li class=\"video-edit-collections__option\"\n" +
    "        ng-click=\"hideAddRemoveAndShowCreateCollection()\"\n" +
    "        ng-class=\"{ 'video-edit-collections__option--modal' : isModal }\">\n" +
    "        <span class=\"video-edit-collections__option-title\">Create New Collection</span>\n" +
    "        <span class=\"video-edit-collections__option-count\"></span>\n" +
    "      </li>\n" +
    "      <li class=\"video-edit-collections__option\"\n" +
    "        data-videos=\"(~ tag.video_count ~)\"\n" +
    "        ng-class=\"{\n" +
    "          'video-edit-collections__option--selected' : hasTag(tag.id),\n" +
    "          'video-edit-collections__option--modal' : isModal\n" +
    "        }\"\n" +
    "        ng-repeat=\"tag in availableTags\"\n" +
    "        ng-click=\"addTag(tag.id, $event)\">\n" +
    "        <span class=\"video-edit-collections__option-title\" ng-bind-html=\"tag.label\"></span>\n" +
    "        <ng-switch ng-show=\"tag.video_count\" on=\"tag.video_count\">\n" +
    "          <span class=\"video-edit-collections__option-count\">\n" +
    "            <ng-pluralize count=\"tag.video_count\"\n" +
    "              when=\"{\n" +
    "                '0'     : 'no videos',\n" +
    "                '1'     : '1 video',\n" +
    "                'other' : '(~ tag.video_count ~) videos'}\">\n" +
    "            </ng-pluralize>\n" +
    "          </span>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "\n" +
    "  </section>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('analytics-engagement-video-segment.html',
    "<style>\n" +
    "\n" +
    "    body {\n" +
    "        font: 10px sans-serif;\n" +
    "        margin: 0;\n" +
    "    }\n" +
    "\n" +
    "    path.line {\n" +
    "        fill: none;\n" +
    "        stroke: #666;\n" +
    "        stroke-width: 1.5px;\n" +
    "    }\n" +
    "\n" +
    "    path.area {\n" +
    "        fill: #e7e7e7;\n" +
    "        @import(user-select): none;\n" +
    "    }\n" +
    "\n" +
    "    path.progress-area {\n" +
    "        fill: #e73c33;\n" +
    "    }\n" +
    "\n" +
    "    .axis {\n" +
    "        shape-rendering: crispEdges;\n" +
    "    }\n" +
    "\n" +
    "    .x.axis line {\n" +
    "        stroke: #fff;\n" +
    "    }\n" +
    "\n" +
    "    .x.axis .minor {\n" +
    "        stroke-opacity: .5;\n" +
    "    }\n" +
    "\n" +
    "    .x.axis path {\n" +
    "        display: none;\n" +
    "    }\n" +
    "\n" +
    "    .y.axis line, .y.axis path {\n" +
    "        fill: none;\n" +
    "        stroke: #000;\n" +
    "    }\n" +
    "\n" +
    "</style>\n" +
    "\n" +
    "<div>\n" +
    "    <iframe id=\"engagement-video-iframe\" src=\"(~ embedSrc ~)\" width=\"300\" height=\"300\" frameborder=\"0\" allowfullscreen></iframe>\n" +
    "    <svg id=\"engagement-video-segment-chart\"></svg>\n" +
    "</div>\n"
  );


  $templateCache.put('analytics-fields-chooser.html',
    "<h3>Select up to (~ analytics.maxFields ~) fields:</h3>\n" +
    "<ul id=\"analytics-fields-selection\">\n" +
    "    <li class=\"analytics-fields-selection-item\" ng-repeat=\"field in analytics.fields\"\n" +
    "        ng-class=\"{ disabled: getFields({visible: true}).length > 4 && !field.visible }\">\n" +
    "        <div class=\"selection-title\" style=\"border-bottom-color: (~ field.color ~)\">\n" +
    "            <input type=\"checkbox\" ng-model=\"field.visible\"\n" +
    "                   ng-disabled=\"getFields({visible: true}).length > 4 && !field.visible\" ng-change=\"notifyChange()\"/>\n" +
    "            <span>(~ field.displayName ~)</span>\n" +
    "        </div>\n" +
    "        <div class=\"selection-description\">(~ field.description ~)</div>\n" +
    "    </li>\n" +
    "</ul>\n"
  );


  $templateCache.put('analytics-fields-key.html',
    "<ul id=\"analytics-fields-key\">\n" +
    "    <li class=\"analytics-fields-key-item\" ng-repeat=\"field in analytics.fields | filter: { visible: true }\">\n" +
    "        <span class=\"key-color\" style=\"background-color: (~field.color~)\"></span>\n" +
    "        <span class=\"key-title\">(~ field.displayName ~)</span>\n" +
    "    </li>\n" +
    "    <li id=\"edit-icon\">\n" +
    "        <span>Fields <span style=\"color: (~ (getFields({visible: true}).length < analytics.maxFields) ? 'green' : 'red' ~);\">((~ getFields({visible: true}).length ~))</span>:</span>\n" +
    "        <span class=\"icon-edit\" ng-click=\"flip()\"></span>\n" +
    "    </li>\n" +
    "\n" +
    "</ul>\n"
  );


  $templateCache.put('analytics-geographic.html',
    "<div>\n" +
    "    <div class=\"analytics-panel analytics-panel-top\">\n" +
    "        <svg id=\"geographic-map\"></svg>\n" +
    "        <div id=\"geographic-region-chooser\">\n" +
    "            <span>Region:</span>\n" +
    "            <select id=\"\" ng-model=\"selectedRegion\" ng-options=\"region as region.name for (name, region) in zoomRegions\" ng-change=\"zoomToRegion(selectedRegion)\">\n" +
    "                <option value=\"\">Select Region</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div id=\"geographic-map-data\">\n" +
    "            <h4>Region: (~ selectedRegion.name ~)</h4>\n" +
    "\n" +
    "            (~ areaData.geo.name ~)\n" +
    "\n" +
    "            <div ng-repeat=\"field in analytics.fields | filter: { visible: true }\" class=\"key-row\">\n" +
    "                <input class=\"key-checkbox\" type=\"radio\" name=\"key-chooser\" ng-value=\"field\" ng-model=\"analytics.selectedMapField\"/>\n" +
    "                <span class=\"key-color\" style=\"background-color: (~field.color~)\"></span><span class=\"key-title\">(~ field.displayName ~)</span>&nbsp;<span\n" +
    "                    class=\"key-value\">(~ areaData.video[field.field] ~)</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('analytics-overview.html',
    "<div id=\"analytics-overview\">\n" +
    "    <div id=\"widget-container\" class=\"center\">\n" +
    "        <pl-analytics-overview-widget id=\"analytics-widget-performance\" data=\"overview.data.performance\" href=\"/#/analytics/(~ video.videoID ~)/performance\"></pl-analytics-overview-widget>\n" +
    "        <pl-analytics-overview-widget id=\"analytics-widget-geographic\" data=\"overview.data.geographic\" href=\"/#/analytics/(~ video.videoID ~)/geographic\"></pl-analytics-overview-widget>\n" +
    "        <pl-analytics-overview-widget id=\"analytics-widget-engagement\" data=\"overview.data.engagement\" href=\"/#/analytics/(~ video.videoID ~)/engagement\"></pl-analytics-overview-widget>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('analytics-performance.html',
    "<div>\n" +
    "    <div class=\"analytics-panel analytics-panel-top\">\n" +
    "        <svg id=\"performance-chart\"></svg>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('analytics-results-table.html',
    "<table id=\"analytics-results-table\">\n" +
    "    <thead>\n" +
    "        <th><span class=\"results-table-column-header\">(~ analytics.results.keyDisplayName ~)</span></th>\n" +
    "        <th class=\"results-table-column-header\" ng-repeat=\"field in analytics.fields | filter: { visible: true }\">(~ field.displayName ~)</th>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "        <tr ng-repeat=\"result in analytics.results.results\">\n" +
    "            <td>(~ result[analytics.results.key] ~)</td>\n" +
    "            <td ng-repeat=\"field in analytics.fields | filter: { visible: true }\">(~ result[field.field] ~)</td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>\n"
  );


  $templateCache.put('analytics-widget-statistic.html',
    "<div class=\"analytics-widget-statistic\">\n" +
    "    <span class=\"analytics-widget-statistic-datum\">(~ datum.amount ~)</span>\n" +
    "    <span class=\"analytics-widget-statistic-title\">(~ datum.title ~)</span>\n" +
    "</div>"
  );


  $templateCache.put('analytics-widget.html',
    "<a class=\"analytics-widget\">\n" +
    "        <div class=\"analytics-widget-top\">\n" +
    "            <pl-analytics-widget-statistic class=\"statistic\" datum=\"viewModel.primary\"></pl-analytics-widget-statistic>\n" +
    "        </div>\n" +
    "        <div class=\"analytics-widget-bottom\">\n" +
    "            <pl-analytics-widget-statistic class=\"statistic\" ng-repeat=\"datum in viewModel.secondary\" datum=\"datum\"></pl-analytics-widget-statistic>\n" +
    "        </div>\n" +
    "\n" +
    "</a>"
  );


  $templateCache.put('upload-quick-share.html',
    "\n" +
    "<div id=\"quick-share\" class=\"f-serif;\">\n" +
    "\t<form ng-submit=\"submitQuickShareForm\">\n" +
    "\t\t<div id=\"quick-share-recipients\"></div>\n" +
    "\t\t<div id=\"quick-share-body\">\n" +
    "\t\t\t<div class=\"message\"></div>\n" +
    "\t\t\t<div class=\"link\"></div>\n" +
    "\t\t\t<div class=\"controls\"></div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
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
    "<div ng-controller=\"LoginCtrl\" autocomplete=\"off\" class=\"login-view\">\n" +
    "\n" +
    "\t\t<form ng-submit=\"login()\">\n" +
    "\n" +
    "\t\t\t\t<label class=\"login-view__label\">Username <input type=\"text\" ng-model=\"username\" autocomplete=\"off\" class=\"login-view__input\" /></label>\n" +
    "\n" +
    "\t\t\t\t<label class=\"login-view__label\">Password <input type=\"password\" name=\"password\" ng-model=\"password\" autocomplete=\"off\"  class=\"login-view__input\" /></label>\n" +
    "\n" +
    "        <span class=\"login-view__errors\" ng-bind=\"errors\"></span>\n" +
    "\n" +
    "\t\t\t\t<label class=\"login-view__label hide-text\">\n" +
    "          Login\n" +
    "          <img class=\"login-view__loading-indicator\" src=\"/static/assets/img/loading.gif\" ng-show=\"isLoading\" />\n" +
    "          <button type=\"submit\" class=\"btn btn--positive login-view__submit\" ng-click=\"isLoading = true;\">\n" +
    "            Login\n" +
    "          </button>\n" +
    "        </label>\n" +
    "\n" +
    "\t\t</form>\n" +
    "\n" +
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


  $templateCache.put('modal-create-new-collection.html',
    "<section class=\"video-new-collection\">\n" +
    "  <a class=\"modal__close\" ng-click=\"close()\">&times;</a>\n" +
    "  <h5 class=\"video-new-collection__new-title\">Create a collection</h5>\n" +
    "  <section class=\"video-new-collection__new-controls\">\n" +
    "    <form name=\"newCollectionForm\">\n" +
    "      <input ng-model=\"collection.label\" placeholder=\"Name\" class=\"video-new-collection__new-collection-name\" name=\"collectionLabel\" validate-collection-title required />\n" +
    "      <span class=\"video-new-collection__error\" ng-show=\"newCollectionForm.collectionLabel.$error.exists && isSubmitted\">Error: there is already a collection with that name</span>\n" +
    "      <textarea ng-model=\"collection.description\" placeholder=\"Collection description (optional)&hellip;\" class=\"video-new-collection__new-collection-description\"></textarea>\n" +
    "      <ul class=\"video-new-collection__scope-options\">\n" +
    "        <li class=\"video-new-collection__scope-option\">\n" +
    "          <label class=\"video-new-collection__label\">\n" +
    "            <input type=\"radio\" name=\"scope\" ng-model=\"collection.scope\" value=\"public\" />\n" +
    "            Public\n" +
    "          </label>\n" +
    "        </li>\n" +
    "        <li class=\"video-new-collection__scope-option\">\n" +
    "          <label class=\"video-new-collection__label\">\n" +
    "            <input type=\"radio\" name=\"scope\" ng-model=\"collection.scope\" value=\"private\" />\n" +
    "            Private\n" +
    "          </label>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "      <a ng-click=\"newCollectionForm.$valid && saveNewCollection(); isSubmitted = true;\" class=\"button button--primary\">Okay</a>\n" +
    "    </form>\n" +
    "  </section>\n" +
    "</section>"
  );


  $templateCache.put('modal-delete-video.html',
    "<section class=\"organise-video-delete\">\n" +
    "  <a class=\"modal__close\" ng-click=\"close()\">&times;</a>\n" +
    "  <h5 class=\"organise-video-delete__title\">Delete video</h5>\n" +
    "  <section class=\"organise-video-delete__controls\">\n" +
    "    <div class=\"media__img\"><i class=\"icon icon--trash icon--large\"></i></div>\n" +
    "    <div class=\"media__body\">\n" +
    "      <p class=\"organise-video-delete__msg\">Are you sure you want to delete '(~video.title~)'?</p>\n" +
    "      <a ng-click=\"delete(video)\" class=\"organise-video-delete_button button button--primary\">Okay</a>\n" +
    "    </div>\n" +
    "  </section>\n" +
    "</section>"
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


  $templateCache.put('notification-tray.html',
    "<ul class=\"nav  nav--stacked  notice-tray\">\n" +
    "  <li ng-repeat=\"notification in notifications\" class=\"notice  notice--(~ notification.status ~)  animate  animate--flippable\" ng-class=\"{ 'notice--active' : notification.active, 'animation--flipInX' : notification.show,  'animation--flipOutX' : notification.hide}\">\n" +
    "    <div class=\"flag  flag--rev\">\n" +
    "      <div class=\"flag__body\">\n" +
    "        <p><b>(~ notification.title ~)</b>:<br>\n" +
    "        (~ notification.message ~)</p>\n" +
    "      </div>\n" +
    "      <div class=\"flag__img\"><a class=\"notice__dismiss\" ng-click=\"removeNotification(notification.id); notification.show = false; notification.hide = true\"><i class=\"icon  icon--cross\"></a></i></div>\n" +
    "    </div>\n" +
    "  </li>\n" +
    "</ul>"
  );


  $templateCache.put('organise-breadcrumb.html',
    "<ol class=\"nav  page-breadcrumbs\">\n" +
    "  <li ng-show=\"!filter\" class=\"page-breadcrumbs__item\"><span class=\"page-breadcrumbs__title\">All Videos</span></li>\n" +
    "  <li ng-show=\"!filter && tag\" class=\"page-breadcrumbs__item\"><span class=\"page-breadcrumbs__title  page-breadcrumbs__title--selected\">(~ tag.label ~)</span></li>\n" +
    "  <li ng-show=\"filter\" class=\"page-breadcrumbs__item\"><span class=\"page-breadcrumbs__title\">Recent Videos</span></li>\n" +
    "</ol>"
  );


  $templateCache.put('organise-collection.html',
    "<section class=\"organise-collection\">\n" +
    "\n" +
    "  <h3 class=\"organise-collection__title\">\n" +
    "    <div ng-hide=\"isEdit\">\n" +
    "      (~ tag.label ~)\n" +
    "      <span class=\"organise-collection__visibility organise-collection__visibility--private\">(~ tag.public ? 'public' : 'private' ~)</span>\n" +
    "    </div>\n" +
    "    <div medium-editor\n" +
    "      options=\"{ disableToolbar : true, forcePlainText : true, disableReturn : true, placeholder : '' }\"\n" +
    "      ng-model=\"tag.label\"\n" +
    "      ng-show=\"isEdit\">\n" +
    "    </div>\n" +
    "  </h3>\n" +
    "\n" +
    "  <p class=\"organise-collection__description\" ng-bind=\"tag.description\" ng-hide=\"isEdit\"></p>\n" +
    "\n" +
    "  <p class=\"organise-collection__description\"\n" +
    "    medium-editor\n" +
    "    options=\"{ disableToolbar : true, forcePlainText : true, disableReturn : true, placeholder : '' }\"\n" +
    "    ng-model=\"tag.description\"\n" +
    "    ng-show=\"isEdit\">\n" +
    "  </p>\n" +
    "\n" +
    "  <a class=\"button organise-collection__button organise-collection__button--edit\" ng-hide=\"isEdit\" ng-click=\"isEdit = !isEdit\">Edit</a>\n" +
    "\n" +
    "  <a class=\"button button--primary organise-collection__button organise-collection__button--save\" ng-show=\"isEdit\" ng-click=\"save()\">Done</a>\n" +
    "\n" +
    "  <a class=\"button organise-collection__button organise-collection__button--delete\" ng-show=\"isEdit\" ng-click=\"delete()\">Delete</a>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('organise-navigation.html',
    "<div class=\"layout__item  one-third  organise-navigation\">\n" +
    "  <ul class=\"nav  nav--stacked  browse-list\">\n" +
    "    <li class=\"browse-list__item\">\n" +
    "      <span class=\"browse-list__title\">Manage</span>\n" +
    "    </li>\n" +
    "    <li class=\"browse-list__item\">\n" +
    "      <a class=\"browse-list__link\" ng-class=\"{ 'organise-navigation__link--active' : !customFilterFunction && !currentTag }\" ng-click=\"showAllVideos()\">All videos</a>\n" +
    "    </li>\n" +
    "    <li class=\"browse-list__item\">\n" +
    "      <a class=\"browse-list__link\" ng-class=\"{ 'organise-navigation__link--active' : customFilterFunction === 'isRecent' }\" ng-click=\"showRecentVideos()\">Recently added videos</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <ul class=\"nav  nav--stacked  browse-list\">\n" +
    "    <li class=\"browse-list__item\">\n" +
    "      <span class=\"browse-list__title\">Collections not visible in app</span>\n" +
    "    </li>\n" +
    "    <li class=\"browse-list__item\" ng-repeat=\"tag in tags | filter : { public : false }\">\n" +
    "      <a class=\"browse-list__link\" ng-class=\"{ 'browse-list__item--active' : currentTag.id === tag.id }\" ng-bind=\"tag.label\" ng-click=\"loadCollection(tag.id)\"></a>\n" +
    "    </li>\n" +
    "    <li class=\"browse-list__item\">\n" +
    "      <a class=\"browse-list__link  browse-list__link--create  split\" ng-click=\"createPrivateCollection()\">\n" +
    "        <span class=\"split__title\">Add a new private collection</span>\n" +
    "        <i class=\"icon  icon--plus\"></i>\n" +
    "      </a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <ul class=\"nav  nav--stacked  browse-list\">\n" +
    "    <li class=\"browse-list__item\">\n" +
    "      <span class=\"browse-list__title\">Collections visible in app</span>\n" +
    "    </li>\n" +
    "    <li class=\"browse-list__item\" ng-repeat=\"tag in tags | filter : { public : true }\">\n" +
    "      <a class=\"browse-list__link\" ng-class=\"{ 'browse-list__link--active' : currentTag.id === tag.id }\" ng-bind=\"tag.label\" ng-click=\"loadCollection(tag.id)\"></a>\n" +
    "    </li>\n" +
    "    <li class=\"browse-list__item\">\n" +
    "      <a class=\"browse-list__link  browse-list__link--create  split\" ng-click=\"createPublicCollection()\">\n" +
    "        <span class=\"split__title\">Add a new public collection</span>\n" +
    "        <i class=\"icon  icon--plus\"></i>\n" +
    "      </a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</div>"
  );


  $templateCache.put('organise-video-list.html',
    "<section class=\"organise-video-list\">\n" +
    "\n" +
    "  <section class=\"organise-video-list__list-controls\">\n" +
    "    <label class=\"organise-video-list__list-control-label\">\n" +
    "      Sort:\n" +
    "      <select class=\"organise-video-list__select  btn  btn--small\"\n" +
    "        ng-model=\"sortOption\"\n" +
    "        ng-init=\"sortOption=''\">\n" +
    "        <option value=\"\">none</option>\n" +
    "        <option value=\"date_updated\">Newest</option>\n" +
    "      </select>\n" +
    "    </label>\n" +
    "    <label class=\"organise-video-list__list-control-label\">\n" +
    "      View:\n" +
    "      <div class=\"btn-group\">\n" +
    "        <a class=\"btn  btn--small\" title=\"Display videos in a grid view.\"\n" +
    "        ng-class=\"{ 'btn--active' : !isList }\"\n" +
    "        ng-click=\"isList = false\"><i class=\"icon  icon--grid\"></i></a>\n" +
    "        <a class=\"btn  btn--small\" title=\"Display videos in a list view.\"\n" +
    "        ng-class=\"{ 'btn--active' : isList }\"\n" +
    "        ng-click=\"isList = true\"><i class=\"icon  icon--align-justify\"></i></a>\n" +
    "      </div>\n" +
    "    </label>\n" +
    "  </section>\n" +
    "\n" +
    "  <div ng-hide=\"filteredVideos\" class=\"organise-video-list__message\">\n" +
    "    <p>Great, you've made a collection, but it's empty!</p>\n" +
    "    <p>Go and <a href=\"#/video\">upload</a> a video.</p>\n" +
    "  </div>\n" +
    "\n" +
    "  <ul class=\"organise-video-list__videos\" ng-show=\"filteredVideos\">\n" +
    "    <li class=\"organise-video-list__video\"\n" +
    "      ng-repeat=\"video in filteredVideos | orderBy: sortOption | filter : customFilter\"\n" +
    "      ng-class=\"{\n" +
    "        'organise-video-list__video--last' : ($index + 1) % 3 == 0,\n" +
    "        'organise-video-list__video--list' : isList\n" +
    "      }\">\n" +
    "      <organise-video video=\"video\" is-list=\"isList\"></organise-video>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "</section>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('organise-video.html',
    "<section class=\"organise-video\">\n" +
    "\n" +
    "  <ul class=\"organise-video__inline-controls\" ng-show=\"isList\">\n" +
    "    <li class=\"organise-video__inline-control\">\n" +
    "      <a class=\"organise-video__inline-link organise-video__inline-link--edit\" ng-href=\"#/video/(~video.id~)/edit\"><i class=\"icon  icon--edit\"></i></a>\n" +
    "    </li>\n" +
    "    <li class=\"organise-video__inline-control\">\n" +
    "      <a class=\"organise-video__inline-link organise-video__inline-link--view\" ng-href=\"#/video/(~video.id~)\"><i class=\"icon  icon--eye\"></i></a>\n" +
    "    </li>\n" +
    "    <li class=\"organise-video__inline-control\">\n" +
    "      <a class=\"organise-video__inline-link organise-video__inline-link--stats\"><i class=\"icon  icon--bar-graph\"></i></a>\n" +
    "    </li>\n" +
    "    <li class=\"organise-video__inline-control\">\n" +
    "      <a class=\"organise-video__inline-link organise-video__inline-link--add-remove\" ng-click=\"addRemove(video)\"><i class=\"icon  icon--collection\"></i></a>\n" +
    "    </li>\n" +
    "    <li class=\"organise-video__inline-control\">\n" +
    "      <a class=\"organise-video__inline-link organise-video__inline-link--delete\" ng-click=\"showDelete(video)\"><i class=\"icon  icon--trash\"></i></a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <a ng-href=\"#/video/(~video.id~)\">\n" +
    "    <span class=\"organise-video__inline-title\" ng-show=\"isList\" ng-bind=\"video.title\"></span>\n" +
    "  </a>\n" +
    "\n" +
    "  <a ng-href=\"#/video/(~video.id~)\">\n" +
    "    <span class=\"organise-video__title\" ng-hide=\"isList\" ng-bind=\"video.title\"></span>\n" +
    "  </a>\n" +
    "\n" +
    "  <div class=\"video-thumb-container\" ng-hide=\"isList\">\n" +
    "    <ul class=\"nav  nav--block  video-action-list\">\n" +
    "      <li class=\"video-action-list__item\"><a class=\"video-action-list__link\" ng-href=\"#/video/(~video.id~)/edit\"><i class=\"icon  icon--edit\"></i><span class=\"t--block\">Edit</span></a></li>\n" +
    "      <li class=\"video-action-list__item\"><a class=\"video-action-list__link\" ng-href=\"#/video/(~video.id~)\"><i class=\"icon  icon--eye\"></i><span class=\"t--block\">Review</span></a></li>\n" +
    "      <li class=\"video-action-list__item\"><a class=\"video-action-list__link\"><i class=\"icon  icon--bar-graph\"></i><span class=\"t--block\">Stats</span></a></li>\n" +
    "      <li class=\"video-action-list__item\"><a class=\"video-action-list__link\" ng-click=\"addRemove(video)\"><i class=\"icon  icon--collection\"></i><span class=\"t--block\">Add / Remove</span></a></li>\n" +
    "      <li class=\"video-action-list__item\"><a class=\"video-action-list__link\" ng-click=\"showDelete(video)\"><i class=\"icon  icon--trash\"></i><span class=\"t--block\">Delete</span></a></l>\n" +
    "    </ul>\n" +
    "    <ng-switch on=\"video.thumbnails.items[0].url.length\">\n" +
    "      <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" class=\"video-thumb-container__thumb\" style=\"background-image: url('http://placehold.it/218x122')\" ng-switch-when=\"0\">\n" +
    "      <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" class=\"video-thumb-container__thumb\" style=\"background-image: url('(~ video.thumbnails.items[0].url ~)')\" ng-switch-default>\n" +
    "    </ng-switch>\n" +
    "  </div>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('organise.html',
    "<main role=\"main\" class=\"page-content\" ng-controller=\"OrganiseCtrl\">\n" +
    "  <div class=\"wrapper  wrapper--fixed\">\n" +
    "    <organise-breadcrumb tag=\"tag\" filter=\"customFilterFunction\"></organise-breadcrumb>\n" +
    "    <div class=\"layout\">\n" +
    "      <organise-navigation tags=\"tags\" current-tag=\"tag\" custom-filter-function=\"customFilterFunction\"></organise-navigation>\n" +
    "      <div class=\"layout__item  two-thirds\">\n" +
    "        <organise-collection ng-show=\"tag\" tag=\"tag\" is-edit=\"isEdit\"></organise-collection>  \n" +
    "        <organise-video-list videos=\"videos\" tag=\"tag\" custom-filter-function=\"customFilterFunction\"></organise-video-list>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</main>\n"
  );


  $templateCache.put('page-footer.html',
    "<footer class=\"page-footer\" role=\"contentinfo\">\n" +
    "  <div class=\"wrapper\">\n" +
    "    <ul class=\"nav  footer-nav\">\n" +
    "      <li class=\"footer-nav__item\"><a href=\"#\" class=\"footer-nav__link\">iOS App</a></li>\n" +
    "      <li class=\"footer-nav__item\"><a href=\"#\" class=\"footer-nav__link\">Help</a></li>\n" +
    "      <li class=\"footer-nav__item\"><a href=\"#\" class=\"footer-nav__link\">API</a></li>\n" +
    "      <li class=\"footer-nav__item\"><a href=\"#\" class=\"footer-nav__link\">Blog</a></li>\n" +
    "      <li class=\"footer-nav__item\"><a href=\"#\" class=\"footer-nav__link\">Twitter</a></li>\n" +
    "      <li class=\"footer-nav__item\"><a href=\"#\" class=\"footer-nav__link\">Facebook</a></li>\n" +
    "      <li class=\"footer-nav__item\"><a href=\"#\" class=\"footer-nav__link\">LinkedIn</a></li>\n" +
    "      <li class=\"footer-nav__item\"><a href=\"#\" class=\"footer-nav__link\">Instagram</a></li>\n" +
    "    \n" +
    "      <li class=\"footer-nav__item\"><a class=\"footer-nav__link\" ng-click=\"testNotify('success')\">SUCCESS</a></li>\n" +
    "      <li class=\"footer-nav__item\"><a class=\"footer-nav__link\" ng-click=\"testNotify('warning')\">WARNING</a></li>\n" +
    "      <li class=\"footer-nav__item\"><a class=\"footer-nav__link\" ng-click=\"testNotify('error')\">ERROR</a></li>\n" +
    "      <li class=\"footer-nav__item\"><a class=\"footer-nav__link\" ng-click=\"testNotify('info')\">INFO</a></li>\n" +
    "    \n" +
    "      <li class=\"footer-nav__item  f--right\">&copy; 2014 Wonder PL, Ltd.</li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</footer>"
  );


  $templateCache.put('page-header.html',
    "<header class=\"page-header\" role=\"header\">\n" +
    "  <nav class=\"wrapper\" role=\"navigation\">\n" +
    "    <ng-switch on=\"$root.isCollaborator\">\n" +
    "    <a href=\"\" class=\"page-logo  page-logo--header\" ng-switch-when=\"true\">\n" +
    "      <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" class=\"page-logo__img\" alt=\"Wonder PL\">\n" +
    "    </a>\n" +
    "    <a href=\"#/\" class=\"page-logo  page-logo--header\" ng-switch-default=\"\">\n" +
    "      <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" class=\"page-logo__img\" alt=\"Wonder PL\">\n" +
    "    </a>\n" +
    "    </ng-switch>\n" +
    "    <upload-progress upload=\"upload\" ng-if=\"isLoggedIn\"></upload-progress>\n" +
    "    <ul class=\"nav  nav-menu\" ng-if=\"isLoggedIn\">\n" +
    "      <li class=\"nav-menu__item\"><a href=\"#/organise\" class=\"nav-menu__link\">Manage</a></li>\n" +
    "      <li class=\"nav-menu__item\"><a href=\"#/video\" class=\"nav-menu__link\">Upload</a></li>\n" +
    "      <li class=\"nav-menu__item\"><a href=\"#/profile\" class=\"nav-menu__link  avatar  avatar--small\"><img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" alt=\"(~ user.name ~)\" class=\"avatar__img\" ng-style=\"profile\"></a></li>\n" +
    "    </ul>\n" +
    "  </nav>\n" +
    "</header>"
  );


  $templateCache.put('profile-cover.html',
    "<section class=\"profile-cover\"\n" +
    "  ng-class=\"{ 'profile-cover--edit' : isEdit, 'profile-cover--hero' : isHero }\"\n" +
    "  style=\"background-image:url('(~ image ~)');\">\n" +
    "\n" +
    "  <label class=\"profile-cover__upload-label\" for=\"profileCoverUpload\">\n" +
    "    <div class=\"profile-cover__dropzone\"\n" +
    "      ng-file-drop=\"uploadProfileCover($files)\"\n" +
    "      ng-file-drag-over-class=\"profile-cover__dropzone--active\"\n" +
    "      ng-show=\"isEdit\">\n" +
    "    </div>\n" +
    "  </label>\n" +
    "\n" +
    "  <input class=\"profile-cover__upload\" type=\"file\" id=\"profileCoverUpload\" ng-file-select=\"uploadProfileCover($files)\" />\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('profile-image.html',
    "<section class=\"profile-image\">\n" +
    "\n" +
    "  <div class=\"profile-image__container\"\n" +
    "    ng-class=\"{ 'profile-image__container--edit' : isEdit }\"\n" +
    "    style=\"background-image:url('(~ image ~)');\">\n" +
    "\n" +
    "  <label class=\"profile-image__upload-label\" for=\"profileImageUpload\">\n" +
    "    <div class=\"profile-image__dropzone\"\n" +
    "      ng-file-drop=\"uploadProfileImage($files)\"\n" +
    "      ng-file-drag-over-class=\"profile-image__dropzone--active\"\n" +
    "      ng-show=\"isEdit\">\n" +
    "    </div>\n" +
    "  </label>\n" +
    "\n" +
    "  <input class=\"profile-image__upload\" type=\"file\" id=\"profileImageUpload\" ng-file-select=\"uploadProfileImage($files)\" />\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('profile-navigation.html',
    "<section class=\"sub-navigation\">\n" +
    "\n" +
    "  <ul class=\"sub-navigation__modes\">\n" +
    "    <li class=\"sub-navigation__mode\" ng-hide=\"isEdit\">\n" +
    "      <a class=\"sub-navigation__link btn btn--utility\" ng-click=\"isEdit = true\">edit</a>\n" +
    "    </li>\n" +
    "    <li class=\"sub-navigation__mode\" ng-show=\"isEdit\">\n" +
    "      <a class=\"sub-navigation__link btn btn--utility\" ng-click=\"save()\">save</a>\n" +
    "    </li>\n" +
    "    <li class=\"sub-navigation__mode\" ng-show=\"isEdit\">\n" +
    "      <a class=\"sub-navigation__link btn btn--utility\" ng-click=\"cancel()\">cancel</a>\n" +
    "    </li>\n" +
    "    <li class=\"sub-navigation__mode\">\n" +
    "      <a class=\"sub-navigation__link btn btn--utility\" href=\"/logout\">logout</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('profile-video-hero.html',
    "<section class=\"profile-video-hero\">\n" +
    "\n" +
    "  <profile-cover is-hero=\"true\" image=\"account.profile_cover\"></profile-cover>\n" +
    "  <profile-image image=\"account.avatar\"></profile-image>\n" +
    "\n" +
    "  <h2 class=\"profile__name\" ng-bind=\"account.display_name\"></h2>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('profile.html',
    "<section class=\"profile\" ng-controller=\"ProfileCtrl\">\n" +
    "\n" +
    "  <div class=\"profile-view__nav-placeholder sub-navigation__placeholder\">\n" +
    "    <profile-navigation is-edit=\"isEdit\"></profile-navigation>\n" +
    "  </div>\n" +
    "\n" +
    "\n" +
    "  <profile-cover image=\"profile.profile_cover\" is-edit=\"isEdit\"></profile-cover>\n" +
    "\n" +
    "  <profile-image image=\"profile.avatar\" is-edit=\"isEdit\"></profile-image>\n" +
    "\n" +
    "  <h2 class=\"profile__name\"\n" +
    "    ng-show=\"isEdit\"\n" +
    "    medium-editor\n" +
    "    data-placeholder=\"(~ profile.name ? ' ' : 'name' ~)\"\n" +
    "    options=\"{ disableToolbar : true, forcePlainText : true, disableReturn : true }\"\n" +
    "    ng-model=\"profile.display_name\">\n" +
    "  </h2>\n" +
    "\n" +
    "  <h2 class=\"profile__name\" ng-hide=\"isEdit\" ng-bind=\"profile.display_name\"></h2>\n" +
    "\n" +
    "  <div class=\"profile__description\"\n" +
    "    ng-show=\"isEdit\"\n" +
    "    medium-editor\n" +
    "    data-placeholder=\"(~ profile.description ? ' ' : 'description' ~)\"\n" +
    "    options=\"{ buttons : ['bold', 'italic', 'header1', 'header2', 'unorderedlist', 'quote'], firstHeader : 'h2', secondHeader : 'h3' }\"\n" +
    "    ng-model=\"profile.description\">\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"profile__description\" ng-hide=\"isEdit\" ng-bind-html=\"profile.description\"></div>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('upload-progress.html',
    "<section class=\"upload-progress\">\n" +
    "  <span ng-show=\"upload && upload.progress && upload.progress > 0 && upload.progress < 100\">(~ upload.progress ~)%</span>\n" +
    "  <span>(~ upload.status ~)</span>\n" +
    "</section>"
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


  $templateCache.put('layout-control.html',
    "<section ng-show=\"isComments\" class=\"layout-control layout-control--(~ isComments ? $root.layoutMode : 'column' ~)\">\n" +
    "  <div class=\"btn-group\">\n" +
    "    <a class=\"btn btn--small\" ng-click=\"reposition('mirror')\"><i class=\"icon  icon--split-vertical-alt\"></i></a>\n" +
    "    <a class=\"btn btn--small\" ng-click=\"reposition('column')\"><i class=\"icon  icon--split-horizontal\"></i></a>\n" +
    "    <a class=\"btn btn--small\" ng-click=\"reposition('wide')\"><i class=\"icon  icon--split-vertical\"></i></a>\n" +
    "  </div>\n" +
    "</section>"
  );


  $templateCache.put('video-collaborators.html',
    "<section class=\"video-collaborators video-collaborators--(~ $root.layoutMode ~)\">\n" +
    "\n" +
    "  <header class=\"video-collaborators__header\">\n" +
    "    <h4 class=\"video-collaborators__title\">collaborators</h4>\n" +
    "    <a class=\"button button--primary button--small video-collaborators__notify\"\n" +
    "      ng-click=\"notify(videoId)\"\n" +
    "      ng-class=\"{ 'button--disabled' : notified || !collaborators || !comments.length }\">Notify All</a>\n" +
    "  </header>\n" +
    "\n" +
    "  <p class=\"video-collaborators__none-message\" ng-hide=\"collaborators\">You have no collaborators!</p>\n" +
    "\n" +
    "  <ul class=\"video-collaborators__collaborators\" ng-show=\"collaborators\">\n" +
    "    <li class=\"video-collaborators__collaborator\" ng-repeat=\"collaborator in collaborators\">\n" +
    "      <span class=\"video-collaborators__collaborator-image\" style=\"background-image: url('(~ collaborator.avatar_url ~)');\"></span>\n" +
    "      <div class=\"video-collaborators__collaborator-name-container\">\n" +
    "        <span class=\"video-collaborators__collaborator-name truncate\" ng-bind=\"collaborator.username\"></span>\n" +
    "      </div>\n" +
    "    </li>\n" +
    "<!--     <li class=\"video-collaborators__collaborator\">\n" +
    "      <span class=\"video-collaborators__collaborator-image\" style=\"background-image: url('http://media.dev.wonderpl.com/images/avatar/thumbnail_medium/kHmU0Pn5E1dVK3K68Okjgw.jpg');\"></span>\n" +
    "      <span class=\"video-collaborators__collaborator-name\">Tom Aitkens</span>\n" +
    "    </li>\n" +
    "    <li class=\"video-collaborators__collaborator\">\n" +
    "      <span class=\"video-collaborators__collaborator-image\" style=\"background-image: url('http://media.dev.wonderpl.com/images/avatar/thumbnail_medium/kHmU0Pn5E1dVK3K68Okjgw.jpg');\"></span>\n" +
    "      <span class=\"video-collaborators__collaborator-name\">Tom Aitkens 2</span>\n" +
    "    </li> -->\n" +
    "  </ul>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('video-color-picker.html',
    "<section class=\"video-player-config color-picker\">\n" +
    "  <input color-picker ng-model=\"color\" class=\"video-player-config__color-input\" />\n" +
    "  <label class=\"video-player-config__hide-logo-label\">\n" +
    "    Hide logo\n" +
    "    <input type=\"checkbox\" ng-model=\"hideLogo\" class=\"video-player-config__hide-logo-checkbox\" ng-change=\"toggleHideLogo()\" />\n" +
    "  </label>\n" +
    "</section>\n"
  );


  $templateCache.put('video-comments.html',
    "<section class=\"video-feedback video-feedback--(~ $root.layoutMode ~)\">\n" +
    "\n" +
    "  <section\n" +
    "    class=\"video-feedback__form\"\n" +
    "    ng-class=\"{ 'video-feedback__form--active' : inputActive }\">\n" +
    "    <section class=\"video-feedback__input-container\">\n" +
    "\n" +
    "      <div class=\"video-feedback__comment\">\n" +
    "        <a class=\"video-feedback__comment-profile-image\" ng-style=\"{ 'background-image' : 'url(' + $root.User.avatar + ')' }\" ng-show=\"$root.User\"></a>\n" +
    "        <a class=\"video-feedback__comment-profile-image\" style=\"background-image: url('(~ $root.User.avatar_url ~)');\" ng-show=\"$root.isCollaborator\"></a>\n" +
    "        <div class=\"video-feedback__comment-details\">\n" +
    "          <span class=\"video-feedback__comment-name\" ng-show=\"$root.User\">(~ $root.User.display_name ~)</span>\n" +
    "          <span class=\"video-feedback__comment-name\" ng-show=\"$root.isCollaborator\">(~ $root.User.username ~)</span>\n" +
    "        </div>\n" +
    "        <div class=\"video-feedback__comment-content\">\n" +
    "          <span class=\"video-feedback__comment-timestamp\">\n" +
    "            @<a class=\"video-feedback__comment-timestamp-link\" ng-bind=\"(currentTime | time)\"></a>\n" +
    "          </span>\n" +
    "          <div class=\"video-feedback__comment-text\">\n" +
    "            <textarea class=\"video-feedback__input js-video-feedback-input\"\n" +
    "              placeholder=\"Hit the space bar to pause the video and write your comments here&hellip;\"\n" +
    "              ng-model=\"commentText\"\n" +
    "              ng-class=\"{ 'video-feedback__input--active' : inputActive }\"\n" +
    "              ng-focus=\"inputActive = true\"\n" +
    "              ng-blur=\"inputActive = false\"\n" +
    "              focus=\"inputActive\">\n" +
    "            </textarea>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <a class=\"video-feedback__button button button--primary push-bottom\"\n" +
    "        ng-click=\"addComment()\">\n" +
    "        submit\n" +
    "      </a>\n" +
    "    </section>\n" +
    "\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"video-feedback__comments\">\n" +
    "\n" +
    "    <div class=\"video-feedback__comments-filter\">\n" +
    "      <label>\n" +
    "        <span class=\"video-feedback__comments-filter-label\">View:</span>\n" +
    "        <select class=\"video-feedback__comments-filters button button--small\" ng-model=\"filterResolved\">\n" +
    "          <option class=\"video-feedback__comments-filter\" value=\"\" selected=\"selected\">All</option>\n" +
    "          <option class=\"video-feedback__comments-filter\" value=\"false\">Unresolved</option>\n" +
    "        </select>\n" +
    "      </label>\n" +
    "    </div>\n" +
    "\n" +
    "    <ul class=\"video-feedback__comments-list\">\n" +
    "      <li id=\"comment-(~ comment.id ~)\"\n" +
    "        class=\"video-feedback__comment\"\n" +
    "        ng-class=\"{ 'video-feedback__comment--active' : isTimeSync(comment.timestamp) }\"\n" +
    "        ng-repeat=\"comment in comments | orderBy : 'timestamp' | filter: { resolved : filterResolved }\">\n" +
    "          <div ng-class=\"{ 'video-feedback__comment--resolved' : comment.resolved }\">\n" +
    "            <a class=\"video-feedback__comment-profile-image\" style=\"background-image: url('(~ comment.avatar_url ~)');\"></a>\n" +
    "            <div class=\"video-feedback__comment-details\">\n" +
    "              <span class=\"video-feedback__comment-name\" ng-bind=\"comment.username\"></span>\n" +
    "              <span class=\"video-feedback__comment-time-posted\" ng-bind=\"comment.datetime | prettyDate\"></span>\n" +
    "              <span class=\"video-feedback__comment-resolved\" ng-class=\"{ 'video-feedback__comment-resolved--active' : replyActive && comment.resolved }\">resolved</span>\n" +
    "            </div>\n" +
    "            <div class=\"video-feedback__comment-content\">\n" +
    "              <span class=\"video-feedback__comment-timestamp\" ng-show=\"!isNaN(comment.timestamp)\">\n" +
    "                @<a class=\"video-feedback__comment-timestamp-link\" ng-click=\"videoSeek(comment.timestamp)\" ng-bind=\"(comment.timestamp | time)\"></a>\n" +
    "              </span>\n" +
    "              <div class=\"video-feedback__comment-text\">\n" +
    "                (~ comment.comment ~)\n" +
    "              </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        <div class=\"video-feedback__comment-controls\">\n" +
    "          <a class=\"video-feedback__reply-link\"\n" +
    "            ng-hide=\"comment.resolved\"\n" +
    "            ng-click=\"reply(comment.timestamp)\">\n" +
    "            reply\n" +
    "          </a>\n" +
    "          <a class=\"video-feedback__resolve-link\"\n" +
    "            ng-hide=\"comment.resolved || !isOwner\"\n" +
    "            ng-click=\"resolve(comment.id)\">\n" +
    "            resolve\n" +
    "          </a>\n" +
    "          <a class=\"video-feedback__resolve-link\"\n" +
    "            ng-show=\"comment.resolved && isOwner\"\n" +
    "            ng-click=\"unresolve(comment.id)\">\n" +
    "            reopen\n" +
    "          </a>\n" +
    "        </div>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "\n" +
    "  </section>\n" +
    "\n" +
    "</section>\n" +
    "\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('video-download.html',
    "<a class=\"btn  btn--utility  icon-text  f--left\" ng-click=\"download()\"><i class=\"icon  icon--download  icon-text__icon\"></i>Download source file</a>"
  );


  $templateCache.put('video-edit.html',
    "<section class=\"video-edit\">\n" +
    "\n" +
    "<section class=\"video-edit__zone video-edit__preview\" ng-click=\"updatePreview()\"></section>\n" +
    "\n" +
    "<section class=\"video-edit__zone video-edit__player-controls\" ng-click=\"showColorPicker = !showColorPicker\"></section>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('video-extended-controls.html',
    "<section class=\"video-extended-controls\" ng-show=\"isEdit\">\n" +
    "  <section class=\"video-extended-controls__section\" ng-class=\"{ 'video-extended-controls__section--expanded' : addCategoryShow }\">\n" +
    "    <i class=\"icon  icon--medium  icon--plus  section-drawer__icon\" ng-click=\"addCategoryShow = !addCategoryShow\" ng-hide=\"addCategoryShow\"></i>\n" +
    "    <i class=\"icon  icon--medium  icon--minus  section-drawer__icon\" ng-click=\"addCategoryShow = !addCategoryShow\" ng-show=\"addCategoryShow\"></i>\n" +
    "    <category-add-video selected-category=\"video.category\"\n" +
    "      show-category=\"addCategoryShow\"\n" +
    "      class=\"video-extended-controls__section-contents\">\n" +
    "    </category-add-video>\n" +
    "    <span class=\"button button--primary\" ng-click=\"save(); addCategoryShow = !addCategoryShow\">Done</span>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"video-extended-controls__section\"\n" +
    "    ng-class=\"{ 'video-extended-controls__section--expanded' : addCollectionShow }\">\n" +
    "    <i class=\"icon  icon--medium  icon--plus  section-drawer__icon\" ng-click=\"addCollectionShow = !addCollectionShow\" ng-hide=\"addCollectionShow\"></i>\n" +
    "    <i class=\"icon  icon--medium  icon--minus  section-drawer__icon\" ng-click=\"addCollectionShow = !addCollectionShow\" ng-show=\"addCollectionShow\"></i>\n" +
    "    <collection-add-video available-tags=\"tags\"\n" +
    "      video=\"video\"\n" +
    "      show-collection=\"addCollectionShow\"\n" +
    "      class=\"video-extended-controls__section-contents\">\n" +
    "    </collection-add-video>\n" +
    "    <span class=\"button button--primary\" ng-click=\"save(); addCollectionShow = !addCollectionShow\">Done</span>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"video-extended-controls__section\" ng-class=\"{ 'video-extended-controls__section--expanded' : addCollaboratorShow }\">\n" +
    "    <i class=\"icon  icon--medium  icon--plus  section-drawer__icon\" ng-click=\"addCollaboratorShow = !addCollaboratorShow\" ng-hide=\"addCollaboratorShow\"></i>\n" +
    "    <i class=\"icon  icon--medium  icon--minus  section-drawer__icon\" ng-click=\"addCollaboratorShow = !addCollaboratorShow\" ng-show=\"addCollaboratorShow\"></i>\n" +
    "    <add-collaborator class=\"video-extended-controls__section-contents\"\n" +
    "      video=\"video\"\n" +
    "      show-collaborator=\"addCollaboratorShow\">\n" +
    "    </add-collaborator>\n" +
    "  </section>\n" +
    "</section>"
  );


  $templateCache.put('video-frame-stepper.html',
    "<section class=\"video-frame-stepper\">\n" +
    "\n" +
    "  <ul>\n" +
    "    <li class=\"inline-space-fix video-frame-stepper__block\">\n" +
    "      <a class=\"button button__component button__component--left\" ng-click=\"step(-1)\">&lt;</a>\n" +
    "    </li>\n" +
    "    <li class=\"inline-space-fix video-frame-stepper__block\">\n" +
    "      <div class=\"button button__component button button__component--input-container\">\n" +
    "        <input class=\"video-frame-stepper__input\" ng-model=\"videoTime\" />\n" +
    "      </div>\n" +
    "    </li>\n" +
    "    <li class=\"inline-space-fix video-frame-stepper__block\">\n" +
    "      <a class=\"button button__component button__component--right\" ng-click=\"step(1)\">&gt;</a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('video-indicators.html',
    "<section class=\"video-indicators\" ng-click=\"seekByPosition($event)\">\n" +
    "  <div class=\"video-indicators__scrubber\" ng-model=\"scrubber\" style=\"left: (~ (currentTime/totalTimeInSeconds)*100 ~)%\"></div>\n" +
    "  <ul class=\"video-indicators__comment-indicators\">\n" +
    "    <li class=\"video-indicators__comment-indicator\"\n" +
    "      ng-repeat=\"comment in comments\"\n" +
    "      ng-class=\"{ 'video-indicators__comment-indicator--resolved' : comment.resolved }\"\n" +
    "      data-timestamp=\"(~ comment.timestamp ~)\"\n" +
    "      data-total-time-in-seconds=\"(~ totalTimeInSeconds ~)\"\n" +
    "      style=\"left: (~ (comment.timestamp/totalTimeInSeconds)*100 ~)%;\">\n" +
    "      <a data-id=\"(~ comment.id ~)\"\n" +
    "        ng-class=\"{ 'video-indicators__comment-link--active' : isTimeSync(comment.timestamp), 'video-indicators__comment-link--resolved' : comment.resolved }\"\n" +
    "        class=\"video-indicators__comment-link\"\n" +
    "        ng-click=\"seek(comment.timestamp)\">\n" +
    "      </a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</section>"
  );


  $templateCache.put('video-list-grid.html',
    "<ul id=\"video-list-grid\" class=\"library\" ng-class=\"{ loading: loading }\">\n" +
    "    <li pl-draggable draggable=\"true\" ng-repeat=\"(key, video) in filter.results\" class=\"row\" data-id=\"(~ key ~)\" style=\"background: transparent url((~ video.thumbnail ~)) center center no-repeat; background-size: 100% auto;\">\n" +
    "        <div class=\"content\">\n" +
    "            <span class=\"title\">(~ video.title ~)</span>\n" +
    "            <span class=\"number-of-collections\" ng-click=\"showAllCollections($event,key)\">( in <span ng-class=\"{ active: video.collections.length > 0}\">(~ video.collections.length ~) collections</span> )</span>\n" +
    "            <a href=\"#/video/(~ key ~)\" class=\"button edit\"><span class=\"icon-info\"></span></a>\n" +
    "            <a href=\"#/analytics/(~ key ~)/overview\" class=\"button analytics\" title=\"View analytics for this video\"><span title=\"View analytics for this video\" class=\"icon-pie\"></span></a>\n" +
    "            <div data-id=\"(~ key ~)\" class=\"pl-checkbox\"></div>\n" +
    "        </div>\n" +
    "    </li>\n" +
    "</ul>"
  );


  $templateCache.put('video-list-list.html',
    "<ul id=\"video-list-list\" class=\"library\" ng-class=\"{ loading: loading }\">\n" +
    "    <li ng-repeat=\"(key, video) in filter.results\" class=\"row\" data-id=\"(~ key ~)\">\n" +
    "        <span class=\"title\"><a href=\"#/video/(~ key ~)\">(~ video.title ~)</a></span>\n" +
    "        <span class=\"number-of-collections\" ng-click=\"showAllCollections($event,key)\">( in <span ng-class=\"{ active: video.collections.length > 0}\">(~ video.collections.length ~) collections</span> )</span>\n" +
    "        <a href=\"#/video/(~ key ~)\" class=\"button edit\"><span class=\"icon-info\"></span></a>\n" +
    "        <a href=\"#/analytics/(~ key ~)/overview\" class=\"button analytics\" title=\"View analytics for this video\"><span title=\"View analytics for this video\" class=\"icon-pie\"></span></a>\n" +
    "        <div data-id=\"(~ key ~)\" class=\"pl-checkbox\"></div>\n" +
    "    </li>\n" +
    "</ul>"
  );


  $templateCache.put('video-more-link.html',
    "<section class=\"video-more\">\n" +
    "\n" +
    "  <a class=\"video-more__link btn\" ng-click=\"(showMoreLinkConfigPanel = !showMoreLinkConfigPanel)\" ng-show=\"isEdit\">(~ text ? text : 'Add a link (optional) &hellip;' ~)</a>\n" +
    "\n" +
    "  <a class=\"video-more__link btn  btn--positive\" href=\"(~ url ~)\" ng-hide=\"isEdit\">(~ text ~)</a>\n" +
    "\n" +
    "  <section class=\"video-more__form\" ng-class=\"{ 'video-more__form--active' : showMoreLinkConfigPanel }\" ng-show=\"isEdit\">\n" +
    "\n" +
    "    <section class=\"video-more__controls-container\">\n" +
    "\n" +
    "      <form name=\"videoMoreLink\" ng-submit=\"videoMoreLink.$valid && save(); isSubmitted = true\">\n" +
    "\n" +
    "        <label class=\"video-more__label video-more__label--text\">\n" +
    "          <input class=\"video-more__input video-more__input--short\"\n" +
    "            name=\"linkText\"\n" +
    "            ng-model=\"text\"\n" +
    "            placeholder=\"Custom text&hellip;\"\n" +
    "            required\n" +
    "            ng-maxlength=\"30\" />\n" +
    "          <span class=\"video-more__character-count\"\n" +
    "            ng-bind=\"remaining\"></span>\n" +
    "        </label>\n" +
    "\n" +
    "        <span class=\"video-more__error\" ng-show=\"isSubmitted && videoMoreLink.linkText.$error.required\">Enter text</span>\n" +
    "        <span class=\"video-more__error\" ng-show=\"isSubmitted && videoMoreLink.linkText.$error.maxlength\">Too many characters</span>\n" +
    "\n" +
    "        <label class=\"video-more__label video-more__label--link\">\n" +
    "          <input class=\"video-more__input\"\n" +
    "            name=\"linkUrl\"\n" +
    "            ng-model=\"url\"\n" +
    "            required\n" +
    "            ng-pattern=\"/^[h|H][t|T][t|T][p|P][s|S]?:\\/\\/.*/\"\n" +
    "            placeholder=\"Link URL\" />\n" +
    "        </label>\n" +
    "\n" +
    "        <span class=\"video-more__error\" ng-show=\"isSubmitted && videoMoreLink.linkUrl.$error.pattern\">Incorrect format: http://&hellip;</span>\n" +
    "        <span class=\"video-more__error\" ng-show=\"isSubmitted && videoMoreLink.linkUrl.$error.required\">Enter URL</span>\n" +
    "\n" +
    "        <p class=\"video-more__hint\"><strong>Hint:</strong> Drive traffic to your website by adding a link</p>\n" +
    "\n" +
    "        <input class=\"btn  btn--positive\" type=\"submit\" value=\"Okay\" />\n" +
    "\n" +
    "      </form>\n" +
    "\n" +
    "    </section>\n" +
    "\n" +
    "  </section>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('video-navigation.html',
    "<section class=\"sub-navigation video-view-control-panel sub-navigation--(~ isComments ? $root.layoutMode : 'column' ~)\">\n" +
    "\n" +
    "  <video-download video-id=\"videoId\" ng-show=\"videoId\"></video-download>\n" +
    "\n" +
    "  <ul class=\"sub-navigation__modes\">\n" +
    "    <li class=\"sub-navigation__mode\" ng-show=\"isEdit\">\n" +
    "      <a class=\"sub-navigation__link btn  btn--utility  icon-text\" ng-click=\"save()\">\n" +
    "        <i class=\"icon  icon--check  icon-text__icon\"></i>\n" +
    "        Save Changes\n" +
    "      </a>\n" +
    "    </li>\n" +
    "    <li class=\"sub-navigation__mode\" ng-show=\"isEdit\">\n" +
    "      <a class=\"sub-navigation__link btn  btn--utility  icon-text\" ng-click=\"cancel()\">\n" +
    "        <i class=\"icon  icon--cross  icon-text__icon\"></i>\n" +
    "        Cancel\n" +
    "      </a>\n" +
    "    </li>\n" +
    "    <li class=\"sub-navigation__mode\" ng-hide=\"isEdit || !isOwner\"> <!-- ng-show=\"video.status=='published'\" -->\n" +
    "      <a class=\"sub-navigation__link btn  btn--utility  icon-text\" ng-click=\"displaySection('edit')\">\n" +
    "        <i class=\"icon  icon--edit  icon-text__icon\"></i>\n" +
    "        Edit Video\n" +
    "      </a>\n" +
    "    </li>\n" +
    "    <li class=\"sub-navigation__mode\" ng-hide=\"isEdit\">\n" +
    "      <a class=\"sub-navigation__link btn  btn--utility  icon-text\" ng-click=\"displaySection('')\">\n" +
    "        <i class=\"icon  icon--eye  icon-text__icon\"></i>\n" +
    "        Review\n" +
    "      </a>\n" +
    "    </li>\n" +
    "    <li class=\"sub-navigation__mode\" ng-hide=\"isEdit\">\n" +
    "      <a class=\"sub-navigation__link btn  btn--utility  icon-text\" ng-click=\"displaySection('comments')\">\n" +
    "        <i class=\"icon  icon--speech-bubble  icon-text__icon\"></i>\n" +
    "        Comments\n" +
    "      </a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</section>"
  );


  $templateCache.put('video-player.html',
    "<section class=\"video-player\">\n" +
    "  <div class=\"video-player__iframe-container\">\n" +
    "    <iframe id=\"VideoPlayerIFrame\" class=\"video-player__frame\" ng-src=\"(~ embedUrl ~)\"  width=\"100%\" height=\"100%\" frameborder=\"0\" allowfullscreen></iframe>\n" +
    "  </div>\n" +
    "</section>"
  );


  $templateCache.put('video-share.html',
    "<section class=\"video-share\">\n" +
    "  <div class=\"btn-center  btn-group\">\n" +
    "    <a href=\"\" class=\"btn  btn--small\" ng-class=\"{ 'btn--disabled' : !hasTags || hasTags === 'false' }\" ng-click=\"showEmbedCode = !showEmbedCode\">\n" +
    "      <i class=\"icon  icon--medium  icon--code\"></i>\n" +
    "    </a>\n" +
    "    <a href=\"\" class=\"btn  btn--small\" ng-class=\"{ 'btn--disabled' : !hasTags || hasTags === 'false' }\" ng-click=\"shareTwitter()\">\n" +
    "      <i class=\"icon  icon--medium  icon--twitter\"></i>\n" +
    "    </a>\n" +
    "    <a href=\"\" class=\"btn  btn--small\" ng-class=\"{ 'btn--disabled' : !hasTags || hasTags === 'false' }\" ng-click=\"shareFacebook()\">\n" +
    "      <i class=\"icon  icon--medium  icon--facebook\" ></i>\n" +
    "    </a>\n" +
    "  </div>\n" +
    "  <section class=\"video-share__embed-code-container\"\n" +
    "    ng-class=\"{ 'video-share__embed-code-container--active' : showEmbedCode }\">\n" +
    "  <label class=\"video-share__embed-code-label\">\n" +
    "    <input class=\"video-share__embed-code-field\" placeholder=\"embed link\" ng-model=\"embedCode.html\" />\n" +
    "  </label>\n" +
    "\n" +
    "  </section>\n" +
    "</section>"
  );


  $templateCache.put('video-thumbnail.html',
    "<section class=\"video-preview\" ng-class=\"{ 'video-preview--invert' : invertPreviewSelector }\">\n" +
    "\n" +
    "  <iframe ng-hide=\"videoHasLoaded\" class=\"video-preview__frame\" src=\"/embed/88888888/?controls=1\"></iframe>\n" +
    "\n" +
    "  <a class=\"video-thumbnail__option video-thumbnail__option--select\" ng-class=\"{ 'video-thumbnail__option--disabled' : video.status !== 'ready' }\" ng-hide=\"showThumbnailSelector\" ng-click=\"(video.status !== 'ready') || selectThumbnail()\">Pick a generated thumbnail</a>\n" +
    "\n" +
    "  <section class=\"video-thumbnail__option video-thumbnail__option--upload\" ng-hide=\"showThumbnailSelector\" ng-file-drop=\"onPreviewImageSelect($files)\">\n" +
    "    <p>Choose your own thumbnail</p>\n" +
    "    <input type=\"file\" ng-file-select=\"onPreviewImageSelect($files)\" />\n" +
    "    <div ng-file-drop-available=\"dropSupported=true\" ng-show=\"!dropSupported\">HTML5 Drop File is not supported!</div>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"video-thumbnail__option video-preview__option--cancel\"\n" +
    "    ng-hide=\"showThumbnailSelector\"\n" +
    "    ng-class=\"{ 'video-preview__option--disabled' : !videoHasLoaded }\"\n" +
    "    ng-click=\"!videoHasLoaded || closePreviewSelector()\">\n" +
    "    <p ng-hide=\"!videoHasLoaded\">Cancel</p>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"video-thumbnail__selector\" ng-show=\"showThumbnailSelector\">\n" +
    "    <a class=\"video-preview__close-link\" ng-click=\"closePreviewSelector()\">×</a>\n" +
    "    <section class=\"video-preview__images-container\">\n" +
    "      <ul class=\"video-preview__available-images js-preview-images\" style=\"width: (~ previewImages.length * 500 ~)px\" ng-style=\"indexOffset\">\n" +
    "        <li class=\"video-preview__available-image-container (~ $index ~)\"\n" +
    "          ng-class=\"{ 'video-preview__available-image-container--active' : previewIndex === $index }\"\n" +
    "          ng-repeat=\"preview in previewImages\">\n" +
    "          <img class=\"video-preview__available-image\"\n" +
    "            ng-class=\"{ 'video-preview__available-image--active' : previewIndex === $index }\"\n" +
    "            ng-src=\"(~ preview.url ~)\"\n" +
    "            ng-click=\"updateIndex($index)\" />\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </section>\n" +
    "\n" +
    "    <section class=\"video-thumbnail__select-controls\">\n" +
    "      <a class=\"video-preview__select-control video-preview__previous-image-link inline-space-fix\" ng-click=\"previewIndex = previewIndex - 1\">&lt;</a>\n" +
    "      <span class=\"video-preview__select-control video-preview__preview-index inline-space-fix\">(~ previewIndex + 1 ~)/(~ previewImages.length ~)</span>\n" +
    "      <a class=\"video-preview__select-control video-preview__next-image-link inline-space-fix\" ng-click=\"previewIndex = previewIndex + 1\">&gt;</a>\n" +
    "\n" +
    "      <a class=\"video-thumbnail__select-link button button--primary button--wide\" ng-click=\"setBackground()\">Ok</a>\n" +
    "    </section>\n" +
    "\n" +
    "  </section>\n" +
    "\n" +
    "</section>\n"
  );


  $templateCache.put('video-upload.html',
    "<section class=\"video-upload\">\n" +
    "\n" +
    "  <div class=\"video-upload__dropzone\" ng-file-drop=\"onFileSelect($files)\" ng-file-drag-over-class=\"optional-css-class\" ng-show=\"dropSupported\">\n" +
    "    <p>Drag &amp; drop your video here</p>\n" +
    "    <img src=\"/static/assets/img/add-video.png\" />\n" +
    "    <p>or choose a video from your desktop</p>\n" +
    "    <input type=\"file\" ng-file-select=\"onFileSelect($files)\" />\n" +
    "  </div>\n" +
    "\n" +
    "  <div ng-file-drop-available=\"dropSupported=true\" ng-show=\"!dropSupported\">HTML5 Drop File is not supported!</div>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('video.html',
    "\n" +
    "<div ng-controller=\"VideoCtrl\" class=\"cf\">\n" +
    "\n" +
    "  <div class=\"video-view__nav-placeholder\" ng-hide=\"$root.isCollaborator\">\n" +
    "    <video-navigation is-edit=\"isEdit\" is-owner=\"isOwner\" is-comments=\"isComments\" video-id=\"video.id\"></video-navigation>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"configurable-layout configurable-layout-(~ isComments ? $root.layoutMode : 'column' ~)\">\n" +
    "\n" +
    "    <div class=\"layout-block layout-block__primary layout-block-primary--(~ isComments ? $root.layoutMode : 'column' ~)\" ng-class=\"{ 'layout-block--narrow' : isComments }\">\n" +
    "\n" +
    "      <section class=\"main-view video-view\">\n" +
    "\n" +
    "        <profile-video-hero ng-show=\"isCollaborator\" account=\"video.account\"></profile-video-hero>\n" +
    "\n" +
    "        <h2 class=\"video-view__title\"\n" +
    "          data-placeholder=\"(~ titlePlaceholder ~)\"\n" +
    "          medium-editor\n" +
    "          options=\"{ disableToolbar : true, forcePlainText : true, disableReturn : true }\"\n" +
    "          ng-model=\"video.title\"\n" +
    "          ng-show=\"isEdit\">\n" +
    "        </h2>\n" +
    "        <h3 class=\"video-view__sub-title\"\n" +
    "          data-placeholder=\"(~ straplinePlaceholder ~)\"\n" +
    "          medium-editor\n" +
    "          options=\"{ disableToolbar : true, forcePlainText : true, disableReturn : true }\"\n" +
    "          ng-model=\"video.strapline\"\n" +
    "          ng-show=\"isEdit\">\n" +
    "        </h2>\n" +
    "\n" +
    "        <h2 class=\"video-view__title\" ng-hide=\"isEdit\" ng-bind-html=\"video.title\" ng-class=\"{ 'video-view__title--small' : isComments }\"></h2>\n" +
    "        <h3 class=\"video-view__sub-title\" ng-hide=\"isEdit\" ng-bind-html=\"video.strapline\"></h2>\n" +
    "\n" +
    "        <div class=\"video-view__container\" ng-class=\"{'video-view__container--fixed': isEdit}\">\n" +
    "          <video-upload ng-show=\"showUpload && isEdit\" ng-cloak></video-upload>\n" +
    "          <video-player ng-show=\"hasProcessed\" embed-url=\"embedUrl\"></video-player>\n" +
    "          <video-edit ng-show=\"showVideoEdit && isEdit\"></video-edit>\n" +
    "          <video-color-picker player-parameters=\"playerParameters\" video-id=\"(~ video.id ~)\" ng-show=\"showColorPicker && isEdit\"></video-color-picker>\n" +
    "          <video-thumbnail ng-show=\"showPreviewSelector && isEdit\"></video-thumbnail>\n" +
    "        </div>\n" +
    "\n" +
    "        <video-more-link\n" +
    "          text=\"video.link_title\"\n" +
    "          url=\"video.link_url\"\n" +
    "          is-edit=\"(~ isEdit ~)\"\n" +
    "          ng-show=\"(isEdit || video.link_title && video.link_url) && !isComments\">\n" +
    "        </video-more-link>\n" +
    "\n" +
    "        <section class=\"video-view__description video-medium\"\n" +
    "          ng-class=\"{ 'video-view__description--edit' : isEdit }\"\n" +
    "          data-placeholder=\"(~ descriptionPlaceholder ~)\"\n" +
    "          medium-editor\n" +
    "          options=\"{ buttons : ['bold', 'italic', 'header1', 'header2', 'unorderedlist', 'quote'], firstHeader : 'h2', secondHeader : 'h3' }\"\n" +
    "          ng-model=\"video.description\"\n" +
    "          ng-show=\"isEdit\">\n" +
    "        </section>\n" +
    "\n" +
    "        <section\n" +
    "          class=\"video-view__description video-medium\"\n" +
    "          ng-bind-html=\"video.description\"\n" +
    "          ng-hide=\"isComments || isEdit\">\n" +
    "        </section>\n" +
    "\n" +
    "        <video-share\n" +
    "          video=\"video\"\n" +
    "          has-tags=\"(~ video.tags && video.tags.items && video.tags.items.length > 0 ~)\"\n" +
    "          ng-hide=\"isComments\"\n" +
    "          video-id=\"(~ video.id ~)\">\n" +
    "        </video-share>\n" +
    "\n" +
    "        <video-extended-controls ng-show=\"isEdit\"></video-extended-controls>\n" +
    "\n" +
    "        <video-download video-id=\"video.id\" ng-show=\"video.id && $root.isCollaborator && canDownload\"></video-download>\n" +
    "\n" +
    "        <div class=\"video-view__save-controls\" ng-show=\"isEdit\">\n" +
    "          <a ng-click=\"cancel()\" class=\"button\">cancel</a>\n" +
    "          <a ng-click=\"save()\" class=\"button button--primary\">save changes</a>\n" +
    "        </div>\n" +
    "\n" +
    "      </section>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"layout-block layout-block__secondary layout-block-secondary--(~ isComments ? $root.layoutMode : 'column' ~)\" ng-class=\"{ 'layout-block--narrow' : isComments }\">\n" +
    "\n" +
    "      <section class=\"cf video-view__comments\" ng-show=\"showComments()\">\n" +
    "        <video-indicators comments=\"comments\" current-time=\"videoCurrentTime\" total-time=\"videoTotalTime\"></video-indicators>\n" +
    "        <video-frame-stepper current-time=\"videoCurrentTime\"></video-frame-stepper>\n" +
    "        <video-collaborators notified=\"notified\" comments=\"comments\" ng-show=\"video.id && isComments && $root.layoutMode !== 'column'\" collaborators=\"collaborators\" video-id=\"(~ video.id ~)\"></video-collaborators>\n" +
    "      </section>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"layout-block layout-block__tertiary layout-block-tertiary--(~ isComments ? $root.layoutMode : 'column' ~)\">\n" +
    "      <section class=\"cf video-view__comments\" ng-show=\"showComments()\">\n" +
    "        <video-collaborators notified=\"notified\" comments=\"comments\" ng-show=\"video.id && isComments && $root.layoutMode === 'column'\" collaborators=\"collaborators\" video-id=\"(~ video.id ~)\"></video-collaborators>\n" +
    "        <video-comments notified=\"notified\" is-owner=\"isOwner\" comments=\"comments\" video-id=\"(~ video.id ~)\" current-time=\"videoCurrentTime\"></video-comments>\n" +
    "      </section>\n" +
    "    </div>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "  <layout-control is-comments=\"isComments\" ng-show=\"(!$root.isCollaborator || ($root.isCollaborator && canComment)) && \"></layout-control>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n"
  );
} ]);