import React from "react";
import Image from "next/image";

import Editor, { useMonaco } from "@monaco-editor/react";
import { debounce } from "lodash";

import { useClipboard } from "use-clipboard-copy";
import { NextSeo } from "next-seo";
import Head from "next/head";

export default function Home() {
  const clipboard = useClipboard({
    copiedTimeout: 2500, // timeout duration in milliseconds
  });

  const [muImage, setMu] = React.useState<string>("/api/mu");
  const [muBuffer, setBuffer] = React.useState<string>("/api/mu");

  const [checked, setChecked] = React.useState<boolean>(true);

  const handleCheck = () => {
    // checked -> non-checked
    if (checked) {
      // case for unnecessary state update
      if (muImage != "/api/mu") setMu("/api/mu");
    } else {
      // non-checked -> checked
      setMu(muBuffer);
    }

    // update checked state
    setChecked((r) => !r);
  };

  const pooled = React.useCallback(
    debounce((value) => {
      if (checked) {
        setMu(`/api/mu?html=${encodeURIComponent(value)}`);
      } else {
        setBuffer(`/api/mu?html=${encodeURIComponent(value)}`);
      }
    }, 500),
    [checked]
  );

  function handleEditorChange(value: any) {
    pooled(value);
  }

  const monaco = useMonaco();
  React.useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("IDLE", {
        base: "vs",
        inherit: false,
        rules: [
          {
            background: "FFFFFF",
            token: "",
          },
          {
            token: "delimiter",
            foreground: "999999",
          },
          {
            token: "aaa",
            foreground: "00ff00",
          },
          {
            foreground: "919191",
            token: "comment",
          },
          {
            foreground: "00a33f",
            token: "string",
          },
          {
            foreground: "3b54bf",
            token: "number",
          },
          {
            foreground: "a535ae",
            token: "constant.language",
          },
          {
            foreground: "ff5600",
            token: "keyword",
          },
          {
            foreground: "ff5600",
            token: "storage",
          },
          {
            foreground: "21439c",
            token: "entity.name.type",
          },
          {
            foreground: "21439c",
            token: "entity.name.function",
          },
          {
            foreground: "a535ae",
            token: "support.function",
          },
          {
            foreground: "a535ae",
            token: "support.constant",
          },
          {
            foreground: "a535ae",
            token: "support.type",
          },
          {
            foreground: "a535ae",
            token: "support.class",
          },
          {
            foreground: "a535ae",
            token: "support.variable",
          },
          {
            foreground: "000000",
            background: "990000",
            token: "invalid",
          },
          {
            foreground: "990000",
            token: "constant.other.placeholder.py",
          },
        ],
        colors: {
          "editor.foreground": "#000000",
          "editor.background": "#FFFFFF",
          "editor.selectionBackground": "#BAD6FD",
          "editor.lineHighlightBackground": "#00000012",
          "editorCursor.foreground": "#000000",
          "editorWhitespace.foreground": "#BFBFBF",
        },
      });
      monaco.editor.setTheme("IDLE");
    }
  }, [monaco]);

  const [header, setHeader] = React.useState<string>("");
  const [description, setDesc] = React.useState<string>("");
  const [image, setImage] = React.useState<string>("");
  const [logo, setLogo] = React.useState<string>("");
  const [float, setFloat] = React.useState<string>("");
  const [background, setBG] = React.useState<string>("");
  const [isDark, setDark] = React.useState<boolean>(false);

  function generate() {
    setMu(
      `/api/mu?dark=${isDark}${header ? `&header=${header}` : ""}${
        description ? `&desc=${description}` : ""
      }${image ? `&image=${image}` : ""}${logo ? `&logo=${logo}` : ""}${
        float ? `&float=${float}` : ""
      }${background ? `&background=${background}` : ""}`
    );
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <NextSeo
        title="mu"
        description="Easy open graph generation"
        openGraph={{
          type: "website",
          url: "https://mu.canary.mx/",
          title: "mu",
          description: "Easy open generation.",
          images: [
            {
              url: "https://mu.hop.sh/api/mu?dark=true&float=center&header=mμ&desc=easy%20open%20graph%20generation&background=https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Funblast.com%2Fwp-content%2Fuploads%2F2018%2F08%2FGradient-Mesh-11.jpg&logo=https://mu.hop.sh/mu.svg",
              width: 1224,
              height: 719,
            },
          ],
        }}
        twitter={{
          handle: "@atmattt",
          site: "@atmattt",
          cardType: "summary_large_image",
        }}
      />
      <main className="grid grid-cols-2 w-full h-screen">
        <section className="h-full">
          <Editor
            height="100%"
            theme="IDLE"
            defaultLanguage="html"
            defaultValue={`<style>\n\thtml {\n\t\tbackground-color: #fff;\n\t\tcolor: #000;\n\t}\n\tbody {\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tjustify-content: start;\n\t}\n\tdiv {\n\t\tdisplay: flex;\n\t\tflex-direction: column;\n\t\tmargin: 0 0 0 5rem;\n\t}\n\th1 {\n\t\tfont-size: 9rem;\n\t\tmargin: 0 0 0 0;\n\t}\n\tp {\n\t\tmargin: 0 0.5rem 0 0.5rem;\n\t\tfont-size: 3rem;\n\t\tcolor: rgb(75 85 99);\n\t}\n\t#image,\n\t#logo {\n\t\ttop: 0;\n\t\tleft: 0;\n\t\tposition: absolute;\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\tdisplay: flex;\n\t\talign-items: start;\n\t}\n\t#image > img {\n\t\tmargin: 5rem 0 0 0;\n\t\ttop: 0;\n\t\tposition: absolute;\n\t}\n\t#logo > img {\n\t\tmargin: 0 0 3rem 0;\n\t\tbottom: 0;\n\t\tposition: absolute;\n\t}\n</style>\n<div>\n\t<h1>Hello, world!</h1>\n\t<p>Lorem ipsum...</p>\n</div>\n`}
            onChange={handleEditorChange}
            options={{
              wordWrap: "on",
              tabSize: 2,
              minimap: {
                enabled: false,
              },
              smoothScrolling: true,
              cursorSmoothCaretAnimation: true,
              contextmenu: false,
            }}
          />
        </section>
        <section>
          <Image alt="mu image" width={1920} height={1080} src={muImage} />
          <section className="ml-2 flex flex-col space-y-2">
            <header className="flex justify-between mr-8">
              <h3>
                HTML:{" "}
                <input
                  checked={checked}
                  onChange={handleCheck}
                  type="checkbox"
                />
              </h3>
              <button
                onClick={() => clipboard.copy(`https://mu.canary.mx${muImage}`)}
                className="w-20 rounded-md py-1 transition-colors duration-500 hover:bg-white hover:text-black border border-white hover:border-black bg-black text-white"
              >
                {clipboard.copied ? "Copied!" : "Copy"}
              </button>
            </header>
            <hr />
            <p className="font-bold text-center border border-black rounded w-2/12">
              Options
            </p>
            <div className="flex flex-col space-y-1">
              <p>
                Header:{" "}
                <input
                  onChange={(event) =>
                    setHeader(encodeURIComponent(event.target.value))
                  }
                />
              </p>
              <p>
                Description:{" "}
                <input
                  onChange={(event) =>
                    setDesc(encodeURIComponent(event.target.value))
                  }
                />
              </p>
              <p>
                Image:{" "}
                <input
                  onChange={(event) =>
                    setImage(encodeURIComponent(event.target.value))
                  }
                />
              </p>
              <p>
                Logo:{" "}
                <input
                  onChange={(event) =>
                    setLogo(encodeURIComponent(event.target.value))
                  }
                />
              </p>
              <p>
                Float:{" "}
                <select
                  onChange={(selected) =>
                    setFloat(encodeURIComponent(selected.target.value))
                  }
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </p>
              <p>
                Background Image:{" "}
                <input
                  onChange={(event) =>
                    setBG(encodeURIComponent(event.target.value))
                  }
                />
              </p>
              <p>
                Dark:{" "}
                <input
                  onChange={(checked) => setDark(checked.target.checked)}
                  type="checkbox"
                />
              </p>
              <button
                onClick={() => generate()}
                disabled={checked}
                className={`
                ${
                  checked ? "cursor-not-allowed" : ""
                } self-end mr-3 w-28 rounded-md py-1 transition-colors duration-500 hover:bg-white hover:text-black border border-white hover:border-black bg-black text-white
              `}
              >
                Generate &rarr;
              </button>
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
