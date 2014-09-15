angular.module('RomeoApp').run(['$templateCache', function($templateCache) {   'use strict';

  $templateCache.put('add-collaborator.html',
    "<section class=\"add-collaborator\">\n" +
    "\n" +
    "  <header class=\"video-extended-controls__section-header\" ng-click=\"addCollaboratorShow = !addCollaboratorShow\">\n" +
    "    <h4 class=\"video-extended-controls__section-header-title\" title=\"Invite people to review and comment on your video, or send someone a link to download it. Type in their name, email address and the permissions yo want to give them.\">\n" +
    "      Wonder Transfer\n" +
    "    </h4>\n" +
    "  </header>\n" +
    "\n" +
    "  <section class=\"video-add-collaborators\">\n" +
    "\n" +
    "    <input type=\"hidden\" ui-select2=\"select2Options\" ng-model=\"invite.collaborators\" />\n" +
    "\n" +
    "    <div class=\"video-add-collaborators__messages\">\n" +
    "      <p ng-show=\"collaboratorAdded\">New collaborator has been added.</p>\n" +
    "      <p class=\"video-add-collaborators__message--error\" ng-show=\"errors\">An error occured. Collaborator not added.</p>\n" +
    "    </div>\n" +
    "    <a class=\"btn btn--small btn--positive f--right\" ng-click=\"add()\">Send Link</a>\n" +
    "\n" +
    "  </section>\n" +
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
    "    <h4 class=\"video-extended-controls__section-header-title\" title=\"You can choose a category top associate your video with. This will make it easier for people to find it, once it has been published.\">\n" +
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
    "<div>\n" +
    "  <header class=\"video-extended-controls__section-header\" ng-if=\"!isModal\">\n" +
    "    <h4 class=\"video-extended-controls__section-header-title\">\n" +
    "      <span ng-click=\"showHideCollectionCtrl()\">\n" +
    "        (~ getTitle() ~)\n" +
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
    "  <section class=\"video-edit-collections\" ng-show=\"showCollection\" ng-if=\"!isModal\">\n" +
    "    <ul class=\"video-edit-collections__options\">\n" +
    "      <li class=\"video-edit-collections__option\" ng-click=\"hideAddRemoveAndShowCreateCollection()\" ng-class=\"{ 'video-edit-collections__option--modal' : isModal }\">\n" +
    "        <span class=\"video-edit-collections__option-title\">Create New Collection</span>\n" +
    "        <span class=\"video-edit-collections__option-count\"></span>\n" +
    "      </li>\n" +
    "\n" +
    "      <li class=\"video-edit-collections__option\" data-videos=\"(~ tag.video_count ~)\"\n" +
    "        ng-class=\"{\n" +
    "          'video-edit-collections__option--selected' : hasTag(tag.id),\n" +
    "          'video-edit-collections__option--modal' : isModal,\n" +
    "          'video-edit-collections__option--private' : !tag.public\n" +
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
    "  </section>\n" +
    "\n" +
    "\n" +
    "  <div class=\"modal__title  split\" ng-click=\"showCollection = !showCollection\"  ng-if=\"isModal\">\n" +
    "    <span class=\"split__title  t--block  w--600\">(~ getTitle() ~)</span>\n" +
    "    <ul ng-show=\"video.tags.items.length\" class=\"video-edit-collections__assigned-tags\">\n" +
    "      <li ng-repeat=\"tag in video.tags.items\" class=\"video-edit-collections__assigned-tag\">\n" +
    "        <span class=\"\" ng-bind-html=\"tag.label\"></span>\n" +
    "        <span class=\"video-edit-collections__remove-tag\" ng-click=\"removeTag(tag.id, $event)\">&times;</span>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "    <a class=\"modal__link\" ng-click=\"close()\"><i class=\"icon icon--medium icon--circle-cross\"></i></a>\n" +
    "  </div>\n" +
    "  <div class=\"modal__content\" ng-if=\"isModal\">\n" +
    "    <ul class=\"video-edit-collections__options\">\n" +
    "      <li class=\"video-edit-collections__option\"\n" +
    "        data-videos=\"(~ tag.video_count ~)\"\n" +
    "        ng-class=\"{\n" +
    "          'video-edit-collections__option--selected' : hasTag(tag.id),\n" +
    "          'video-edit-collections__option--modal' : isModal,\n" +
    "          'video-edit-collections__option--private' : !tag.public\n" +
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
    "  </div>\n" +
    "  <div class=\"modal__footer\" ng-if=\"isModal\">\n" +
    "    <div class=\"modal__actions\">\n" +
    "      <a ng-click=\"close()\" class=\"btn  btn--small  btn--positive\">Okay</a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
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


  $templateCache.put('faq.html',
    "<section class=\"faq wrapper wrapper--fixed\">\n" +
    "\n" +
    "  <div class=\"page-content\">\n" +
    "\n" +
    "    <h2 class=\"heading\">Wonder Platform FAQs</h2>\n" +
    "\n" +
    "    <ul>\n" +
    "      <li><a class=\"link\" ng-click=\"active='using'\">Using Romeo</a></li>\n" +
    "      <li><a ng-click=\"active='seo'\">Video SEO</a></li>\n" +
    "      <li><a ng-click=\"active='law'\">The Law</a></li>\n" +
    "      <li><a ng-click=\"active='community'\">The Community</a></li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <section ng-if=\"active === 'using' || !active\">\n" +
    "\n" +
    "      <h2 class=\"heading\">Using Romeo</h2>\n" +
    "\n" +
    "      <section>\n" +
    "        <h3 class=\"heading\">Supported Video files</h3>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">What type of video files can I upload to Wonder?</h4>\n" +
    "          <p>H264 video files, Quicktime movies (.mov) and MP4 files (.mp4) are all accepted by Wonder. </p>\n" +
    "          <p>Our technology is optimised for files that are 720p or 1080p, with a bitrate of at least 2 Megabits/second.</p>\n" +
    "        </article>\n" +
    "      </section>\n" +
    "\n" +
    "      <section>\n" +
    "        <h3 class=\"heading\">Publishing</h3>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">How do I publish a video?</h4>\n" +
    "          <p>Your video is publically published when it is added to a Public Collection.</p>\n" +
    "          <p>Creating a Public Collection is simple, just visit the Manage section of your account. </p>\n" +
    "          <p>Highlight the video and use Add / Remove to Add it to the Collection</p>\n" +
    "          <img src=\"/static/assets/img/faq/organise-item-menu.png\" alt=\"organise item menu\" title=\"click Add/Remove\" />\n" +
    "          <p>You’ll receive an email notification once your video has been published and so will any collaborators you worked with.</p>\n" +
    "        </article>\n" +
    "      </section>\n" +
    "\n" +
    "      <section>\n" +
    "        <h3 class=\"heading\">Video Player</h3>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">Can I change the colour of the player controls of the video player?</h4>\n" +
    "          <p>Absolutely! Changing the colour of the player controls is easy and instant for all of your embedded videos.</p>\n" +
    "          <p>Select the edit function on your video</p>\n" +
    "          <img src=\"/static/assets/img/faq/organise-item-menu.png\" alt=\"organise item menu\" title=\"click Edit\" />\n" +
    "          <p>Hover over the player controls until a green box appears around them</p>\n" +
    "          <img src=\"/static/assets/img/faq/video-controls-edit.png\" alt=\"video controls edit\" title=\"hover over video control bar\" />\n" +
    "          <p>Click anywhere in the green box to make the colour pallette appear.</p>\n" +
    "          <img src=\"/static/assets/img/faq/colour-picker.png\" alt=\"colour picker\" title=\"click to show colour picker\" />\n" +
    "          <p>Select the colour or, if you know it, type in the RGB colour values.</p>\n" +
    "          <p>Once you’ve selected your colour, click back in the green box to remove the colour palette and then click save changes in the top right hand corner</p>\n" +
    "          <img src=\"/static/assets/img/faq/save-cancel.png\" alt=\"save/cancel changes\" title=\"click save changes\" />\n" +
    "        </article>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">Can I remove the Wonder logo from the player controls of the video player?</h4>\n" +
    "          <p>Yes, you can.</p>\n" +
    "          <p>Select the edit function on your video</p>\n" +
    "          <img src=\"/static/assets/img/faq/organise-item-menu.png\" alt=\"organise item menu\" title=\"click Edit\" />\n" +
    "          <p>Hover over the player controls until a green box appears around them</p>\n" +
    "          <img src=\"/static/assets/img/faq/video-controls-edit.png\" alt=\"video controls edit\" title=\"hover over video control bar\" />\n" +
    "          <p>Click anywhere in the green box to make the colour pallette appear.</p>\n" +
    "          <img src=\"/static/assets/img/faq/colour-picker.png\" alt=\"colour picker\" title=\"click to show colour picker\" />\n" +
    "          <p>Tick the ‘Hide Logo’ box</p>\n" +
    "        </article>\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">Can I add my own logo to the video player?</h4>\n" +
    "          <p>No, it is not possible to add your own logo to the player controls.</p>\n" +
    "        </article>\n" +
    "      </section>\n" +
    "\n" +
    "      <section>\n" +
    "        <h3 class=\"heading\">General</h3>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">How do I download the original source file for my video?</h4>\n" +
    "          <p>As long as your Video has been published, when you are in the Edit, Review or Comments screens, you can always find a ‘Download Source File’ icon in the top left hand corner.</p>\n" +
    "          <img src=\"/static/assets/img/faq/download-control.png\" alt=\"download source control\" title=\"click download source\" />\n" +
    "        </article>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">Why is Recently Added Videos empty when I click on it?</h4>\n" +
    "          <p>Recently Added Videos will only show videos that were uploaded and processed in the last 24 hours. If you uploaded your video more than 24 hours ago, it will be listed in ‘All Videos’ and in any Collection that you have published it to.</p>\n" +
    "        </article>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">What is the best format to shoot and upload your videos in?</h4>\n" +
    "          <p>Frame rate: 24, 25, or 30 FPS (Constant)</p>\n" +
    "          <p>Uploading videos with frame rates of 24 (or 23.976), 25, and 30 (or 29.97) produces the best quality videos. If you know what frame rate you shot your footage at, it’s best to encode your final video at the same frame rate.</p>\n" +
    "          <p>If your footage is over 30 FPS (frames per second), you should encode your video at half that frame rate. EG, if you shot at 60 FPS, your final video should be encoded at 30 FPS. If you're uncertain what frame rate your video was shot at, set your frame rate to either \"Current\" or 30 FPS. If there is an option for keyframes, choose the same value you used for frame rate. NB. When given the option between “constant” and “variable” frame rate, always choose “constant”.</p>\n" +
    "        </article>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">Bit rate</h4>\n" +
    "          <p>Bit rate (or data rate) controls the visual quality of the video and its file size. It is commonly measured in kilobits per seconds (kbit/s). If your video editing software gives you the option, choose a “variable” bit rate and set the target to a minimum of  2,000 kbit/s for standard definition (SD) video; 5,000 kbit/s for 720p HD video; or 10,000 kbit/s for 1080p HD video.</p>\n" +
    "          <table class=\"table\">\n" +
    "            <tr><th>Quality</th><th>Bitrate (kbit/s)</th></tr>\n" +
    "            <tr><td>SD</td><td>2,000 – 5,000</td></tr>\n" +
    "            <tr><td>720p</td><td>5,000 – 10,000</td></tr>\n" +
    "            <tr><td>1080p</td><td>10,000 – 20,000</td></tr>\n" +
    "          </table>\n" +
    "        </article>\n" +
    "\n" +
    "      </section>\n" +
    "\n" +
    "    </section>\n" +
    "\n" +
    "    <section ng-if=\"active === 'seo'\">\n" +
    "\n" +
    "      <h2 class=\"heading\">SEO</h2>\n" +
    "\n" +
    "      <section>\n" +
    "        <h3 class=\"heading\">Stuff about Stuff</h3>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">What type of stuff can I stuff with stuff?</h4>\n" +
    "          <p>You can stuff stuff with as much stuff as you can stuff in your stuff (and stuff). </p>\n" +
    "        </article>\n" +
    "      </section>\n" +
    "\n" +
    "    </section>\n" +
    "\n" +
    "    <section ng-if=\"active === 'law'\">\n" +
    "\n" +
    "      <h2 class=\"heading\">The Law</h2>\n" +
    "\n" +
    "      <section>\n" +
    "        <h3 class=\"heading\">General</h3>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">What copyright protections does my content have?</h4>\n" +
    "          <p>We are a UK registered company and so are governed by the laws of the United Kingdom. This includes the <a href=\"http://www.legislation.gov.uk/ukpga/1988/48/contents\">copyright laws</a>. We also offer all of our creators a variety of copyright protection under the <a href=\"https://wiki.creativecommons.org/Main_Page\">Creative Commons Licensing</a> system, for more information about how we do this, have a look at our Legal Documentation(LINK).</p>\n" +
    "        </article>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">What about fair usage of other people’s content?</h4>\n" +
    "          <p>UK Copyright law has very comprehensive guidance as to what defines ‘fair dealing’:</p>\n" +
    "          <p>s29.—(1) Fair dealing with a literary, dramatic, musical, etc, work, for the purpose of research for a non-commercial purpose, does not infringe any copyright in the work, provided it is accompanied by a sufficient acknowledgement of the source.</p>\n" +
    "          <p>s30.—(1) Fair dealing with a work for the purpose of criticism or review, of that or another work, or of a performance of a work, does not infringe copyright in the work, provided it is accompanied by a sufficient acknowledgement, and provided the work has actually been made available to the public.</p>\n" +
    "          <p>CITATION NEEDED</p>\n" +
    "          <p>Even when the owner of the video has allowed others to use it under the Creative Commons Licensing(LINK), which you will see by these symbols (PICTURE), you must always request permission to use someone elses content.</p>\n" +
    "        </article>\n" +
    "      </section>\n" +
    "\n" +
    "    </section>\n" +
    "\n" +
    "    <section ng-if=\"active === 'community'\">\n" +
    "\n" +
    "      <h2 class=\"heading\">Community</h2>\n" +
    "\n" +
    "      <section>\n" +
    "        <h3 class=\"heading\">Sharing</h3>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">How do I get the embed code for my video?</h4>\n" +
    "          <p>Once you have published your video to a public collection.  Highlight the Video thumbnail in the Manage view and select Review</p>\n" +
    "          <img src=\"/static/assets/img/faq/organise-item-menu.png\" alt=\"organise item menu\" title=\"click Review\" />\n" +
    "          <p>And then select the left-most icon, under the video, to show the embed code for your video.</p>\n" +
    "          <img src=\"/static/assets/img/faq/embed-url.png\" alt=\"embed url control\" title=\"click angle-brackets icon\" />\n" +
    "        </article>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">How do I share my video on Facebook or Twitter?</h4>\n" +
    "          <p>Once you have published your video to a public collection, highlight the Video thumbnail in the Manage view and select Review</p>\n" +
    "          <img src=\"/static/assets/img/faq/organise-item-menu.png\" alt=\"organise item menu\" title=\"click Review\" />\n" +
    "          <p>And then select the Social Network you want to share to, under the video.</p>\n" +
    "          <p>You will be automatically prompted to login</p>\n" +
    "          <img src=\"/static/assets/img/faq/share-controls.png\" alt=\"share to Twitter/Facebook controls\" title=\"click Twitter/Facebook\" />\n" +
    "        </article>\n" +
    "\n" +
    "        <article>\n" +
    "          <h3 class=\"heading\">Collaborating  (commenting &amp; downloading)</h3>\n" +
    "          <h4 class=\"heading\">How do I invite other people to comment on my video?</h4>\n" +
    "          <p>Whilst your video is uploading, you can invite people to comment on your video by scrolling under video to the collaborators menu.</p>\n" +
    "          <img src=\"/static/assets/img/faq/add-collaborators.png\" alt=\"add collaborator controls\" title=\"click add collaborator to show controls\" />\n" +
    "          <p>Just input their names and email addresses into the Collaborators section</p>\n" +
    "          <p>Select the permissions that you want to give them and then send the request.</p>\n" +
    "          <p>The email will only be sent when your video is ready to be viewed.</p>\n" +
    "          <p>You can invite people to collaborate and comment anytime after your video has been uploaded by just going back to the Edit state.</p>\n" +
    "        </article>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">How do I invite more than 1 person to collaborate?</h4>\n" +
    "          <p>Just repeat the process for each additional person you want to invite.</p>\n" +
    "        </article>\n" +
    "\n" +
    "        <article>\n" +
    "          <h4 class=\"heading\">How do I send a link to someone to download the video?</h4>\n" +
    "          <p>You can invite people to download your video by scrolling under video to the collaborators menu.</p>\n" +
    "          <p>Just input their names and email addresses into the Collaborators section</p>\n" +
    "          <p>Grant them the permission to download the video and then send the request.</p>\n" +
    "          <img src=\"/static/assets/img/faq/add-collaborators-download.png\" alt=\"add collaborator controls\" title=\"check relevant checkbox to allow collaborator permissions\" />\n" +
    "        </article>\n" +
    "      </section>\n" +
    "\n" +
    "    </section>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('login.html',
    "<div ng-controller=\"LoginCtrl\" id=\"loginController\" autocomplete=\"off\" class=\"login-view\">\n" +
    "  <div class=\"center-container\">\n" +
    "    <div class=\"center-object\">\n" +
    "      <div class=\"wrapper\">\n" +
    "        <form ng-submit=\"submitted = true; loginForm.$valid && login();\" name=\"loginForm\">\n" +
    "          <fieldset>\n" +
    "            <legend class=\"accessibility\">Log in details</legend>\n" +
    "            <ul class=\"form-fields  login-view__form\">\n" +
    "              <li class=\"text-col\">\n" +
    "                <div class=\"login-view__input  icon-text\">\n" +
    "                  <i class=\"icon  icon--head  icon-text__icon\"></i>\n" +
    "                  <label class=\"label login-view__label  accessibility\" for=\"login-view__username\">Username</label>\n" +
    "                  <input type=\"text\" ng-model=\"username\" name=\"username\" autocomplete=\"off\" class=\"text-input\" required id=\"login-view__username\" placeholder=\"Username\" />\n" +
    "                  <span class=\"error\" ng-show=\"submitted && loginForm.username.$error.required\">Required!</span>\n" +
    "                </div>\n" +
    "                <div class=\"login-view__input  icon-text\">\n" +
    "                  <i class=\"icon  icon--lock  icon-text__icon\"></i>\n" +
    "                  <label class=\"label login-view__label  accessibility\" for=\"login-view__password\">Password</label>\n" +
    "                  <input type=\"password\" required name=\"password\" ng-model=\"password\" autocomplete=\"off\"  class=\"text-input\" id=\"login-view__password\" placeholder=\"Password\" />\n" +
    "                  <span class=\"error\" ng-show=\"submitted && loginForm.password.$error.required\">Required!</span>\n" +
    "                </div>\n" +
    "              </li>\n" +
    "              <li class=\"text-col\">\n" +
    "                <ul class=\"check-list\">\n" +
    "                  <li>\n" +
    "                    <input type=\"checkbox\" name=\"tandc\" ng-model=\"tandc\" required class=\"login-view__input_checkbox\" id=\"tandc\"/>\n" +
    "                    <label class=\"t--inline  login-view__label\" for=\"tandc\">I agree with the standard Wonder Place Ltd <a href=\"http://wonderpl.com/tos\">terms and conditions</a> and the following conditions of the Closed Beta Program:</label>\n" +
    "                  </li>\n" +
    "                </ul>\n" +
    "              </li>\n" +
    "              <li class=\"text-col\">\n" +
    "                <span class=\"login-view__errors\" ng-bind=\"errors\"></span>\n" +
    "                <div class=\"btn-center\">\n" +
    "                  <button type=\"submit\" class=\"btn btn--positive login-view__submit\" ng-class=\"{'btn--disabled': !tandc || disableButtons()}\" ng-disabled=\"!tandc || disableButtons()\">Login <img class=\"login-view__loading-indicator\" src=\"/static/assets/img/loading.gif\" ng-show=\"isLoading.login\" /></button>\n" +
    "                </div>\n" +
    "\n" +
    "                <p>Or</p>\n" +
    "                <div class=\"btn-center\">\n" +
    "                  <a class=\"btn btn--positive login-view__submit\" ng-disabled=\"disableButtons()\" ng-class=\"{'btn--disabled': disableButtons()}\" ng-click=\"isLoading.twitter = true; showTwitterSignin();\">Sign in with Twitter<img class=\"login-view__loading-indicator\" src=\"/static/assets/img/loading.gif\" ng-show=\"isLoading.twitter\" /></a>\n" +
    "\n" +
    "                  <a class=\"btn btn--positive login-view__submit\" ng-disabled=\"disableButtons()\" ng-class=\"{'btn--disabled': disableButtons()}\" ng-click=\"isLoading.signup = true; showSignup();\">Sign up <img class=\"login-view__loading-indicator\" src=\"/static/assets/img/loading.gif\" ng-show=\"isLoading.signup\" /></a>\n" +
    "                </div>\n" +
    "              </li>\n" +
    "              <li>\n" +
    "                <p class=\"smallprint  muted\">The Program is proprietary to, and a valuable trade secret of, Wonder Place Ltd. It is entrusted to Tester only for the purpose set forth in this Agreement. Tester shall maintain the Program in the strictest confidence. Tester will not, without Company's prior written consent:</p>\n" +
    "                <ol class=\"smallprint\" type=\"a\">\n" +
    "                  <li><p class=\"muted\">disclose any information about the Program, its design and performance specifications, its code, and the existence of the beta test and its results to anyone other than Tester's employees who are performing the testing and who shall be subject to nondisclosure restrictions at least as protective as those set forth in this Agreement;</p></li>\n" +
    "                  <li><p class=\"muted\">copy any portion of the Program or documentation, except to the extent necessary to perform beta testing; or</p></li>\n" +
    "                  <li><p class=\"muted\">reverse engineer, decompile or disassemble Software or any portion of it.</p></li>\n" +
    "                </ol>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </fieldset>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('manage-collaborators.tmpl.html',
    "<div class=\"modal__title  split\">\n" +
    "  <span class=\"split__title  t--block  w--600\">Invite Collaborators</span>\n" +
    "  <a class=\"modal__link\" ng-click=\"close()\"><i class=\"icon icon--medium icon--circle-cross\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"modal__content\">\n" +
    "\n" +
    "  <input type=\"hidden\" ui-select2=\"select2Options\" ng-model=\"invite.collaborators\" />\n" +
    "\n" +
    "  <select ng-model=\"invite.permissions\">\n" +
    "    <option value=\"canComment\">Comment</option>\n" +
    "    <option value=\"canCommentDownload\">Comment and Download</option>\n" +
    "    <option value=\"canDownload\">Download</option>\n" +
    "  </select>\n" +
    "\n" +
    "  <a class=\"btn btn--small btn--positive\" ng-click=\"sendInvitations()\">Invite</a>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal__footer\">\n" +
    "  <div class=\"modal__actions\">\n" +
    "  </div>\n" +
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
    "<div class=\"modal__title  split\">\n" +
    "  <span class=\"split__title  t--block  w--600\">Create a collection</span>\n" +
    "  <a class=\"modal__link\" ng-click=\"close()\"><i class=\"icon icon--medium icon--circle-cross\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"modal__content\">\n" +
    "  <div class=\"media\">\n" +
    "    <div class=\"media__img\">\n" +
    "      <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" class=\"modal-collection-thumb\">\n" +
    "    </div>\n" +
    "    <div class=\"media__body\">\n" +
    "      <form name=\"newCollectionForm\" class=\"modal-form\">\n" +
    "        <fieldset class=\"modal-form__fieldset\">\n" +
    "          <legend class=\"is-hidden\">Enter collection details</legend>\n" +
    "          <ul class=\"form-fields  \">\n" +
    "            <li>\n" +
    "              <input type=\"text\" ng-model=\"collection.label\" placeholder=\"Name\" class=\"form-input  modal-input  video-new-collection__new-collection-name\" name=\"collectionLabel\" validate-collection-title required />\n" +
    "              <span class=\"video-new-collection__error\" ng-show=\"newCollectionForm.collectionLabel.$error.exists && isSubmitted\">Error: there is already a collection with that name</span>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "              <textarea ng-model=\"collection.description\" placeholder=\"Collection description (optional)&hellip;\" class=\"video-new-collection__new-collection-description\"></textarea>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "              <ul class=\"nav  nav--blocks  modal-check-list\">\n" +
    "                <li>\n" +
    "                  <label class=\"video-new-collection__label\">\n" +
    "                    <input type=\"radio\" name=\"scope\" ng-model=\"collection.scope\" value=\"public\" />\n" +
    "                    Public\n" +
    "                  </label>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                  <label class=\"video-new-collection__label\">\n" +
    "                    <input type=\"radio\" name=\"scope\" ng-model=\"collection.scope\" value=\"private\" />\n" +
    "                    Private\n" +
    "                  </label>\n" +
    "                </li>\n" +
    "              </ul>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </fieldset>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"modal__footer\">\n" +
    "  <div class=\"modal__actions\">\n" +
    "    <a ng-click=\"newCollectionForm.$valid && saveNewCollection(); isSubmitted = true;\" class=\"btn  btn--small  btn--positive\">Okay</a>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('modal-delete-video.html',
    "<div class=\"modal__title  split\">\n" +
    "  <span class=\"split__title  t--block  w--600\">Delete Video</span>\n" +
    "  <a class=\"modal__link\" ng-click=\"close()\"><i class=\"icon icon--medium icon--circle-cross\"></i></a>\n" +
    "</div>\n" +
    "<div class=\"modal__content\">\n" +
    "  <div class=\"media\">\n" +
    "    <div class=\"media__img\">\n" +
    "      <i class=\"icon icon--trash icon--large\"></i>\n" +
    "    </div>\n" +
    "    <div class=\"media__body\">\n" +
    "      <p class=\"organise-video-delete__msg\">Are you sure you want to delete '(~video.title~)'?</p>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"modal__footer\">\n" +
    "  <div class=\"modal__actions\">\n" +
    "    <a ng-click=\"close()\" class=\"btn  btn--small\">Cancel</a>\n" +
    "    <a ng-click=\"delete(video)\" class=\"btn  btn--small  btn--positive\">Okay</a>\n" +
    "  </div>\n" +
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


  $templateCache.put('notification-tray.html',
    "<ul class=\"nav  nav--stacked  notice-tray\">\n" +
    "  <li ng-repeat=\"notification in notifications\" class=\"notice  notice--(~ notification.status ~)  animate  animate--flippable\" ng-class=\"{ 'notice--active' : notification.active, 'animation--flipInX' : notification.show,  'animation--flipOutX' : notification.hide}\">\n" +
    "    <div class=\"flag  flag--rev\">\n" +
    "      <div class=\"flag__body\">\n" +
    "        <p><b>(~ notification.title ~)</b>:<br>\n" +
    "        (~ notification.message ~)</p>\n" +
    "      </div>\n" +
    "      <div class=\"flag__img\">\n" +
    "        <!--<a class=\"notice__dismiss\" ng-click=\"removeNotification(notification.id); notification.show = false; notification.hide = true\">\n" +
    "          <i class=\"icon  icon--cross\"></i>\n" +
    "        </a>-->\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </li>\n" +
    "</ul>"
  );


  $templateCache.put('page-footer.html',
    "<footer class=\"page-footer\" role=\"contentinfo\">\n" +
    "  <div class=\"wrapper\">\n" +
    "    <ul class=\"f--left\">\n" +
    "      <li class=\"t--iblock smallprint\"><a href=\"#/faq\">FAQ</a></li>\n" +
    "    </ul>\n" +
    "    <span class=\"f--right smallprint\">&copy; 2014 Wonder PL, Ltd.</span>\n" +
    "  </div>\n" +
    "</footer>"
  );


  $templateCache.put('page-header.html',
    "<header class=\"page-header\" role=\"header\">\n" +
    "  <nav class=\"wrapper\" role=\"navigation\">\n" +
    "    <a href=\"#\" class=\"page-logo  page-logo--header\" >\n" +
    "      <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" class=\"page-logo__img\" alt=\"Wonder PL\">\n" +
    "    </a>\n" +
    "    <upload-progress ng-if=\"isLoggedIn() && isUploading()\"></upload-progress>\n" +
    "    <ul class=\"nav  nav-menu\" ng-if=\"isLoggedIn()\">\n" +
    "      <li class=\"nav-menu__item\" ng-if=\"isContentOwner()\"><a href=\"#/video\" class=\"nav-menu__link\">Upload</a></li>\n" +
    "      <li class=\"nav-menu__item\"><a href=\"#/profile\" class=\"nav-menu__link  avatar  avatar--small\"><img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" alt=\"(~ display_name ~)\" class=\"avatar__img\" ng-style=\"profileStyle\"></a></li>\n" +
    "    </ul>\n" +
    "  </nav>\n" +
    "</header>"
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


  $templateCache.put('signup.html',
    "<div ng-controller=\"SignupCtrl\" autocomplete=\"off\" class=\"login-view\">\n" +
    "  <div class=\"center-container\">\n" +
    "    <div class=\"center-object\">\n" +
    "      <div class=\"wrapper\">\n" +
    "        <form ng-submit=\"signUp()\">\n" +
    "          <fieldset>\n" +
    "            <legend class=\"accessibility\">Sign up details</legend>\n" +
    "            <ul class=\"form-fields  login-view__form\">\n" +
    "              <li class=\"text-col\">\n" +
    "                <div class=\"login-view__input  icon-text\">\n" +
    "                  <i class=\"icon  icon--head  icon-text__icon\"></i>\n" +
    "                  <label class=\"label login-view__label  accessibility\" for=\"login-view__name\">Name</label>\n" +
    "                  <input type=\"text\" ng-model=\"name\" autocomplete=\"off\" class=\"text-input\" id=\"login-view__name\" placeholder=\"Name\" />\n" +
    "                </div>\n" +
    "                <div class=\"login-view__input  icon-text\">\n" +
    "                  <i class=\"icon icon--mail icon-text__icon\"></i>\n" +
    "                  <label class=\"label login-view__label  accessibility\" for=\"login-view__username\">Email</label>\n" +
    "                  <input type=\"text\" ng-model=\"username\" autocomplete=\"off\" class=\"text-input\" id=\"login-view__email\" placeholder=\"Email\" />\n" +
    "                </div>\n" +
    "                <div class=\"login-view__input  icon-text\">\n" +
    "                  <i class=\"icon  icon--lock  icon-text__icon\"></i>\n" +
    "                  <label class=\"label login-view__label  accessibility\" for=\"login-view__password\">Password</label>\n" +
    "                  <input type=\"password\" name=\"password\" ng-model=\"password\" autocomplete=\"off\"  class=\"text-input\" id=\"login-view__password\" placeholder=\"Password\" />\n" +
    "                </div>\n" +
    "                <div class=\"login-view__input login-view__input--location  icon-text\">\n" +
    "                  <i class=\"icon  icon--globe  icon-text__icon\"></i>\n" +
    "                  <location-selector location=\"location\">\n" +
    "                  </location-selector>\n" +
    "                </div>\n" +
    "              </li>\n" +
    "              <li class=\"text-col\">\n" +
    "                <ul class=\"check-list\">\n" +
    "                  <li>\n" +
    "                    <input type=\"checkbox\" name=\"tandc\" ng-model=\"tandc\" required class=\"login-view__input_checkbox\" id=\"tandc\"/>\n" +
    "                    <label class=\"t--inline  login-view__label\" for=\"tandc\">I agree with the standard Wonder Place Ltd <a href=\"http://wonderpl.com/tos\">terms and conditions</a> and the following conditions of the Closed Beta Program:</label>\n" +
    "                  </li>\n" +
    "                </ul>\n" +
    "              </li>\n" +
    "              <li class=\"text-col\" ng-show=\"errorMessage\">\n" +
    "                <div class=\"error\">\n" +
    "                  (~ errorMessage ~)\n" +
    "                </div>\n" +
    "              </li>\n" +
    "              <li class=\"text-col\">\n" +
    "                <span class=\"login-view__errors\" ng-bind=\"errors\"></span>\n" +
    "                <div class=\"btn-center\">\n" +
    "                  <button type=\"submit\" class=\"btn btn--positive login-view__submit\" ng-class=\"{'btn--disabled': !tandc}\" ng-disabled=\"!tandc\" ng-click=\"save()\">Sign up  <img class=\"login-view__loading-indicator\" src=\"/static/assets/img/loading.gif\" ng-show=\"isLoading\" /></button>\n" +
    "                </div>\n" +
    "              </li>\n" +
    "              <li>\n" +
    "                <p class=\"smallprint  muted\">The Program is proprietary to, and a valuable trade secret of, Wonder Place Ltd. It is entrusted to Tester only for the purpose set forth in this Agreement. Tester shall maintain the Program in the strictest confidence. Tester will not, without Company's prior written consent:</p>\n" +
    "                <ol class=\"smallprint\" type=\"a\">\n" +
    "                  <li><p class=\"muted\">disclose any information about the Program, its design and performance specifications, its code, and the existence of the beta test and its results to anyone other than Tester's employees who are performing the testing and who shall be subject to nondisclosure restrictions at least as protective as those set forth in this Agreement;</p></li>\n" +
    "                  <li><p class=\"muted\">copy any portion of the Program or documentation, except to the extent necessary to perform beta testing; or</p></li>\n" +
    "                  <li><p class=\"muted\">reverse engineer, decompile or disassemble Software or any portion of it.</p></li>\n" +
    "                </ol>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </fieldset>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('twitter-login.html',
    "<div ng-controller=\"TwitterLoginCtrl\" autocomplete=\"off\" class=\"login-view\">\n" +
    "  <div class=\"center-container\">\n" +
    "    <div class=\"center-object\">\n" +
    "      <div class=\"wrapper\">\n" +
    "        <form ng-submit=\"save()\">\n" +
    "          <fieldset>\n" +
    "            <legend class=\"accessibility\">Twitter Log in details:</legend>\n" +
    "            <ul class=\"form-fields  login-view__form\">\n" +
    "              <li class=\"text-col\">\n" +
    "                <h2>Nearly there</h2>\n" +
    "                <div class=\"login-view__input  icon-text\">\n" +
    "                  <i class=\"icon  icon--mail  icon-text__icon\"></i>\n" +
    "                  <label class=\"label login-view__label  accessibility\" for=\"login-view__username\">Email Address</label>\n" +
    "                  <input type=\"text\" ng-model=\"profile.username\" autocomplete=\"off\" class=\"text-input\" id=\"login-view__username\" placeholder=\"Email Address\" />\n" +
    "                </div>\n" +
    "                <div class=\"login-view__input login-view__input--location  icon-text\">\n" +
    "                  <i class=\"icon  icon--globe  icon-text__icon\"></i>\n" +
    "                  <location-selector location=\"profile.location\">\n" +
    "                  </location-selector>\n" +
    "                </div>\n" +
    "              </li>\n" +
    "              <li class=\"text-col\">\n" +
    "                <ul class=\"check-list\">\n" +
    "                  <li>\n" +
    "                    <input type=\"checkbox\" name=\"tandc\" ng-model=\"tandc\" required class=\"login-view__input_checkbox\" id=\"tandc\"/>\n" +
    "                    <label class=\"t--inline  login-view__label\" for=\"tandc\">By creating an account, I accept Wonder's <a href=\"http://wonderpl.com/tos\">Terms of Service</a> </label>\n" +
    "                  </li>\n" +
    "                </ul>\n" +
    "              </li>\n" +
    "              <li class=\"text-col\">\n" +
    "                <span class=\"login-view__errors\" ng-bind=\"errors\"></span>\n" +
    "                <div class=\"btn-center\">\n" +
    "                  <button type=\"submit\" class=\"btn btn--positive login-view__submit\" ng-click=\"isLoading = true;\" ng-disabled=\"!tandc\">Create account <img class=\"login-view__loading-indicator\" src=\"/static/assets/img/loading.gif\" ng-show=\"isLoading\" /></button>\n" +
    "                </div>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </fieldset>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('upload-progress.html',
    "<section class=\"upload-progress\">\n" +
    "  <span ng-show=\"progress > 0 && progress < 100\">(~ progress ~)%</span>\n" +
    "  <span>(~ status ~)&hellip;</span>\n" +
    "</section>"
  );


  $templateCache.put('layout-control.html',
    "<section ng-show=\"flags.isComments\" class=\"layout-control layout-control--(~ flags.isComments ? $root.layoutMode : 'column' ~)\">\n" +
    "  <div class=\"wrapper\">\n" +
    "    <div class=\"btn-group\">\n" +
    "      <a class=\"btn btn--small\" ng-click=\"reposition('mirror')\"><i class=\"icon  icon--split-vertical-alt\"></i></a>\n" +
    "      <a class=\"btn btn--small\" ng-click=\"reposition('column')\"><i class=\"icon  icon--split-horizontal\"></i></a>\n" +
    "      <a class=\"btn btn--small\" ng-click=\"reposition('wide')\"><i class=\"icon  icon--split-vertical\"></i></a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</section>"
  );


  $templateCache.put('video-collaborators.html',
    "<section class=\"video-collaborators video-collaborators--(~ $root.layoutMode ~)\">\n" +
    "\n" +
    "  <header class=\"video-collaborators__header\">\n" +
    "    <h4 class=\"video-collaborators__title  no-spacing\">collaborators <a class=\"show-modal-indicator\" ng-click=\"showCollaboratorsModal()\">[+]</a></h4>\n" +
    "    <a class=\"btn  btn--small  btn--positive  video-collaborators__notify  f--right\"\n" +
    "      ng-click=\"!flags.notified && notify(videoId)\"\n" +
    "      ng-class=\"{ 'btn--disabled' : flags.notified || !collaborators || !comments.length }\">Notify All</a>\n" +
    "  </header>\n" +
    "\n" +
    "  <p class=\"video-collaborators__none-message\" ng-hide=\"collaborators\">You have no collaborators!</p>\n" +
    "\n" +
    "  <ul class=\"nav  nav--stacked  video-collaborators__collaborators\" ng-show=\"collaborators\">\n" +
    "    <li class=\"video-collaborators__collaborator\" ng-repeat=\"collaborator in collaborators\">\n" +
    "      <div class=\"media\">\n" +
    "        <div class=\"media__img\">\n" +
    "          <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" class=\"video-collaborators__collaborator-image\" ng-style=\"{ 'background-image' : 'url(' + collaborator.avatar + ')' }\">\n" +
    "        </div>\n" +
    "        <div class=\"media__body\">\n" +
    "          <span class=\"video-collaborators__collaborator-name truncate\" ng-bind=\"collaborator.display_name\"></span>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('video-comments.html',
    "<section class=\"video-feedback video-feedback--(~ $root.layoutMode ~)\">\n" +
    "\n" +
    "  <section\n" +
    "    class=\"video-feedback__form\"\n" +
    "    ng-class=\"{ 'video-feedback__form--active' : inputActive }\">\n" +
    "    <section class=\"video-feedback__input-container\">\n" +
    "\n" +
    "      <div class=\"media  video-feedback__comment\">\n" +
    "        <a class=\"media__img  video-feedback__comment-profile-image\" ng-style=\"{ 'background-image' : 'url(' + user().avatar + ')' }\" ng-show=\"isLoggedIn()\"></a>\n" +
    "        <a class=\"media__img  video-feedback__comment-profile-image\" ng-style=\"{ 'background-image' : 'url(' + user().avatar + ')' }\" ng-show=\"isCollaborator()\"></a>\n" +
    "        <div class=\"media__body\">\n" +
    "          <div class=\"video-feedback__comment-details\">\n" +
    "            <span class=\"video-feedback__comment-name\" ng-show=\"isLoggedIn()\">(~ user().display_name ~)</span>\n" +
    "            <span class=\"video-feedback__comment-name\" ng-show=\"isCollaborator()\">(~ user().username ~)</span>\n" +
    "          </div>\n" +
    "          <div class=\"video-feedback__comment-content\">\n" +
    "            <span class=\"video-feedback__comment-timestamp\">\n" +
    "              @<a class=\"video-feedback__comment-timestamp-link\" ng-bind=\"(videoCurrentTime | time)\"></a>\n" +
    "            </span>\n" +
    "            <div class=\"video-feedback__comment-text\">\n" +
    "              <textarea class=\"video-feedback__input js-video-feedback-input\"\n" +
    "                placeholder=\"Hit the space bar to timestamp your comment and pause the video&hellip;\"\n" +
    "                ng-model=\"commentText\"\n" +
    "                ng-class=\"{ 'video-feedback__input--active' : inputActive }\"\n" +
    "                ng-focus=\"inputActive = true\"\n" +
    "                ng-blur=\"inputActive = false\"\n" +
    "                focus=\"inputActive\">\n" +
    "              </textarea>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <a class=\"video-feedback__button btn  btn--small btn--positive push-bottom\"\n" +
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
    "        <select class=\"video-feedback__comments-filters btn btn--small\" ng-model=\"filterResolved\">\n" +
    "          <option class=\"video-feedback__comments-filter\" value=\"\" selected=\"selected\">All</option>\n" +
    "          <option class=\"video-feedback__comments-filter\" value=\"false\">Unresolved</option>\n" +
    "        </select>\n" +
    "      </label>\n" +
    "    </div>\n" +
    "\n" +
    "    <ul class=\"video-feedback__comments-list\" id=\"video-comments-list-(~ $root.layoutMode ~)\">\n" +
    "      <li id=\"comment-(~ comment.id ~)\"\n" +
    "        class=\"video-feedback__comment\"\n" +
    "        ng-class=\"{ 'video-feedback__comment--active' : isTimeSync(comment.timestamp) }\"\n" +
    "        ng-repeat=\"comment in comments | orderBy : 'timestamp' | filter: { resolved : filterResolved }\">\n" +
    "          <div class=\"media\" ng-class=\"{ 'video-feedback__comment--resolved' : comment.resolved }\">\n" +
    "            <a class=\"media__img  video-feedback__comment-profile-image\" ng-style=\"{ 'background-image' : 'url(' + comment.avatar + ')' }\"></a>\n" +
    "            <div class=\"media__body\">\n" +
    "              <div class=\"video-feedback__comment-details\">\n" +
    "                <span class=\"video-feedback__comment-name\" ng-bind=\"comment.display_name\"></span>\n" +
    "                <span class=\"video-feedback__comment-time-posted\" ng-bind=\"comment.datetime | prettyDate\"></span>\n" +
    "                <span class=\"video-feedback__comment-resolved\" ng-class=\"{ 'video-feedback__comment-resolved--active' : replyActive && comment.resolved }\">resolved</span>\n" +
    "              </div>\n" +
    "              <div class=\"video-feedback__comment-content\">\n" +
    "                <span class=\"video-feedback__comment-timestamp\" ng-show=\"!isNaN(comment.timestamp)\">\n" +
    "                  @<a class=\"video-feedback__comment-timestamp-link\" ng-click=\"videoSeek(comment.timestamp)\" ng-bind=\"(comment.timestamp | time)\"></a>\n" +
    "                </span>\n" +
    "                <div class=\"video-feedback__comment-text\">\n" +
    "                  (~ comment.comment ~)\n" +
    "                </div>\n" +
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
    "            ng-hide=\"comment.resolved || !flags.isOwner\"\n" +
    "            ng-click=\"resolve(comment.id)\">\n" +
    "            resolve\n" +
    "          </a>\n" +
    "          <a class=\"video-feedback__resolve-link\"\n" +
    "            ng-show=\"comment.resolved && flags.isOwner\"\n" +
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
    "<a class=\"btn  btn--utility  icon-text\" ng-click=\"download()\"><i class=\"icon  icon--download  icon-text__icon\"></i>Download source file</a>"
  );


  $templateCache.put('video-extended-controls.html',
    "<section class=\"video-extended-controls\" ng-show=\"flags.isEdit\">\n" +
    "  <section class=\"video-extended-controls__section\" ng-class=\"{ 'video-extended-controls__section--expanded' : addCollectionShow }\">\n" +
    "    <i class=\"icon  icon--medium  icon--plus  section-drawer__icon\" ng-click=\"showHideCollectionExtended()\" ng-hide=\"addCollectionShow\"></i>\n" +
    "    <i class=\"icon  icon--medium  icon--minus  section-drawer__icon\" ng-click=\"showHideCollectionExtended()\" ng-show=\"addCollectionShow\"></i>\n" +
    "    <collection-add-video available-tags=\"tags\"\n" +
    "      video=\"video\"\n" +
    "      show-collection=\"addCollectionShow\"\n" +
    "      class=\"video-extended-controls__section-contents\">\n" +
    "    </collection-add-video>\n" +
    "    <span class=\"btn  btn--small  btn--positive  f--right\" ng-click=\"save(); addCollectionShow = !addCollectionShow\">Done</span>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"video-extended-controls__section\" ng-class=\"{ 'video-extended-controls__section--expanded' : addCollaboratorShow }\">\n" +
    "    <i class=\"icon  icon--medium  icon--plus  section-drawer__icon\" ng-click=\"addCollaboratorShow = !addCollaboratorShow\" ng-hide=\"addCollaboratorShow\"></i>\n" +
    "    <i class=\"icon  icon--medium  icon--minus  section-drawer__icon\" ng-click=\"addCollaboratorShow = !addCollaboratorShow\" ng-show=\"addCollaboratorShow\"></i>\n" +
    "    <add-collaborator class=\"video-extended-controls__section-contents\"\n" +
    "      video=\"video\"\n" +
    "      add-collaborator-show=\"addCollaboratorShow\"\n" +
    "      flags=\"flags\">\n" +
    "    </add-collaborator>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"video-extended-controls__section\" ng-class=\"{ 'video-extended-controls__section--expanded' : addSearchTermsShow }\">\n" +
    "    <i class=\"icon  icon--medium  icon--plus  section-drawer__icon\" ng-click=\"addSearchTermsShow = !addSearchTermsShow\" ng-hide=\"addSearchTermsShow\"></i>\n" +
    "    <i class=\"icon  icon--medium  icon--minus  section-drawer__icon\" ng-click=\"addSearchTermsShow = !addSearchTermsShow\" ng-show=\"addSearchTermsShow\"></i>\n" +
    "    <video-search-terms class=\"video-extended-controls__section-contents\"\n" +
    "      video=\"video\"\n" +
    "      add-search-terms-show=\"addSearchTermsShow\"\n" +
    "      flags=\"flags\">\n" +
    "    </add-collaborator>\n" +
    "  </section>\n" +
    "</section>"
  );


  $templateCache.put('video-frame-stepper.html',
    "<section class=\"video-frame-stepper\">\n" +
    "  <div class=\"btn-center btn-group\">\n" +
    "    <a ng-click=\"step(-1)\" class=\"btn  btn--small\">&lt;</a>\n" +
    "    <input class=\"btn  btn--small\" ng-model=\"videoTime\">\n" +
    "    <a ng-click=\"step(1)\" class=\"btn  btn--small\">&gt;</a>\n" +
    "  </div>\n" +
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
    "  <a class=\"video-more__link btn\"\n" +
    "    ng-click=\"(showMoreLinkConfigPanel = !showMoreLinkConfigPanel)\"\n" +
    "    ng-show=\"isEdit\"\n" +
    "    title=\"You can add a button, which will appear under your video in the Wonder App that takes you to any website.&#013;&#013;Simply add the text for the button (up-to 30 characters) and type in the URL you want to go to.\">\n" +
    "    (~ text ? text : 'Add a link (optional) &hellip;' ~)\n" +
    "  </a>\n" +
    "\n" +
    "  <a class=\"video-more__link btn  btn--positive\" href=\"(~ url ~)\" target=\"_new\" ng-if=\"isEdit == 'false'\">(~ text ~)</a>\n" +
    "\n" +
    "  <section class=\"video-more__form\" ng-class=\"{ 'video-more__form--active' : showMoreLinkConfigPanel }\" ng-if=\"isEdit\">\n" +
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
    "            placeholder=\"Link URL\" />\n" +
    "        </label>\n" +
    "\n" +
    "        <span class=\"video-more__error\" ng-show=\"isSubmitted && videoMoreLink.linkUrl.$error.pattern\">Incorrect format: http://&hellip;</span>\n" +
    "        <span class=\"video-more__error\" ng-show=\"isSubmitted && videoMoreLink.linkUrl.$error.required\">Enter URL</span>\n" +
    "\n" +
    "        <p class=\"video-more__hint\"><strong>Hint:</strong> Drive traffic to your website by adding a link</p>\n" +
    "\n" +
    "        <input class=\"btn  btn--small  btn--positive\" type=\"submit\" value=\"Okay\" />\n" +
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
    "<section class=\"sub-navigation video-view-control-panel sub-navigation--(~ flags.isComments ? $root.layoutMode : 'column' ~)\">\n" +
    "  <div class=\"wrapper\">\n" +
    "    <ul class=\"sub-navigation__modes\">\n" +
    "      <li class=\"sub-navigation__mode  f--left\">\n" +
    "        <video-download video-id=\"videoId\" ng-show=\"videoId && videoStatus==='published'\"></video-download>\n" +
    "      </li>\n" +
    "      <li class=\"sub-navigation__mode  f--left\" ng-if=\"!flags.isOwner\">\n" +
    "        <a class=\"btn  btn--utility  icon-text\"><i class=\"icon  icon--paper-stack  icon-text__icon\"></i>Copy video to my account</a>\n" +
    "      </li>\n" +
    "      <li class=\"sub-navigation__mode\" ng-show=\"flags.isEdit\">\n" +
    "        <a class=\"sub-navigation__btn btn btn--positive  icon-text\"\n" +
    "         ng-class=\"{ 'sub-navigation__btn--active' : flags.isEdit }\"\n" +
    "         ng-click=\"save()\">\n" +
    "          <i class=\"icon  icon--check  icon-text__icon\"></i>\n" +
    "          Save Changes\n" +
    "        </a>\n" +
    "      </li>\n" +
    "      <li class=\"sub-navigation__mode\" ng-show=\"flags.isEdit\">\n" +
    "        <a class=\"sub-navigation__btn btn icon-text\" ng-click=\"cancel()\">\n" +
    "          <i class=\"icon  icon--cross  icon-text__icon\"></i>\n" +
    "          Discard\n" +
    "        </a>\n" +
    "      </li>\n" +
    "      <li class=\"sub-navigation__mode\" ng-show=\"flags.isOwner\">\n" +
    "        <a\n" +
    "          class=\"sub-navigation__link btn  btn--utility icon-text\"\n" +
    "          ng-class=\"{ 'sub-navigation__link--active' : flags.isEdit }\"\n" +
    "          ng-href=\"#/video/(~videoId~)\">\n" +
    "          <i class=\"icon  icon--edit  icon-text__icon\"></i>\n" +
    "          Edit\n" +
    "        </a>\n" +
    "      </li>\n" +
    "      <li class=\"sub-navigation__mode\" ng-show=\"flags.isOwner\">\n" +
    "        <a\n" +
    "          class=\"sub-navigation__link btn  btn--utility icon-text\"\n" +
    "          ng-href=\"#/video/(~videoId~)/publish\"\n" +
    "          ng-class=\"{ 'sub-navigation__link--active' : flags.isReview }\">\n" +
    "          <i class=\"icon  icon--eye  icon-text__icon\"></i>\n" +
    "          Publish\n" +
    "        </a>\n" +
    "      </li>\n" +
    "      <li class=\"sub-navigation__mode\" ng-hide=\"flags.showUpload\">\n" +
    "        <a\n" +
    "          class=\"sub-navigation__link btn  btn--utility icon-text\"\n" +
    "          ng-href=\"#/video/(~videoId~)/comments\"\n" +
    "          ng-class=\"{ 'sub-navigation__link--active' : flags.isComments }\">\n" +
    "          <i class=\"icon  icon--speech-bubble  icon-text__icon\"></i>\n" +
    "          Collaborate\n" +
    "        </a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</section>"
  );


  $templateCache.put('video-player.html',
    "<section class=\"video-player\">\n" +
    "  <div class=\"video-player__iframe-container\">\n" +
    "    <iframe id=\"VideoPlayerIFrame\" class=\"video-player__frame\" ng-src=\"(~ embedUrl ~)\"  width=\"100%\" height=\"100%\" frameborder=\"0\" allowfullscreen></iframe>\n" +
    "  </div>\n" +
    "</section>"
  );


  $templateCache.put('video-search-terms.html',
    "<section class=\"add-collaborator\">\n" +
    "\n" +
    "  <header class=\"video-extended-controls__section-header\" ng-click=\"addSearchTermsShow = !addSearchTermsShow\">\n" +
    "    <h4 class=\"video-extended-controls__section-header-title\" title=\"\">\n" +
    "      Search terms\n" +
    "    </h4>\n" +
    "  </header>\n" +
    "\n" +
    "  <section class=\"video-add-collaborators\">\n" +
    "    <input type=\"hidden\" ui-select2=\"select2Options\" ng-model=\"video.search_keywords\" />\n" +
    "  </section>\n" +
    "\n" +
    "</section>\n" +
    "\n"
  );


  $templateCache.put('video-share.html',
    "<section class=\"video-share\">\n" +
    "  <div class=\"btn-center  btn-group\">\n" +
    "    <a href=\"\" class=\"btn  btn--small\" ng-class=\"{ 'btn--disabled' : !videoIsPublic }\" ng-click=\"!videoIsPublic || (showEmbedCode = !showEmbedCode)\" title=\"(~{true: 'Once you have published a Video you can use these links to generate an Embed Code, and to share the video using your Facebook and Twitter accounts.&#013;&#013;In order to publish the video, Add it to a Public Collection.&#013;&#013;You can add a new Public Collection in Manage, using the menu option of the same name.', false: ''}[!videoIsPublic] ~)\">\n" +
    "      <i class=\"icon  icon--medium  icon--code\"></i>\n" +
    "    </a>\n" +
    "    <a href=\"\" class=\"btn  btn--small\" ng-class=\"{ 'btn--disabled' : !videoIsPublic }\" ng-click=\"!videoIsPublic || shareTwitter()\" title=\"(~{true: 'Once you have published a Video you can use these links to generate an Embed Code, and to share the video using your Facebook and Twitter accounts.&#013;&#013;In order to publish the video, Add it to a Public Collection.&#013;&#013;You can add a new Public Collection in Manage, using the menu option of the same name.', false: ''}[!videoIsPublic] ~)\">\n" +
    "      <i class=\"icon  icon--medium  icon--twitter\"></i>\n" +
    "    </a>\n" +
    "    <a href=\"\" class=\"btn  btn--small\" ng-class=\"{ 'btn--disabled' : !videoIsPublic }\" ng-click=\"!videoIsPublic || shareFacebook()\" title=\"(~{true: 'Once you have published a Video you can use these links to generate an Embed Code, and to share the video using your Facebook and Twitter accounts.&#013;&#013;In order to publish the video, Add it to a Public Collection.&#013;&#013;You can add a new Public Collection in Manage, using the menu option of the same name.', false: ''}[!videoIsPublic] ~)\">\n" +
    "      <i class=\"icon  icon--medium  icon--facebook\" ></i>\n" +
    "    </a>\n" +
    "  </div>\n" +
    "  <section class=\"video-share__embed-code-container\"\n" +
    "    ng-class=\"{ 'video-share__embed-code-container--active' : showEmbedCode }\">\n" +
    "  <label class=\"video-share__embed-code-label\">\n" +
    "    <input class=\"video-share__embed-code-field\" placeholder=\"embed link\" ng-model=\"embedCode.html\" />\n" +
    "  </label>\n" +
    "  </section>\n" +
    "</section>"
  );


  $templateCache.put('video-thumbnail.html',
    "<section class=\"video-preview\" ng-class=\"{ 'video-preview--invert' : invertPreviewSelector }\">\n" +
    "\n" +
    "  <iframe ng-hide=\"flags.videoHasLoaded\" class=\"video-preview__frame\" src=\"/embed/88888888/?controls=1\"></iframe>\n" +
    "\n" +
    "  <a class=\"video-thumbnail__option video-thumbnail__option--select\"\n" +
    "    ng-class=\"{ 'video-thumbnail__option--disabled' : video.status !== 'ready' }\"\n" +
    "    ng-hide=\"showThumbnailSelector\"\n" +
    "    ng-click=\"(video.status !== 'ready') || selectThumbnail()\"\n" +
    "    title=\"(~{true: 'Once your video has been uploaded and processed you can choose a thumbnail from the those that have been automatically generated video. Go to Organise, Choose Edit, click on the video and then click \\'Pick a generated thumbnail\\'', false: ''}[video.status !== 'ready'] ~)\"\n" +
    "    >Pick a generated thumbnail</a>\n" +
    "\n" +
    "  <section class=\"video-thumbnail__option video-thumbnail__option--upload\" ng-hide=\"showThumbnailSelector\" ng-file-drop=\"onPreviewImageSelect($files)\">\n" +
    "    <p>Choose your own thumbnail</p>\n" +
    "    <input type=\"file\" ng-file-select=\"onPreviewImageSelect($files)\" />\n" +
    "    <div ng-file-drop-available=\"dropSupported=true\" ng-show=\"!dropSupported\">HTML5 Drop File is not supported!</div>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"video-thumbnail__option video-preview__option--cancel\"\n" +
    "    ng-hide=\"showThumbnailSelector\"\n" +
    "    ng-class=\"{ 'video-preview__option--disabled' : !flags.videoHasLoaded }\"\n" +
    "    ng-click=\"!flags.videoHasLoaded || closePreviewSelector()\">\n" +
    "    <p ng-hide=\"!flags.videoHasLoaded\">Cancel</p>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"video-thumbnail__selector\" ng-show=\"showThumbnailSelector\">\n" +
    "    <a class=\"btn  btn--small  btn--blob  btn--light  video-preview__close-link\" ng-click=\"closePreviewSelector()\">×</a>\n" +
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
    "    <section class=\"btn-center btn-group\" style=\"margin-bottom: 24px;\">\n" +
    "      <a class=\"btn btn--small btn--light\" ng-click=\"previewIndex = previewIndex - 1\">&lt;</a>\n" +
    "      <span class=\"btn btn--small btn--light\">(~ previewIndex + 1 ~)/(~ previewImages.length ~)</span>\n" +
    "      <a class=\"btn btn--small btn--light\" ng-click=\"previewIndex = previewIndex + 1\">&gt;</a>\n" +
    "    </section>\n" +
    "    <a class=\"btn btn--small btn--light\" ng-click=\"setBackground()\">Ok</a>\n" +
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
    "    <input type=\"file\" ng-file-select=\"onFileSelect($files)\" class=\"video-upload__input\" />\n" +
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
    "  <div class=\"video-view__nav-placeholder\" ng-hide=\"collaborator() || flags.isPublic\">\n" +
    "    <video-navigation flags=\"flags\" video-id=\"video.id\" video-status=\"video.status\"></video-navigation>\n" +
    "  </div>\n" +
    "\n" +
    "  <ul class=\"configurable-layout configurable-layout-(~ flags.isComments ? $root.layoutMode : 'column' ~)\" ng-class=\"{ 'configurable-layout-column--is-comments' : flags.isComments }\">\n" +
    "\n" +
    "    <li class=\"layout-block layout-block__quaternary\" ng-show=\"$root.layoutMode !== 'column'\">\n" +
    "      <section class=\"cf video-view__comments\" ng-show=\"showComments()\">\n" +
    "        <video-collaborators flags=\"flags\" comments=\"comments\" ng-show=\"video.id && flags.isComments && $root.layoutMode === 'column'\" collaborators=\"collaborators\" video-id=\"(~ video.id ~)\"></video-collaborators>\n" +
    "        <video-comments flags=\"flags\" comments=\"comments\" video-id=\"(~ video.id ~)\" current-time=\"videoCurrentTime\" ng-if=\"$root.layoutMode !== 'column'\"></video-comments>\n" +
    "      </section>\n" +
    "    </li>\n" +
    "\n" +
    "    <li class=\"layout-block  layout-block--group\">\n" +
    "\n" +
    "      <div class=\"layout-block layout-block__primary layout-block-primary--(~ flags.isComments ? $root.layoutMode : 'column' ~)\" ng-class=\"{ 'layout-block--narrow' : flags.isComments }\">\n" +
    "\n" +
    "        <section class=\"main-view video-view\">\n" +
    "\n" +
    "          <profile-video-hero ng-show=\"collaborator()\" account=\"video.account\"></profile-video-hero>\n" +
    "\n" +
    "          <h2 class=\"video-view__title\"\n" +
    "            data-placeholder=\"(~ titlePlaceholder ~)\"\n" +
    "            medium-editor\n" +
    "            options=\"{ disableToolbar : true, forcePlainText : true, disableReturn : true }\"\n" +
    "            ng-model=\"video.title\"\n" +
    "            ng-show=\"flags.isEdit\">\n" +
    "          </h2>\n" +
    "          <h3 class=\"video-view__sub-title\"\n" +
    "            data-placeholder=\"(~ straplinePlaceholder ~)\"\n" +
    "            medium-editor\n" +
    "            options=\"{ disableToolbar : true, forcePlainText : true, disableReturn : true }\"\n" +
    "            ng-model=\"video.strapline\"\n" +
    "            ng-show=\"flags.isEdit\">\n" +
    "          </h3>\n" +
    "\n" +
    "          <h2 class=\"video-view__title\" ng-hide=\"flags.isEdit\" ng-bind-html=\"video.title\" ng-class=\"{ 'video-view__title--small' : flags.isComments }\"></h2>\n" +
    "          <h3 class=\"video-view__sub-title\" ng-hide=\"flags.isEdit||flags.isComments\" ng-bind-html=\"video.strapline\"></h3>\n" +
    "\n" +
    "          <div class=\"video-view__container\" ng-class=\"{'video-view__container--fixed': flags.isEdit}\">\n" +
    "            <video-upload ng-show=\"flags.showUpload && flags.isEdit\" ng-cloak></video-upload>\n" +
    "            <video-player ng-hide=\"flags.isEdit && !video.id\" embed-url=\"embedUrl\"></video-player>\n" +
    "\n" +
    "            <a class=\"btn btn--positive btn--small show-modal-button t--push-all\" ng-show=\"flags.isEdit && video.id\" ng-click=\"showModal=true\">edit player</a>\n" +
    "\n" +
    "            <video-modal ng-show=\"flags.isEdit && video.id && showModal\" show-modal=\"showModal\" video=\"video\" player-parameters=\"playerParameters\"></video-modal>\n" +
    "\n" +
    "            <extended-player-controls ng-show=\"showExtendedControls && flags.isEdit\"></extended-player-controls>\n" +
    "\n" +
    "          </div>\n" +
    "\n" +
    "          <video-more-link\n" +
    "            text=\"video.link_title\"\n" +
    "            url=\"video.link_url\"\n" +
    "            is-edit=\"(~ flags.isEdit ~)\"\n" +
    "            ng-show=\"(flags.isEdit || video.link_title && video.link_url) && !flags.isComments\">\n" +
    "          </video-more-link>\n" +
    "\n" +
    "          <section class=\"video-view__description video-medium\"\n" +
    "            ng-class=\"{ 'video-view__description--edit' : flags.isEdit }\"\n" +
    "            data-placeholder=\"(~ descriptionPlaceholder ~)\"\n" +
    "            medium-editor\n" +
    "            options=\"{ buttons : ['bold', 'italic', 'header1', 'header2', 'unorderedlist', 'quote'], firstHeader : 'h2', secondHeader : 'h3' }\"\n" +
    "            ng-model=\"video.description\"\n" +
    "            ng-if=\"flags.isEdit\">\n" +
    "          </section>\n" +
    "\n" +
    "          <section\n" +
    "            class=\"video-view__description video-medium\"\n" +
    "            ng-bind-html=\"video.description\"\n" +
    "            ng-if=\"!flags.isComments && !flags.isEdit\">\n" +
    "          </section>\n" +
    "\n" +
    "          <video-share\n" +
    "            video=\"video\"\n" +
    "            has-tags=\"(~ video.tags && video.tags.items && video.tags.items.length > 0 ~)\"\n" +
    "            ng-hide=\"flags.isComments || flags.isPublic\"\n" +
    "            video-id=\"(~ video.id ~)\">\n" +
    "          </video-share>\n" +
    "\n" +
    "          <video-extended-controls ng-if=\"flags.isEdit\" collaborators=\"collaborators\"></video-extended-controls>\n" +
    "\n" +
    "          <video-download video-id=\"video.id\" ng-show=\"video.id && collaborator() && canDownload\"></video-download>\n" +
    "\n" +
    "          <div class=\"video-view__save-controls\" ng-show=\"flags.isEdit\">\n" +
    "            <a ng-click=\"bottomCancel()\" class=\"btn  btn--small\">cancel</a>\n" +
    "            <a ng-click=\"save()\" class=\"btn  btn--small  btn--positive\">save changes</a>\n" +
    "          </div>\n" +
    "\n" +
    "          <div ng-if=\"flags.isPublic\">\n" +
    "            <h3 class=\"video-view__owner\"><a href=\"#/profile/(~owner.user.id~)\"><img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" alt=\"\" class=\"avatar avatar__img video-view__avatar\" style=\"background-image: url((~owner.avatar || '/static/assets/img/user-avatar.png' ~));\"> (~owner.display_name~)</a></h3>\n" +
    "            <p class=\"profile-details__legend f--sans\" ng-if=\"collaborators\">Collaborators:</p>\n" +
    "            <ul class=\"profile-collaborators\" ng-show=\"collaborators\">\n" +
    "              <li ng-repeat=\"connection in collaborators\">\n" +
    "                <a href=\"#/profile/(~ connection.user.id~)\" data-tooltip=\"(~connection.display_name~), (~connection.user.title~)\" class=\"profile-collaborators__link avatar simptip-position-top  simptip-smooth  simptip-movable\"><img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" alt=\"\" class=\"avatar__img\" style=\"background-image: url((~connection.avatar || '/static/assets/img/user-avatar.png' ~));\">\n" +
    "                </a>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "\n" +
    "        </section>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"layout-block layout-block__secondary layout-block-secondary--(~ flags.isComments ? $root.layoutMode : 'column' ~)\" ng-class=\"{ 'layout-block--narrow' : flags.isComments }\">\n" +
    "\n" +
    "        <section class=\"cf video-view__comments\" ng-show=\"showComments()\">\n" +
    "          <video-indicators comments=\"comments\" current-time=\"videoCurrentTime\" total-time=\"videoTotalTime\"></video-indicators>\n" +
    "          <video-frame-stepper current-time=\"videoCurrentTime\"></video-frame-stepper>\n" +
    "          <video-collaborators flags=\"flags\" comments=\"comments\" ng-show=\"video.id && flags.isComments && $root.layoutMode !== 'column'\" collaborators=\"collaborators\" video-id=\"(~ video.id ~)\"></video-collaborators>\n" +
    "        </section>\n" +
    "\n" +
    "      </div>\n" +
    "\n" +
    "      <div ng-show=\"$root.layoutMode === 'column'\" class=\"layout-block layout-block__tertiary layout-block-tertiary--(~ flags.isComments ? $root.layoutMode : 'column' ~)\">\n" +
    "        <section class=\"cf video-view__comments\" ng-show=\"showComments()\">\n" +
    "          <video-collaborators flags=\"flags\" comments=\"comments\" ng-show=\"video.id && flags.isComments && $root.layoutMode === 'column'\" collaborators=\"collaborators\" video-id=\"(~ video.id ~)\"></video-collaborators>\n" +
    "          <video-comments flags=\"flags\" comments=\"comments\" video-id=\"(~ video.id ~)\" current-time=\"videoCurrentTime\" ng-if=\"$root.layoutMode === 'column'\"></video-comments>\n" +
    "        </section>\n" +
    "      </div>\n" +
    "\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <layout-control is-comments=\"flags.isComments\" ng-show=\"(!collaborator() || (collaborator() && canComment)) && \"></layout-control>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('analytics/analytics.tmpl.html',
    "<div class=\"wrapper  wrapper--fixed\">\n" +
    "  <header class=\"masthead\">\n" +
    "    <h1 class=\"heading  alpha  u--ta-center\">Statistics</h1>\n" +
    "    <div class=\"comparison\">\n" +
    "      <div class=\"comparison__object  one-third\">\n" +
    "        <h2 class=\"heading  tera  u--ff-sans  u--ta-center\">214</h2>\n" +
    "        <p class=\"u--ff-sans  u--smallcaps  u--w600  u--ta-center\">Video Views</p>\n" +
    "      </div>\n" +
    "      <div class=\"comparison__divider  one-third\">\n" +
    "        <h2 class=\"heading  tera  u--ff-sans  u--ta-center\">50</h2>\n" +
    "        <p class=\"u--ff-sans  u--smallcaps  u--w600  u--ta-center\">Profile Views</p>\n" +
    "      </div>\n" +
    "      <div class=\"comparison__object  one-third\">\n" +
    "        <h2 class=\"heading  tera  u--ff-sans  u--ta-center\">264</h2>\n" +
    "        <p class=\"u--ff-sans  u--smallcaps  u--w600  u--ta-center\">Total views</p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </header>\n" +
    "  <section class=\"page-section\">\n" +
    "    <!--<canvas id=\"income\" class=\"graph\" width=\"960\" height=\"240\"></canvas>-->\n" +
    "    <div class=\"text-col\">\n" +
    "      <hr class=\"rule\">\n" +
    "      <h3 class=\"heading  gamma\">Referrers</h3>\n" +
    "      <table class=\"table  table--bordered\">\n" +
    "        <thead>\n" +
    "          <tr>\n" +
    "            <th>Source</th>\n" +
    "            <th class=\"numerical\">Views</th>\n" +
    "          </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "          <tr>\n" +
    "            <th><img src=\"/static/assets/img/favicon-16x16.png\"> Romeo</td>\n" +
    "            <td class=\"numerical\">248</td>\n" +
    "          </tr>\n" +
    "          <tr>\n" +
    "            <th><img src=\"/static/assets/img/favicon-16x16.png\"> Wonder PL iOS</span></td>\n" +
    "            <td class=\"numerical\">141</td>\n" +
    "          </tr>\n" +
    "          <tr>\n" +
    "            <th><span class=\"icon-text\"><i class=\"icon  icon--mail  icon-text__icon\"></i>Wonder PL Newsletters &amp; Notifications</span></td>\n" +
    "            <td class=\"numerical\">65</td>\n" +
    "          </tr>\n" +
    "          <tr>\n" +
    "            <th><span class=\"icon-text\"><i class=\"icon  icon--inbox  icon-text__icon\"></i>Email, IM and direct</span></td>\n" +
    "            <td class=\"numerical\">37</td>\n" +
    "          </tr>\n" +
    "        </tbody>\n" +
    "      </table>\n" +
    "    </div>\n" +
    "  </section>\n" +
    "</div>\n" +
    "\n" +
    "<script>\n" +
    "\n" +
    "var margin = {top: 0, right: 0, bottom: 24, left: 0},\n" +
    "    width = 960 - margin.left - margin.right,\n" +
    "    height = 240 - margin.top - margin.bottom;\n" +
    "\n" +
    "var x = d3.scale.ordinal()\n" +
    "    .rangeRoundBands([0, width], .1);\n" +
    "\n" +
    "var y = d3.scale.linear()\n" +
    "    .range([height, 0]);\n" +
    "\n" +
    "var xAxis = d3.svg.axis()\n" +
    "    .scale(x)\n" +
    "    .orient(\"bottom\");\n" +
    "\n" +
    "var yAxis = d3.svg.axis()\n" +
    "    .scale(y)\n" +
    "    .orient(\"left\")\n" +
    "    .ticks(10, \"%\");\n" +
    "\n" +
    "var svg = d3.select(\"body\").append(\"svg\")\n" +
    "    .attr(\"width\", width + margin.left + margin.right)\n" +
    "    .attr(\"height\", height + margin.top + margin.bottom)\n" +
    "  .append(\"g\")\n" +
    "    .attr(\"transform\", \"translate(\" + margin.left + \",\" + margin.top + \")\");\n" +
    "\n" +
    "d3.tsv(\"data.tsv\", type, function(error, data) {\n" +
    "  x.domain(data.map(function(d) { return d.letter; }));\n" +
    "  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);\n" +
    "\n" +
    "  svg.append(\"g\")\n" +
    "      .attr(\"class\", \"x axis\")\n" +
    "      .attr(\"transform\", \"translate(0,\" + height + \")\")\n" +
    "      .call(xAxis);\n" +
    "\n" +
    "  svg.append(\"g\")\n" +
    "      .attr(\"class\", \"y axis\")\n" +
    "      .call(yAxis)\n" +
    "    .append(\"text\")\n" +
    "      .attr(\"transform\", \"rotate(-90)\")\n" +
    "      .attr(\"y\", 6)\n" +
    "      .attr(\"dy\", \".71em\")\n" +
    "      .style(\"text-anchor\", \"end\")\n" +
    "      .text(\"Frequency\");\n" +
    "\n" +
    "  svg.selectAll(\".bar\")\n" +
    "      .data(data)\n" +
    "    .enter().append(\"rect\")\n" +
    "      .attr(\"class\", \"bar\")\n" +
    "      .attr(\"x\", function(d) { return x(d.letter); })\n" +
    "      .attr(\"width\", x.rangeBand())\n" +
    "      .attr(\"y\", function(d) { return y(d.frequency); })\n" +
    "      .attr(\"height\", function(d) { return height - y(d.frequency); });\n" +
    "\n" +
    "});\n" +
    "\n" +
    "function type(d) {\n" +
    "  d.frequency = +d.frequency;\n" +
    "  return d;\n" +
    "}\n" +
    "\n" +
    "</script>"
  );


  $templateCache.put('login/upgrade/upgrade.tmpl.html',
    "<div class=\"login-view\">\n" +
    "    <div class=\"center-container\">\n" +
    "        <div class=\"center-object\">\n" +
    "            <div class=\"wrapper\">\n" +
    "                <h2>One moment please...</h2>\n" +
    "                <p>...We are upgrading your account to give you creator status.\n" +
    "                As a creator, you can upload videos, invite people to comment on edits and publish your work.\n" +
    "                These features are free as we work through our Beta test. Whilst we may, in the future, charge to upgrade, for now we want you to have access to everything available and to hear what you think.\n" +
    "                Please do take a moment to send us your feedback to <a href=\"mailto:beta@wonderpl.com\">beta@wonderpl.com</a>.</p>\n" +
    "                <ul class=\"button-row\">\n" +
    "                    <li class=\"button-item\"><a href=\"#/organise/collaboration\" class=\"btn\">Cancel</a></li>\n" +
    "                    <li class=\"button-item\"><a ng-click=\"upgrade()\" class=\"btn btn--positive\">Upgrade</a></li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('organise/organise-breadcrumb.tmpl.html',
    "<ol class=\"nav  page-breadcrumbs\">\n" +
    "  <li class=\"page-breadcrumbs__item\"><span class=\"page-breadcrumbs__title\">All Videos</span></li>\n" +
    "  <li ng-if=\"!filterByRecent && tag\" class=\"page-breadcrumbs__item\"><span class=\"page-breadcrumbs__title  page-breadcrumbs__title--selected\" ng-bind-html=\"tag.label\"></span></li>\n" +
    "  <li ng-if=\"filterByRecent\" class=\"page-breadcrumbs__item\"><span class=\"page-breadcrumbs__title\">Recent Videos</span></li>\n" +
    "  <li ng-if=\"filterByCollaboration\" class=\"page-breadcrumbs__item\"><span class=\"page-breadcrumbs__title\">Collaboration Videos</span></li>\n" +
    "</ol>"
  );


  $templateCache.put('organise/organise-collection.tmpl.html',
    "<section class=\"organise-collection\">\n" +
    "  <div class=\"media collection-view\" ng-class=\"{ 'collection-view--public' : tag.public }\">\n" +
    "    <div class=\"media__img  collection-view__thumb\">\n" +
    "      <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" class=\"collection-view__thumb__icon\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"media__body collection-view__content\">\n" +
    "      <h3 class=\"heading  w--800  no-spacing  organise-collection__title\">\n" +
    "        <div ng-hide=\"isEdit\">\n" +
    "          (~ tag.label ~)\n" +
    "          <span class=\"organise-collection__visibility organise-collection__visibility--private  icon-text\"><i class=\"icon  icon-text__icon\" ng-class=\"tag.public ? 'icon--eye' : 'icon--lock'\"></i>(~ tag.public ? 'public' : 'private' ~)</span>\n" +
    "        </div>\n" +
    "        <div class=\"editable\" medium-editor\n" +
    "          options=\"{ disableToolbar : true, disableReturn : true, placeholder : '' }\"\n" +
    "          ng-model=\"tag.label\"\n" +
    "          ng-show=\"isEdit\">\n" +
    "        </div>\n" +
    "      </h3>\n" +
    "      <p class=\"organise-collection__description\" ng-bind=\"tag.description\" ng-hide=\"isEdit\"></p>\n" +
    "      <p class=\"organise-collection__description\"\n" +
    "        medium-editor\n" +
    "        options=\"{ disableToolbar : true, forcePlainText : true, disableReturn : true, placeholder : '' }\"\n" +
    "        ng-model=\"tag.description\"\n" +
    "        ng-show=\"isEdit\">\n" +
    "      </p>\n" +
    "      <div class=\"collection-view__actions\">\n" +
    "        <ul class=\"nav  nav--blocks collection-view-action-list\">\n" +
    "          <li class=\"collection-view-action-list__item\"><a class=\"btn  btn--small  organise-collection__button organise-collection__button--edit collection-view-action-list__link\" ng-hide=\"isEdit\" ng-click=\"isEdit = !isEdit\">Edit</a></li>\n" +
    "          <li class=\"collection-view-action-list__item\"><a class=\"btn  btn--small  btn--positive organise-collection__button organise-collection__button--save collection-view-action-list__link\" ng-show=\"isEdit\" ng-click=\"save()\">Done</a></li>\n" +
    "          <li class=\"collection-view-action-list__item\"><a class=\"btn  btn--small  btn--destructive organise-collection__button organise-collection__button--delete collection-view-action-list__link\" ng-show=\"isEdit\" ng-click=\"delete()\">Delete</a></li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</section>"
  );


  $templateCache.put('organise/organise-navigation.tmpl.html',
    "<div class=\"layout__item  one-third  organise-navigation\">\n" +
    "  <ul class=\"nav  nav--stacked  browse-list\">\n" +
    "    <li class=\"browse-list__item\"><span class=\"browse-list__title\">Manage</span></li>\n" +
    "    <li class=\"browse-list__item\" ng-if=\"!isCollaborator()\"><a class=\"browse-list__link\" ng-class=\"{ 'browse-list__link--active' : !filterByCollaboration &&  !filterByRecent && !currentTag }\" ng-click=\"showAllVideos()\">All my videos</a></li>\n" +
    "    <li class=\"browse-list__item\" ng-if=\"!isCollaborator()\"><a class=\"browse-list__link\" ng-class=\"{ 'browse-list__link--active' : filterByRecent }\" ng-click=\"showRecentVideos()\">My recently added videos</a></li>\n" +
    "    <li class=\"browse-list__item\"><a class=\"browse-list__link\" ng-class=\"{ 'browse-list__link--active' : filterByCollaboration }\" ng-click=\"showCollaborationVideos()\">Collaborating videos</a></li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <ul class=\"nav  nav--stacked  browse-list\" ng-if=\"!isCollaborator()\">\n" +
    "    <li class=\"browse-list__item\"><span class=\"browse-list__title\">Collections not visible in app</span></li>\n" +
    "    <li class=\"browse-list__item\"><a class=\"browse-list__link  browse-list__link--create  icon-text\" ng-click=\"createPrivateCollection()\"><i class=\"icon  icon-text__icon  icon--plus\"></i>Add a new private collection</a></li>\n" +
    "    <li class=\"browse-list__item\" ng-repeat=\"tag in tags | orderBy : 'label' | filter : { public : false }\"><a class=\"browse-list__link\" ng-class=\"{ 'browse-list__link--active' : currentTag.id === tag.id }\" ng-bind-html=\"tag.label\" ng-click=\"loadCollection(tag.id)\"></a></li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <ul class=\"nav  nav--stacked  browse-list\"ng-if=\"!isCollaborator()\">\n" +
    "    <li class=\"browse-list__item\"><span class=\"browse-list__title\">Collections visible in app</span></li>\n" +
    "    <li class=\"browse-list__item\"><a class=\"browse-list__link  browse-list__link--create  icon-text\" ng-click=\"createPublicCollection()\"><i class=\"icon  icon-text__icon  icon--plus\"></i>Add a new public collection</a></li>\n" +
    "    <li class=\"browse-list__item\" ng-repeat=\"tag in tags | filter : { public : true } | orderBy : 'label'\"><a class=\"browse-list__link\" ng-class=\"{ 'browse-list__link--active' : currentTag.id === tag.id }\" ng-bind-html=\"tag.label\" ng-click=\"loadCollection(tag.id)\"></a></li>\n" +
    "  </ul>\n" +
    "</div>"
  );


  $templateCache.put('organise/organise-video-list.tmpl.html',
    "<section class=\"organise-video-list\">\n" +
    "\n" +
    "  <section class=\"organise-video-list__list-controls\">\n" +
    "    <label class=\"organise-video-list__list-control-label\">\n" +
    "      Sort:\n" +
    "      <select class=\"organise-video-list__select  btn  btn--small\"\n" +
    "        ng-model=\"sortOption\"\n" +
    "        ng-init=\"sortOption=''\">\n" +
    "        <option value=\"\">Oldest</option>\n" +
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
    "    <p>There are no videos here right now</p>\n" +
    "    <p ng-if=\"!filterByCollaboration\">Go and <a href=\"#/video\">upload</a> a video.</p>\n" +
    "  </div>\n" +
    "\n" +
    "  <ul class=\"layout\" ng-show=\"filteredVideos\">\n" +
    "    <li class=\"layout__item  one-third\"\n" +
    "      ng-repeat=\"video in filteredVideos | orderBy: sortOption\"\n" +
    "      ng-class=\"{\n" +
    "        'organise-video-list__video--last' : ($index + 1) % 3 == 0,\n" +
    "        'organise-video-list__video--list' : isList\n" +
    "      }\">\n" +
    "      <organise-video video=\"video\" is-list=\"isList\" is-collaboration=\"filterByCollaboration\"></organise-video>\n" +
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


  $templateCache.put('organise/organise-video.tmpl.html',
    "<div class=\"video-thumb-wrapper  organise-video\">\n" +
    "\n" +
    "  <ul class=\"nav  nav--block  organise-video__inline-controls\" ng-show=\"isList && !isCollaboration\">\n" +
    "    <li class=\"organise-video__inline-control\">\n" +
    "      <a class=\"organise-video__inline-link organise-video__inline-link--edit\" ng-href=\"#/video/(~video.id~)\" title=\"Edit\"><i class=\"icon  icon--edit\"></i></a>\n" +
    "    </li>\n" +
    "    <li class=\"organise-video__inline-control\">\n" +
    "      <a class=\"organise-video__inline-link organise-video__inline-link--view\" ng-href=\"#/video/(~video.id~)/publish\" title=\"Review\"><i class=\"icon  icon--eye\"></i></a>\n" +
    "    </li>\n" +
    "    <li class=\"organise-video__inline-control\">\n" +
    "      <a class=\"organise-video__inline-link is-disabled organise-video__inline-link--stats\"><i class=\"icon  icon--bar-graph\" title=\"Stats\"></i></a>\n" +
    "    </li>\n" +
    "    <li class=\"organise-video__inline-control\">\n" +
    "      <a class=\"organise-video__inline-link organise-video__inline-link--add-remove\" ng-click=\"addRemove(video)\" title=\"Add/Remove from collection\"><i class=\"icon  icon--collection\"></i></a>\n" +
    "    </li>\n" +
    "    <li class=\"organise-video__inline-control\">\n" +
    "      <a class=\"organise-video__inline-link organise-video__inline-link--delete\" ng-click=\"showDelete(video)\" title=\"Delete video\" ><i class=\"icon  icon--trash\"></i></a>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <a ng-href=\"#/video/(~video.id~)\" class=\"video-thumb-link\">\n" +
    "    <span class=\"heading  trunc  video-thumb-link__title\" ng-show=\"isList\" ng-bind=\"video.title\"></span>\n" +
    "  </a>\n" +
    "\n" +
    "  <a ng-href=\"#/video/(~video.id~)\" class=\"video-thumb-link\">\n" +
    "    <span class=\"heading  trunc  trunc--two  video-thumb-link__title\" ng-hide=\"isList\" ng-bind=\"video.title\"></span>\n" +
    "  </a>\n" +
    "\n" +
    "  <div class=\"ratio  ratio--16x9  video-thumb\" ng-hide=\"isList\">\n" +
    "    <ul class=\"nav  nav--block  video-thumb-list\" ng-hide=\"isCollaboration\">\n" +
    "      <li class=\"video-thumb-list__item\"><a class=\"video-thumb-list__link\" ng-class=\"{'is-disabled' : video.status=='error'}\" href=\"#/video/(~video.id~)\"><i class=\"icon  icon--edit\"></i><span class=\"t--block  t--center\">Edit</span></a></li>\n" +
    "      <li class=\"video-thumb-list__item\"><a class=\"video-thumb-list__link\" ng-class=\"{'is-disabled' : video.status=='error'}\" href=\"#/video/(~video.id~)/publish\"><i class=\"icon  icon--eye\"></i><span class=\"t--block  t--center\">Publish</span></a></li>\n" +
    "      <li class=\"video-thumb-list__item\"><a class=\"video-thumb-list__link\" ng-class=\"{'is-disabled' : video.status=='error'}\" ng-href=\"#/video/(~video.id~)/comments\"><i class=\"icon  icon--group\"></i><span class=\"t--block  t--center\">Collaborate</span></a></li>\n" +
    "      <li class=\"video-thumb-list__item\"><a class=\"video-thumb-list__link is-disabled\"><i class=\"icon  icon--bar-graph\"></i><span class=\"t--block  t--center\">Stats</span></a></li>\n" +
    "      <li class=\"video-thumb-list__item\"><a class=\"video-thumb-list__link\" ng-class=\"{'is-disabled' : video.status=='error'}\" ng-click=\"addRemove(video)\"><i class=\"icon  icon--collection\"></i><span class=\"t--block  t--center\">Add / Remove</span></a></li>\n" +
    "      <li class=\"video-thumb-list__item\"><a class=\"video-thumb-list__link\" ng-click=\"showDelete(video)\"><i class=\"icon  icon--trash\"></i><span class=\"t--block  t--center\">Delete</span></a></l>\n" +
    "    </ul>\n" +
    "    <a ng-href=\"#/video/(~video.id~)\">\n" +
    "      <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" class=\"ratio__src  video-thumb__img\" style=\"background-image: url('(~ thumbnail ~)')\">\n" +
    "      <div class=\"status\" ng-if=\"showStatus\"><span>(~video.status~)</span></div>\n" +
    "    </a>\n" +
    "  </div>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('organise/organise.tmpl.html',
    "<main role=\"main\" class=\"page-content\" ng-controller=\"OrganiseCtrl\">\n" +
    "  <div class=\"wrapper  wrapper--fixed\">\n" +
    "    <organise-breadcrumb tag=\"tag\" filter-by-recent=\"filterByRecent\" filter-by-collaboration=\"filterByCollaboration\"></organise-breadcrumb>\n" +
    "    <div class=\"layout\">\n" +
    "      <organise-navigation tags=\"tags\" current-tag=\"tag\" filter-by-recent=\"filterByRecent\" filter-by-collaboration=\"filterByCollaboration\"></organise-navigation>\n" +
    "      <div class=\"layout__item  two-thirds\">\n" +
    "        <organise-collection ng-show=\"tag\" ng-if=\"!collaborator()\" tag=\"tag\" is-edit=\"isEdit\"></organise-collection>\n" +
    "        <organise-video-list videos=\"videos\" collaboration-videos=\"collaborationVideos\" tag=\"tag\" filter-by-recent=\"filterByRecent\" filter-by-collaboration=\"filterByCollaboration\"></organise-video-list>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</main>\n"
  );


  $templateCache.put('profile/cover-image.tmpl.html',
    "<section class=\"profile-cover\"\n" +
    "  ng-class=\"{ 'profile-cover--edit' : flags.isEdit, 'profile-cover--hero' : isHero, 'profile-cover--img' : profile.profile_cover }\"\n" +
    "  style=\"background-image:url((~ profile.profile_cover ~));\" loading-spinner>\n" +
    "\n" +
    "  <label class=\"profile-cover__upload-label\" for=\"profileCoverUpload\">\n" +
    "    <div class=\"profile-cover__dropzone\"\n" +
    "      ng-file-drop=\"uploadProfileCover($files)\"\n" +
    "      ng-file-drag-over-class=\"profile-cover__dropzone--active\"\n" +
    "      ng-show=\"flags.isEdit\">\n" +
    "    </div>\n" +
    "  </label>\n" +
    "\n" +
    "  <input class=\"profile-cover__upload\" type=\"file\" id=\"profileCoverUpload\" ng-file-select=\"uploadProfileCover($files)\" />\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('profile/edit/edit-details.tmpl.html',
    "<form class=\"profile-edit\">\n" +
    "  <h3 class=\"error\" ng-hide=\"form.valid\">(~ form.errorMsg() ~)</h3>\n" +
    "\n" +
    "  <input type=\"text\" ng-model=\"profile.display_name\" class=\"profile-edit__name input--field\" placeholder=\"name\" required=\"true\" ng-trim=\"true\" />\n" +
    "\n" +
    "  <input class=\"profile-edit__description input--field\"\n" +
    "    type=\"text\"\n" +
    "    placeholder=\"description\"\n" +
    "    ng-maxlength=\"100\"\n" +
    "    ng-model=\"profile.description\" ng-trim=\"true\" />\n" +
    "\n" +
    "  <section class=\"profile-edit__extended\">\n" +
    "\n" +
    "  <label>Job title:</label>\n" +
    "    <input type=\"text\" class=\"profile-edit__job_title input--field\"\n" +
    "      ng-model=\"profile.title\" ng-trim=\"true\" id=\"profileJobTitle\" />\n" +
    "\n" +
    "  <label>Website or homepage:</label>\n" +
    "    <input type=\"text\" class=\"profile-edit__website input--field\"\n" +
    "      ng-class=\"{ 'error' : form.errors.website_url }\"\n" +
    "      placeholder=\"Link http://\"\n" +
    "      ng-model=\"profile.website_url\" />\n" +
    "\n" +
    "  <label>Share your location:</label>\n" +
    "    <location-selector class=\"input--field\" location=\"profile.location\"></location-selector>\n" +
    "\n" +
    "  <label>Show &ldquo;Connect with me&rdquo; button:</label>\n" +
    "    <div class=\"profile-edit__contact-button toggle--field\">\n" +
    "    <button ng-class=\"{'active' : profile.contactable }\" ng-click=\"profile.contactable = true\">Yes</button>\n" +
    "    <button ng-class=\"{'active' : !profile.contactable }\" ng-click=\"profile.contactable = false\">No</button>\n" +
    "  </div>\n" +
    "  <label>Make yourself easy to find, add your skills and interests:</label>\n" +
    "    <input type=\"hidden\" ui-select2=\"select2Options\" ng-model=\"search_keywords\" placeholder=\"Make yourself searchable by adding relevant terms\">\n" +
    "  </section>\n" +
    "</form>"
  );


  $templateCache.put('profile/invite-modal.tmpl.html',
    "<div class=\"modal__title  split\">\n" +
    "  <span class=\"split__title  t--block  w--600\">Invite User</span>\n" +
    "  <a class=\"modal__link\" ng-click=\"close()\"><i class=\"icon icon--medium icon--circle-cross\"></i></a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal__content\">\n" +
    "  <fieldset class=\"modal-form__fieldset\">\n" +
    "    <label for=\"inviteMessage\" class=\"is-hidden\">Invitation Message:</label>\n" +
    "    <textarea id=\"inviteMessage\" class=\"modal-textbox\" ng-model=\"invitation.message\" placeholder=\"Invitation Message\"></textarea>\n" +
    "  </fieldset>\n" +
    "  <button class=\"btn btn--positive\" ng-click=\"sendInvite()\">Send Invitation</button>\n" +
    "</div>"
  );


  $templateCache.put('profile/profile-avatar.tmpl.html',
    "<section class=\"profile-image\">\n" +
    "\n" +
    "  <div class=\"profile-image__container\"\n" +
    "    ng-class=\"{ 'profile-image__container--edit' : flags.isEdit }\"\n" +
    "    ng-style=\"profileImageStyle\"\n" +
    "    loading-spinner>\n" +
    "    <label class=\"profile-image__upload-label\" for=\"profileImageUpload\">\n" +
    "      <div class=\"profile-image__dropzone\"\n" +
    "        ng-file-drop=\"uploadProfileImage($files)\"\n" +
    "        ng-file-drag-over-class=\"profile-image__dropzone--active\"\n" +
    "        ng-show=\"flags.isEdit\">\n" +
    "      </div>\n" +
    "    </label>\n" +
    "\n" +
    "    <input class=\"profile-image__upload\" type=\"file\" id=\"profileImageUpload\" ng-file-select=\"uploadProfileImage($files)\" />\n" +
    "  </div>\n" +
    "</section>"
  );


  $templateCache.put('profile/profile-navigation.tmpl.html',
    "<section class=\"sub-navigation\">\n" +
    "  <div class=\"wrapper\">\n" +
    "    <ul class=\"sub-navigation__modes\">\n" +
    "      <li class=\"sub-navigation__mode\" ng-hide=\"flags.isEdit\">\n" +
    "        <a href=\"#/profile/edit\" class=\"sub-navigation__link btn btn--utility\" >edit</a>\n" +
    "      </li>\n" +
    "      <li class=\"sub-navigation__mode\" ng-show=\"flags.isEdit\">\n" +
    "        <a class=\"sub-navigation__link btn btn--utility\" ng-click=\"save()\" ng-disabled=\"\">save</a>\n" +
    "      </li>\n" +
    "      <li class=\"sub-navigation__mode\" ng-show=\"flags.isEdit\">\n" +
    "        <a class=\"sub-navigation__link btn btn--utility\" href=\"#/profile\">cancel</a>\n" +
    "      </li>\n" +
    "      <li class=\"sub-navigation__mode\">\n" +
    "        <a class=\"sub-navigation__link btn btn--utility\" ng-click=\"logout()\">logout</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</section>"
  );


  $templateCache.put('profile/profile.tmpl.html',
    "<section class=\"profile\">\n" +
    "\n" +
    "  <div class=\"profile-view__nav-placeholder sub-navigation__placeholder\" ng-show=\"flags.isOwner\">\n" +
    "    <profile-navigation flags=\"flags\" ng-if=\"flags.isOwner\"></profile-navigation>\n" +
    "  </div>\n" +
    "\n" +
    "  <profile-cover></profile-cover>\n" +
    "\n" +
    "  <profile-image></profile-image>\n" +
    "\n" +
    "  <div class=\"wrapper wrapper--fixed\">\n" +
    "    <profile-edit-details data-profile=\"profile\" data-flags=\"flags\" ng-if=\"flags.isEdit\"></profile-edit-details>\n" +
    "    <profile-view-details data-profile=\"profile\" data-flags=\"flags\" ng-if=\"! flags.isEdit\"></profile-view-details>\n" +
    "\n" +
    "\n" +
    "    <list-videos ng-if=\"! flags.isOwner\">\n" +
    "      This should be the list of collaborators and public videos\n" +
    "    </list-videos>\n" +
    "\n" +
    "  </div>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('profile/public/list-videos.tmpl.html',
    "<section class=\"public-profile__wrapper\">\n" +
    "\t<ul class=\"public-profile__videos\" ng-show=\"videos\">\n" +
    "\t\t<li ng-repeat=\"item in videos\" class=\"cf t--block t--pad-top--half\">\n" +
    "        <a href=\"#/video/(~item.id~)\" class=\"media non-link\">\n" +
    "          <div class=\"media__img one-third search__thumbnail\">\n" +
    "            <div class=\"ratio  ratio--16x9\">\n" +
    "              <img class=\"ratio__src\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" style=\"background-image : url((~ item.thumbnail ~));\">\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"media__body\">\n" +
    "            <p class=\"heading no-spacing trunc\" ng-bind-html=\"item.title\"></p>\n" +
    "            <p class=\"search__item-description milli trunc--three\" ng-bind-html=\"item.description\"></p>\n" +
    "          </div>\n" +
    "        </a>\n" +
    "      </li>\n" +
    "\t</ul>\n" +
    "</section>"
  );


  $templateCache.put('profile/view-details.tmpl.html',
    "<div class=\"profile-details\">\n" +
    "\t<h2 class=\"profile-details__name no-spacing\" ng-bind=\"profile.display_name\"></h2>\n" +
    "\n" +
    "\t<div ng-show=\"profile.title\" class=\"profile-details__job-title\" style=\"text-align: center;\">(~ profile.title ~)</div>\n" +
    "\n" +
    "\t<div class=\"profile-details__description\" ng-bind-html=\"profile.description\"></div>\n" +
    "\n" +
    "\t<ul class=\"profile-details__optional\">\n" +
    "\t\t<li class=\"profile-details__website\" ng-if=\"profile.website_url\"><a href=\"(~ profile.website_url ~)\" target=\"_new\">(~ profile.website_url ~)</a></li>\n" +
    "\t\t<li ng-if=\"profile.location\" class=\"profile-details__location\">(~ findLocationName() ~)</li>\n" +
    "\t</ul>\n" +
    "\n" +
    "    <profile-invite ng-if=\"!flags.isOwner && profile.contactable\" data-profile=\"profile\"></profile-invite>\n" +
    "\n" +
    "\t<p class=\"profile-details__legend f--sans\" ng-if=\"connections\">Collaborated with:</p>\n" +
    "\t<ul class=\"profile-collaborators\" ng-show=\"connections\">\n" +
    "\t\t<li ng-repeat=\"connection in connections\">\n" +
    "\t\t\t<a href=\"#/profile/(~ connection.user.id~)\" data-tooltip=\"(~connection.user.display_name~), (~connection.user.title~)\" class=\"profile-collaborators__link avatar simptip-position-top  simptip-smooth  simptip-movable\"><img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" alt=\"\" class=\"avatar__img\" style=\"background-image: url((~connection.user.avatar || '/static/assets/img/user-avatar.png' ~));\">\n" +
    "\t\t\t</a>\n" +
    "\t\t</li>\n" +
    "\t</ul>\n" +
    "</div>"
  );


  $templateCache.put('publish/publish.tmpl.html',
    "<section class=\"sub-navigation\">\n" +
    "  <div class=\"wrapper\">\n" +
    "    <ul class=\"sub-navigation__modes\">\n" +
    "      <li class=\"sub-navigation__mode\">\n" +
    "        <a href=\"#/video/(~video.id~)\" class=\"sub-navigation__link  btn  btn--utility  icon-text\"><i class=\"icon  icon--edit  icon-text__icon\"></i>Edit</a>\n" +
    "      </li>\n" +
    "      <li class=\"sub-navigation__mode\">\n" +
    "        <a href=\"#/video/(~video.id~)/publish\" class=\"sub-navigation__link  sub-navigation__link--active  btn  btn--utility  icon-text\"><i class=\"icon  icon--eye  icon-text__icon\"></i>Publish</a>\n" +
    "      </li>\n" +
    "      <li class=\"sub-navigation__mode\">\n" +
    "        <a href=\"#/video/(~video.id~)/comments\" class=\"sub-navigation__link  btn  btn--utility  icon-text\"><i class=\"icon  icon--speech-bubble  icon-text__icon\"></i>Collaborate</a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</section>\n" +
    "<section class=\"page-section\">\n" +
    "  <div class=\"wrapper  wrapper--fixed\">\n" +
    "\n" +
    "    <h1 class=\"heading  alpha  t--center\">Publish '(~ video.title ~)' to Wonder Place</h1>\n" +
    "\n" +
    "    <div class=\"text-col\">\n" +
    "      <p class=\"t--center\">Schedule a timed publish for your video on Wonder Place. The act of publishing on Wonder Place is done by placing your video inside a public collection which will appear on the app.</p>\n" +
    "    </div>\n" +
    "    <div class=\"media\">\n" +
    "      <div class=\"media__img  publish-thumb\">\n" +
    "        <div class=\"ratio  ratio--16x9\">\n" +
    "          <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" class=\"ratio__src\" style=\"background-image:url('(~ video.thumbnails.items[3].url ~)');\">\n" +
    "        </div>\n" +
    "      </div>\n" +
    "      <div class=\"media__body\">\n" +
    "        <p class=\"heading  gamma\" ng-bind=\"video.title\"></p>\n" +
    "        <p ng-bind-html=\"video.description\"></p>\n" +
    "        <p ng-bind=\"video.search_keywords\"></p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"text-col\">\n" +
    "      <p class=\"heading  kilo\" ng-if=\"isPublished\">Your video has been published!</p>\n" +
    "      <p ng-if=\"video.tags.items\">Your video has been published to: <span ng-bind=\"video.tags.items | commaSeparatedList\"></span></p>\n" +
    "\n" +
    "      <div class=\"notice  notice--info\">\n" +
    "        <p>By clicking 'Publish', you agree that this video does not violate the Terms of Use of any of the video sites you plan to upload to and that you own all copyrights in this video or have express permission from all copyright owners to upload it. You also agree to Wonder PL’s Terms of Service.</p>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"btn-center\">\n" +
    "\n" +
    "        <div class=\"btn  btn--positive  btn--small  btn--popup\">\n" +
    "          <span class=\"icon-text--rev\" ng-click=\"showPublishOptions = !showPublishOptions\">publish<i class=\"icon  icon--ellipsis  icon-text__icon\"></i></span>\n" +
    "          <ul class=\"nav  nav--stacked  popup\" ng-show=\"showPublishOptions\">\n" +
    "            <li class=\"popup__item\"><a class=\"popup__link\" ng-click=\"showPublish()\">Publish Now</a></li>\n" +
    "            <li class=\"popup__item\"><a class=\"popup__link\" ng-click=\"showPublish()\">Add to Queue</a></li>\n" +
    "            <li class=\"popup__item\"><a class=\"popup__link\" ng-click=\"showCalendar = !showCalendar\">Schedule a date</a>\n" +
    "              <div class=\"date-picker\" ng-show=\"showCalendar\">\n" +
    "                <img class=\"date-picker__img\" ng-click=\"showPublish()\" src=\"/static/assets/img/date-picker-placeholder.png\" />\n" +
    "              </div>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <hr class=\"rule\">\n" +
    "  </div>\n" +
    "</section>\n" +
    "<section class=\"page-section\">\n" +
    "  <div class=\"wrapper  wrapper--fixed\">\n" +
    "\n" +
    "    <h2 class=\"heading  beta  t--center\">Set up your multi-platform publishing&hellip;</h2>\n" +
    "    <div class=\"text-col\">\n" +
    "      <p class=\"t--center\">Publish to many different places with Wonder Place and we will make sure your posts look great everywhere. Click the associated logo buttons below to begin connecting your accounts to Wonder Place.</p>\n" +
    "    </div>\n" +
    "\n" +
    "    <ul class=\"layout  publish-host\">\n" +
    "      <li class=\"layout__item  one-quarter  publish-host__option\" ng-class=\"{ 'publish-host__option--published' : providers.wonderpl.isPublished }\">\n" +
    "        <div class=\"avatar  avatar--huge\">\n" +
    "          <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" alt=\"\" class=\"avatar__img\">\n" +
    "        </div>\n" +
    "        <p class=\"publish-host__title  icon-text\"><i class=\"icon  icon-text__icon  icon--circle-check\" ng-if=\"providers.wonderpl.isPublished\"></i>Wonder PL</p>\n" +
    "      </li><!--\n" +
    "\n" +
    "      --><li class=\"layout__item  one-quarter  publish-host__option\">\n" +
    "        <div class=\"avatar  avatar--huge\">\n" +
    "          <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" alt=\"\" class=\"avatar__img\">\n" +
    "        </div>\n" +
    "        <p class=\"publish-host__title  icon-text\"><i class=\"icon  icon-text__icon  icon--circle-check\" ng-if=\"providers.youtube.isPublished\"></i>Youtube</p>\n" +
    "      </li><!--\n" +
    "\n" +
    "      --><li class=\"layout__item  one-quarter  publish-host__option\">\n" +
    "        <div class=\"avatar  avatar--huge\">\n" +
    "          <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" alt=\"\" class=\"avatar__img\">\n" +
    "        </div>\n" +
    "        <p class=\"publish-host__title  icon-text\"><i class=\"icon  icon-text__icon  icon--circle-check\" ng-if=\"providers.facebook.isPublished\"></i>Facebook</p>\n" +
    "      </li><!--\n" +
    "\n" +
    "      --><li class=\"layout__item  one-quarter  publish-host__option\">\n" +
    "        <div class=\"avatar  avatar--huge\">\n" +
    "          <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" alt=\"\" class=\"avatar__img\">\n" +
    "        </div>\n" +
    "        <p class=\"publish-host__title  icon-text--rev\">Add<i class=\"icon  icon-text__icon  icon--plus\"></i></p>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "\n" +
    "  </div>\n" +
    "</section>"
  );


  $templateCache.put('search/form.tmpl.html',
    "<section class=\"search__form\">\n" +
    "\n" +
    "  <input type=\"text\" class=\"search__form-input\" ng-model=\"q\" auto-focus placeholder=\"Type to search\" tabindex=\"1\" />\n" +
    "\n" +
    "  <location-selector location=\"location\" allow-empty=\"true\"></location-selector>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('search/results.tmpl.html',
    "<section class=\"search__results\" ng-if=\"results\">\n" +
    "\n" +
    "  <section ng-if=\"results.content_owner.items\" class=\"search__results-container search__results-container--left\">\n" +
    "    <span class=\"content-heading\">Creators: </span>\n" +
    "    <ul class=\"no-spacing--full\">\n" +
    "      <li ng-repeat=\"item in results.content_owner.items\" class=\"cf t--block t--pad-top--half\">\n" +
    "        <a ng-href=\"#/profile/(~ item.id ~)\">\n" +
    "          <div class=\"search__avatar-container\">\n" +
    "            <div class=\"search__avatar avatar\">\n" +
    "              <img class=\"search__avatar-image avatar__img\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" style=\"background-image : url('(~ item.avatar ~)');\" />\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <p class=\"heading no-spacing trunc t--pad-top--half\" ng-bind=\"item.display_name\"></p>\n" +
    "          <p class=\"search__item-title\" ng-bind-html=\"item.title\"></p>\n" +
    "          <p class=\"search__item-description milli trunc\" ng-bind-html=\"item.description\"></p>\n" +
    "        </a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </section>\n" +
    "\n" +
    "  <section ng-if=\"results.collaborator.items\" class=\"search__results-container search__results-container--left\">\n" +
    "    <span class=\"content-heading\">Collaborators: </span>\n" +
    "    <ul class=\"no-spacing--full\">\n" +
    "      <li ng-repeat=\"item in results.collaborator.items\" class=\"cf t--block t--pad-top--half\">\n" +
    "        <a ng-href=\"#/profile/(~ item.id ~)\">\n" +
    "          <div class=\"search__avatar-container\">\n" +
    "            <div class=\"no-spacing avatar\">\n" +
    "              <img class=\"avatar__img\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" style=\"background-image : url('(~ item.avatar ~)');\" />\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <p class=\"heading no-spacing trunc t--pad-top--half\" ng-bind=\"item.display_name\"></p>\n" +
    "          <p class=\"search__item-title\" ng-bind-html=\"item.title\"></p>\n" +
    "          <p class=\"search__item-description milli trunc\" ng-bind-html=\"item.description\"></p>\n" +
    "        </a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </section>\n" +
    "\n" +
    "  <section ng-if=\"results.video.items\" class=\"search__results-container search__results-container--right\">\n" +
    "    <span class=\"content-heading\">Associated Videos: </span>\n" +
    "    <ul class=\"no-spacing--full\">\n" +
    "      <li ng-repeat=\"item in results.video.items\" class=\"cf t--block t--pad-top--half\">\n" +
    "\n" +
    "        <a  ng-href=\"#/video/(~ item.id ~)\" class=\"media non-link\">\n" +
    "          <div class=\"media__img one-third search__thumbnail\">\n" +
    "            <div class=\"ratio  ratio--16x9\">\n" +
    "              <img class=\"ratio__src\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" style=\"background-image : url('(~ item.thumbnail_url ~)');\" />\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"media__body\">\n" +
    "            <p class=\"heading no-spacing trunc\" ng-bind-html=\"item.title\"></p>\n" +
    "            <p class=\"search__item-description milli trunc--two\" ng-bind-html=\"item.description\"></p>\n" +
    "          </div>\n" +
    "        </a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </section>\n" +
    "\n" +
    "</section>\n"
  );


  $templateCache.put('search/search.tmpl.html',
    "<section class=\"search page-content wrapper wrapper--fixed\" ng-controller=\"SearchCtrl\">\n" +
    "\n" +
    "  <search-form q=\"q\" location=\"location\"></search-form>\n" +
    "\n" +
    "  <results results=\"results\"></results>\n" +
    "\n" +
    "</section>"
  );


  $templateCache.put('video/config/cover-selector.tmpl.html',
    "<div class=\"cover-selector\">\n" +
    "\n" +
    "  <a class=\"btn btn--positive t--push-bottom\" ng-class=\"{ 'btn--disabled' : !previewImages }\" ng-if=\"!showSelector\" ng-click=\"!!previewImages && displaySelector()\">Pick a generated thumbnail</a>\n" +
    "\n" +
    "  <section class=\"cover-selector__upload t--pad-all\" ng-if=\"!showSelector\" ng-file-drop=\"onCoverSelect($files)\">\n" +
    "    <p>Choose your own thumbnail</p>\n" +
    "    <input type=\"file\" ng-file-select=\"onCoverSelect($files)\" />\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"cover-selector__carousel\" ng-if=\"showSelector\">\n" +
    "    <ul class=\"cover-selector__images js-preview-images\" style=\"width: (~ previewImages.length * 500 ~)px\" ng-style=\"indexOffset\">\n" +
    "      <li class=\"cover-selector__image-container cover-selector__image-container-(~ $index ~)\"\n" +
    "        ng-class=\"{ 'video-preview__available-image-container--active' : previewIndex === $index }\"\n" +
    "        ng-repeat=\"preview in previewImages\">\n" +
    "        <img class=\"cover-selector__image\"\n" +
    "          ng-class=\"{ 'cover-selector__image--active' : previewIndex === $index }\"\n" +
    "          ng-src=\"(~ preview.url ~)\"\n" +
    "          ng-click=\"updateIndex($index)\" />\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </section>\n" +
    "\n" +
    "  <section class=\"btn-center btn-group\" style=\"margin-bottom: 24px;\" ng-if=\"showSelector\">\n" +
    "    <a class=\"btn btn--small no-selection\" ng-click=\"decrementIndex()\">&lt;</a>\n" +
    "    <span class=\"btn btn--small\">(~ previewIndex + 1 ~)/(~ previewImages.length ~)</span>\n" +
    "    <span class=\"btn btn--small\">\n" +
    "      <a ng-click=\"setBackground()\">Select</a>\n" +
    "    </span>\n" +
    "    <a class=\"btn btn--small no-selection\" ng-click=\"incrementIndex()\">&gt;</a>\n" +
    "  </section>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('video/config/extended-controls.tmpl.html',
    "<div class=\"extended-controls\">\n" +
    "\n" +
    "  <label>\n" +
    "    Show buy button\n" +
    "    <input type=\"checkbox\" ng-model=\"playerParameters.showBuyButton\" ng-change=\"updateShowBuyButton()\" />\n" +
    "  <label>\n" +
    "  <label>\n" +
    "    Show description button\n" +
    "    <input type=\"checkbox\"  ng-model=\"playerParameters.showDescriptionButton\" ng-change=\"updateShowDescriptionButton()\" />\n" +
    "  <label>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('video/config/modal.tmpl.html',
    "<div class=\"video-modal video-modal__overlay\">\n" +
    "\n" +
    "  <div class=\"video-modal__window\">\n" +
    "\n" +
    "    <div class=\"video-modal__header modal__title  split\">\n" +
    "      <span class=\"split__title  t--block  w--600\">Configure Video</span>\n" +
    "      <a class=\"modal__link\" ng-click=\"close($event)\"><i class=\"icon icon--medium icon--circle-cross\"></i></a>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"video-modal__container modal__content modal__content--video\">\n" +
    "\n" +
    "      <section class=\"video-edit__options\" ng-if=\"!selection\">\n" +
    "        <a class=\"btn btn--positive\" ng-click=\"showSection('cover')\">update cover</a>\n" +
    "        <a class=\"btn btn--positive\" ng-click=\"showSection('player')\">edit player</a>\n" +
    "        <a class=\"btn btn--positive\" ng-click=\"showSection('controls')\">extended controls</a>\n" +
    "      </section>\n" +
    "\n" +
    "      <cover-selector ng-if=\"selection === 'cover'\" video=\"video\"></cover-selector>\n" +
    "      <player-editor ng-if=\"selection === 'player'\" player-parameters=\"playerParameters\" video=\"video\"></player-editor>\n" +
    "      <extended-controls ng-if=\"selection === 'controls'\" player-parameters=\"playerParameters\"></extended-controls>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"video-modal__footer modal__footer\">\n" +
    "      <div class=\"modal__actions\">\n" +
    "        <a class=\"btn btn--small btn--positive\" ng-if=\"selection\" ng-click=\"showSection()\">back</a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</div>\n"
  );


  $templateCache.put('video/config/player-editor.tmpl.html',
    "<div class=\"player-editor\">\n" +
    "\n" +
    "  <input color-picker rgb=\"rgb\" />\n" +
    "\n" +
    "  <label>\n" +
    "    Hide logo\n" +
    "    <input type=\"checkbox\" ng-model=\"playerParameters.hideLogo\" ng-change=\"toggleHideLogo()\" />\n" +
    "  </label>\n" +
    "\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('directives/global-navigation.tmpl.html',
    "<div class=\"global-nav-wrapper\">\n" +
    "  <nav id=\"global-nav\" class=\"global-nav\" role=\"navigation\">\n" +
    "    <div class=\"wrapper\">\n" +
    "      <div class=\"avatar  avatar--large  global-nav__avatar\">\n" +
    "        <img src=\"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\" alt=\"(~ account.display_name ~)\" class=\"avatar__img\" ng-style=\"profileStyle\">\n" +
    "      </div>\n" +
    "      <ul class=\"list-inline  t--center  global-nav-core-actions\">\n" +
    "        <li class=\"global-nav-core-actions__item\" ng-if=\"account\"><a href=\"#/profile\" class=\"global-nav-core-actions__link  btn  btn--blob  btn--light  simptip-position-bottom  simptip-smooth  simptip-movable\" title=\"View your profile page.\" data-tooltip=\"View your profile page.\"><i class=\"icon  icon--head\"></i></a></li><!--\n" +
    "     --><li class=\"global-nav-core-actions__item\"><a href=\"#/settings\" class=\"global-nav-core-actions__link  btn  btn--blob  btn--light  simptip-position-bottom  simptip-smooth  simptip-movable\" title=\"View and edit your settings.\" data-tooltip=\"View and edit your settings.\"><i class=\"icon  icon--cog\"></i></a></li><!--\n" +
    "     --><li class=\"global-nav-core-actions__item\"><a ng-click=\"logout()\" class=\"global-nav-core-actions__link  btn  btn--blob  btn--light  simptip-position-bottom  simptip-smooth  simptip-movable\" title=\"Sign out from Wonder Place.\" data-tooltip=\"Sign out from Wonder Place.\"><i class=\"icon  icon--exit\"></i></a></li>\n" +
    "      </ul>\n" +
    "      <ul class=\"list-ui  global-nav-menu\">\n" +
    "        <li class=\"global-nav-menu__item\"><a href=\"#/search\" class=\"global-nav-menu__link  icon-text\"><i class=\"icon  icon--search  icon-text__icon\"></i>Search</a></li>\n" +
    "        <li class=\"global-nav-menu__item\"><a href=\"#/video\" class=\"global-nav-menu__link  icon-text\"><i class=\"icon  icon--folder  icon-text__icon\"></i>(~isUploading ? 'Uploads in Progress' : 'Upload a Video'~)</a></li>\n" +
    "        <li class=\"global-nav-menu__item\"><a href=\"#/\" title=\"Manage and organize your video library.\" class=\"global-nav-menu__link  icon-text\"><i class=\"icon  icon--layout  icon-text__icon\"></i>Organize</a></li>\n" +
    "        <li class=\"global-nav-menu__item\"><a href=\"#/\" class=\"global-nav-menu__link  icon-text\"><i class=\"icon  icon--pie-graph icon-text__icon\"></i>Stats</a></li>\n" +
    "      </ul>\n" +
    "      <ul class=\"list-ui  global-nav-menu\">\n" +
    "        <li class=\"global-nav-menu__item\"><a href=\"#/faq\" class=\"global-nav-menu__link\">FAQs</a></li>\n" +
    "        <!-- li class=\"global-nav-menu__item\"><a href=\"#/login/upgrade\" title=\"Get access to premium features by upgrading your account.\" class=\"global-nav-menu__link\">Upgrade account</a></li -->\n" +
    "        <li class=\"global-nav-menu__item\"><a href=\"mailto:support@wonderpl.com\" title=\"We're here to help.\" class=\"global-nav-menu__link\">Support</a></li>\n" +
    "        <li class=\"global-nav-menu__item\"><a href=\"#/tands\" title=\"The Wonder Place Terms of Service.\" class=\"global-nav-menu__link\">Terms of service</a></li>\n" +
    "        <li class=\"global-nav-menu__item\"><a href=\"#/privacy-policy\" title=\"The Wonder Place Privary Policy.\" class=\"global-nav-menu__link\">Privacy policy</a></li>\n" +
    "        <li class=\"global-nav-menu__item\"><a href=\"#/about\" title=\"Who are we, and why are we here?\" class=\"global-nav-menu__link\">About</a></li>\n" +
    "      </ul>\n" +
    "      <p class=\"global-nav-menu__text\">&copy; Copyright 2014</p>\n" +
    "    </div>\n" +
    "  </nav>\n" +
    "</div>"
  );


  $templateCache.put('directives/location-selector.tmpl.html',
    " <div class=\"location-selector icon-text\">\n" +
    "  <label class=\"label location-selector__label  accessibility\" for=\"location-selector__location\">Location</label>\n" +
    "  <select class=\"location-selector\" ui-select2=\"select2Options\" ng-model=\"location\">\n" +
    "    <option value=\"\" ng-if=\"allowEmpty\">All countries</option>\n" +
    "    <option value=\"GB\">United Kingdom</option>\n" +
    "    <option value=\"US\">United States</option>\n" +
    "    <option ng-repeat=\"location in locations | orderBy:'name'\" value=\"(~ location.code ~)\">(~ location.name ~)</option>\n" +
    "  </select>\n" +
    "</div>;"
  );
} ]);