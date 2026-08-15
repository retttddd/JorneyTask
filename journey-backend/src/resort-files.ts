import { accessSync, constants, statSync } from 'node:fs';
import { resolve } from 'node:path';

export interface ResortFiles {
  mapPath: string;
  bookingsPath: string;
}

const repositoryRoot = resolve(__dirname, '../..');

function parseRuntimePaths(argumentsList: string[]): ResortFiles {
  const runtimeArguments =
    argumentsList[0] === '--' ? argumentsList.slice(1) : argumentsList;
  const values = new Map<string, string>();

  for (let index = 0; index < runtimeArguments.length; index += 1) {
    const option = runtimeArguments[index];
    const value = runtimeArguments[index + 1];

    if (option !== '--map' && option !== '--bookings') {
      throw new Error(`Unknown option: ${option}`);
    }

    if (!value || value.startsWith('--')) {
      throw new Error(`${option} requires a path.`);
    }

    values.set(option, resolve(repositoryRoot, value));
    index += 1;
  }

  const mapPath = values.get('--map');
  const bookingsPath = values.get('--bookings');

  if (!mapPath || !bookingsPath) {
    throw new Error('Both --map <path> and --bookings <path> are required.');
  }

  return { mapPath, bookingsPath };
}

export function resolveResortFiles(argumentsList = process.argv.slice(2)): ResortFiles {
  const { mapPath, bookingsPath } = parseRuntimePaths(argumentsList);

  for (const [name, path] of Object.entries({ mapPath, bookingsPath })) {
    try {
      accessSync(path, constants.R_OK);
      if (!statSync(path).isFile()) {
        throw new Error('Not a file');
      }
    } catch {
      throw new Error(`Configured ${name} must be a readable file: ${path}`);
    }
  }

  return { mapPath, bookingsPath };
}
