import React, { useState } from 'react';

const CurrencyConfig = ({ onConfigSubmit }) => {
  const [config, setConfig] = useState([
    { from: 'RUB', to: 'EUR', rate: 0.012, fee: 1 },
    { from: 'EUR', to: 'USD', rate: 1.1, fee: 0.5 },
    { from: 'USD', to: 'GBP', rate: 0.8, fee: 1 },
  ]);

  const handleChange = (index, field, value) => {
    const newConfig = [...config];
    newConfig[index][field] = field === 'rate' || field === 'fee' ? parseFloat(value) : value;
    setConfig(newConfig);
  };

  const handleSubmit = () => {
    onConfigSubmit(config);
  };

  return (
    <div>
      <h2>Currency Configuration</h2>
      {config.map((pair, index) => (
        <div key={index}>
          <input
            type="text"
            value={pair.from}
            onChange={(e) => handleChange(index, 'from', e.target.value)}
            placeholder="From Currency"
          />
          →
          <input
            type="text"
            value={pair.to}
            onChange={(e) => handleChange(index, 'to', e.target.value)}
            placeholder="To Currency"
          />
          Rate:
          <input
            type="number"
            value={pair.rate}
            onChange={(e) => handleChange(index, 'rate', e.target.value)}
            step="0.01"
          />
          Fee (%):
          <input
            type="number"
            value={pair.fee}
            onChange={(e) => handleChange(index, 'fee', e.target.value)}
            step="0.1"
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Save Configuration</button>
    </div>
  );
};

export default CurrencyConfig;