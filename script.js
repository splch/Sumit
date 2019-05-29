function clear() {
    // clear all divs
    for (let i = 0; i < document.getElementsByTagName('a').length; i++) {
        for (let j = 1; j < document.getElementsByClassName("summar_"+String(i)).length; j++) {
            document.getElementsByClassName("summar_" + String(i))[j].parentNode.removeChild(document.getElementsByClassName("summar_"+String(i))[j]);
        }
    }
    for (let i = 0; i < document.getElementsByTagName('a').length; i++) {
        if (document.getElementsByClassName("summar_" + String(i))[0]) {
            document.getElementsByClassName("summar_" + String(i))[0].style.visibility = "hidden";
        }
    }
}

function load(url, response, id) {
    clear();
    if (response.summary != undefined && response.status.remaining_credits >= 10) {
        let div = document.createElement("div");
        div.className = "summar_" + String(id);
        // display summary in div
        div.innerHTML = response.summary;
        // console.info("Remaing credits: ", response.status.remaining_credits);
        chrome.storage.sync.set({"sl": response.status.remaining_credits});
        document.getElementsByTagName('a')[id].parentElement.appendChild(div);
    }
    else {
        // display iframe in div
        let frame = document.createElement("iframe");
        frame.setAttribute("src", url);
        frame.className = "summar_" + String(id);
        document.getElementsByTagName('a')[id].parentElement.appendChild(frame);
    }
    // set div styles
    document.getElementsByClassName("summar_" + String(id))[0].style = "position: absolute; width: 300px; height: 150px; margin: 5px; padding: 10px; background-color: rgba(255, 255, 255, 1); box-shadow: 0px 0px 10px grey; font: italic 10pt Times; overflow: auto; zIndex: 2147483647; visibility: visible;";
}

function summar(url, id) {
    // if the summary has already been loaded, make that div visible
    if (document.getElementsByClassName("summar_" + String(id))[0]) {
        document.getElementsByClassName("summar_" + String(id))[0].style.visibility = "visible";
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
            load(url, response, id);
        });
    }
}

function modsums() {
    for (let i = 0; i < document.getElementsByTagName('a').length; i++) {
        let tag = document.getElementsByTagName('a')[i];
        tag.onmouseenter = function() {
            // on hover, send url to summar function
            setTimeout(function() {
                if (tag.parentElement.querySelector(":hover") == tag) {
                    summar(tag.href, i);
                }
            }, 1700); // wait about 2 seconds before calling summary function
        };
        tag.onmouseout = function() {
            let notHover = setInterval(function() {
                if (tag.parentElement.querySelector(":hover") != document.getElementsByClassName("summar_" + String(i))[0]) {
                    // on mouseout, clear all summary boxes
                    clear();
                    clearInterval(notHover);
                }
            }, 1700); // wait about 2 seconds before calling summary function
        };
    }
}

function on_load() {
    chrome.storage.sync.get(["key"], function(result) {
        key = result.key;
    });
    chrome.storage.sync.get(["whitelist"], function(result) {
        if (urls) {
            urls = result.whitelist;
        }
        else {
            urls = "";
        }
    });
    // timeout to allow time for chrome to sync url values
    setTimeout(function() {
        if (urls.includes(document.URL.split(".")[1]) === false) {
            modsums();
        }
    }, 250);
}

let key, urls;

on_load();