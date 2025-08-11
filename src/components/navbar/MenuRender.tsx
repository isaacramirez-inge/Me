import { useCallback, useEffect, memo, useRef } from "react";

interface MenuLink {
    show: boolean;
    name: string;
    path: string;
}

interface MenuProps {
  links: MenuLink[];
  base?: string;
  lang: string;
  prefetch: boolean;
}

function Menu({ links: ls, base = "", lang , prefetch}: MenuProps) {
    const links = ls.filter((link) => link.show);
    const prefetchedUrls = useRef(new Set<string>());

    const handlePrefetch = useCallback((url: string) => {
        if (!prefetchedUrls.current.has(url)) {
        const linkPrefetch = document.createElement("link");
        linkPrefetch.rel = "prefetch";
        linkPrefetch.href = url;
        document.head.appendChild(linkPrefetch);
        prefetchedUrls.current.add(url);
        }
    }, []);

    useEffect(() => {
        if (!prefetch) return;

        links.forEach((link) => {
            const url = `${link.path}`;
            handlePrefetch(url);
        });
    }, [links, base, lang, handlePrefetch]);

    return (
        <>
        {links.map((link) => {
            const url = `${link.path}`;
            return (
            <a key={link.path} href={url} className="menu cursor-pointer">
                {link.name}
            </a>
            );
        })}
        </>
    );
}

export default memo(Menu);