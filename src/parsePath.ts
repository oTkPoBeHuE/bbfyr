import {dirname, resolve, extname} from "path";

export function parsePath(pathToFolder, pathToFile){
    const currentFolder = dirname(pathToFolder);
    const normalizePathToFile = pathToFile.replace(/['"]+/g, '');
    let parsedPath =  !pathToFile.includes(`./`) && !pathToFile.includes('..') ? normalizePathToFile :  resolve(currentFolder, normalizePathToFile, '');
    return parsedPath;
}
