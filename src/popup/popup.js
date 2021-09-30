(function (window) {
    let { Vue, TabEx } = window;
    let { store } = TabEx;
    let app = Vue.createApp(window.TabEx.components.TabEx);
    app.component('leaf-comp', window.TabEx.components.leaf);
    app.component('node-comp', window.TabEx.components.node);
    app.use(store);
    app.mount('#main');
    window.TabEx.app = app;
})(window);
