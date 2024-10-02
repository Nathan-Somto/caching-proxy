import {describe, expect, it, beforeEach, afterEach, jest} from 'bun:test';
import { spawn, fetch as bunFetch } from 'bun';
jest.setTimeout(10000);
async function startProxyServer(port: number, origin: string){
    return spawn({
        cmd: ["caching-proxy", "--port", port.toString(), "--origin", origin],
    })
}
async function executeCommand(command: string, port: number){
    return spawn({
        cmd: ["caching-proxy", command, "--port", port.toString()],
    })
}
type Proxy = Awaited<ReturnType<typeof startProxyServer>>;
async function stopProxyServer(proxyServer: Proxy){
    return proxyServer.kill();
}
describe('Caching Proxy Server', () => {
    let proxyServer: Proxy | undefined;
    const port = 3001;
    const originUrl = "https://jsonplaceholder.typicode.com";
    beforeEach(async () => {
        proxyServer =  await startProxyServer(port, originUrl);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for server to start
    });
    afterEach(async () => {
        if (proxyServer){
            await stopProxyServer(proxyServer);

        }
        proxyServer = undefined; 
        await new Promise((resolve) => setTimeout(resolve, 1000));      
    });
    it('should cache responses', async () => {
        const firstResponse = await bunFetch(`http://localhost:${port}/todos/1`);
        const firstResponseData = await firstResponse.json();
        const firstResponseHeaders = firstResponse.headers;
        expect(firstResponseHeaders.get('X-Cache')).toBe('MISS');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const secondResponse = await bunFetch(`http://localhost:${port}/todos/1`);
        const secondResponseData = await secondResponse.json();
        const secondResponseHeaders = secondResponse.headers;
        expect(secondResponseHeaders.get('X-Cache')).toBe('HIT');
        expect(firstResponseData.data).toEqual(secondResponseData.data);
    });
    it('should return 404 for non-existent resources', async () => {
        const response = await bunFetch(`http://localhost:${port}/todos/efg`);
        const data = await response.json();
        expect(response.status).toBe(404);
        expect(data.message).toBe("Resource not found for specified URL");
        expect(data.url).toBe("/todos/efg")
    });
    it('should return 405 for non GET methods', async () => {
        const response = await bunFetch(`http://localhost:${port}/todos/1`, {
            method: "POST",
        });
        const data = await response.json();
        expect(response.status).toBe(405);
        // just check the message prop for now
        expect(data.message).toBe("Only GET requests are allowed");
    });
    it('should clear the cache', async () => {
       await bunFetch(`http://localhost:${port}/todos/1`);
       await bunFetch(`http://localhost:${port}/todos/2`);
        const result = await executeCommand("clear-cache", port);
        const output = await  new Response(result.stdout).text();
        expect(output).toBe("Clearing Cache\nCache Cleared\n");
    });
    it('should view the cache', async () => {
        await bunFetch(`http://localhost:${port}/todos/1`);
        await bunFetch(`http://localhost:${port}/todos/2`);
        await bunFetch(`http://localhost:${port}/todos/3`);
        const result = await executeCommand("view-cache", port);
        const output = await  new Response(result.stdout).text();
        const outputArr = output.split('\n');
        const data = JSON.parse(outputArr.slice(1).join('\n'));
        expect(outputArr[0]).toBe("Viewing Cache");
        expect(data.length).toBe(3);
    });
})