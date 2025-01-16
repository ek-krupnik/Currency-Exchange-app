import React, { useState } from 'react';

const ExchangeForm = ({ onAddChain }) => {
  const [baseCurrency, setBaseCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [fee, setFee] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddChain({ baseCurrency, amount, targetCurrency, exchangeRate, fee });
    setBaseCurrency('');
    setAmount('');
    setTargetCurrency('');
    setExchangeRate('');
    setFee('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Base Currency (e.g., RUB)"
        value={baseCurrency}
        onChange={(e) => setBaseCurrency(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Target Currency (e.g., GBP)"
        value={targetCurrency}
        onChange={(e) => setTargetCurrency(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Exchange Rate"
        value={exchangeRate}
        onChange={(e) => setExchangeRate(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        placeholder="Fee (%)"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
      />
      <button type="submit">Add Chain</button>
    </form>
  );
};

export default ExchangeForm;