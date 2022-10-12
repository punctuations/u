import { encodeText } from "next/dist/server/node-web-streams-helper";

const pattern = new RegExp(
  "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
  "i"
); // fragment locator

export async function getLink(link: string) {
  if (pattern.test(link)) {
    return await fetch(link).then((r) => r.text());
  } else {
    // link is html (or malformed link)
    return link;
  }
}
