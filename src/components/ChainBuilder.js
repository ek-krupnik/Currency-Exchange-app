import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'BLOCK';

const ChainBuilder = ({ chain, config, onChange }) => {
  // Move a block to a new position
  const moveBlock = (fromIndex, toIndex) => {
    const newBlocks = [...chain.blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    onChange({ ...chain, blocks: newBlocks });
  };

  // Add a new block to the chain
  const addBlock = () => {
    const defaultCurrency = config[0]?.to || ''; // Default to the first configured currency if available
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

  return (
    <div style={{ border: '1px solid black', padding: '10px', marginBottom: '20px' }}>
      <h3>Chain</h3>
      <div>Start Amount: {chain.startAmount}</div>
      {chain.blocks.map((block, index) => (
        <ChainBlock
          key={index}
          index={index}
          block={block}
          config={config}
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

const ChainBlock = ({ block, index, config, moveBlock, updateBlock, deleteBlock }) => {
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
        {config.map((pair, idx) => (
          <option key={idx} value={pair.to}>
            {pair.to}
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