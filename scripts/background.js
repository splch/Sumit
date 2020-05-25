let apiID, apiKey, cl, urls

function clearDivs() {
    // hide created divs
    for (let i = 0; i < document.getElementsByTagName("a").length; i++) {
        if (document.getElementsByClassName("Sumit_" + String(i))[0]) {
            document.getElementsByClassName("Sumit_" + String(i))[0].style.visibility = "hidden";
            document.getElementsByClassName("Sumit_" + String(i))[0].scrollTop = 0;
        }
    }
    // clear other divs
    for (let i = 0; i < document.getElementsByTagName("a").length; i++) {
        for (let j = 1; j < document.getElementsByClassName("Sumit_" + String(i)).length; j++) {
            document.getElementsByClassName("Sumit_" + String(i))[j].parentNode.removeChild(document.getElementsByClassName("Sumit_" + String(i))[j]);
        }
    }
}

function hideDiv(node) {
    setTimeout(() => {
        if (node.parentElement.querySelector(":hover") !== node && node.parentElement.querySelector(":hover") !== node.parentElement.lastChild) {
            // on mouseout, clear all summary boxes
            clearDivs();
        }
    }, 1400);
}

function createDivs(url, summary, id) {
    clearDivs();
    let div = document.createElement("div");
    // set div style
    div.style = "position: absolute !important; width: 275px; max-height: 150px; margin: 5px; padding: 10px; background-color: rgba(255, 255, 255, 1) !important; box-shadow: 0px 0px 10px grey; font: italic 10pt Times !important; color: black !important; overflow: auto; zIndex: 2147483647 !important; visibility: visible;";
    div.className = "Sumit_" + String(id);
    div.onmouseout = function () {
        hideDiv(this);
    }
    if (summary) {
        // display summary in div
        div.innerText = summary.replace(/(\r\n|\n|\r)/gm, "");;
    } else {
        // load text from webpage
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let parsedResponse = (new window.DOMParser()).parseFromString(xhttp.responseText, "text/html");
                let title = parsedResponse.title;
                let body = parsedResponse.getElementsByTagName("body")[0].textContent.replace(/(\r\n|\n|\r)/gm, "");
                let summarizer = new JsSummarize(
                    {
                        returnCount: 3
                    });
                // use https://github.com/spencerchurchill/js-summarize as fallback
                let JsSummary = summarizer.summarize(title, body);
                summary = JsSummary.join(" ");
                div.innerText = summary;
            }
        };
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Content-type", "text/html");
        xhttp.send();
    }
    document.getElementsByTagName("a")[id].parentElement.appendChild(div);
}

function xmlRequest(url, summary, id) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                summary = JSON.parse(this.responseText).sentences.join(" ");
            }
            createDivs(url, summary, id);
        }
    };
    // get request to aylien sandbox
    xhttp.open("GET", "https://sandbox.aylien.com/textapi/summarize?" +
        "sentences_number=" + String(3) +
        "&url=" + encodeURIComponent(url), true);
    xhttp.send();
}

function summarize(url, id) {
    let summary;
    // if the summary has already been loaded, make that div visible
    if (document.getElementsByClassName("Sumit_" + String(id))[0]) {
        document.getElementsByClassName("Sumit_" + String(id))[0].style.visibility = "visible";
    } else if (apiKey && apiID) {
        let settings = {
            "url": "https://api.aylien.com/api/v1/summarize",
            "method": "POST",
            "headers": {
                "X-AYLIEN-TextAPI-Application-Key": apiKey,
                "X-AYLIEN-TextAPI-Application-ID": apiID,
            },
            "data": {
                "url": url,
                "sentences_number": 3,
            }
        }
        $.ajax(settings).always(function (result, err, limit) {
            // create div regardless of summary
            if (err === "success") {
                summary = result.sentences.join(" ");
                chrome.storage.sync.set({ "cl": limit.getResponseHeader("X-RateLimit-Remaining") });
                createDivs(url, summary, id);
            } else if (err === "error") {
                xmlRequest(url, summary, id);
            }
        });
    } else {
        xmlRequest(url, summary, id);
    }
}

function addFunction() {
    for (let i = 0; i < document.getElementsByTagName("a").length; i++) {
        let tag = document.getElementsByTagName("a")[i];
        tag.onmouseenter = function () {
            // on hover, send url to summarization function
            setTimeout(() => {
                if (this.parentElement.querySelector(":hover") === this) {
                    if (this.href) {
                        summarize(this.href, i);
                    }
                }
            }, 1500); // wait about 2 seconds before calling summary function
        };
        tag.onmouseout = function () {
            hideDiv(this);
        };
    }
}

function initialize() {
    // get popup values from chrome storage
    chrome.storage.sync.get(["id"], function (result) {
        if (result.id) {
            apiID = result.id;
        }
    });
    chrome.storage.sync.get(["key"], function (result) {
        if (result.key) {
            apiKey = result.key;
        }
    });
    chrome.storage.sync.get(["cl"], function (result) {
        cl = result.cl;
    });
    chrome.storage.sync.get(["whitelist"], function (result) {
        urls = result.whitelist;
    });
    // timeout to allow time for chrome to sync url values
    let documentURL = new URL(document.URL);
    setTimeout(function () {
        if (!urls) {
            urls = "";
        }
        if (urls && urls.includes(documentURL.hostname) || urls === "*") {
            addFunction();
        }
    }, 10);
}

initialize();
