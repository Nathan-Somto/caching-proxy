import { Command } from "commander";
import { version } from "../package.json";
const program = new Command();
import { startServer } from "./server";
import { isServerRunning } from "./utils";
const DEFAULT_PORT = 3001;
program
  .name("caching-proxy-server")
  .description("CLI that caches responses from other servers.")
  .version(version, "-v, --version", "output the current version");

program
  .command("start", {
    isDefault: true,
  })
  .description("Start's the caching proxy server")
  .requiredOption("-p, --port <number>", "Port number to run the server on")
  .requiredOption("-o, --origin <url>", "Origin server to proxy requests to")
  .action((options) => {
    console.log(
      "Starting Server with the following options: ",
      JSON.stringify(options)
    );
    startServer(options.port, options.origin);
  });
program
  .command("clear-cache")
  .option("-p, --port <number>", "Port number to clear cache for")
  .description("Clears the cache")
  .action(async (options) => {
    console.log("Clearing Cache");
    const isRunning = await isServerRunning(options.port ?? DEFAULT_PORT);
    if (isRunning) {
      const res = await fetch(`http://localhost:${options.port ?? DEFAULT_PORT}/clear-cache`);
      const  data  = await res.json();
      console.log(data);
    } else {
      console.error("Server is not running");
    }
  });
program
  .command("view-cache")
  .option("-p, --port <number>", "Port number to clear cache for")
  .description("View the cache")
  .action(async (options) => {
    console.log("Viewing Cache");
    const isRunning = await isServerRunning(options.port ?? DEFAULT_PORT);
    if (isRunning) {
      const res = await fetch(`http://localhost:${options.port ?? DEFAULT_PORT}/view-cache`);
      const data = await res.json();
      console.log(data);
    } else {
      console.error("Server is not running");
    }
  });

export function runCli() {
  program.parse(process.argv);
}
