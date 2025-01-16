import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CurrencyConfig from './components/CurrencyConfig';
import ChainBuilder from './components/ChainBuilder';
import ResultDisplay from './components/ResultDisplay';

const App = () => {
  const [config, setConfig] = useState([
    { from: 'EUR', to: 'RUB', rate: 105, fee: 1 },
    { from: 'RUB', to: 'USD', rate: 0.01, fee: 0.5 },
    { from: 'USD', to: 'GBP', rate: 0.82, fee: 1.5 },
  ]);
  const [chains, setChains] = useState([]);

  const addChain = () => {
    setChains([
      ...chains,
      { startAmount: 1000, startCurrency: 'RUB', blocks: [] },
    ]);
  };

  const deleteChain = (index) => {
    const updatedChains = chains.filter((_, i) => i !== index);
    setChains(updatedChains);
  };

  const calculateResult = (chain) => {
    let amount = chain.startAmount;
    let previousCurrency = chain.startCurrency;
  
    for (const block of chain.blocks) {
      const pair = config.find(
        (c) => c.from === previousCurrency && c.to === block.currency
      );
      if (pair) {
        amount = amount * pair.rate * (1 - pair.fee / 100);
        previousCurrency = block.currency;
      } else {
        // Return an error message if the pair doesn't exist
        return `Invalid chain: No conversion from ${previousCurrency} to ${block.currency}`;
      }
    }
  
    // If all conversions are valid, return the result string with the last currency
    return `Result amount: ${amount.toFixed(2)} ${previousCurrency}`;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1 style={{ textAlign: 'center' }}>Currency Exchange Strategy Builder</h1>
        <CurrencyConfig config={config} setConfig={setConfig} />
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {chains.map((chain, index) => (
            <div
              key={index}
              style={{
                border: '1px solid black',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '20px',
              }}
            >
              <ChainBuilder
                chain={chain}
                config={config}
                onChange={(updatedChain) => {
                  const newChains = [...chains];
                  newChains[index] = updatedChain;
                  setChains(newChains);
                }}
              />
              <button
                onClick={() => deleteChain(index)}
                style={{
                  backgroundColor: '#ff2c2c',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  marginBottom: '10px',
                  marginLeft: '10px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                Delete Chain
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addChain}
          style={{
            marginTop: '20px',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Create new exchange chain
        </button>
        <ResultDisplay chains={chains} calculateResult={calculateResult} />
      </div>
    </DndProvider>
  );
};

export default App;