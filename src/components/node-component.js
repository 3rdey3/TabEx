export var liComp = {
    props: ['url'],
    methods: {
        handleClick: (tab) => {
            (async () => {
                //cawait chrome.tabs.highlight({tabs: [tab.id]});
                await chrome.tabs.update(tab.id, { selected: true });
            })();
        }
    },
    render() {
        let icon = Vue.h('img', {class: 'icon', src: this.url.icon});
        if (this.url.children) {
            return Vue.h('div', {class: 'level-0', style: {listStyle: 'none'}}, [
                Vue.h('div', {class: 'head'}, [icon, " ", this.url.name]),
                this.url.children.map(cu => {
                    return Vue.h('div', {
                        title: cu.tab.url,
                        class: 'level-1 tab-link leaf',
                        onClick: (event) => { this.handleClick(cu.tab); }
                    }, cu.tab.title)
                })
            ]);
        } else {
            return Vue.h('div', {class: 'level-0'}, this.url.name);
        }
    }
};
