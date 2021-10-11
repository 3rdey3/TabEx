(function(window) {
    let {Vue, Vuex, Fuse} = window;

    let TabExOptions = {
        data() {
            return {
            }
        },
        mounted() {
        },
        methods: {
        },
        render() {
            return Vue.h('div',
                'TabEx Options'
            );
        }
    };

    window.TabExOptions.components = window.TabExOptions.components || {};

    window.TabExOptions.components.TabExOptions = TabExOptions;
})(window);

