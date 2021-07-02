import React from 'react';
import {ThemeProvider, theme} from "@primer/components";
import { Layout } from './layouts';
import AppRouter from './AppRouter';
import {HashRouter} from "react-router-dom";


// theme.colorSchemes.dark.colors.bg?.canvas

function App() {
	return (
		<ThemeProvider colorMode={'auto'} nightScheme={'dark'} dayScheme={'light'}>
			<HashRouter hashType={'hashbang'}>
				<Layout>
					<AppRouter />
				</Layout>
			</HashRouter>
		</ThemeProvider>
	);
}

export default App;
