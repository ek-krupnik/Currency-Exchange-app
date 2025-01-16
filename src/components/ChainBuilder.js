import React, { useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'BLOCK';

const ChainBuilder = ({ chain, config, onChange }) => {
  // Extract all unique currencies from the config
  const allCurrencies = useMemo(
    () => Array.from(new Set(config.flatMap((pair) => [pair.from, pair.to]))),
    [config]
  );

  // Move a block to a new position
  const moveBlock = (fromIndex, toIndex) => {
    const newBlocks = [...chain.blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    onChange({ ...chain, blocks: newBlocks });
  };

  // Add a new block to the chain
  const addBlock = () => {
    const defaultCurrency = allCurrencies[0] || '';
    onChange({
      ...chain,
      blocks: [...chain.blocks, { currency: defaultCurrency }],
    });
  };

  // Delete a block from the chain
  const deleteBlock = (index) => {
    const newBlocks = chain.blocks.filter((_, i) => i !== index);
    onChange({ ...chain, blocks: newBlocks });
  };

  // Update the starting currency or amount
  const updateStart = (field, value) => {
    onChange({ ...chain, [field]: field === 'startAmount' ? parseFloat(value) || 0 : value });
  };

  return (
    <div style={{ 
            // border: '1px solid black', 
            padding: '10px', 
            // borderRadius: '5px',
        }}>
      <h3 style={{ marginBottom: '20px' }}>Chain</h3>
      <div>
        Start Amount:
        <input
          type="number"
          value={chain.startAmount || ''}
          onChange={(e) => updateStart('startAmount', e.target.value)}
          style={{ marginLeft: '5px', marginRight: '10px', width: '80px' }}
        />
        Start Currency:
        <select
          value={chain.startCurrency || ''}
          onChange={(e) => updateStart('startCurrency', e.target.value)}
          style={{ marginLeft: '5px' }}
        >
          <option value="" disabled>
            Select Currency
          </option>
          {allCurrencies.map((currency, idx) => (
            <option key={idx} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div style={{
            margin: '20px',
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
        }}>
      {chain.blocks.map((block, index) => (
        <ChainBlock
          key={index}
          index={index}
          block={block}
          allCurrencies={allCurrencies}
          moveBlock={moveBlock}
          updateBlock={(value) => {
            const newBlocks = [...chain.blocks];
            newBlocks[index].currency = value;
            onChange({ ...chain, blocks: newBlocks });
          }}
          deleteBlock={() => deleteBlock(index)}
        />
      ))}
      </div>
      <button 
        onClick={addBlock}
        style={{backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
      >
        Add Block in chain
      </button>
    </div>
  );
};

const ChainBlock = ({ block, index, allCurrencies, moveBlock, updateBlock, deleteBlock }) => {
    const [, ref] = useDrag({
      type: ItemType,
      item: { index },
    });
  
    const [, drop] = useDrop({
      accept: ItemType,
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveBlock(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });
  
    const [hover, setHover] = useState(false);
  
    return (
      <div
        ref={(node) => ref(drop(node))}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '15px',
          border: '1px solid gray',
          marginBottom: '5px',
          cursor: 'grab',
          borderRadius: '5px',
          transform: hover ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: hover ? '0px 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <select
          value={block.currency || ''}
          onChange={(e) => updateBlock(e.target.value)}
          style={{ 
              marginRight: '5px',
              width: '60px',
          }}
        >
          <option value="" disabled>
            Select Currency
          </option>
          {allCurrencies.map((currency, idx) => (
            <option key={idx} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <button 
          onClick={deleteBlock} 
          style={{ 
              marginLeft: 'auto',
              color: '#ff2c2c',
              fontWeight: 'bold',
              cursor: 'pointer',
          }}
        >
          X
        </button>
      </div>
    );
  };

export default ChainBuilder;