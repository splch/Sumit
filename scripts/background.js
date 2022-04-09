let apiKey, cl, urls

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

function hideDiv(id) {
    setTimeout(() => {
        let link = document.getElementsByTagName("a")[id];
        let div = document.getElementsByClassName("Sumit_" + String(id))[0];
        if (link.parentElement.querySelector(":hover") !== link && document.body.querySelector(":hover") !== div) {
            // on mouseout, clear all summary boxes
            clearDivs();
        }
    }, 999);
}

function move(id) {
    let div = document.getElementsByClassName("Sumit_" + String(id))[0];
    let coords = document.getElementsByTagName("a")[id].getBoundingClientRect();
    let maxcoords = document.body.getBoundingClientRect();
    let divdims = div.getBoundingClientRect();
    if (maxcoords.right - coords.right >= coords.left) {
        // div right of link
        div.style.left = String(window.scrollX + coords.right) + "px";
    } else {
        // div left of link
        div.style.left = String(window.scrollX + coords.right - divdims.width - coords.width) + "px";
    }
    if (maxcoords.bottom - coords.bottom >= coords.top) {
        // div under link
        div.style.top = String(window.scrollY + coords.bottom) + "px";
    } else {
        // div above link
        div.style.top = String(window.scrollY + coords.bottom - divdims.height - coords.height) + "px";
    }
}

function createDivs(url, summary, id) {
    clearDivs();
    let div = document.createElement("div");
    // set div style
    div.style = "position: absolute !important; width: 275px; max-height: 150px; margin: 5px; padding: 10px; background-color: rgba(255, 255, 255, 1) !important; box-shadow: 0px 0px 10px grey; font: italic 10pt Times !important; color: black !important; overflow: auto; zIndex: 2147483647 !important; visibility: visible;";
    div.className = "Sumit_" + String(id);
    div.onmouseout = function () {
        hideDiv(id);
    }
    if (summary) {
        // display summary in div
        div.innerText = summary.replace(/(\r\n|\n|\r)/gm, "");
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
                // use https://github.com/splch/js-summarize as fallback
                let JsSummary = summarizer.summarize(title, body);
                summary = JsSummary.join(" ");
                div.innerText = summary;
            }
        };
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader("Content-type", "text/html");
        xhttp.send();
    }
    document.body.appendChild(div);
    move(id);
}

function xmlRequest(url, id) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            let summary;
            if (this.status == 200) {
                let rsp = JSON.parse(this.responseText);
                summary = rsp.sm_api_content;
                cl = rsp.sm_api_limitation;
            }
            createDivs(url, summary, id);
        }
    };
    // get request to aylien sandbox
    xhttp.open("GET", "https://api.smmry.com/?" +
        "SM_API_KEY=" + apiKey +
        "&SM_URL=" + encodeURIComponent(url), true);
    xhttp.send();
}

function summarize(url, id) {
    // if the summary has already been loaded, make that div visible
    if (document.getElementsByClassName("Sumit_" + String(id))[0]) {
        move(id);
        document.getElementsByClassName("Sumit_" + String(id))[0].style.visibility = "visible";
    } else {
        xmlRequest(url, id);
    }
}

function addFunction() {
    for (let i = 0; i < document.getElementsByTagName("a").length; i++) {
        let tag = document.getElementsByTagName("a")[i];
        if (tag.href) {
            tag.onmouseenter = function () {
                // on hover, send url to summarization function
                setTimeout(() => {
                    if (this.parentElement.querySelector(":hover") === this) {
                        summarize(this.href, i);
                    }
                }, 1000); // wait before calling summary function
            };
            tag.onmouseout = function () {
                hideDiv(i);
            };
        }
    }
}

function initialize() {
    // get popup values from chrome storage
    chrome.storage.sync.get(["key"], function (result) {
        if (result.key) {
            apiKey = result.key;
        }
    });
    chrome.storage.sync.get(["cl"], function (result) {
        cl = result.cl;
    });
    chrome.storage.sync.get(["allowlist"], function (result) {
        urls = result.allowlist;
    });
    // timeout to allow time for chrome to sync url values
    let documentURL = new URL(window.location.href);
    setTimeout(function () {
        if (!urls) {
            urls = "";
        }
        if (urls && urls.includes(documentURL.hostname) || urls === "*") {
            addFunction();
        }
    }, 5);
}

initialize();
