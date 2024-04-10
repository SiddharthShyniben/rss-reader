import m from "mithril";

import Navbar from "./navbar";
import { getFeed, removeFromFeed } from "./db";

export default function Settings() {
  let feed, items;
  return {
    oninit(vnode) {
      feed = vnode.attrs.feed;
      items = getFeed(feed);
      if (!items) m.route.set("/");
    },
    view() {
      return [
        // TODO: Add FABs
        m(Navbar, { feeds: false }),
        m(
          "section",
          { class: "section" },
          m(
            "div",
            { class: "container" },
            m("h1", { class: "title" }, `Settings for ${feed}`),
            m("h2", "RSS Feeds"),
            m(
              "table",
              { class: "table" },
              m("tbody", [
                items.map((x) =>
                  m("tr", [
                    m("td", x),
                    m(
                      "td",
                      m(
                        "span",
                        { class: "icon has-text-danger" },
                        m(
                          "span",
                          {
                            class: "material-symbols-outlined is-clickable",
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
