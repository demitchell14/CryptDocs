import React from 'react';
import {Route, Navigate, Routes, useLocation} from "react-router-dom";

const HomePage = React.lazy(() => import('./pages/Home'));
const WritePage = React.lazy(() => import('./pages/Write'));
const ExplorerPage = React.lazy(() => import('./pages/Explorer'));

function AppRouter() {
    const location = useLocation();

    return (
        <React.Suspense fallback={'loading'}>
           <Routes location={location}>
               <Route
                   path={'/home'}
                   element={<HomePage />}
               />

               <Route
                   path={'/explore'}
                   element={<ExplorerPage />}
               />

               <Route
                   path={'/write'}
               >
                   <Route
                       index
                       element={<WritePage />}
                   />
                   <Route
                       path={':id'}
                       element={<WritePage />}
                   />
               </Route>

               <Route
                   index
                   element={<Navigate to={'/explore'} />}
               />

           </Routes>
        </React.Suspense>
    );
}

export default AppRouter;
