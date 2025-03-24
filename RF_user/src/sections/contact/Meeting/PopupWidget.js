import React from 'react';
import { PopupWidget } from 'react-calendly';

const App = () => {
  return (
    <div className="App">
      <PopupWidget
        url="https://calendly.com/legend-dev-go"
        /*
         * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
         * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
         */
        rootElement={document.getElementById('root')}
        text="Click here to schedule!"
        textColor="#ffffff"
        color="#00a2ff"
      />
    </div>
  );
};

export default App;
