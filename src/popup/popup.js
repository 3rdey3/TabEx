// document.addEventListener('DOMContentLoaded', function () {
//     (async function() {
//         var urls = await getAllTabUrls();
//         document.getElementById("main").innerHTML = JSON.stringify(urls);
//     })();
// });


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

var liComp = {
    props: ['url', 'closeEvent'],
    methods: {
        handleClick: function (tab) {
            (async () => {
                await chrome.tabs.update(tab.id, { selected: true });
            })();
        },
        handleCloseClick: function (tab) {
            (async () => {
                await chrome.tabs.remove(tab.id);
                this.closeEvent();
            })();
        },
        handleCloseAllClick: function() {
            let ids = this.url.children.map(cu => cu.tab.id);
            (async () => {
                await chrome.tabs.remove(ids);
                this.closeEvent();
            })();
        }
    },
    render() {
        let icon = Vue.h('img', {class: 'icon', src: this.url.icon});
        if (this.url.children) {
            return Vue.h('div', {class: 'level-0', style: {listStyle: 'none'}}, [
                Vue.h('div', {class: 'head'},
                    [
                        icon, " ",
                        this.url.name,
                        " - (", this.url.children.length, ") - ",
                        Vue.h('span', {class: 'close-link', onClick: (event) => { this.handleCloseAllClick(); }}, 'close all')
                    ]),
                this.url.children.map(cu => {
                    return Vue.h('div', {class: 'level-1 leaf'}, [
                        Vue.h('span', {class: 'bullet'}, '•'),
                        Vue.h('div', {
                            title: cu.tab.url,
                            class: 'tab-link',
                            onClick: (event) => { this.handleClick(cu.tab); }
                        }, cu.tab.title),
                        Vue.h('span', {class: 'close-link', onClick: (event) => { this.handleCloseClick(cu.tab); }}, 'X')
                    ])
                })
            ]);
        } else {
            return Vue.h('div', {class: 'level-0'}, this.url.name);
        }
    }
};

var TabEx = {
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
        let liComp = Vue.resolveComponent('li-comp');
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
                        return Vue.h(liComp, { url: url, closeEvent: () => { this.applyFilter(this.searchText); }});
                    }))
            ]
        );
    }
}

let app = Vue.createApp(TabEx);
app.component('li-comp', liComp);
app.mount('#main');
