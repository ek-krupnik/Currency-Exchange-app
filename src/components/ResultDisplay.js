import React from 'react';

const ResultDisplay = ({ chains, calculateResult }) => {
  return (
    <div>
      <h2>Results</h2>
      {chains.map((chain, index) => {
        const result = calculateResult(chain);
        const lastCurrency =
          chain.blocks.length > 0
            ? chain.blocks[chain.blocks.length - 1].currency // Last block's currency
            : chain.startCurrency; // Starting currency if no blocks

        return (
          <div key={index}>
            <p>
                {result}
              {/* Result amount of chain {index + 1}: {result || 'Insufficient currency configuration data'}
              {lastCurrency && <span> ({lastCurrency})</span>} */}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ResultDisplay;