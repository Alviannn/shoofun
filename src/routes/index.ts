import { Router } from 'express';

type CommonRoute = {
    /** the current routing version
     * starts at 1 */
    version: number,
    /** the endpoint path
     * don't start with '/' */
    path: string,
    /** the router object for this certain endpoint */
    router: Router
};

// All of the routes you've created within the 'routes' folder
// must be inserted here to register them
// and bind it to your server
const allRoutes: CommonRoute[] = [
    {
        version: 1,
        path: '',
        router: null
    }
];

// Inserts all routes to the current router
//
// We're making the routing management easier for you
// and this won't require you to import any routes manually
//
// To use this, you can add `import routes from './routes'` in `app.ts`
// once that's done you can bind the `routes` to all route (or the '/').
const router = Router();
for (const route of allRoutes) {
    // will create something like `/v1/add-todo`
    router.use(`/v${route.version}/${route.path}`, route.router);
}

export default router;