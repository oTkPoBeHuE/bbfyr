import {appendFileSync, writeFileSync} from "fs";

export function write(str: string){
    writeFileSync("data.gml",  str, "utf-8");
}

export function append(str: string){
    appendFileSync('data.gml', str)
}
