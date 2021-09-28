(function (Vue, Fuse, window) {
    let parser = window.TabEx.parser;

    let TabEx = {
        data() {
            return {
                urls: ["loading..."],
                searchText: '',
                filterByRoot: false
            }
        },
        mounted() {
            (async() => {
                var urls = await parser.getAllTabUrls();
                this.urls = this.filterByRoot ? parser.parseByHostRoot(urls) : parser.parseByHost(urls);
            })();
        },
        methods: {
            applyFilter: function (filterText) {
                (async () => {
                    let urls = await parser.getAllTabUrls();
                    let purls = this.filterByRoot ? parser.parseByHostRoot(urls) : parser.parseByHost(urls);
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
                    Vue.h('div', {class: 'toolbar'},
                        Vue.h('button', {
                            type: 'button',
                            title: 'Root Toggle',
                            class: this.filterByRoot ? 'active' : '',
                            onClick: (event) => {
                                this.filterByRoot = !this.filterByRoot;
                                this.applyFilter();
                            }
                        }, 'R')),
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
})(Vue, Fuse, window);
