import {useEffect, useRef, useState} from "react";

type Props<T extends any = any, F extends any = any> = {
    whenTrue?: T,
    whenFalse?: F
}

function useMediaQuery(query: string) {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined')
        throw new Error('window.matchMedia is undefined');

    const mediaQueryRef = useRef(window.matchMedia(query))
    const [match, setMatch] = useState(!!mediaQueryRef.current.matches);

    useEffect(() => {
        const handler = () => setMatch(!!mediaQueryRef.current.matches);
        mediaQueryRef.current.addEventListener('change', handler);
        return () => mediaQueryRef.current.removeEventListener('change', handler)
    }, [])

    return match;
}

export type UseMediaQueryProps<T = unknown, F = unknown> = Props<T, F>;
export default useMediaQuery;
