const domains = [
    {name: "Youtube", domain: "www.youtube.com/favicon.ico", rank: 2},
    {name: "Google", domain: "www.google.com/favicon.ico", rank: 1},
    {name: "Amazon", domain: "www.amazon.com/favicon.ico", rank: 3},
    {name: "Yahoo", domain: "www.yahoo.com/favicon.ico", rank: 4},
    {name: "Facebook", domain: "www.facebook.com/favicon.ico", rank: 5},
    {name: "Reddit", domain: "www.reddit.com/favicon.ico", rank: 6},
    {name: "Wikipedia", domain: "www.wikipedia.org/favicon.ico", rank: 7},
    {name: "Ebay", domain: "www.ebay.com/favicon.ico", rank: 8},
    {name: "Office", domain: "www.office.com", rank: 9},
    {name: "Bing", domain: "www.bing.com/favicon.ico", rank: 10},
    {name: "Netflix", domain: "www.netflix.com/favicon.ico", rank: 11},
    {name: "ESPN", domain: "www.espn.com/favicon.ico", rank: 12},
    {name: "Salesforce", domain: "www.salesforce.com", rank: 13}, /* Salesforce */
    {name: "Live", domain: "outlook.live.com/mail/favicon.ico", rank: 14},
    {name: "Instructure", domain: "www.instructure.com/themes/instructure_blog/images/favicon.ico", rank: 15},
    {name: "Chase", domain: "www.chase.com/favicon.ico", rank: 16},
    {name: "Apple", domain: "www.apple.com/favicon.ico", rank: 17},
    {name: "Instagram", domain: "www.instagram.com/favicon.ico", rank: 18},
    {name: "CNN", domain: "www.cnn.com/favicon.ico", rank: 20},
    {name: "Dropbox", domain: "www.dropbox.com", rank: 21},
    {name: "Tmall", domain: "www.tmall.com/favicon.ico", rank: 22},
    {name: "LinkedIn", domain: "www.linkedin.com/favicon.ico", rank: 23},
    {name: "Twitter", domain: "twitter.com/favicon.ico", rank: 24},
    {name: "Twitch", domain: "www.twitch.tv", rank: 25},
    {name: "Microsoft", domain: "www.microsoft.com/favicon.ico", rank: 27},
    {name: "Shopify", domain: "www.shopify.com", rank: 28},
    {name: "NYTimes", domain: "www.nytimes.com/favicon.ico", rank: 29},
    {name: "Walmart", domain: "www.walmart.com/favicon.ico", rank: 31},
    {name: "Pornhub", domain: "www.pornhub.com/favicon.ico", rank: 32},
    {name: "Adobe", domain: "www.adobe.com/favicon.ico", rank: 33},
    {name: "IMDb", domain: "www.imdb.com/favicon.ico", rank: 35},
    {name: "Stackoverflow", domain: "stackoverflow.com", rank: 36},
    {name: "AWS", domain: "aws.amazon.com", rank: 37},
    {name: "Sohu", domain: "sohu.com", rank: 38}, // Sohu.com
    {name: "QQ", domain: "www.qq.com/favicon.ico", rank: 39},
    {name: "Indeed", domain: "www.indeed.com/images/favicon.ico", rank: 40},
    {name: "Zillow", domain: "www.zillow.com/favicon.ico", rank: 41},
    {name: "Wellsfargo", domain: "www.wellsfargo.com/favicon.ico", rank: 42},
    {name: "Spotify", domain: "www.spotify.com/favicon.ico", rank: 43},
    {name: "MSN", domain: "www.msn.com/favicon.ico", rank: 44},
    {name: "Imgur", domain: "imgur.com/favicon.ico", rank: 45},
    {name: "Yelp", domain: "www.yelp.com/favicon.ico", rank: 47},
    {name: "Taobao", domain: "world.taobao.com", rank: 48},
    {name: "Etsy", domain: "www.etsy.com/favicon.ico", rank: 49},
    {name: "Hulu", domain: "www.hulu.com/favicon.ico", rank: 50}
];


function log(message, end = '\n') {
    // if(end === null) end = '\n';
    document.querySelector('#output').innerHTML += `${message}${end}`;
}


function reset() {
    document.querySelector('#output').innerHTML = ``;
    siteIndex = 0;
}

let sites = [];
let smallestObjects = {};
let siteIndex = 0;
let siteURL = "";

function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

function isImage(str){
    return str.endsWith('.jpg')
        || str.endsWith('.jpeg')
        || str.endsWith('.svg')
        || str.endsWith('.png')
        || str.endsWith('.ico')
        || str.endsWith('.gif');
}

function getDomain(url) {
    let str = url;
    str = str.replace('https://', '');
    str = str.replace('http://', '');
    str = str.split('/')[0];
    return str
}

function setSmallest(domain, url, size) {
    if (size !== 0 && validURL(url))
        smallestObjects[domain] = {
            url: url,
            size: size,
        };
}

function getHeader(headers, name) {
    // log(`Looking for header ${name}:`);
    let value = "";
    headers.forEach(function (header) {
        // if(value === "") log(`${header.name}`, '...');
        if (header.name.toLowerCase() === name.toLowerCase()) {
            // if(value === "") log('YES: ' + value);
            value = header.value;
        }
        // else if(value === "") log('NO')
    });
    // if(value === "") log(JSON.stringify(headers));
    return value;
}

let debug = false;

function processObject(request) {
    let size = request.response.content.size;
    let url = request.request.url;
    let reqHeaders = request.request.headers;
    let respHeaders = request.response.headers;
    let domain = getDomain(getHeader(reqHeaders, 'referer'));
    if (domain === '') domain = getDomain(getHeader(reqHeaders, 'authority'));
    if (domain === '') domain = getDomain(getHeader(reqHeaders, 'origin'));
    if (domain === '' && debug) log(JSON.stringify(reqHeaders));
    let exists = smallestObjects.hasOwnProperty(domain);
    let type = getHeader(respHeaders, 'content-type');
    // if (type === '' && debug) log(JSON.stringify(headers));
    if (sites.includes(domain)) {
        if (debug) log(domain + ': ' + url.substring(0, 50));
        if (validURL(url) && type.includes('image')) {
            if ((exists && size < smallestObjects[domain].size) || !exists) {
                setSmallest(domain, url, size)
                // log(`${type}: ${url}`);
            }
        }
    } else if (debug) log(`BAD DOMAIN: ` + domain)
}


function LoadSite(tabID) {
    if (siteIndex < sites.length) {
        siteURL = sites[siteIndex];
        log(`Scraping ${siteIndex + 1}/${sites.length}: ${siteURL}`);
        chrome.tabs.update(tabID, {url: 'https://' + siteURL});
    }
}

function report() {
    log(`Smallest Objects: `);
    for (let domain in smallestObjects)
        log(`${domain},${smallestObjects[domain].size},${smallestObjects[domain].url}`)
    // if (!smallestObjects.hasOwnProperty(sites[siteIndex])) log("***Warning! No object for " + sites[siteIndex]);


}

document.querySelector('#report').addEventListener('click', () => report(), false);

document.querySelector('#executescript').addEventListener('click', () => {
    domains.forEach(function (site) {
        sites.push(getDomain(site.domain));
    });

    chrome.tabs.query({currentWindow: true, active: true}, tab => {
        let tabID = tab[0].id;

        chrome.devtools.network.onRequestFinished.addListener(request => processObject(request));
        chrome.tabs.onUpdated.addListener(function (loadedTabID, info) {
            if (info.status === 'complete') {
                siteIndex++;
                LoadSite(tabID);
            }
        });
        reset();
        LoadSite();
    })
}, false);
