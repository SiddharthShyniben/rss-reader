import m from "mithril";
import timeAgo from "@nuff-said/time-ago";

import { addToFeed, getFeed } from "./db";
import Navbar from "./navbar";
import { feed } from "./state";
import { parseFeed, truncate } from "./util";

let inputVisible = false;

const f = feed();
const feedItems = getFeed(f);
let processed;
parseFeed(feedItems).then((x) => {
  processed = x;
  m.redraw();
});

m.mount(document.body, {
  view() {
    return [
      m(Navbar),

      m("div", { class: "fab-area" }, [
        m("input", {
          class: "input link is-small mr-5 " + (inputVisible ? "visible" : ""),
          placeholder: "Add an RSS feed URL",
          onkeydown(e) {
            if (e.key == "Enter") {
              addToFeed(f, e.target.value);
              e.target.value = "";
              inputVisible = false;
            }
          },
        }),
        m(
          "button",
          {
            class: "button is-primary is-dark fab",
            onclick() {
              inputVisible = !inputVisible;
            },
          },
          [
            m(
              "span",
              { class: "icon" },
              m("span", { class: "material-symbols-outlined" }, "add"),
            ),
          ],
        ),
      ]),

      m("section", { class: "section" }, [
        m(
          "div",
          { class: "container" },
          // processed
          //   ? processed.map((item) =>
          //       m("div", { class: "block" }, [
          //         m("div", { class: "card" }, [
          //           m("div", { class: "card-content" }, [
          //             m(
          //               "p",
          //               { class: "is-size-6" },
          //               item.categories
          //                 .flatMap((x) => [m("a", "#" + x), ", "])
          //                 .slice(0, -1),
          //             ),
          //             m("h2", { class: "title my-2" }, item.title),
          //             m("p", { class: "subtitle" }, item.source),
          //             // m("div", { class: "content" }, m.trust(item.description)),
          //           ]),
          //         ]),
          //       ]),
          //     )
          //   : "waiting...",
          // processed
          //   ? m("table", { class: "table" }, [
          //       m(
          //         "tbody",
          //         processed.map((item) => m("tr", [m("td", item.title)])),
          //       ),
          //     ])
          //   : "waiting...",
          processed
            ? processed.map((item) =>
                m(
                  "div",
                  { class: "block" },
                  m("article", { class: "media" }, [
                    m(
                      "div",
                      { class: "media-content" },
                      m("div", { class: "content" }, [
                        m("p", [
                          m("strong", item.title),
                          " ",
                          m(
                            "small",
                            timeAgo(new Date(item.date)),
                          ),
                        m("br"),
                        m("div", {class: "content"}, m.trust(truncate(item.description || "", 300)))
                        ]),
                      ]),
                    ),
                  ]),
                ),
              )
            : "waiting..",
        ),
      ]),
    ];
  },
});
