document.getElementById("key").onchange = function () {
    chrome.storage.sync.set({ "key": this.value });
}

document.getElementById("allowlist").onchange = function () {
    chrome.storage.sync.set({ "allowlist": this.value });
}

chrome.storage.sync.get(["key"], function (result) {
    if (result.key) {
        document.getElementById("key").value = result.key;
    }
});

chrome.storage.sync.get(["allowlist"], function (result) {
    if (result.allowlist) {
        document.getElementById("allowlist").value = result.allowlist;
    }
});

chrome.storage.sync.get(["cl"], function (result) {
    if (result.cl) {
        document.getElementById("sl").innerHTML = "Credits left: " + result.cl;
    }
});