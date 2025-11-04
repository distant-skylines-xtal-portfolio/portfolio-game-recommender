import { motion } from 'framer-motion';

export function meta() {
    return [
        { title: 'About' },
        {
            name: 'description',
            content: 'About page',
        },
    ];
}

export default function About() {
    return (
        <motion.div
            className="home-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <p>About page!</p>
        </motion.div>
    );
}
