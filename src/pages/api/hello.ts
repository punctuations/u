import { NextApiRequest, NextApiResponse } from "next";
import { convert } from "../../lib/puppeteer";
import { getLink } from "../../lib/link";

type Query = {
  html?: string; // Custom html to render
  header?: string; // Header text
  desc?: string; // small description
  dark?: "true" | "false"; // Background colour & text color. Default false.
  background?: string; // Background image
  image?: string; // custom image, can be link like lanyard
  float?: "left" | "right" | "center"; // float of text
  logo?: string; // small logo, bottom left, bottom right, bottom center
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query as Query;

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader(
    "content-security-policy",
    "default-src 'none'; img-src * data:; style-src 'unsafe-inline'"
  );

  const style = `<style> html { ${
    query.background
      ? `background-position: center; background-size: cover; background-origin: border-box; background-image: url(${query.background});`
      : ""
  } background-color: ${query.dark == "true" ? "#000" : "#fff"}; color: ${
    query.dark == "true" ? "#fff" : "#000"
  } } body { display: flex; align-items: center; justify-content: ${
    query.float == "right"
      ? "end"
      : query.float == "center"
      ? "center"
      : "start"
  }; } div { display: flex; flex-direction: column; margin: ${
    query.float == "center"
      ? "0"
      : query.float == "right"
      ? "0 5rem 0 0"
      : "0 0 0 5rem"
  }; } h1 { font-size: 9rem; margin: 0 0 0 0; } p { text-align: ${
    query.float == "right"
      ? "right"
      : query.float == "center"
      ? "center"
      : "left"
  }; margin: 0 .5rem 0 .5rem; font-size: 3rem; color: ${
    query.dark == "true" ? "rgb(156 163 175);" : "rgb(75 85 99);"
  } } #image, #logo { top: 0; left: 0; position: absolute; width: 100%; height: 100%; display: flex; align-items: ${
    query.float == "right"
      ? "end"
      : query.float == "center"
      ? "center"
      : "start"
  }; } #image > img { margin: 5rem 0 0 0; top: 0; } #logo > img { margin: 0 0 3rem 0; bottom: 0; } </style>`;

  const html = query.html
    ? await getLink(query.html)
    : `${style}<div><div id="image"><img src="${
        query.image ?? ""
      }" /></div><h1>${query.header ?? "Hello, world!"}</h1><p>${
        query.desc ?? "Lorem ipsum..."
      }</p><div id="logo"><img src="${query.logo ?? ""}" /></div></div>`;

  res.status(200);
  res.send(await convert(html));
};
