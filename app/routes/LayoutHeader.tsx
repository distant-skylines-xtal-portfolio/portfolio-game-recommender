import type { JSX } from 'react';
import { NavLink } from 'react-router';
import AnimatedHeader from '~/components/AnimatedHeader';
import AnimatedOutlet from '~/components/AnimatedOutlet';

export function HeaderLayout(): JSX.Element {
    return (
        <div className="app-container">
            <AnimatedHeader />
            <main>
                <AnimatedOutlet />
            </main>
        </div>
    );
}

export default HeaderLayout;
