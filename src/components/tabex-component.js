(function(Vue, Fuse, window) {
    async function getCurrentTab() {
        let queryOptions = { active: true, currentWindow: true };
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
    }

    async function getAllTabUrls() {
        let tabs = await chrome.tabs.query({});
        let urls = tabs.map(t => {return { url: new URL(t.url), tab: t }});
        return urls;
    }

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
    }

    let TabEx = {
        data() {
            return {
                urls: ["loading..."],
                searchText: '',
            }
        },
        mounted() {
            (async() => {
                var urls = await getAllTabUrls();
                this.urls = parseByHost(urls);
            })();
        },
        methods: {
            applyFilter: function (filterText) {
                (async () => {
                    let urls = await getAllTabUrls();
                    let purls = parseByHost(urls);
                    this.searchText = filterText;
                    if (!!filterText && filterText.length) {
                        const fuse = new Fuse(purls, {threshold:0.3, minMatchCharLength: 5, keys: [ "children.tab.title", "children.tab.url" ]});
                        this.urls = fuse.search(filterText).map(sr => {return {...sr.item}});
                    } else {
                        this.urls = purls;
                    }
                })();
            }
        },
        render() {
            let nodeComp = Vue.resolveComponent('node-comp');
            return Vue.h('div',
                [
                    Vue.h('input', {
                        type: 'text', class: 'search', autofocus: true,
                        onKeyup: event => {
                            if (event.key === 'Enter') {
                                this.applyFilter(event.target.value);
                                event.stopPropagation();
                                event.preventDefault();
                            }
                        }
                    }),
                    Vue.h('div', {class: 'tab-list'},
                        this.urls.map(url => {
                            return Vue.h(nodeComp, { url: url, closeEvent: () => { this.applyFilter(this.searchText); }});
                        }))
                ]
            );
        }
    };

    window.TabEx = window.TabEx || {};
    window.TabEx.components = window.TabEx.components || {};

    window.TabEx.components.TabEx = TabEx;
})(Vue, Fuse, window);
