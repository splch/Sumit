let key;

function load(summary, id) {
    document.getElementsByTagName('a')[id].title = summary;
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
        load(response.summary, id);
        console.log("Remaining calls: ", Math.round(response.status.remaining_credits/3));
    });
}

function modsums() {
    for (let i = 0; i < document.getElementsByTagName('a').length; i++) {
        let tag = document.getElementsByTagName('a')[i];
        tag.onmouseover = function() {
            // on hover, send url to sumup function
            sumup(tag.href, i);
        };
    }
}

chrome.storage.sync.get(["key"], function(result) {
    key = result.key;
});

modsums();