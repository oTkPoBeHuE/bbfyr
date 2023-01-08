import { append, write } from '@/saveData.js';

export function addPrelude() {
    write('graph\n' + '[\n');
}
export function addFinal() {
    append(']\n');
}

export type Metadata = {
    key: string;
    value: string;
};
export function addNode(metadata: Metadata[]) {
    append('\tnode\n');
    append('\t[\n');
    metadata.forEach(data => {
        append(`\t\t${data.key} "${data.value}"\n`);
    });
    append('\t]\n');
}

export function addEdge(metadata: Metadata[]) {
    append('\tedge\n');
    append('\t[\n');
    metadata.forEach(data => {
        append(`\t\t${data.key} "${data.value}"\n`);
    });
    append('\t]\n');
}
