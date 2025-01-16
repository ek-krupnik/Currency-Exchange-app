import React, { useMemo } from 'react';
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
    const defaultCurrency = allCurrencies[0] || ''; // Default to the first available currency if any
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
    <div style={{ border: '1px solid black', padding: '10px', marginBottom: '20px' }}>
      <h3>Chain</h3>
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
      <button onClick={addBlock}>Add Block</button>
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
        draggedItem.index = index; // Update the dragged item's index
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '5px',
        border: '1px solid gray',
        marginBottom: '5px',
        cursor: 'grab',
      }}
    >
      <select
        value={block.currency || ''}
        onChange={(e) => updateBlock(e.target.value)}
        style={{ marginRight: '5px' }}
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
      <button onClick={deleteBlock} style={{ marginLeft: 'auto' }}>
        Delete
      </button>
    </div>
  );
};

export default ChainBuilder;