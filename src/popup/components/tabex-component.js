(function (window) {
    let {Vue, Vuex, Fuse} = window;
    let {mapState} = Vuex;
    let parser = window.TabEx.parser;

    let TabEx = {
        data() {
            return {
                urls: ["loading..."],
                searchText: '',
            }
        },
        computed: mapState([
            'filterByRoot',
            'filterByCW',
            'filterByOpener',
            'selectedTabId',
        ]),
        mounted() {
            (async() => {
                var urls = await parser.getAllTabUrls(this.filterByCW);
                if (this.filterByOpener) {
                    urls = parser.parseByOpener(urls);
                }
                this.urls = this.filterByRoot ? parser.parseByHostRoot(urls) : parser.parseByHost(urls);
            })();
        },
        methods: {
            applyFilter: function (filterText) {
                (async () => {
                    let urls = await parser.getAllTabUrls(this.filterByCW);
                    if (!!filterText && filterText.length) {
                        const fuse = new Fuse(urls, {threshold:0.3, minMatchCharLength: 5, keys: [ "tab.title", "tab.url" ]});
                        urls = fuse.search(filterText).map(sr => sr.item);
                        this.searchText = filterText;
                    }
                    if (this.filterByOpener) {
                        urls = parser.parseByOpener(urls);
                    }
                    let purls = this.filterByRoot ? parser.parseByHostRoot(urls) : parser.parseByHost(urls);
                    this.urls = purls;
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
                                if (!!this.selectedTabId) {
                                    (async () => {
                                        await chrome.tabs.update(this.selectedTabId, { selected: true });
                                        let tab = await chrome.tabs.get(this.selectedTabId);
                                        let window = await chrome.windows.get(tab.windowId);
                                        if (!window.focused) {
                                            await chrome.windows.update(tab.windowId, { focused: true });
                                        }
                                    })();
                                } else {
                                    this.applyFilter(event.target.value);
                                }
                                event.stopPropagation();
                                event.preventDefault();
                            } else if (event.key === 'Delete') {
                                if (!!this.selectedTabId) {
                                    (async () => {
                                        await chrome.tabs.remove(this.selectedTabId);
                                        this.$store.commit('setSelectedTabId', 0);
                                        this.applyFilter(event.target.value);
                                    })();
                                }
                                event.stopPropagation();
                                event.preventDefault();
                            }
                        },
                        onKeydown: event => {
                            if (event.ctrlKey) {
                                if (event.code === 'KeyN') {
                                    const ids = this.urls.flatMap(node => node.children.map(c => c.tab.id));
                                    if (!this.selectedTabId) {
                                        if (!!ids && !!ids.length) {
                                            let id = ids[0];
                                            this.$store.commit('setSelectedTabId', id);
                                        }
                                    } else {
                                        let idx = ids.indexOf(this.selectedTabId);

                                        let id = 0;
                                        if (idx < ids.length - 1) {
                                            id = ids[idx + 1];
                                        } else {
                                            id = ids[0];
                                        }
                                        this.$store.commit('setSelectedTabId', id);
                                    }
                                    event.stopPropagation();
                                    event.preventDefault();
                                } else if (event.code === 'KeyP') {
                                    const ids = this.urls.flatMap(node => node.children.map(c => c.tab.id));
                                    if (!this.selectedTabId) {
                                        if (!!ids && !!ids.length) {
                                            let id = ids[ids.length - 1];
                                            this.$store.commit('setSelectedTabId', id);
                                        }
                                    } else {
                                        let idx = ids.indexOf(this.selectedTabId);

                                        let id = 0;
                                        if (idx >= 0) {
                                            id = ids[idx - 1];
                                        } else {
                                            id = ids[ids.length - 1];
                                        }
                                        this.$store.commit('setSelectedTabId', id);
                                    }
                                    event.stopPropagation();
                                    event.preventDefault();
                                }
                            }
                        },
                    }),
                    Vue.h('div', {class: 'toolbar'},
                        [
                            Vue.h('button', {
                                type: 'button',
                                title: 'Root Toggle',
                                class: this.filterByRoot ? 'active' : '',
                                onClick: (event) => {
                                    this.$store.commit('toggleFilterByRoot');
                                    this.applyFilter();
                                }
                            }, 'R'),
                            Vue.h('button', {
                                type: 'button',
                                title: 'Current Window Toggle',
                                class: this.filterByCW ? 'active' : '',
                                onClick: (event) => {
                                    this.$store.commit('toggleFilterByCW');
                                    this.applyFilter();
                                }
                            }, 'C'),
                            Vue.h('button', {
                                type: 'button',
                                title: 'Opener Group Toggle',
                                class: this.filterByOpener ? 'active' : '',
                                onClick: (event) => {
                                    this.$store.commit('toggleFilterByOpener');
                                    this.applyFilter();
                                }
                            }, 'O'),
                        ]),
                    Vue.h('div', {class: 'tab-list'},
                        this.urls.map(url => {
                            return Vue.h(nodeComp, { url: url, closeEvent: () => { this.applyFilter(this.searchText); }});
                        }))
                ]
            );
        }
    };

    window.TabEx.components = window.TabEx.components || {};

    window.TabEx.components.TabEx = TabEx;
})(window);

