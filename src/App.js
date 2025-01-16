import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CurrencyConfig from './components/CurrencyConfig';
import ChainBuilder from './components/ChainBuilder';
import ResultDisplay from './components/ResultDisplay';

const App = () => {
  const [config, setConfig] = useState([
    { from: 'RUB', to: 'EUR', rate: 0.012, fee: 1 },
    { from: 'EUR', to: 'USD', rate: 1.1, fee: 0.5 },
    { from: 'USD', to: 'GBP', rate: 0.8, fee: 1 },
  ]);
  const [chains, setChains] = useState([]);

  const addChain = () => {
    setChains([
      ...chains,
      { startAmount: 10000, blocks: [{ currency: 'EUR' }] },
    ]);
  };

  const calculateResult = (chain) => {
    let amount = chain.startAmount;
    let previousCurrency = chain.startCurrency; // Use user-specified starting currency
  
    for (const block of chain.blocks) {
      const pair = config.find(
        (c) => c.from === previousCurrency && c.to === block.currency
      );
      if (pair) {
        amount = amount * pair.rate * (1 - pair.fee / 100);
        previousCurrency = block.currency;
      } else {
        return null; // Invalid chain
      }
    }
  
    return amount.toFixed(2);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h1>Currency Exchange Strategy Builder</h1>
        <CurrencyConfig onConfigSubmit={setConfig} />
        <div style={{ display: 'flex', gap: '20px' }}>
          {chains.map((chain, index) => (
            <ChainBuilder
              key={index}
              chain={chain}
              config={config}
              onChange={(updatedChain) => {
                const newChains = [...chains];
                newChains[index] = updatedChain;
                setChains(newChains);
              }}
            />
          ))}
        </div>
        <button onClick={addChain}>Add New Chain</button>
        <ResultDisplay chains={chains} calculateResult={calculateResult} />
      </div>
    </DndProvider>
  );
};

export default App;