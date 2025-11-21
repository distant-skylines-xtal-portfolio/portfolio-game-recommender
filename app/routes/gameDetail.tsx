import { motion } from 'framer-motion';
import GameDetail from '~/components/GameDetailCard';

export function meta() {
    return [
        { title: 'Game Detail' },
        {
            name: 'Game Details',
            content: 'Details for selected game',
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
            <GameDetail/>
        </motion.div>
    );
}
