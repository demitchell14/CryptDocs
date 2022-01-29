import React, {useEffect} from 'react';
import {ThemeProvider, theme} from "@primer/components";
import { Layout } from './layouts';
import AppRouter from './AppRouter';
import {HashRouter} from "react-router-dom";
import { ServiceWorker } from './components/ServiceWorker'

function App() {
	return (
		<ThemeProvider colorMode={window.localStorage.getItem('theme-mode') as 'day'|'night' || 'auto'} nightScheme={'dark'} dayScheme={'light'}>
			<ServiceWorker initialize />
			<HashRouter>
				<Layout>
					<AppRouter />
				</Layout>
			</HashRouter>
		</ThemeProvider>
	);
}

export default App;
