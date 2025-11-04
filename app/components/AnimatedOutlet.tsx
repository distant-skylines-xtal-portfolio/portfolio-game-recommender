import { AnimatePresence } from 'framer-motion';
import { useLocation, useOutlet } from 'react-router';
import { cloneElement } from 'react';

export default function AnimatedOutlet() {
    const location = useLocation();
    const element = useOutlet();

    return (
        <AnimatePresence mode="wait" initial={true}>
            {element && cloneElement(element, { key: location.pathname })}
        </AnimatePresence>
    );
}
