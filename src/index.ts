import glob from "glob";

import { parseFile } from "./parseFile.js";
import { parsePath } from "./parsePath.js";
import { addEdge, addFinal, addNode, addPrelude } from "./saveGraph.js";

const IGNORE = ['**/node_modules/**/*.*', '**/lib/**/*.*', '**/_stories/**/*.*'];
const PATTERNS = '**/*(*.ts|*.tsx)';

function normalize(str, pathToFolder){
    return str.replace(process.env.PATH_TO_FOLDER, '')
}

async function promiseAllInBatches<T>(tasks: (() => Promise<T>)[], batchSize: number) {
    let results = [];
    for(let position = 0;  position < tasks.length; position += batchSize){
        const tasksForBatch = tasks.slice(position, position + batchSize);
        results = [...results, ...await Promise.all(tasksForBatch.map(task => task()))];
    }
    return results;
}
async function parse(pathToFolder){
    console.log("Парсинг", pathToFolder);
    await glob(PATTERNS, { cwd: pathToFolder, ignore: IGNORE},
        async (err, files) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('files', files)

        const pathToFileList = files.map(pathToFile => pathToFile.split('/'))
        const promises = pathToFileList.map((pathToFile) => async () => {
            return await Promise.all(pathToFile.flatMap(async (folderOrFile, index) => {
                const path = pathToFile.join('/');
                const absolutePath = pathToFolder + path;
                const isFile = pathToFile.length -1 === index;
                if(!isFile){
                    return [[pathToFile.slice(0, pathToFile.length-1).join('/'), path]];
                }
                const imports = await parseFile(absolutePath);
                if(!path || path.length === 0){
                    return []
                }
                if(path){
                    return imports.map(value => {
                        const v = [absolutePath, parsePath(absolutePath, value)];
                        // console.log(v);
                        return v;
                    })
                }
            }))
        });
        const result = await promiseAllInBatches(promises, 1000);
        const map = new Map<string, string[]>();

        result.flat().flat().filter(Boolean).forEach(([key, value] )=> {
            if(!map.get(key)){
                map.set(key, [])
            }
            map.set(key, [...map.get(key), value])
        });
            // console.log('map', map)
            // console.log('result', result.flat().flat().filter(Boolean).filter(arr => arr.some(value => value.match('administration'))))
        addPrelude()
            // Array.from(map).map(ke).
            const nodes = new Set([...map.keys()].map(value => normalize(value, pathToFolder)))
            nodes.forEach(value => addNode([
                {
                    key: 'id',
                    value: value
                },
                {
                    key: 'label',
                    value: value
                }
            ]))
            Array.from(map).forEach(([key, value]) => {
                value.forEach(dist => {
                    addEdge([
                        {
                            key: 'source',
                            value: normalize(key, pathToFolder)
                        },

                        {
                            key: 'target',
                            value:  normalize(dist, pathToFolder)
                        }
                        ]
                    )
                })
            })
            addFinal();
    });
}



async function main() {
    console.time("Время выполнения:");
    // Путь до папки с проектом обязательно должен заканчиваться косой чертой.
    await parse('/Users/ivan/Documents/code/myProject/src/frontend/')
    console.timeEnd("Время выполнения:")
    return 0;
}

setTimeout(main, 2000)
