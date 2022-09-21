import React, { MouseEventHandler } from "react";
import { TabUrl } from "../../models/tab-url";
import { PopupContext } from "../PopupStore";

export const ListLeaf = (props: { url: TabUrl, closeEvent: Function }) => {
  const { url, closeEvent } = props;
  const { state, dispatch } = React.useContext(PopupContext);

  let showChild = (): boolean => {
    return state.filterByOpener;
  }

  const handleClick = (tab: chrome.tabs.Tab) => {
    (async () => {
      await chrome.tabs.update(tab.id ?? 0, { selected: true });
      let window = await chrome.windows.get(tab.windowId);
      if (!window.focused) {
        await chrome.windows.update(tab.windowId, { focused: true });
      }
    })();
  }

  const handleCloseClick = (tab: chrome.tabs.Tab) => {
    (async () => {
      await chrome.tabs.remove(tab.id ?? 0);
      closeEvent();
    })();
  };

  let cNodes = [
    <div className="leaf">
      <span className="bullet">•</span>
      <div title={url.tab.url} className={"tab-link" + (state.selectedTabId === url.tab.id ? " selected" : "")}
        onClick={() => handleClick(url.tab)}
      >
        {!!url.children && !!url.children.length ? `(${url.children.length}) ` : ''}
        {url.tab.title}
      </div>
      <span className="close-link" onClick={() => handleCloseClick(url.tab)}>X</span>
    </div>
  ];

  if (showChild() && !!url.tab.openerTabId && !!url.children && !!url.children.length) {
    cNodes.push(
      ...url.children.map(cuc => <ListLeaf url={cuc} closeEvent={closeEvent}></ListLeaf>)
    )
  }

  return (
    <div>
      {cNodes}
    </div>
  );
};