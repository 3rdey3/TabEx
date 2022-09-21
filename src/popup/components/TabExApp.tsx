// react-component.js
import Fuse from 'fuse.js';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { render } from 'react-dom';
import parser from '../parser';
import { TabUrl } from '../../models/tab-url';
import { ListNode } from './ListNode';
import { PopupContext } from '../PopupStore';

export const TabExApp: FunctionComponent = () => {
  let turl: TabUrl[] = [];
  const [urls, setUrls] = useState(turl);
  const [searchText, setSearchText] = useState('');
  const { state, dispatch } = React.useContext(PopupContext);

  useEffect(() => {
    (async () => {
      var urls = await parser.getAllTabUrls(state.filterByCW);
      if (state.filterByOpener) {
        urls = parser.parseByOpener(urls);
      }
      const turls = state.filterByRoot ? parser.parseByHostRoot(urls) : parser.parseByHost(urls);
      setUrls(turls)
    })();
  }, []);

  const applyFilter = (filterText: string = "") => {
    (async () => {
      let urls = await parser.getAllTabUrls(state.filterByCW);
      if (!!filterText && filterText.length) {
        const fuse = new Fuse(urls, { threshold: 0.3, minMatchCharLength: 5, keys: ["tab.title", "tab.url"] });
        urls = fuse.search(filterText).map(sr => sr.item);
        setSearchText(filterText);
      }
      if (state.filterByOpener) {
        urls = parser.parseByOpener(urls);
      }
      let purls = state.filterByRoot ? parser.parseByHostRoot(urls) : parser.parseByHost(urls);
      setUrls(purls);
    })();
  }

  const inputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (!!state.selectedTabId) {
        (async () => {
          await chrome.tabs.update(state.selectedTabId, { selected: true });
          let tab = await chrome.tabs.get(state.selectedTabId);
          let window = await chrome.windows.get(tab.windowId);
          if (!window.focused) {
            await chrome.windows.update(tab.windowId, { focused: true });
          }
        })();
      } else {
        applyFilter(event.currentTarget.value);
      }
      event.stopPropagation();
      event.preventDefault();
    } else if (event.key === 'Delete') {
      if (!!state.selectedTabId) {
        (async () => {
          await chrome.tabs.remove(state.selectedTabId);
          dispatch({ type: 'set_selectedTabId', payload: 0 });
          applyFilter(event.currentTarget.value);
        })();
      }
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const inputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.ctrlKey) {
      if (event.code === 'KeyN') {
        const ids = urls.flatMap(node => node.children.map(c => c.tab.id));
        if (!state.selectedTabId) {
          if (!!ids && !!ids.length) {
            let id = ids[0];
            dispatch({ type: 'set_selectedTabId', payload: id ?? 0 });
          }
        } else {
          let idx = ids.indexOf(state.selectedTabId);

          let id = 0;
          if (idx < ids.length - 1) {
            id = ids[idx + 1] ?? 0;
          } else {
            id = ids[0] ?? 0;
          }
          dispatch({ type: 'set_selectedTabId', payload: id });
        }
        event.stopPropagation();
        event.preventDefault();
      } else if (event.code === 'KeyP') {
        const ids = urls.flatMap(node => node.children.map(c => c.tab.id));
        if (!state.selectedTabId) {
          if (!!ids && !!ids.length) {
            let id = ids[ids.length - 1];
            dispatch({ type: 'set_selectedTabId', payload: id ?? 0 });
          }
        } else {
          let idx = ids.indexOf(state.selectedTabId);

          let id = 0;
          if (idx >= 0) {
            id = ids[idx - 1] ?? 0;
          } else {
            id = ids[ids.length - 1] ?? 0;
          }
          dispatch({ type: 'set_selectedTabId', payload: id })
        }
        event.stopPropagation();
        event.preventDefault();
      }
    }
  };

  return (
    <div>
      <input itemType='text' className='search' onKeyUp={inputKeyUp} onKeyDown={inputKeyDown} />
      <div className='toolbar'>
        <button itemType='button' title='Root Toggle'
          onClick={() => { dispatch({ type: 'toggleFilterByRoot' }); applyFilter(); }}
        >R</button>
        <button itemType='button' title='Current Window Toggle'
          onClick={() => { dispatch({ type: 'toggleFilterByCW' }); applyFilter(); }}
        >C</button>
        <button itemType='button' title='Opener Group Toggle'
          onClick={() => { dispatch({ type: 'toggleFilterByOpener' }); applyFilter(); }}
        >O</button>
      </div>
      <div className='tab-list'>
        {urls.map(url =>
          <ListNode url={url} closeEvent={() => applyFilter(searchText)}></ListNode>
        )
        }
      </div>
    </div>
  );
}
