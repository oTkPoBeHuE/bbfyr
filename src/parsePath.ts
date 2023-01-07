import { dirname, resolve } from 'path';

export function parsePath(pathToFolder, pathToFile) {
    const currentFolder = dirname(pathToFolder);
    const normalizePathToFile = pathToFile.replace(/['"]+/g, '');
    const parsedPath =
        !pathToFile.includes(`./`) && !pathToFile.includes('..')
            ? normalizePathToFile
            : resolve(currentFolder, normalizePathToFile, '');
    return parsedPath;
}
