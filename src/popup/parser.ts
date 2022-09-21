import { TabUrl } from "../models/tab-url";
import { COUNTRY_DOMAINS } from "./constants";

class Parser {
    constructor() { }

    async getCurrentTab() {
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
    };

    async getAllTabUrls(filterByCW: boolean): Promise<TabUrl[]> {
        let queryOptions = {};
        if (filterByCW) {
            queryOptions = { currentWindow: true };
        }
        let tabs = await chrome.tabs.query(queryOptions);
        let urls = tabs.map(t => {return { url: new URL(t.url ?? ""), tab: t } as TabUrl});
        return urls;
    };

    getHostRoot(host: string) {
        let hostParts = host.split('.').reverse();
        let rootLen = 2;
        let rootParts = [];
        for (let i = 0; i < hostParts.length; i++) {
            if (i === 0 && COUNTRY_DOMAINS.some(dom => dom === hostParts[i])) {
                rootLen++;
            }
            if (i < rootLen) {
                rootParts.push(hostParts[i]);
            } else {
                break;
            }
        }
        return rootParts.reverse().join('.');
    }

    parseByHostRoot(urls: TabUrl[]) {
        let hosts = [] as TabUrl[];
        urls.forEach(url => {
            let rootHost = this.getHostRoot(url.url.host);
            if (!hosts.some(host => host.name === rootHost)) {
                let host = {} as TabUrl;
                host.name = rootHost;
                if (!!url.tab.favIconUrl) {
                    host.icon = url.tab.favIconUrl;
                } else {
                    host.icon = '../icons/tabex16x16.png';
                }
                host.children = urls.filter(curl => this.getHostRoot(curl.url.host) === host.name);
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

    parseByHost(urls: TabUrl[]) {
        let hosts = [] as TabUrl[];
        urls.forEach(url => {
            if (!hosts.some(host => host.name === url.url.host)) {
                let host = {} as TabUrl;
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

    parseByOpener(urls: TabUrl[]) {
        urls.forEach(url => {
            if (!!url.tab.openerTabId) {
                let opener = urls.find(u => u.tab.id === url.tab.openerTabId);
                if (opener) {
                    opener.children = opener.children || [];
                    opener.children.push(url);
                }
            }
        });
        return urls.filter(url => !url.tab.openerTabId);
    }
}

const parser = new Parser();
export default parser;