import React from 'react';
import { InlineWidget } from 'react-calendly';

export default function Calendar() {
  return (
    <div className="App">
      <InlineWidget url="https://calendly.com/legend-dev-go/30min?back=1&month=2023-07" />
    </div>
  );
}
