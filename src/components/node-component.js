(function (Vue, window) {
    let node = {
        props: ['url', 'closeEvent'],
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

    window.TabEx.components = window.TabEx.components || {};

    window.TabEx.components.node = node;
})(Vue, window);
