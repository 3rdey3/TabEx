(function (window) {
    let { Vuex } = window;
    const store = Vuex.createStore({
        state() {
            return {
                filterByRoot: false,
                filterByCW: false,
                filterByOpener: false,
                selectedTabId: 0,
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
            setSelectedTabId(state, id) {
                state.selectedTabId = id;
            },
        }
    });

    window.TabExOptions.store = store;
})(window);
