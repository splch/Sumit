let key, urls;

function remove() {
    // remove all divs
    for (let i = 0; i < document.getElementsByTagName('a').length; i++) {
        for (let j = 0; j < document.getElementsByClassName("SumUp_"+String(i)).length; j++) {
            document.getElementsByClassName("SumUp_"+String(i))[j].parentNode.removeChild(document.getElementsByClassName("SumUp_"+String(i))[j]);
        }
    }
}

function load(response, id) {
    remove();
    let div = document.createElement("div");
    div.className = "SumUp_" + String(id);
    // display summary in div
    div.innerHTML = response.summary;
    // display remaining credits
    let sl = response.status.remaining_credits;
    console.log("Remaing calls: ", Math.round(sl/3));
    // chrome.storage.sync.set({"sl": String(sl)});
    if (sl == 10) {
        console.log("SumUp: Your API will stop shortly.");
    }

    document.getElementsByTagName('a')[id].parentElement.appendChild(div);
    // set div styles
    for (let i = 0; i < document.getElementsByClassName("SumUp_" + String(id)).length; i++) {
        document.getElementsByClassName("SumUp_" + String(id))[i].style = "position: absolute; width: 300px; height: 150px; margin: 5px; background-color: rgba(255, 255, 255, 1); box-shadow: 0px 0px 10px grey; font-style: italic; font-size: 10pt; overflow: auto;";
    }
}

function sumup(url, id) {
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
        load(response, id);
    });
}

function modsums() {
    for (let i = 0; i < document.getElementsByTagName('a').length; i++) {
        let tag = document.getElementsByTagName('a')[i];
        tag.onmouseenter = function() {
            // on hover, send url to sumup function
            sumup(tag.href, i);
        };
        tag.onmouseout = function() {
            // on mouseout, remove all summary boxes
            remove();
        }
    }
}

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