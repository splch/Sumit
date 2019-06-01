console.time("Sumit initialization"); // measure lag (1, 92)

let apiID = apiKey = urls = '';

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

function createDivs(url, summary, id) {
    clearDivs();
    let div = '';
    if (summary) {
        div = document.createElement("div");
        // display summary in div
        div.innerHTML = summary;
        // chrome.storage.sync.set({"cl": response.status.remaining_credits});
    }
    else {
        // display iframe in div
        div = document.createElement("iframe");
        div.src = url;
    }
    div.className = "sumit_" + String(id);
    // set div styles
    div.style = "position: absolute !important; width: 300px; max-height: 250px; margin: 5px; padding: 10px; background-color: rgba(255, 255, 255, 1) !important; box-shadow: 0px 0px 10px grey; font: italic 10pt Times !important; overflow: auto; zIndex: 10000000 !important; visibility: visible;";
    document.getElementsByTagName('a')[id].parentElement.appendChild(div);
}

function summarize(url, id) {
    let summary;
    // if the summary has already been loaded, make that div visible
    if (document.getElementsByClassName("sumit_" + String(id))[0]) {
        document.getElementsByClassName("sumit_" + String(id))[0].style.visibility = "visible";
    }
    else {
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.aylien.com/api/v1/summarize",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "X-AYLIEN-TextAPI-Application-Key": apiKey,
                "X-AYLIEN-TextAPI-Application-ID": apiID,
            },
            "data": {
                "url": url,
            }
        };
        $.ajax(settings).done(function (result) {
            // use summary
            summary = result.sentences.slice(0, 3).join(' ')
        });
        createDivs(url, summary, id);
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
            }, 1400); // wait about 2 seconds before calling summary function
        };
        tag.onmouseout = function() {
            let notHover = setInterval(function() {
                if (tag.parentElement.querySelector(":hover") != document.getElementsByClassName("sumit_" + String(i))[0]) {
                    // on mouseout, clear all summary boxes
                    clearDivs();
                    clearInterval(notHover);
                }
            }, 1300); // wait less time than summary before clearing
        };
    }
    console.timeEnd("Sumit initialization");
}

function initialize() {
    chrome.storage.sync.get(["id"], function(result) {
        apiID = result.id;
    });
    chrome.storage.sync.get(["key"], function(result) {
        apiKey = result.key;
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
        if (urls.includes(documentURL.hostname) === false && documentURL.hostname != '') {
            addFunction();
        }
    }, 10);
}

initialize();