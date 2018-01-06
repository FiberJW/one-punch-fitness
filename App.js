import Sentry from "sentry-expo";
import App from "./src/index.bs";

Sentry.config(
  "https://20b4ae39f24049e796732bacf3283728:48fb051e0cc24e98bc0ccfe68d75e514@sentry.io/264077"
).install();

export default App;
