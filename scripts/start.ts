import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawn, type ChildProcess } from "node:child_process";

type LaunchOptions = {
  mapPath: string;
  bookingsPath: string;
};

const repositoryRoot = resolve(__dirname, "..");
const frontendDirectory = resolve(repositoryRoot, "jorney-frontend");
const backendDirectory = resolve(repositoryRoot, "jorney-backend");
const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function resolveInputPath(path: string, label: string): string {
  const absolutePath = resolve(repositoryRoot, path);

  if (!existsSync(absolutePath)) {
    throw new Error(`${label} file does not exist: ${absolutePath}`);
  }

  return absolutePath;
}

function parseOptions(argumentsList: string[]): LaunchOptions {
  let mapPath = "./map.ascii";
  let bookingsPath = "./bookings.json";

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];

    if (argument !== "--map" && argument !== "--bookings") {
      throw new Error(`Unknown option: ${argument}`);
    }

    const value = argumentsList[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`${argument} requires a path.`);
    }

    if (argument === "--map") {
      mapPath = value;
    } else {
      bookingsPath = value;
    }

    index += 1;
  }

  return {
    mapPath: resolveInputPath(mapPath, "Map"),
    bookingsPath: resolveInputPath(bookingsPath, "Bookings"),
  };
}

function startProcess(
  argumentsList: string[],
  cwd: string,
  environment: NodeJS.ProcessEnv,
): ChildProcess {
  return spawn(pnpmCommand, argumentsList, {
    cwd,
    env: environment,
    stdio: "inherit",
  });
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

async function waitForServer(url: string): Promise<void> {
  const timeoutAt = Date.now() + 30_000;

  while (Date.now() < timeoutAt) {
    try {
      await fetch(url);
      return;
    } catch {
      await wait(250);
    }
  }

  throw new Error(`Server did not become ready: ${url}`);
}

async function start(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  const backend = startProcess(["run", "start:dev"], backendDirectory, {
    ...process.env,
    MAP_PATH: options.mapPath,
    BOOKINGS_PATH: options.bookingsPath,
  });
  const frontend = startProcess(
    ["exec", "vite", "--host", "127.0.0.1", "--port", "5173"],
    frontendDirectory,
    process.env,
  );
  const processes = [backend, frontend];

  let isStopping = false;
  const stop = (signal: NodeJS.Signals): void => {
    if (isStopping) {
      return;
    }

    isStopping = true;
    for (const process of processes) {
      if (!process.killed) {
        process.kill(signal);
      }
    }
  };

  process.once("SIGINT", () => stop("SIGINT"));
  process.once("SIGTERM", () => stop("SIGTERM"));

  try {
    await Promise.all([
      waitForServer("http://127.0.0.1:8081"),
      waitForServer("http://127.0.0.1:5173"),
    ]);

    console.clear();
    console.log("\nApplication ready:");
    console.log("Frontend: http://127.0.0.1:5173");
    console.log("Backend:  http://127.0.0.1:8081\n");

    await Promise.race(
      processes.map(
        (process) =>
          new Promise<void>((resolvePromise, reject) => {
            process.on("error", reject);
            process.on("exit", (code) => {
              if (isStopping || code === 0) {
                resolvePromise();
                return;
              }

              reject(new Error(`A development server exited with code ${code}`));
            });
          }),
      ),
    );
  } finally {
    stop("SIGTERM");
  }
}

start().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Unable to start the application: ${message}`);
  process.exitCode = 1;
});
