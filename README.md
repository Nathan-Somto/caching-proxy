# Caching Proxy Server CLI 🛡️⚡

![Tests Passing](https://img.shields.io/badge/tests-passing-brightgreen) ![GitHub Stars](https://img.shields.io/github/stars/nathan-somto/caching-proxy) ![GitHub Issues](https://img.shields.io/github/issues/nathan-somto/caching-proxy)
A CLI tool that creates a caching proxy server, designed to cache responses from an origin server to improve performance and reduce load on the origin.

## ⚙️ Tech Stack

1.🐢 Bun - A fast all-in-one JavaScript runtime.
2. 🟦 Typescript - Typed JavaScript for improved development experience.
3. 🗂️ Node Cache - A simple caching solution for Node.js applications.
4. 🚀 Express - A fast, minimalist web framework for Node.js.

# 🚀 Installation
First, make sure you have Bun installed on your system. Then, follow the steps below:

- Install the dependencies:

```bash
bun install
```
- To make the CLI globally available, run:

```bash
bun run npm:global
```
- To run the tests and verify everything is working, execute:

```bash

bun test
```
## 🎯 Features
1. **Start the proxy server:** Route all requests through the caching proxy.
2. **View cache:** Inspect the cached responses for the current server instance.
3. **Clear cache:** Remove all cached responses to free up memory or force new data from the origin.
4. **Customizable Ports and Origin Options**: CLI allows for easy customization of the origin server and forwards the request as such.

## 💡 Usage
- Starting the Proxy Server
```bash
caching-proxy start --port <PORT> --origin <ORIGIN_URL>
```
This command starts a new caching proxy server on the specified port and forwards requests to the given origin server.

Example:

```bash
caching-proxy start --port 3001 --origin https://jsonplaceholder.typicode.com
```

- Viewing the Cache

```bash
caching-proxy-server view-cache --port <PORT>
```
This command calls an endpoint on the already running server to view the current cache content. The --port argument is optional, and if omitted, the server will default to port 3001.

Example:

```bash
caching-proxy-server view-cache --port 3001
```

- Clearing the Cache

```bash
caching-proxy-server clear-cache --port <PORT>
```
This command clears the cache of a running server instance. Similar to view-cache, the --port argument is optional.

Example:

```bash
caching-proxy-server clear-cache --port 3001
```

## 🛠️ How It Works
1. **Cache Middleware:** All requests are first routed through this middleware, if the data requested from the origin exists in the cache it it returned if not the request is forwarded down to the proxy middleware.

2. **View Cache and Clear Cache Implementation:** When you call the `view-cache` command, the CLI checks if the server is running on the specified port. If the server is running, it makes a request to the `/view-cache` endpoint of the server, returning all cached data in JSON format. the same thing happens for clear cache

## ⚡ Quick Command Reference
| Command               | Description                |
|-----------------------|----------------------------|
| start --port --origin | Start's the proxy server     |
| view-cache --port     | View the current cache     |
| clear-cache --port    | Clear all cached responses |

**Happy caching! 🚀**

[project URL](https://roadmap.sh/projects/caching-server)