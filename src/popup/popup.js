(function (Vue, window) {
    let app = Vue.createApp(window.TabEx.components.TabEx);
    app.component('leaf-comp', window.TabEx.components.leaf);
    app.component('node-comp', window.TabEx.components.node);
    app.mount('#main');
    window.TabEx.app = app;
})(Vue, window);
