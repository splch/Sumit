console.time("Sumit initialization"); // measure lag (1, 92)

function clearDivs() {
    // clear all divs
    for (let i = 0; i < document.getElementsByTagName('a').length; i++) {
        for (let j = 1; j < document.getElementsByClassName("sumit_" + String(i)).length; j++) {
            document.getElementsByClassName("sumit_" + String(i))[j].parentNode.removeChild(document.getElementsByClassName("sumit_" + String(i))[j]);
        }
    }
    for (let i = 0; i < document.getElementsByTagName('a').length; i++) {
        if (document.getElementsByClassName("sumit_" + String(i))[0]) {
            document.getElementsByClassName("sumit_" + String(i))[0].style.visibility = "hidden";
            document.getElementsByClassName("sumit_" + String(i))[0].scrollTop = 0;
        }
    }
}

function createDivs(url, response, id) {
    clearDivs();
    let div = '';
    if (response.summary != undefined && response.summary != '' && response.status.remaining_credits >= 4) {
        div = document.createElement("div");
        // display summary in div
        div.innerHTML = response.summary;
        chrome.storage.sync.set({"cl": response.status.remaining_credits});
    }
    else {
        // display iframe in div
        div = document.createElement("iframe");
        div.src = url;
    }
    div.className = "sumit_" + String(id);
    // set div styles
    div.style = "position: absolute !important; width: 300px; height: 150px; margin: 5px; padding: 10px; background-color: rgba(255, 255, 255, 1) !important; box-shadow: 0px 0px 10px grey; font: italic 10pt Times !important; overflow: auto; zIndex: 10000000 !important; visibility: visible;";
    document.getElementsByTagName('a')[id].parentElement.appendChild(div);
}

function summarize(url, id) {
    // if the summary has already been loaded, make that div visible
    if (document.getElementsByClassName("sumit_" + String(id))[0]) {
        document.getElementsByClassName("sumit_" + String(id))[0].style.visibility = "visible";
    }
    else {
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.meaningcloud.com/summarization-1.0",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "key": key,
                "url": url,
                "sentences": "3"
            }
        };
        $.ajax(settings).done(function (response) {
            // use summary
            createDivs(url, response, id);
        });
    }
}

function addFunction() {
    for (let i = 0; i < document.getElementsByTagName('a').length; i++) {
        let tag = document.getElementsByTagName('a')[i];
        tag.onmouseenter = function() {
            // on hover, send url to summarization function
            setTimeout(function() {
                if (tag.parentElement.querySelector(":hover") === tag) {
                    if(tag.href) {
                        summarize(tag.href, i);
                    }
                }
            }, 1700); // wait about 2 seconds before calling summary function
        };
        tag.onmouseout = function() {
            let notHover = setInterval(function() {
                if (tag.parentElement.querySelector(":hover") != document.getElementsByClassName("sumit_" + String(i))[0]) {
                    // on mouseout, clear all summary boxes
                    clearDivs();
                    clearInterval(notHover);
                }
            }, 1600); // wait less time than summary before clearing
        };
    }
    for (let i = 0; i < document.querySelectorAll('*').length; i++) {
        document.querySelectorAll("*")[i].style.opacity = 1;
    }
    console.timeEnd("Sumit initialization");
}

function initialize() {
    chrome.storage.sync.get(["key"], function(result) {
        key = result.key;
    });
    chrome.storage.sync.get(["whitelist"], function(result) {
        urls = result.whitelist;
    });
    // timeout to allow time for chrome to sync url values
    let documentURL = new URL(document.URL);
    setTimeout(function() {
        if (!urls) {
            urls = '';
        }
        if (urls.includes(documentURL.hostname) === false) {
            addFunction();
        }
    }, 10);
}

let key = urls = '';

initialize();