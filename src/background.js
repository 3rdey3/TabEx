// async function getCurrentTab() {
//     let queryOptions = { active: true, currentWindow: true };
//     let [tab] = await chrome.tabs.query(queryOptions);
//     return tab;
// }
chrome.action.onClicked.addListener((tab) => {
    //TODO toggle dark mode in the tab
});

function setBadgeText() {
    chrome.tabs.query({}, (dt) => {
        chrome.action.setBadgeText(
            {
                text: dt.length.toString(),
            });
    });
}

chrome.tabs.onUpdated.addListener(setBadgeText);
chrome.tabs.onCreated.addListener(setBadgeText);
chrome.tabs.onActivated.addListener(setBadgeText);
chrome.tabs.onReplaced.addListener(setBadgeText);
chrome.tabs.onRemoved.addListener(setBadgeText);
chrome.windows.onFocusChanged.addListener(setBadgeText);

