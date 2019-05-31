document.getElementById("key").onchange = function() {
    chrome.storage.sync.set({"key": this.value});
};

document.getElementById("whitelist").onchange = function() {
    chrome.storage.sync.set({"whitelist": this.value});
};

document.getElementsByTagName("a")[0].onclick = function() {
    chrome.tabs.create({url: this.href});
}

chrome.storage.sync.get(["key"], function(result) {
    if (result.key) {
        document.getElementById("key").value = result.key;
    }
});

chrome.storage.sync.get(["cl"], function(result) {
    if (result.cl) {
        document.getElementById("sl").innerHTML = "Searches left &#8776; " + String(Math.round(parseInt(result.cl)/3));
    }
});

chrome.storage.sync.get(["whitelist"], function(result) {
    if (result.whitelist) {
        document.getElementById("whitelist").value = result.whitelist;
    }
});