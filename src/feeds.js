import m from "mithril";
import Navbar from "./navbar";
import timeAgo from "@nuff-said/time-ago";

import { addToFeed, deleteFeed, getFeed, getFeeds } from "./db";
import { feed } from "./state";
import { parseFeed, truncate } from "./util";

export default function Feeds() {
  let inputVisible = false;
  let processing = true;
  let confirmation = false;

  let f,
    feedItems = [],
    processed,
    feedsCount;

  const firstTime = !localStorage.getItem("visited");
  if (firstTime) localStorage.setItem("visited", true);

  let modalShow = true;

  const loadFeed = () =>
    parseFeed(feedItems, (processed = [])).then((x) => {
      processed = x.filter(Boolean);
      m.redraw();
      processing = false;
    });

  return {
    oninit() {
      processing = true;
      f = feed();
      feedItems = getFeed(f) || [];
      feedsCount = Object.keys(getFeeds()).length;
      loadFeed();

      feed.map((v) => {
        processing = true;
        f = v;
        feedItems = getFeed(f) || [];
        feedsCount = Object.keys(getFeeds()).length;
        loadFeed();
      });
    },
    view() {
      return [
        firstTime
          ? m("div", { class: "modal" + (modalShow ? " is-active" : "") }, [
              m("div", {
                class: "modal-background",
                onclick() {
                  modalShow = false;
                },
              }),
              m(
                "div",
                { class: "modal-content" },
                m("div", { class: "card" }, [
                  m("section", { class: "modal-card-body" }, [
                    m("p", m("strong", "Welcome to Reed!")),
                    m(
                      "p",
                      "Reed is a small, no-nonsense, browser-based RSS feed reader. Simply add RSS feed URLs and enjoy!",
                    ),
                  ]),
                ]),
              ),
              m("button", {
                class: "modal-close is-large",
                "aria-label": "close",
                onclick() {
                  modalShow = false;
                },
              }),
            ])
          : undefined,
        m(Navbar, { feeds: true }),

        m("div", { class: "fab-area" }, [
          m("input", {
            class:
              "input link is-small mr-5 has-background-dark " +
              (inputVisible ? "visible" : ""),
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
            m(
              "span",
              { class: "icon" },
              m("span", { class: "material-symbols-outlined" }, "settings"),
            ),
          ),
          feedsCount > 1
            ? m(
                "button",
                {
                  class: "button is-danger is-dark fab ml-3",
                  onclick() {
                    if (!confirmation) {
                      confirmation = true;
                      setTimeout(() => {
                        confirmation = false;
                        m.redraw();
                      }, 5000);
                    } else {
                      deleteFeed(f);
                      feed(Object.keys(getFeeds())[0]);
                    }
                  },
                },
                m(
                  "span",
                  { class: "icon" },
                  m(
                    "span",
                    { class: "material-symbols-outlined" },
                    confirmation ? "check" : "delete",
                  ),
                ),
              )
            : undefined,
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
          : processing
            ? m("div", { class: "lds-ripple is-absolute-center" }, [
                m("div"),
                m("div"),
              ])
            : m(
                "div",
                { class: "container" },
                m("div", { class: "section is-size-4" }, [
                  m("strong", "This feed is empty."),
                  m("br"),
                  "Add new items to your feed by clicking the button at the bottom right corner.",
                ]),
              ),
      ];
    },
  };
}
