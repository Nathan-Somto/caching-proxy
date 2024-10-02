import express from "express";
import { cacheMiddleware, errorHandler, proxyMiddleware } from "./middlewares";
export function startServer(port: number, origin: string) {
  const app = express();
  app.use(express.json());
  app.use(cacheMiddleware(origin));
  app.use(proxyMiddleware(origin));
  app.use(errorHandler);
  app.listen(port, () => {
    console.log(`Proxy Server is active on  http://localhost:${port}`);
  });
}
