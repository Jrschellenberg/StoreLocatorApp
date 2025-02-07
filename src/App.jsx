import React from 'react';
import './App.scss';

const App = ({filteredLocations}) => (
  <div>

      <h1>Hello world</h1>

    {filteredLocations.map(m => <h2 key={m.name}>{m.name}</h2>)}
  </div>
);
export default App;
