import React from "react";
import { TabUrl } from "../../models/tab-url";
import { PopupContext } from "../PopupStore";
import { ListLeaf } from "./ListLeaf";

export const ListNode = (props: { url: TabUrl, closeEvent: Function }) => {
  const { url, closeEvent } = props;
  const { state, dispatch } = React.useContext(PopupContext);

  const handleCloseAllClick = () => {
    let ids: number[] = url.children.map(cu => cu.tab.id ?? 0) ?? [];
    (async () => {
      await chrome.tabs.remove(ids);
      closeEvent();
    })();
  };

  return (
    url.children ?
      <div className="level-0" style={{ listStyle: 'none' }}>
        <div className="head">
          <img className="icon" src={url.icon} />
          {` ${url.name} - (${url.children.length}) - `}
          <span className="close-link" onClick={handleCloseAllClick}>close all</span>
        </div>
        {
          url.children.map(cu => {
            let cNodes = [
              <ListLeaf url={cu} closeEvent={closeEvent}></ListLeaf>
            ];
            if (!!cu.children && !!cu.children.length) {
              cNodes.push(
                <div className="level-2">
                  {cu.children.map(cuc => <ListLeaf url={cuc} closeEvent={closeEvent}></ListLeaf>)}
                </div>
              )
            }
            return (
              <div className="level-1">
                {cNodes}
              </div>
            );
          })
        }
      </div>
      :
      <div className="level-0">{url.name}</div>
  );
};