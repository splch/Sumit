let key;

function remove(id) {
    document.getElementsByTagName('a')[id].removeAttribute("title");
}

function load(summary, id) {
    document.getElementsByTagName('a')[id].setAttribute("title", summary);
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
        let sl = Math.round(response.status.remaining_credits/3);
        // use summary
        load(response.summary, id);
        chrome.storage.sync.set({"sl": String(sl)});
        console.log("Remaining calls: ", sl);
        if (sl == 10) {
            alert("SumUp: Your API will run out shortly.");
        }
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
            remove(i);
        }
    }
}

chrome.storage.sync.get(["key"], function(result) {
    key = result.key;
});

modsums();