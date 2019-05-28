function hide() {
    // hide all divs
    for (let i = 0; i < document.getElementsByTagName('a').length; i++) {
        for (let j = 0; j < document.getElementsByClassName("summar_"+String(i)).length; j++) {
            document.getElementsByClassName("summar_"+String(i))[j].style.visibility = "hidden";
        }
    }
}

function load(url, response, id) {
    hide();
    let sl = response.status.remaining_credits;
    let div = document.createElement("div");
    div.className = "summar_" + String(id);
    if (response.summary != undefined && sl >= 10) {
        // display summary in div
        div.innerHTML = response.summary;
        // display remaining credits
        console.log("Remaing calls: ", Math.round(sl/3));
        // chrome.storage.sync.set({"sl": String(sl)});
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
    for (let i = 0; i < document.getElementsByClassName("summar_" + String(id)).length; i++) {
        document.getElementsByClassName("summar_" + String(id))[i].style = "position: absolute; width: 300px; height: 150px; margin: 5px; background-color: rgba(255, 255, 255, 1); box-shadow: 0px 0px 10px grey; font-style: italic; font-size: 10pt; overflow: auto; zIndex: 2147483647; visibility: visible;";
    }
}

function summar(url, id) {
    if (document.getElementsByClassName("summar_" + String(id))[0]) {
        for (let i = 0; i < document.getElementsByClassName("summar_" + String(id)).length; i++) {
            document.getElementsByClassName("summar_" + String(id))[i].style.visibility = "visible";
        }
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
        }
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
            }, 2000);
        };
        tag.onmouseout = function() {
            // on mouseout, hide all summary boxes
            hide();
        }
    }
}

let key, urls;

chrome.storage.sync.get(["key"], function(result) {
    key = result.key;
});

chrome.storage.sync.get(["urls"], function(result) {
    urls = result.key;
});


if (urls == undefined) {
    urls = "www.google.com, www.bing.com, www.yahoo.com, www.wikipedia.com";
}
if (urls.includes(document.URL.split(".")[1]) === false) {
    modsums();
}