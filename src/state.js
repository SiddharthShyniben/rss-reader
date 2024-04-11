import Stream from "mithril-stream";
import { getFeeds } from "./db";

export const feed = Stream(Object.keys(getFeeds())[0]);
