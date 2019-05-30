document.getElementById("key").onchange = function() {
    chrome.storage.sync.set({"key": document.getElementById("key").value});
};

document.getElementById("whitelist").onchange = function() {
    chrome.storage.sync.set({"whitelist": document.getElementById("whitelist").value});
};

chrome.storage.sync.get(["key"], function(result) {
    if (result.key) {
        document.getElementById("key").value = result.key;
    }
});

chrome.storage.sync.get(["sl"], function(result) {
    if (result.sl) {
        document.getElementById("sl").innerHTML = "Searches left &#8776; " + String(Math.round(parseInt(result.sl)/3));
    }
});

chrome.storage.sync.get(["whitelist"], function(result) {
    if (result.whitelist) {
        document.getElementById("whitelist").value = result.whitelist;
    }
});