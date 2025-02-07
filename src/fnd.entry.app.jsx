import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


const FND = (window.FND = window.FND || {});
FND.BUILDS = FND.BUILDS || {};
FND.BUILDS.InitializeStoreLocator = (props) => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(

    <React.StrictMode>
      <App {...props} />
    </React.StrictMode>
  );
}
