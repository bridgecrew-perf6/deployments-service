import fs from 'fs/promises';
import { constants as fileFlags } from 'fs';

/**
 * Reads the entirety of a file
 */
const readContent = async (filePath: string) => fs
    .readFile(filePath, { flag: fileFlags.O_CREAT | fileFlags.O_RDONLY })
    .then(buffer => buffer.toString());

/**
 * Truncates a file and writes the given content to
 */
const writeContent = async (filePath: string, content: string) => fs
    .writeFile(filePath, content, { flag: fileFlags.O_CREAT | fileFlags.O_TRUNC | fileFlags.O_WRONLY });

/**
 * Increments the value inside a file. Sets to one if no file.
 * Note: In this specific context, there is no gaurantee for multiple writers.
 *       Such scenario should be handled at a higher scope.
 */
export default (filePath: string) => async () => {
    const prevContent = await readContent(filePath);

    let value;
    try {
        value = Number.parseInt(prevContent);
    } catch {
        // Left blank intentionally
    }

    value = value || 0;
    value += 1;

    await writeContent(filePath, value.toString());
}