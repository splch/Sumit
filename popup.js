document.getElementById("key").onchange = function() {
    chrome.storage.sync.set({"key": document.getElementById("key").value});
};

chrome.storage.sync.get(["key"], function(result) {
    document.getElementById("key").value = result.key;
});