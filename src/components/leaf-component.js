(function (window) {
    let {Vue, Vuex} = window;
    let {mapState} = Vuex;

    let leaf = {
        props: ['url', 'closeEvent'],
        computed: mapState({
            showChild: 'filterByOpener'
        }),
        methods: {
            handleClick: function (tab) {
                (async () => {
                    await chrome.tabs.update(tab.id, { selected: true });
                    let winInfo = await chrome.windows.get(tab.windowId);
                    if (!window.focused) {
                        await chrome.windows.update(tab.windowId, { focused: true });
                    }
                })();
            },
            handleCloseClick: function (tab) {
                (async () => {
                    await chrome.tabs.remove(tab.id);
                    this.closeEvent();
                })();
            },
        },
        render() {
            let cu = this.url;
            let leafComp = Vue.resolveComponent('leaf-comp');
            let cNodes = [
                Vue.h('div', {class: 'leaf'}, [
                    Vue.h('span', {class: 'bullet'}, '•'),
                    Vue.h('div', {
                        title: cu.tab.url,
                        class: 'tab-link',
                        onClick: (event) => {this.handleClick(cu.tab);}
                    }, [
                        !!cu.children && !!cu.children.length ? '(' + cu.children.length + ') ' : '',
                        cu.tab.title
                    ]),
                    Vue.h('span', {class: 'close-link', onClick: (event) => {this.handleCloseClick(cu.tab);}}, 'X')
                ])
            ];
            if (this.showChild && !!cu.tab.openerTabId && !!cu.children && !!cu.children.length) {
                cNodes.push(
                    cu.children.map(cuc => Vue.h(leafComp, {url: cuc, closeEvent: this.closeEvent}))
                );
            }
            return Vue.h('div', {}, cNodes);
        }
    };

    window.TabEx.components = window.TabEx.components || {};
    window.TabEx.components.leaf = leaf;
})(window);
