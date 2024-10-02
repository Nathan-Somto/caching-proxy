import { Cache } from "./config";
export const isServerRunning = async (port: number) => {
   return (await fetch(`http://localhost:${port}/is-ok`)).ok;
}
export function viewCache() {
    const keys = Cache.keys();
    const data = keys.map(key => {
        return {
            key,
            data: Cache.get(key),
            ttl: Cache.getTtl(key)
        }
    });
    return JSON.stringify(data, null, 2);
}
export function clearCache() {
    // check if cache is empty
    if (Cache.keys().length === 0) {
        return "Cache is already empty";
    }
    Cache.flushAll();
    return "Cache Cleared";
}