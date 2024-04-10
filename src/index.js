import m from "mithril";
import Feeds from "./feeds";
import Settings from "./settings";

m.route(document.body, "/", {
  "/": Feeds,
  "/feed-settings/:feed": Settings,
});
