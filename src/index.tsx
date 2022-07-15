import { createRoot } from 'react-dom/client'
import React from 'react'
import { Provider } from 'react-redux';
import { store } from './app/redux-store';
import { App } from './components/App';

const container = document.getElementById('root')
const root = createRoot(container); // createRoot(container!) if you use TypeScript



root.render(
	<Provider store={store}>
		<App />
	</Provider>
);