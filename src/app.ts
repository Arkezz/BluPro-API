import Koa, { Context } from "koa";
import { koaBody } from "koa-body";
import helmet from "koa-helmet";
import cors from "@koa/cors";
import compress from "koa-compress";
import etag from "koa-etag";
import conditional from "koa-conditional-get";
import favicon from "koa-favicon";
import "dotenv/config";

import router from "./routes/index.js";
import errorHandler from "./modules/errorHandler.js";
import logHandler from "./modules/logHandler.js";

const app = new Koa<{}, Context>();
const serveFavicon = favicon("./favicon.ico");

app.use(logHandler);
app.use(errorHandler);

app.use(helmet());
app.use(cors());
app.use(compress());
app.use(koaBody());
app.use(conditional());
app.use(etag());
app.use(serveFavicon);

app.use(router.routes());

export default app;
