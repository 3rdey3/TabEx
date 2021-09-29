(function (Vue, window) {
    let node = {
        props: ['url', 'showChild', 'closeEvent'],
        methods: {
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
            let leafComp = Vue.resolveComponent('leaf-comp');
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
                        let cNodes = [
                            Vue.h(leafComp, {closeEvent: this.closeEvent, url: cu, showChild: this.showChild})
                        ];
                        if (this.showChild && !!cu.children && !!cu.children.length) {
                            cNodes.push(
                                Vue.h('div', {class: 'level-2'}, cu.children.map(cuc => Vue.h(leafComp, {url: cuc, showChild: this.showChild, closeEvent: this.closeEvent})))
                            );
                        }
                        return Vue.h('div', {class: 'level-1'}, cNodes);
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
