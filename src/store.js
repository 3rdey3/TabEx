(function (window) {
    let { Vuex } = window;
    const store = Vuex.createStore({
        state() {
            return {
                filterByRoot: false,
                filterByCW: false,
                filterByOpener: false,
            }
        },
        mutations: {
            toggleFilterByRoot(state) {
                state.filterByRoot = !state.filterByRoot;
            },
            toggleFilterByCW(state) {
                state.filterByCW = !state.filterByCW;
            },
            toggleFilterByOpener(state) {
                state.filterByOpener = !state.filterByOpener;
            },
        }
    });

    window.TabEx.store = store;
})(window);
