import { existsSync, promises as fs } from 'fs';
import { resolve, dirname } from 'path';
import debug from 'debug';
export const log = debug('1db');
export async function readJsonFile(path, defaultContent) {
    log(`readJsonFile ${path}`);
    path = resolve(path);
    if (!existsSync(path)) {
        return defaultContent;
    }
    let fileContent;
    try {
        fileContent = await fs.readFile(path, { encoding: 'utf-8' });
    }
    catch (err) {
        throw new Error('read_file_error');
    }
    log(`readJsonFile: ${fileContent.length} characters loaded`);
    try {
        return JSON.parse(fileContent);
    }
    catch (err) {
        throw new Error('invalid_json');
    }
}
export async function writeJsonFile(path, data) {
    log(`writeJsonFile ${path}`);
    path = resolve(path);
    if (!existsSync(path)) {
        await fs.mkdir(dirname(path), { recursive: true });
    }
    const json = JSON.stringify(data, undefined, 2);
    try {
        await fs.writeFile(path, json, { encoding: 'utf-8' });
    }
    catch (err) {
        throw new Error('write_file_error');
    }
    log(`writeJsonFile: ${json.length} characters saved`);
}
export function utcTimestamp() {
    const now = new Date();
    return now.getTime() + now.getTimezoneOffset() * 60000;
}
