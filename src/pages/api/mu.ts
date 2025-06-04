import { NextApiRequest, NextApiResponse } from "next";
import { convert } from "../../lib/ppt";
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

  res.setHeader("Content-Type", "image/svg");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader(
    "content-security-policy",
    "default-src 'none'; img-src * data:; font-src * https:; style-src 'unsafe-inline'",
  );

  // Custom font handling for JSX approach
  const customFontStyle = query.font_url && query.font_name
    ? `@import url('${query.font_url}'); * { font-family: ${query.font_name} !important }`
    : "";

  const html = query.html ? await getLink(query.html) : `<div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '${query.dark === "true" ? "#000" : "#fff"}',
        width: '100%',
        height: '100%',
        alignItems: '${
    query.float === "right"
      ? "flex-end"
      : query.float === "left"
      ? "flex-start"
      : "center"
  }',
        justifyContent: 'center',
        margin: '${
    query.float === "right"
      ? "0 5rem 0 0"
      : query.float === "left"
      ? "0 0 0 5rem"
      : "0"
  }'
      }}>
        ${
    query.image
      ? `<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: '${
        query.float === "right"
          ? "flex-end"
          : query.float === "left"
          ? "flex-start"
          : "center"
      }' }}>
          <img src="${query.image}" style={{ margin: '5rem 0 0 0', position: 'absolute', top: 0 }} />
        </div>`
      : ""
  }
        <h1 style={{ 
          fontSize: '9rem', 
          margin: '0', 
          textAlign: '${
    query.float === "right"
      ? "right"
      : query.float === "left"
      ? "left"
      : "center"
  }',
          color: '${query.dark === "true" ? "#fff" : "#000"}'
        }}>${query.header ?? "Hello, world!"}</h1>
        <p style={{ 
          textAlign: '${
    query.float === "right"
      ? "right"
      : query.float === "left"
      ? "left"
      : "center"
  }', 
          margin: '0 0.5rem', 
          fontSize: '3rem', 
          color: '${
    query.dark === "true" ? "rgb(156, 163, 175)" : "rgb(75, 85, 99)"
  }'
        }}>${query.desc ?? "Lorem ipsum..."}</p>
        ${
    query.logo
      ? `<div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: '${
        query.float === "right"
          ? "flex-end"
          : query.float === "left"
          ? "flex-start"
          : "center"
      }' }}>
          <img src="${query.logo}" style={{ margin: '0 0 3rem 0' }} />
        </div>`
      : ""
  }
      </div>`;

  await res.send(await convert(html));
  res.status(200);
};
