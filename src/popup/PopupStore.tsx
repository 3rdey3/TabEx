import React from "react";

export function createCtx<StateType, ActionType>(
  reducer: React.Reducer<StateType, ActionType>,
  initialState: StateType,
) {
  const defaultDispatch: React.Dispatch<ActionType> = () => initialState // we never actually use this
  const ctx = React.createContext({
    state: initialState,
    dispatch: defaultDispatch, // just to mock out the dispatch type and make it not optioanl
  })
  function Provider(props: React.PropsWithChildren<{}>) {
    const [state, dispatch] = React.useReducer<React.Reducer<StateType, ActionType>>(reducer, initialState)
    return <ctx.Provider value={{ state, dispatch }} {...props} />
  }
  return [ctx, Provider] as const
}
// usage
const initialState = {
  filterByRoot: false,
  filterByCW: false,
  filterByOpener: false,
  selectedTabId: 0,
};
type AppState = typeof initialState;
type Action =
  | { type: 'toggleFilterByRoot' }
  | { type: 'toggleFilterByCW' }
  | { type: 'toggleFilterByOpener' }
  | { type: 'set_selectedTabId'; payload: number }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'set_selectedTabId':
      return { ...state, selectedTabId: action.payload }
    case 'toggleFilterByRoot':
      return { ...state, filterByRoot: !state.filterByRoot }
    case 'toggleFilterByCW':
      return { ...state, filterByRoot: !state.filterByCW }
    case 'toggleFilterByOpener':
      return { ...state, filterByRoot: !state.filterByOpener }
    default:
      throw new Error()
  }
}
const [ctx, PopupPrvdr] = createCtx(reducer, initialState)

export const PopupContext = ctx;
export const PopupProvider = PopupPrvdr;

/*
// top level example usage
export function App() {
    return (
        <CountProvider>
            <Counter />
        </CountProvider>
    )
}

// example usage inside a component
function Counter() {
    const { state, dispatch } = React.useContext(CountContext)
    return (
        <div>
            Count: {state.count}
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'add', payload: 5 })}>+5</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
            <button onClick={() => dispatch({ type: 'minus', payload: 5 })}>+5</button>
        </div>
    )
}
*/