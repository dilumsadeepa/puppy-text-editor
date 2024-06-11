import React from 'react';

const Output = ({ content }) => {
  return (
    <div id="output-container">
      <h3>HTML Output:</h3>
      <textarea id="output" value={content} readOnly />
    </div>
  );
}

export default Output;