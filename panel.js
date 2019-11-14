// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*
// document.location = "http://stackoverflow.com/"

function log(message) {
    document.querySelector('#output').innerHTML += `${message}\n`;
}

// let chosenFileEntry = null;
//
// chooseFileButton.addEventListener('click', function(e) {
//     chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {
//         readOnlyEntry.file(function(file) {
//             let reader = new FileReader();
//
//             reader.onerror = errorHandler;
//             reader.onloadend = function(e) {
//                 log(e.target.result);
//             };
//             reader.readAsText(file);
//         });
//     });
// });
//
//
// function writeToFile(){
//     chrome.fileSystem.getWritableEntry(chosenFileEntry, function(writableFileEntry) {
//         writableFileEntry.createWriter(function(writer) {
//             writer.onerror = errorHandler;
//             writer.onwriteend = callback;
//
//             chosenFileEntry.file(function(file) {
//                 writer.write(file);
//             });
//         }, errorHandler);
//     });
// }

let sites = {1: "http://stackoverflow.com/"};
let smallestObjects = {};
let siteID = 0;
let siteURL = "";

function setSmallest(url, size) {
    if (size !== 0) {
        smallestObjects[siteID] = {
            url: url,
            size: size,
        };
        log(`***New smallest size!`)
    }
}

function processObject(request) {
    let newSize = request.response.content.size;
    let url = request.request.url;
    log(`Request: ${url} Size: ${newSize}`);
    if ((smallestObjects.hasOwnProperty(siteID) && newSize < smallestObjects[siteID].size)
        || !smallestObjects.hasOwnProperty(siteID))
        setSmallest(url, newSize)
}

document.querySelector('#executescript').addEventListener('click', function () {
    chrome.devtools.network.onRequestFinished.addListener(request => processObject(request));

    for (let key in sites) {
        siteID = key;
        siteURL = sites[key];
        log(`Scraping ${siteURL}`);
        chrome.tabs.query({currentWindow: true, active: true}, tab =>
            chrome.tabs.update(tab.id, {url: siteURL}));
    }

    for (let key in smallestObjects) {
        log(`${key}: ${sites[key]} - ${smallestObjects[key].size} - ${smallestObjects[key].url}`)
    }


    // chrome.tabs.create({url: newURL},
    //     function (newTab) {
    //         // chrome.tabs.connect(newTab.id);
    //     });


    // harLog.getAll()
    // for(let entry in harLog.entries)
    //     log(`Entry: ${entry.toString()}\n`;

}, false);

// document.querySelector('#insertscript').addEventListener('click', function () {
//     // sendObjectToInspectedPage({action: "script", content: "inserted-script.js"});
// }, false);

// document.querySelector('#insertmessagebutton').addEventListener('click', function () {
//     sendObjectToInspectedPage({
//         action: "code",
//         content: "document.body.innerHTML='<button>Send message to DevTools</button>'"
//     });
//     sendObjectToInspectedPage({action: "script", content: "messageback-script.js"});
// }, false);
