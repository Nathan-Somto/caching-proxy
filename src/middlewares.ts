import { Cache } from "./config";
import type { Request, Response, NextFunction } from "express";
import { clearCache, viewCache } from "./utils";

export function cacheMiddleware(origin: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
    console.log("req.method: ", req.method);
     if(req.method !== 'GET') {
        res.status(405).json({
          message: "Only GET requests are allowed"
        });
        return;
     }
      const key = `${origin}${req.url}`;
      const cachedResponse = Cache.get(key);
      console.log("cachedResponse: ", cachedResponse);
      if (cachedResponse) {
        res.setHeader("X-Cache", "HIT");
        res.json({
          data: cachedResponse,
          cached: true,
          message: "Data retrieved from cache",
        });
        return;
      } else {
        res.setHeader("X-Cache", "MISS");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
export function proxyMiddleware(origin: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.url === "/is-ok") {
        res.status(200).json({ ok: true });
        return;
      }
      if (req.url === "/view-cache") {
        res.status(200).json(viewCache());
        return;
      }
      if (req.url === "/clear-cache") {
        res.status(200).json(clearCache());
        return;
      }
      const key = `${origin}${req.url}`;
      const fetchRes = await fetch(`${origin}${req.url}`);
      if (fetchRes.status === 404) {
        res.status(404).json({
          message: "Resource not found for specified URL",
          url: req.url,
        });
        return;
      }
      if (!fetchRes.ok) {
        throw new Error("Failed to fetch data");
      }
      const data: unknown = await fetchRes.json();
      Cache.set(key, data);
      res.json({
        data,
        cached: false,
        message: "Data retrieved from origin server",
      });
      return;
    } catch (err) {
      next(err);
    }
  };
}
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("[ERROR_LOG]: ", err?.message);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
}
