import m from "mithril";
import Navbar from "./navbar";
import timeAgo from "@nuff-said/time-ago";

import { addToFeed, getFeed } from "./db";
import { feed } from "./state";
import { parseFeed, truncate } from "./util";

export default function Feeds() {
  let inputVisible = false;
  let f, feedItems, processed;

  const loadFeed = () =>
    parseFeed(feedItems, (processed = [])).then((x) => {
      processed = x.filter(Boolean);
      m.redraw();
    });

  return {
    oninit() {
      f = feed();
      feedItems = getFeed(f);
      loadFeed();
    },
    view() {
      return [
        m(Navbar, { feeds: true }),

        m("div", { class: "fab-area" }, [
          m("input", {
            class:
              "input link is-small mr-5 " + (inputVisible ? "visible" : ""),
            placeholder: "Add an RSS feed URL",
            onkeydown(e) {
              if (e.key == "Enter") {
                addToFeed(f, e.target.value);
                e.target.value = "";
                inputVisible = false;
                loadFeed();
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
          m(
            "button",
            {
              class: "button is-info is-dark fab ml-3",
              onclick() {
                m.route.set("/feed-settings/:feed", { feed: feed() });
              },
            },
            [
              m(
                "span",
                { class: "icon" },
                m("span", { class: "material-symbols-outlined" }, "settings"),
              ),
            ],
          ),
        ]),

        processed.length
          ? m("section", { class: "section" }, [
              m(
                "div",
                { class: "container" },
                processed.map((item) =>
                  item.error
                    ? m(
                        "div",
                        { class: "block" },
                        m("div", { class: "notification is-danger" }, [
                          m("button", {
                            class: "delete",
                            onclick({ target }) {
                              const $notification = target.parentNode;
                              $notification.parentNode.removeChild(
                                $notification,
                              );
                            },
                          }),
                          m("p", [
                            m("strong", [
                              "Error trying to process feed ",
                              item.item
                                ? m("a", { href: item.item }, item.item)
                                : "<unknown>",
                              ": ",
                            ]),
                            item.error.message,
                          ]),
                        ]),
                      )
                    : [
                        m(
                          "div",
                          { class: "block" },
                          m("article", { class: "media" }, [
                            m(
                              "div",
                              { class: "media-content" },
                              m("div", { class: "content" }, [
                                m("p", [
                                  ...item.categories.map((x) =>
                                    m(
                                      "span",
                                      { class: "tag mr-1 mb-2" },
                                      "#" + x,
                                    ),
                                  ),
                                  ...(item.categories.length ? [m("br")] : []),
                                  m(
                                    "a",
                                    {
                                      class: "has-text-link-light",
                                      target: "_blank",
                                      href: item.link,
                                    },
                                    m("strong", item.title),
                                  ),
                                  " ",
                                  m("small", timeAgo(new Date(item.date))),
                                  m("small", [
                                    " • via ",
                                    item.creator || item.source,
                                  ]),
                                  m("br"),
                                  m(
                                    "div",
                                    { class: "feed-content mt-4" },
                                    m.trust(
                                      truncate(item.description || "", 300),
                                    ),
                                  ),
                                ]),
                              ]),
                            ),
                          ]),
                        ),
                        m("hr"),
                      ],
                ),
              ),
            ])
          : m("div", { class: "lds-ripple is-absolute-center" }, [
              m("div"),
              m("div"),
            ]),
      ];
    },
  };
}
