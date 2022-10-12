import { AppProps } from "next/app";
import "../styles/tailwind.css";

export default function App({ Component, pageProps }: AppProps) {
  // @ts-ignore
  return <Component {...pageProps} />;
}
