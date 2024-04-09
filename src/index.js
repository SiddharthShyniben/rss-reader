import m from "mithril";
import { addToFeed, getFeed } from "./db";
import Navbar from "./navbar";
import { feed } from "./state";
import { parseFeed } from "./util";

let inputVisible = false;

m.mount(document.body, {
  view() {
    const f = feed();
    const feedItems = getFeed(f);
    parseFeed(feedItems).then(console.log);

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
        m("div", { class: "container" }, [
          m("h1", { class: "title" }, "Hello, world!"),
          m("p", { class: "subtitle" }, [
            "Da feed has ",
            feedItems.length,
            " items",
          ]),
        ]),
      ]),
    ];
  },
});
