import {
    type RouteConfig,
    index,
    layout,
    route,
} from '@react-router/dev/routes';

export default [
    layout('routes/LayoutHeader.tsx', [
        index('routes/home.tsx', {id: 'home-default'}),
        route('/search/*', 'routes/home.tsx', {id: 'home-search'}),
        route('/about', 'routes/about.tsx'),
        route('/detail/:id', 'routes/gameDetail.tsx')
        
    ]),
] satisfies RouteConfig;
