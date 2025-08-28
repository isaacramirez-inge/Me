import * as fs from 'fs/promises';
import path from 'path';

export type DataName = 'timeline' | 'technologies' | 'profile' | 'charts';

export const buyData = async (what: DataName, lang: string) => {
    const rpath = `${lang}/${what}.json`;
    
    // Construct an absolute path
    const filePath = path.join(process.cwd(), 'src/assets/data', rpath);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error loading data:", error);
        return null;
    }
}