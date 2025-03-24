import React from 'react';
import { PopupButton } from 'react-calendly';

export default function Calendar() {
  return (
    <div className="App">
      <PopupButton
        url="https://calendly.com/legend-dev-go"
        /*
         * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal. As a result, you'll need to
         * specify the rootElement property to ensure that the modal is inserted into the correct domNode.
         */
        rootElement={document.getElementById('root')}
        text="Click here to schedule!"
      />
    </div>
  );
}
