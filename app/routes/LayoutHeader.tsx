import type { JSX } from 'react';
import { NavLink } from 'react-router';
import AnimatedOutlet from '~/components/AnimatedOutlet';

export function HeaderLayout(): JSX.Element {
    return (
        <div className="app-container">
            <header>
                <h1>Game recommendations!</h1>
                <NavLink to="/">Home page</NavLink>
                <NavLink to="/about">About page!</NavLink>
            </header>
            <main>
                <AnimatedOutlet />
            </main>
        </div>
    );
}

export default HeaderLayout;
