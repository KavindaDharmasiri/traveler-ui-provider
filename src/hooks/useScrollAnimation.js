import React, { useEffect, useRef } from 'react';

// This custom hook handles the Intersection Observer logic for scroll animations.
export const useScrollAnimation = (ref, isRoot = false) => {
    // We use a local state only to ensure the component using the hook re-renders
    // if the ref target changes (though usually it doesn't).
    const isObserving = useRef(false);

    useEffect(() => {
        const currentRef = ref.current;

        if (!currentRef || isObserving.current) {
            return;
        }

        const observerOptions = {
            root: null, // Use the viewport
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // If it's the root element, observe its children.
        if (isRoot) {
            // Find all elements with the 'animate-on-scroll' class inside the root.
            const elementsToObserve = currentRef.querySelectorAll('.animate-on-scroll');
            elementsToObserve.forEach(el => observer.observe(el));
        } else {
            // Otherwise, observe the element itself.
            observer.observe(currentRef);
        }

        isObserving.current = true;

        return () => {
            if (isObserving.current) {
                observer.disconnect();
                isObserving.current = false;
            }
        };
    }, [ref, isRoot]);
};

// Note: No default export for hooks