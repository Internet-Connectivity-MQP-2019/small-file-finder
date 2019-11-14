chrome.devtools.panels.create("Scrapy Boi",
    "",
    "Panel.html",
    function (panel) {
    }
);

chrome.devtools.panels.elements.createSidebarPane("My Sidebar",
    function (sidebar) {
        // sidebar initialization code here
        sidebar.setObject({some_data: "Some data to show"});
    });
