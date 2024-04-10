export const assert = (cond, message = "assertion failed") => {
  if (!cond) throw new Error(message);
};

export const parseFeed = async (feed) => {
  let all = [];

  for (const item of feed) {
    const f = await fetch(item)
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((data) => {
        const items = Array.from(data.querySelectorAll("item"));
        const source = data.querySelector("channel>title").innerHTML;

        return items.map((e) => {
          return {
            source,
            title: e.querySelector("title")?.innerHTML,
            link: e.querySelector("link")?.innerHTML,
            creator: e.querySelector("dc\\:creator")?.innerHTML,
            date: e.querySelector("pubDate")?.innerHTML,
            description: decodeEntities(
              e.querySelector("description")?.innerHTML || "",
            ),
            categories: [...e.querySelectorAll("category")].map(
              (x) => x.innerHTML,
            ),
          };
        });
      });

    all = all.concat(f);
  }

  return all.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export function decodeEntities(encodedString) {
  var textArea = document.createElement("textarea");
  textArea.innerHTML = encodedString;
  return textArea.value;
}

export const truncate = (input, len) => input.length > len ? `${input.substring(0, len)}...` : input;
