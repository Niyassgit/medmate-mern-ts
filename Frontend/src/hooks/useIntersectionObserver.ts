import { useEffect, useState } from "react";

interface UseIntersectionObserverProps {
    threshold?: number;
    root?: Element | null;
    rootMargin?: string;
}

export const useIntersectionObserver = ({
    threshold = 0,
    root = null,
    rootMargin = "0%",
}: UseIntersectionObserverProps = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [ref, setRef] = useState<Element | null>(null);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            {
                threshold,
                root,
                rootMargin,
            }
        );

        observer.observe(ref);

        return () => {
            observer.unobserve(ref);
        };
    }, [ref, threshold, root, rootMargin]);

    return { ref: setRef, isIntersecting };
};
