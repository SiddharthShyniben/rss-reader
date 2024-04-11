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
        console.log(data);
        const items = Array.from(data.querySelectorAll("item"));
        if (!items) return [];
        const source = repairCDATA(
          data.querySelector("channel>title")?.innerHTML,
        );

        return items.map((e) => {
          return {
            source,
            title: repairCDATA(e.querySelector("title")?.innerHTML || ""),
            link: repairCDATA(e.querySelector("link")?.innerHTML || ""),
            creator: repairCDATA(
              // FIXME: how do we do creator again??
              e.querySelector("dc\\:creator")?.innerHTML || "",
            ),
            date: repairCDATA(e.querySelector("pubDate")?.innerHTML || ""),
            description: repairCDATA(
              decodeEntities(e.querySelector("description")?.innerHTML || ""),
            ),
            categories: [...e.querySelectorAll("category")].map((x) =>
              repairCDATA(x?.innerHTML || ""),
            ),
          };
        });
      })
      .catch((error) => {
        console.error("Error parsing", item, error);
        all.unshift({ item, error });
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

export const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const repairCDATA = (text) => text.replace(/<!\[CDATA\[(.*?)]]>/g, "$1");
