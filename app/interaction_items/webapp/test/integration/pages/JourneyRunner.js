sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"interactionitems/test/integration/pages/Interactions_HeaderList",
	"interactionitems/test/integration/pages/Interactions_HeaderObjectPage",
	"interactionitems/test/integration/pages/Interactions_ItemsObjectPage"
], function (JourneyRunner, Interactions_HeaderList, Interactions_HeaderObjectPage, Interactions_ItemsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('interactionitems') + '/test/flp.html#app-preview',
        pages: {
			onTheInteractions_HeaderList: Interactions_HeaderList,
			onTheInteractions_HeaderObjectPage: Interactions_HeaderObjectPage,
			onTheInteractions_ItemsObjectPage: Interactions_ItemsObjectPage
        },
        async: true
    });

    return runner;
});

