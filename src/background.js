// async function getCurrentTab() {
//     let queryOptions = { active: true, currentWindow: true };
//     let [tab] = await chrome.tabs.query(queryOptions);
//     return tab;
// }
chrome.action.onClicked.addListener((tab) => {
    //TODO toggle dark mode in the tab
});
