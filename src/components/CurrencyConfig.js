import React, { useState } from 'react';

const CurrencyConfig = ({ onConfigSubmit }) => {
  const [config, setConfig] = useState([
    { from: 'RUB', to: 'EUR', rate: 0.012, fee: 1 },
    { from: 'EUR', to: 'USD', rate: 1.1, fee: 0.5 },
    { from: 'USD', to: 'GBP', rate: 0.8, fee: 1 },
  ]);
  const [newConfig, setNewConfig] = useState({ from: '', to: '', rate: '', fee: '' });

  const handleNewConfigChange = (field, value) => {
    setNewConfig({ ...newConfig, [field]: value });
  };

  const addNewConfig = () => {
    if (newConfig.from && newConfig.to && newConfig.rate && newConfig.fee) {
      const updatedConfig = [
        ...config,
        { ...newConfig, rate: parseFloat(newConfig.rate), fee: parseFloat(newConfig.fee) },
      ];
      setConfig(updatedConfig);
      onConfigSubmit(updatedConfig);
      setNewConfig({ from: '', to: '', rate: '', fee: '' });
    } else {
      alert('Please fill out all fields before adding.');
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Currency Configuration</h2>
      {config.map((pair, index) => (
        <div key={index}>
          {pair.from} → {pair.to} | Rate: {pair.rate} | Fee: {pair.fee}%
        </div>
      ))}
      <h3>Add New Configuration</h3>
      <div>
        <input
          type="text"
          placeholder="From Currency"
          value={newConfig.from}
          onChange={(e) => handleNewConfigChange('from', e.target.value)}
          style={{ marginRight: '5px' }}
        />
        →
        <input
          type="text"
          placeholder="To Currency"
          value={newConfig.to}
          onChange={(e) => handleNewConfigChange('to', e.target.value)}
          style={{ marginLeft: '5px', marginRight: '5px' }}
        />
        Rate:
        <input
          type="number"
          placeholder="Rate"
          value={newConfig.rate}
          onChange={(e) => handleNewConfigChange('rate', e.target.value)}
          style={{ marginLeft: '5px', marginRight: '5px', width: '80px' }}
          step="0.01"
        />
        Fee (%):
        <input
          type="number"
          placeholder="Fee"
          value={newConfig.fee}
          onChange={(e) => handleNewConfigChange('fee', e.target.value)}
          style={{ marginLeft: '5px', marginRight: '5px', width: '50px' }}
          step="0.1"
        />
        <button onClick={addNewConfig} style={{ marginLeft: '10px' }}>
          Add
        </button>
      </div>
    </div>
  );
};

export default CurrencyConfig;