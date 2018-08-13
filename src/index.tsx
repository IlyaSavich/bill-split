import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from 'src/App';
import 'src/index.css';
import registerServiceWorker from 'src/registerServiceWorker';

ReactDOM.render(
    <App/>,
    document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
