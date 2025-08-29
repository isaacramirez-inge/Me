import { useCallback, useEffect, memo, useRef } from "react";

interface MenuLink {
    show: boolean;
    name: string;
    path: string;
    complete_url?: string;
}

interface MenuProps {
  links: MenuLink[];
  base_path?: string;
  lang: string;
  prefetch: boolean;
}

function Menu({ links: ls, base_path, lang , prefetch}: MenuProps) {
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
            const url = `/${base_path}/${lang}/${link.path}`;
            link.complete_url = url;
            handlePrefetch(url);
        });
    }, [links, base_path, lang, handlePrefetch]);

    return (
        <>
        {links.map((link) => {
            const url = `/${base_path}/${lang}/${link.path}`;
            return (
                <a key={link.path} href={url} className="hover:scale-125 transition-transform duration-300 font-bold text-white/80 cursor-pointer" style={{ textShadow: '0 0 10px #9f7aea, 0 0 20px #9f7aea' }}>
                    {link.name}
                </a>
            );
        })}
        </>
    );
}

export default memo(Menu);