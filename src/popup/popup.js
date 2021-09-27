(function (Vue, window) {
    let app = Vue.createApp(TabEx);
    app.component('li-comp', liComp);
    app.mount('#main');
})(Vue, window);
