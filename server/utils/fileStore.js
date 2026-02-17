import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '..', 'data', 'problems.json');

let writeQueue = Promise.resolve();

export async function readProblems() {
  try {
    const data = await readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function writeProblems(problems) {
  writeQueue = writeQueue.then(() =>
    writeFile(DATA_PATH, JSON.stringify(problems, null, 2), 'utf-8')
  );
  return writeQueue;
}
