import { HelmetProvider } from "react-helmet-async";
import "../styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <HelmetProvider>
      <Component {...pageProps} />
    </HelmetProvider>
  );
}

export default App;
