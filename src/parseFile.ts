import { promises } from 'fs';

export async function parseFile(
    pathToFile: string,
): Promise<string[] | undefined> {
    try {
        const data = await promises.readFile(pathToFile, 'utf8');
        const imports = data.match(
            /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?:(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g,
        );
        const from = imports?.flatMap(currentImport =>
            currentImport.match(/(['"])([^'"\n]+)(?:['"])/g),
        ) as string[];
        // console.log('from', from)
        return (from as string[]) ?? [];
    } catch (e) {
        console.error('!!!', pathToFile, e);
    }
    return [];
}
