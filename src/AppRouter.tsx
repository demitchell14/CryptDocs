import React from 'react';
// import {createBrowserHistory} from "history";
import {BrowserRouter, HashRouter, Route} from "react-router-dom";

const HomePage = React.lazy(() => import('./pages/Home'));
const WritePage = React.lazy(() => import('./pages/Write'));

type Props = any;

// const browserHistory = createBrowserHistory();

function AppRouter(props: Props) {
    return (
        <React.Suspense fallback={'loading'}>
            <Route path={'/home'} render={(props) => (
                <HomePage {...props} />
            )} />

            <Route path={'/write'} render={(props) => (
                <WritePage {...props} />
            )} />
        </React.Suspense>
    );
}

export type AppRouterProps = Props;
export default AppRouter;