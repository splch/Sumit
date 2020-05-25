document.getElementById("id").onchange = function () {
    chrome.storage.sync.set({ "id": this.value });
}

document.getElementById("key").onchange = function () {
    chrome.storage.sync.set({ "key": this.value });
}

document.getElementById("whitelist").onchange = function () {
    chrome.storage.sync.set({ "whitelist": this.value });
}

chrome.storage.sync.get(["id"], function (result) {
    if (result.id) {
        document.getElementById("id").value = result.id;
    }
});

chrome.storage.sync.get(["key"], function (result) {
    if (result.key) {
        document.getElementById("key").value = result.key;
    }
});

chrome.storage.sync.get(["whitelist"], function (result) {
    if (result.whitelist) {
        document.getElementById("whitelist").value = result.whitelist;
    }
});

chrome.storage.sync.get(["cl"], function (result) {
    if (result.cl) {
        document.getElementById("sl").innerHTML = "Credits left: " + result.cl;
    }
});