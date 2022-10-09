import { NextApiRequest, NextApiResponse } from "next";
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
  font_url?: string; // url of a custom font
  font_name?: string; // name of custom font
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query as Query;

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader(
    "content-security-policy",
    "default-src 'none'; img-src * data:; style-src 'unsafe-inline'"
  );

  const style = `<style> ${
    query.font_url && query.font_name
      ? `@import url('${query.font_url}'); * { font-family: ${query.font_name} !important }`
      : ""
  } html { ${
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
  }; } h1 { font-size: 9rem; margin: 0 0 0 0; text-align: ${
    query.float == "right"
      ? "right"
      : query.float == "center"
      ? "center"
      : "left"
  }; } p { text-align: ${
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
  }; } #image > img { margin: 5rem 0 0 0; top: 0; position: absolute; } #logo > img { margin: 0 0 3rem 0; bottom: 0; position: absolute; } </style>`;

  const html = query.html
    ? await getLink(query.html)
    : `${style}<div><div id="image"><img src="${
        query.image ?? ""
      }" /></div><h1>${query.header ?? "Hello, world!"}</h1><p>${
        query.desc ?? "Lorem ipsum..."
      }</p><div id="logo"><img src="${query.logo ?? ""}" /></div></div>`;

  res.status(200);
  res.send(html);
};
