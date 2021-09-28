(function (window, chrome) {
    let parser = window.TabEx.parser || {};
    let config = window.TabEx.config;

    async function getCurrentTab() {
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
    };
    parser.getCurrentTab = getCurrentTab;

    async function getAllTabUrls() {
        let tabs = await chrome.tabs.query({});
        let urls = tabs.map(t => {return { url: new URL(t.url), tab: t }});
        return urls;
    };
    parser.getAllTabUrls = getAllTabUrls;


    function parseByHost(urls) {
        let hosts = [];
        urls.forEach(url => {
            if (!hosts.some(host => host.name === url.url.host)) {
                let host = {};
                host.name = url.url.host;
                if (!!url.tab.favIconUrl) {
                    host.icon = url.tab.favIconUrl;
                } else {
                    host.icon = '../icons/tabex16x16.png';
                }
                host.children = urls.filter(curl => curl.url.host === host.name);
                hosts.push(host);
            }
        });
        return hosts.sort((a,b) => {
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });
    };
    parser.parseByHost = parseByHost;

    window.TabEx.parser = parser;
})(window, chrome);
