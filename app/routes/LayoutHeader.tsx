import { Outlet } from "react-router";
import type {JSX} from 'react'

export function HeaderLayout():JSX.Element {
    return (
        <div className="app-container">
            <header>
                <h1>Game recommendations!</h1>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default HeaderLayout;