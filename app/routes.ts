import {
    type RouteConfig,
    index,
    layout,
    route,
} from '@react-router/dev/routes';

export default [
    layout('routes/LayoutHeader.tsx', [
        index('routes/home.tsx'),
        route('/about', 'routes/about.tsx'),
    ]),
] satisfies RouteConfig;
