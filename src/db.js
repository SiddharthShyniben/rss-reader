import { assert } from "./util";

const KEY = "feed";

let cache = null;

export const getFeeds = () => _getAll();
export const getFeed = (id) => _getAll()[id];
export const deleteFeed = (id) => {
  const feeds = _getAll();
  delete feeds[id];
  _set(feeds);
};

export const addToFeed = (id, feed) => {
  const feeds = _getAll();
  feeds[id] ??= [];
  feeds[id].push(feed);
  _set(feeds);
};

export const removeFromFeed = (id, feed) => {
  const feeds = _getAll();
  if (feeds[id]) feeds[id] = feeds[id].filter((f) => f !== feed);
  _set(feeds);
};

//////////////////////////////////////////////////////////////////////
// Internal //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

const _getAll = () => {
  if (cache) return cache;

  const data = localStorage.getItem(KEY) || JSON.stringify({ default: [] });

  try {
    const out = JSON.parse(data);
    _validate(out);
    return (cache = out);
  } catch (e) {
    console.error("Data corrupted!", e);
    _set({ default: [] });
    return (cache = {});
  }
};

const _set = (feeds) => {
  _validate(feeds);
  cache = feeds;
  localStorage.setItem(KEY, JSON.stringify(feeds));
};

const _validate = (object) => {
  assert(
    Object.prototype.toString.call(object) == "[object Object]",
    "data is not an object",
  );
  for (const k in object) {
    assert(Array.isArray(object[k], `feed ${k} is not an array`));
    assert(
      object[k].every((item) => typeof item == "string"),
      "all feed items are not strings",
    );
  }
};
