console.time("Sumit initialization"); // measure lag Ln {1, 101}

let apiID; apiKey; cl; urls;

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

function createDivs(url, summary, id) {
    clearDivs();
    let div;
    if (summary) {
        div = document.createElement("div");
        // display summary in div
        div.innerHTML = summary;
    }
    else {
        div = document.createElement("iframe");
        // load url in iframe
        div.src = url;
    }
    div.className = "Sumit_" + String(id);
    // set div style
    div.style = "position: absolute !important; width: 275px; max-height: 150px; margin: 5px; padding: 10px; background-color: rgba(255, 255, 255, 1) !important; box-shadow: 0px 0px 10px grey; font: italic 10pt Times !important; color: black !important; overflow: auto; zIndex: 10000000 !important; visibility: visible;";
    document.getElementsByTagName("a")[id].parentElement.appendChild(div);
}

function summarize(url, id) {
    let i = 0;
    let summary;
    // if the summary has already been loaded, make that div visible
    if (document.getElementsByClassName("Sumit_" + String(id))[0]) {
        document.getElementsByClassName("Sumit_" + String(id))[0].style.visibility = "visible";
    }
    // load iframe when credits are low
    // else if (cl < 10) {
    //     createDivs(url, summary, id);
    // }
    else {
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
            if (err === "success" && i === 0) {
                summary = result.sentences.join(" ");
                chrome.storage.sync.set({ "cl": limit.getResponseHeader("X-RateLimit-Remaining") });
            }
            createDivs(url, summary, id);
            i++; // i prevents two requests from occuring
        });
    }
}

function addFunction() {
    for (let i = 0; i < document.getElementsByTagName("a").length; i++) {
        let tag = document.getElementsByTagName("a")[i];
        tag.onmouseenter = function () {
            // on hover, send url to summarization function
            setTimeout(function () {
                if (tag.parentElement.querySelector(":hover") === tag) {
                    if (tag.href) {
                        summarize(tag.href, i);
                    }
                }
            }, 1500); // wait about 2 seconds before calling summary function
        }
        tag.onmouseout = function () {
            let notHover = setInterval(function () {
                if (tag.parentElement.querySelector(":hover") !== document.getElementsByClassName("Sumit_" + String(i))[0]) {
                    // on mouseout, clear all summary boxes
                    clearDivs();
                    clearInterval(notHover);
                }
            }, 1400); // wait less time than summary before clearing
        }
    }
    console.timeEnd("Sumit initialization");
}

function initialize() {
    // get popup values from chrome storage
    chrome.storage.sync.get(["id"], function (result) {
        apiID = result.id;
    });
    chrome.storage.sync.get(["key"], function (result) {
        apiKey = result.key;
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
        if (!urls) { urls = ""; };
        if (urls && urls.includes(documentURL.hostname) || urls === "*") { addFunction(); }
        else { console.timeEnd("Sumit initialization"); };
    }, 10);
}

initialize();
