
export type DataName = 'timeline' | 'technologies' | 'profile' | 'charts';

const search = async (path: string) => {return (await import(path)).default;};
export const buyData = async (what: DataName, lang: string) => {
    const rpath = `${lang}/${what}.json`;
    const path = `../../../src/assets/data/${rpath}`;
    return await search(path);
}
