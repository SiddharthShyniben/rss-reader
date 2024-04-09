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

        return items.map((e) => {
          return {
            source: data.querySelector("channel>title").innerHTML,
            title: e.querySelector("title")?.innerHTML,
            link: e.querySelector("link")?.innerHTML,
            creator: e.querySelector("dc\\:creator")?.innerHTML,
            date: e.querySelector("pubDate")?.innerHTML,
          };
        });
      });

    all = all.concat(f);
  }

  return all.sort((a, b) => new Date(b.date) - new Date(a.date));
};
