import m from "mithril";

import Navbar from "./navbar";
import { addToFeed, getFeed, removeFromFeed, renameFeed } from "./db";
import { feed as _feed } from "./state";

export default function Settings() {
  let feed, items;
  let showInput = false;
  return {
    oninit(vnode) {
      feed = vnode.attrs.feed;
      items = getFeed(feed);
      if (!items) m.route.set("/");
    },
    view() {
      return [
        m(Navbar, { feeds: false }),
        m(
          "section",
          { class: "section" },
          m(
            "div",
            { class: "container" },
            m("h1", { class: "title" }, `Settings for ${feed}`),
            m("h2", { class: "title is-6" }, "Rename feed"),
            m("input", {
              class: "input",
              placeholder: "New feed name...",
              onkeydown(e) {
                if (e.key == "Enter") {
                  const name = e.target.value;
                  renameFeed(feed, name);
                  _feed.map((feed) => {
                    m.route.set("/settings/:feed", { feed: name });
                  });
                  _feed(name);
                }
              },
            }),
            m("h2", { class: "title is-6 mt-6" }, "RSS Feeds"),
            m(
              "table",
              { class: "table" },
              m("tbody", [
                m("tr", [
                  m(
                    "td",
                    showInput
                      ? m("input", {
                          class: "input is-small",
                          placeholder: "RSS feed url...",
                          onkeydown(e) {
                            if (e.key == "Enter") {
                              addToFeed(feed, e.target.value);
                              e.target.value = "";
                              showInput = false;
                            }
                          },
                        })
                      : "Add a new RSS feed",
                  ),
                  m(
                    "td",
                    m(
                      "span",
                      {
                        class: "icon has-text-success is-clickable",
                        onclick() {
                          showInput = !showInput;
                        },
                      },
                      m(
                        "span",
                        {
                          class: "material-symbols-outlined is-vcentered",
                          style: "height: 1rem;",
                        },
                        showInput ? "cancel" : "add",
                      ),
                    ),
                  ),
                ]),
                ...items.map((x) =>
                  m("tr", [
                    m("td", x),
                    m(
                      "td",
                      m(
                        "span",
                        { class: "icon has-text-danger is-clickable" },
                        m(
                          "span",
                          {
                            class: "material-symbols-outlined",
                            onclick() {
                              removeFromFeed(feed, x);
                              items = items.filter((i) => i !== x);
                              m.redraw();
                            },
                          },
                          "delete",
                        ),
                      ),
                    ),
                  ]),
                ),
              ]),
            ),
          ),
        ),
      ];
    },
  };
}
