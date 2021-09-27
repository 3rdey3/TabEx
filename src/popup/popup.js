(function (Vue, window) {
    let app = Vue.createApp(window.TabEx.components.TabEx);
    app.component('node-comp', window.TabEx.components.node);
    app.mount('#main');
})(Vue, window);
