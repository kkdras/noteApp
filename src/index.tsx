import { createRoot } from 'react-dom/client'
import React from 'react'
import { Provider } from 'react-redux';
import { store } from './app/redux-store';
import { App } from './components/App';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import "./styles/main.scss"
const container = document.getElementById('root') as HTMLElement
const root = createRoot(container);


// Accepted compromise on the use of HashRouter - this is bad, but you can run the file from the hard disk
root.render(
	<HashRouter>
		<Provider store={store}>
			<App />
		</Provider>
	</HashRouter>
);