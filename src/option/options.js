(function (window) {
    let { Vue, TabExOptions } = window;
    let { store } = TabExOptions;
    let app = Vue.createApp(window.TabExOptions.components.TabExOptions);
    // app.component('leaf-comp', window.TabEx.components.leaf);
    // app.component('node-comp', window.TabEx.components.node);
    app.use(store);
    app.mount('#main');
    window.TabExOptions.app = app;
})(window);

