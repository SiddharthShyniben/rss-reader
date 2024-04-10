import m from "mithril";
import { getFeeds } from "./db";
import { feed } from "./state";

export default function Navbar() {
  return {
    view(vnode) {
      return [
        m(
          "nav",
          {
            class: "navbar",
            role: "navigation",
            "aria-label": "main-navigation",
          },
          [
            m("div", { class: "navbar-brand" }, [
              m(m.route.Link, { class: "navbar-item is-size-4", href: "/" }, [
                m.trust(
                  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`,
                ),
                m.trust("&nbsp;Reed"),
              ]),
              m(
                "a",
                {
                  role: "button",
                  class: "navbar-burger has-text-white-ter",
                  "aria-label": "menu",
                  "aria-expanded": "false",
                  "data-target": "navbarBasicExample",
                  onclick(e) {
                    const target = e.target.dataset.target;
                    const $target = document.getElementById(target);

                    e.target.classList.toggle("is-active");
                    $target.classList.toggle("is-active");
                  },
                },
                [
                  m("span", { "aria-hidden": true }),
                  m("span", { "aria-hidden": true }),
                  m("span", { "aria-hidden": true }),
                  m("span", { "aria-hidden": true }),
                ],
              ),
            ]),
            m("div", { id: "navbarBasicExample", class: "navbar-menu" }, [
              m(
                "div",
                { class: "navbar-start ml-6" },
                [
                  vnode.attrs.feeds
                    ? m("div", { class: "tabs" }, [
                        m(
                          "ul",
                          { class: "is-borderless" },
                          Object.keys(getFeeds()).map((title) =>
                            m(
                              "li",
                              {
                                class: feed() == title ? "is-active" : void 0,
                                onclick() {
                                  feed(title);
                                },
                              },
                              m("a", { class: "navbar-item" }, title),
                            ),
                          ),
                        ),
                      ])
                    : null,
                ].filter(Boolean),
              ),
            ]),
          ],
        ),
      ];
    },
  };
}
