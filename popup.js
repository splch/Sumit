document.getElementById("key").onchange = function() {
    chrome.storage.sync.set({"key": document.getElementById("key").value});
};

document.getElementById("whitelist").onchange = function() {
    chrome.storage.sync.set({"urls": document.getElementById("whitelist").value});
};

chrome.storage.sync.get(["sl"], function(result) {
    document.getElementById("sl").innerHTML = result.key;
});

chrome.storage.sync.get(["key"], function(result) {
    document.getElementById("key").value = result.key;
});