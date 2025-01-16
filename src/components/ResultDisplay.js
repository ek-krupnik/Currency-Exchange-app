import React from 'react';

const ResultDisplay = ({ chains, calculateResult }) => {
  return (
    <div>
      <h2>Results</h2>
      {chains.map((chain, index) => (
        <div key={index}>
          Chain {index + 1}: {calculateResult(chain) || 'Insufficient currency configuration data'}
        </div>
      ))}
    </div>
  );
};

export default ResultDisplay;