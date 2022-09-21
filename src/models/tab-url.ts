export interface TabUrl {
    url: URL;
    tab: chrome.tabs.Tab;
    name: string;
    icon: string;
    children: TabUrl[];
}