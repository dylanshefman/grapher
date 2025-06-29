import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// --- Block Types and Data Structures ---
type BlockType =
  | 'expression' | 'variable' | 'plus' | 'minus' | 'multiply' | 'divide' | 'power' | 'root'
  | 'log' | 'ln' | 'logbase'
  | 'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot' | 'arcsin' | 'arccos' | 'arctan'
  | 'fraction' | 'paren';

interface BlockNode {
  id: string;
  type: BlockType;
  value?: string; // for constants, variables, or expressions
  children?: (BlockNode | null)[]; // for operators, fractions, etc. (null for empty slots)
}

// --- Block Palette ---
const bigBox = (
  <span style={{
    display: 'inline-block',
    minWidth: 30,
    minHeight: 30,
    border: '2px dashed #8884',
    borderRadius: 4,
    background: '#fff',
    verticalAlign: 'middle',
    margin: '0 2px',
  }} />
);
const smallBox = (
  <span style={{
    display: 'inline-block',
    minWidth: 18,
    minHeight: 18,
    border: '2px dashed #8884',
    borderRadius: 4,
    background: '#fff',
    verticalAlign: 'middle',
    margin: '0 2px',
  }} />
);

const blockPaletteGroups: { label: string; color: string; blocks: { type: BlockType; label: React.ReactNode; slots: number }[] }[] = [
  {
    label: 'Operators',
    color: '#fbbf24', // amber
    blocks: [
      { type: 'plus', label: <span>{bigBox} + {bigBox}</span>, slots: 2 },
      { type: 'minus', label: <span>{bigBox} − {bigBox}</span>, slots: 2 },
      { type: 'multiply', label: <span>{bigBox} × {bigBox}</span>, slots: 2 },
      { type: 'divide', label: <span>{bigBox} ÷ {bigBox}</span>, slots: 2 },
      { type: 'fraction', label: (
        <span style={{display:'inline-block',textAlign:'center'}}>
          <div>{smallBox}</div>
          <div style={{borderTop:'1.5px solid black',width:24,margin:'0 auto'}} />
          <div>{smallBox}</div>
        </span>
      ), slots: 2 },
    ],
  },
  {
    label: 'Powers & Roots',
    color: '#a78bfa', // violet
    blocks: [
      { type: 'power', label: <span>{bigBox}<sup>{smallBox}</sup></span>, slots: 2 },
      { type: 'root', label: <span><sup>{smallBox}</sup>√{bigBox}</span>, slots: 2 },
    ],
  },
  {
    label: 'Logarithms',
    color: '#60a5fa', // blue
    blocks: [
      { type: 'log', label: <span>log({bigBox})</span>, slots: 1 },
      { type: 'ln', label: <span>ln({bigBox})</span>, slots: 1 },
      { type: 'logbase', label: <span>log<sub>{smallBox}</sub>({bigBox})</span>, slots: 2 },
    ],
  },
  {
    label: 'Trigonometric Functions',
    color: '#38bdf8', // cyan
    blocks: [
      { type: 'sin', label: <span>sin({bigBox})</span>, slots: 1 },
      { type: 'cos', label: <span>cos({bigBox})</span>, slots: 1 },
      { type: 'tan', label: <span>tan({bigBox})</span>, slots: 1 },
      { type: 'csc', label: <span>csc({bigBox})</span>, slots: 1 },
      { type: 'sec', label: <span>sec({bigBox})</span>, slots: 1 },
      { type: 'cot', label: <span>cot({bigBox})</span>, slots: 1 },
      { type: 'arcsin', label: <span>sin<sup>-1</sup>({bigBox})</span>, slots: 1 },
      { type: 'arccos', label: <span>cos<sup>-1</sup>({bigBox})</span>, slots: 1 },
      { type: 'arctan', label: <span>tan<sup>-1</sup>({bigBox})</span>, slots: 1 },
    ],
  },
  {
    label: 'Parentheses',
    color: '#f472b6', // pink
    blocks: [
      { type: 'paren', label: <span>({bigBox})</span>, slots: 1 },
    ],
  },
];

// --- Drag-and-Drop Context ---

// --- Helper: get group color for a block type
function getBlockGroupColor(type: BlockType): string {
  for (const group of blockPaletteGroups) {
    if (group.blocks.some(b => b.type === type)) return group.color;
  }
  return '#fff';
}

// Helper: get a darker version of a color (simple algorithm for now)
function darkenColor(hex: string, amount = 40): string {
  // Remove # if present
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  const num = parseInt(hex, 16);
  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0x00FF) - amount;
  let b = (num & 0x0000FF) - amount;
  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// --- Block Renderer ---
// Remove all duplicate definitions of:
//   BLOCK_WRAPPER_STYLE
//   BLOCK_INNER_STYLE
//   StyledBlockWrapper
//   renderSlot
//   renderBinaryOp
//   renderFraction
//   renderPower
//   renderRoot
//   renderUnaryFunc
//   renderParens
//   renderInput
//   blockRenderers
//   BlockRenderer
// Only keep ONE definition of each, in the order: styles/helpers, renderers, blockRenderers, BlockRenderer.


// --- Shared Styles and Helpers ---
const BLOCK_WRAPPER_STYLE = {
  position: 'relative' as const,
  display: 'inline-block' as const,
};
const BLOCK_INNER_STYLE = (color: string) => ({
  background: color,
  borderRadius: 6,
  padding: '8px 8px',
  margin: 2,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${darkenColor(color)}`,
  boxShadow: `0 2px 8px 0 #3332`,
});

function StyledBlockWrapper({ children, color, draggable, onDragStart, onDragEnd }: any) {
  return (
    <span style={BLOCK_WRAPPER_STYLE}>
      <span
        style={BLOCK_INNER_STYLE(color)}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {children}
      </span>
    </span>
  );
}

function renderSlot(block: BlockNode, idx: number, props: any) {
  return <BlockSlot block={block.children?.[idx] || null} slotIdx={idx} parent={block} {...props} />;
}

const renderBinaryOp = (symbol: string) => (props: any) => {
  const { block, ...rest } = props;
  return (
    <>
      {renderSlot(block, 0, rest)}
      <span className="block-op-symbol">{symbol}</span>
      {renderSlot(block, 1, rest)}
    </>
  );
};

const renderFraction = (props: any) => {
  const { block, ...rest } = props;
  return (
    <span style={{display:'inline-block',textAlign:'center'}}>
      <div>{renderSlot(block, 0, rest)}</div>
      <div style={{borderTop:'1.5px solid black',width:24,margin:'0 auto'}} />
      <div>{renderSlot(block, 1, rest)}</div>
    </span>
  );
};

const renderPower = (props: any) => {
  const { block, ...rest } = props;
  return (
    <>
      {renderSlot(block, 0, rest)}
      <sup>{renderSlot(block, 1, rest)}</sup>
    </>
  );
};

const renderRoot = (props: any) => {
  const { block, ...rest } = props;
  return (
    <>
      <sup style={{fontSize:'0.7em'}}>{renderSlot(block, 1, rest)}</sup>
      <span style={{fontSize:'1.2em'}}>√</span>
      {renderSlot(block, 0, rest)}
    </>
  );
};

const renderUnaryFunc = (label: string, inverse = false) => (props: any) => {
  const { block, ...rest } = props;
  return (
    <>
      <span>{label}{inverse ? <sup>-1</sup> : null}</span>
      <span>(</span>
      {renderSlot(block, 0, rest)}
      <span>)</span>
    </>
  );
};

const renderParens = (props: any) => {
  const { block, ...rest } = props;
  return (
    <>
      <span>(</span>
      {renderSlot(block, 0, rest)}
      <span>)</span>
    </>
  );
};

const renderInput = (props: any) => {
  const { block, onValueChange, parentId, onDragStartBlock, onDragEndBlock } = props;
  const color = getBlockGroupColor(block.type);
  const isDraggable = !!parentId || parentId === undefined;
  return (
    <input
      className="block-input"
      value={block.value || ''}
      onChange={e => onValueChange(block.id, e.target.value)}
      placeholder={block.type === 'variable' ? 'x' : 'expr'}
      style={{
        width: 40,
        textAlign: 'center',
        margin: '0 2px',
        background: color,
        border: `1px solid ${darkenColor(color)}`,
        borderRadius: 6,
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 0 1.5px #3338`,
        padding: '8px 8px',
      }}
      draggable={isDraggable}
      onDragStart={isDraggable ? (e) => {
        e.stopPropagation();
        e.dataTransfer.setData('block-tree', JSON.stringify({ id: block.id }));
        e.dataTransfer.setData('delete-block', 'true');
        if (onDragStartBlock) onDragStartBlock(block.id);
        // Create a custom drag image that matches the block
        const dragGhost = e.currentTarget.cloneNode(true) as HTMLElement;
        dragGhost.style.position = 'absolute';
        dragGhost.style.top = '-9999px';
        dragGhost.style.left = '-9999px';
        dragGhost.style.pointerEvents = 'none';
        dragGhost.style.opacity = '1';
        document.body.appendChild(dragGhost);
        e.dataTransfer.setDragImage(dragGhost, dragGhost.offsetWidth / 2, dragGhost.offsetHeight / 2);
        setTimeout(() => {
          document.body.removeChild(dragGhost);
        }, 0);
      } : undefined}
      onDragEnd={onDragEndBlock}
    />
  );
};

const blockRenderers: Record<BlockType, (props: any) => JSX.Element> = {
  plus: renderBinaryOp('+'),
  minus: renderBinaryOp('−'),
  multiply: renderBinaryOp('×'),
  divide: renderBinaryOp('÷'),
  fraction: renderFraction,
  power: renderPower,
  root: renderRoot,
  log: renderUnaryFunc('log'),
  ln: renderUnaryFunc('ln'),
  logbase: (props) => (
    <>
      <span>log<sub>{renderSlot(props.block, 0, props)}</sub></span>
      <span>(</span>
      {renderSlot(props.block, 1, props)}
      <span>)</span>
    </>
  ),
  sin: renderUnaryFunc('sin'),
  cos: renderUnaryFunc('cos'),
  tan: renderUnaryFunc('tan'),
  csc: renderUnaryFunc('csc'),
  sec: renderUnaryFunc('sec'),
  cot: renderUnaryFunc('cot'),
  arcsin: renderUnaryFunc('sin', true),
  arccos: renderUnaryFunc('cos', true),
  arctan: renderUnaryFunc('tan', true),
  paren: renderParens,
  expression: renderInput,
  variable: renderInput,
};

function BlockRenderer(props: any) {
  const { block, parentId, onDragStartBlock, onDragEndBlock } = props;
  if (!block) return null;
  const type: BlockType = block.type;
  const renderer = blockRenderers[type];
  if (!renderer) return <span />;
  const color = getBlockGroupColor(type);
  const isDraggable = !!parentId || parentId === undefined;

  // Custom drag image for all blocks (including root)
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('block-tree', JSON.stringify({ id: block.id }));
    e.dataTransfer.setData('delete-block', 'true');
    if (onDragStartBlock) onDragStartBlock(block.id);
    // Create a custom drag image that matches the block
    const dragGhost = e.currentTarget.cloneNode(true) as HTMLElement;
    dragGhost.style.position = 'absolute';
    dragGhost.style.top = '-9999px';
    dragGhost.style.left = '-9999px';
    dragGhost.style.pointerEvents = 'none';
    dragGhost.style.opacity = '1';
    document.body.appendChild(dragGhost);
    e.dataTransfer.setDragImage(dragGhost, dragGhost.offsetWidth / 2, dragGhost.offsetHeight / 2);
    setTimeout(() => {
      document.body.removeChild(dragGhost);
    }, 0);
  };

  return (
    type === 'expression' || type === 'variable' ?
      renderer({ ...props }) :
      <StyledBlockWrapper
        color={color}
        draggable={isDraggable}
        onDragStart={isDraggable ? handleDragStart : undefined}
        onDragEnd={onDragEndBlock}
      >
        {renderer(props)}
      </StyledBlockWrapper>
  );
}

// --- Auto Resizing Input Component ---
function AutoResizingInput({ value, onChange, onBlur, onKeyDown, style, ...props }: any) {
  const [inputWidth, setInputWidth] = useState(28);
  const spanRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth + 12); // add some padding
    }
  }, [value]);

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
        onBlur={onBlur}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyDown(e)}
        style={{
          ...style,
          width: inputWidth,
          minWidth: 28,
          maxWidth: 160,
          boxSizing: 'content-box',
        }}
        {...props}
      />
      <span
        ref={spanRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          height: 0,
          overflow: 'scroll',
          whiteSpace: 'pre',
          fontSize: style?.fontSize || 15,
          fontFamily: 'inherit',
          fontWeight: style?.fontWeight || 400,
          padding: style?.padding || '0 4px',
        }}
      >
        {value || ''}
      </span>
    </>
  );
}

function BlockSlot({ block, slotIdx, parent, onDrop, onValueChange, root, onDelete }: any) {
  const [inputValue, setInputValue] = useState('');
  // Drag-and-drop: accept drop from palette or from input area
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const paletteType = e.dataTransfer.getData('block-type');
    const blockTreeData = e.dataTransfer.getData('block-tree');
    if (paletteType) {
      // From palette
      const paletteBlock = blockPaletteGroups.flatMap(g => g.blocks).find(b => b.type === paletteType);
      if (!paletteBlock) return;
      const newBlock: BlockNode = { id: uuidv4(), type: paletteBlock.type, children: paletteBlock.slots ? Array(paletteBlock.slots).fill(null) : undefined };
      onDrop(newBlock, slotIdx, parent.id);
      setInputValue('');
    } else if (blockTreeData) {
      // From input area (move block)
      const { id: draggedId } = JSON.parse(blockTreeData);
      if (!draggedId || !root) return;
      function isDescendant(targetId: string, node: BlockNode | null): boolean {
        if (!node) return false;
        if (node.id === targetId) return true;
        if (node.children) return node.children.some(child => isDescendant(targetId, child));
        return false;
      }
      if (isDescendant(draggedId, parent)) return; // Prevent cycle
      function removeAndReturn(node: BlockNode | null): [BlockNode | null, BlockNode | null] {
        if (!node) return [null, null];
        if (node.id === draggedId) return [null, node];
        if (node.children) {
          let found: BlockNode | null = null;
          const newChildren = node.children.map(child => {
            const [newChild, foundChild] = removeAndReturn(child);
            if (foundChild) found = foundChild;
            return newChild;
          });
          return [{ ...node, children: newChildren as (BlockNode | null)[] }, found];
        }
        return [node, null];
      }
      const [treeWithoutDragged, draggedBlock] = removeAndReturn(root);
      if (!draggedBlock) return;
      function insert(node: BlockNode | null): BlockNode | null {
        if (!node) return null;
        if (node.id === parent.id) {
          const children = node.children ? [...node.children] : [];
          children[slotIdx] = draggedBlock;
          return { ...node, children: children as (BlockNode | null)[] };
        }
        if (node.children) {
          const newChildren = node.children.map(child => insert(child));
          return { ...node, children: newChildren as (BlockNode | null)[] };
        }
        return node;
      }
      const updated = insert(treeWithoutDragged);
      onDrop(updated, -1, '');
      setInputValue('');
    }
  };

  // If slot is empty, show a text input that creates an expression block on blur/enter
  if (!block) {
    return (
      <span
        className="block-slot"
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        style={{ minWidth: 30, display: 'inline-block', background: 'transparent', borderRadius: 4, margin: '0 2px', position: 'relative' }}
      >
        <AutoResizingInput
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onBlur={() => {
            if (inputValue.trim() !== '') {
              const exprBlock: BlockNode = { id: uuidv4(), type: 'expression', value: inputValue.trim() };
              onDrop(exprBlock, slotIdx, parent.id);
              setInputValue('');
            }
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && inputValue.trim() !== '') {
              const exprBlock: BlockNode = { id: uuidv4(), type: 'expression', value: inputValue.trim() };
              onDrop(exprBlock, slotIdx, parent.id);
              setInputValue('');
            }
          }}
          style={{
            border: '2px dashed #8884',
            borderRadius: 4,
            background: '#fff',
            verticalAlign: 'middle',
            margin: '0 2px',
            padding: '0 4px',
            fontSize: 15,
            outline: 'none',
          }}
          placeholder=""
        />
      </span>
    );
  }
  return (
    <span
      className="block-slot"
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      style={{ minWidth: 30, display: 'inline-block', background: 'transparent', borderRadius: 4, margin: '0 2px' }}
    >
      <BlockRenderer block={block} onDrop={onDrop} onValueChange={onValueChange} parentId={parent?.id} root={root} onDelete={onDelete} />
    </span>
  );
}

// --- Block Palette UI ---
function BlockPalette({ onDragStart, onDropFromInput }: { onDragStart: (e: React.DragEvent, type: BlockType) => void, onDropFromInput?: (blockId: string) => void }) {
  // Accept drop from input area to delete block
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const blockTreeData = e.dataTransfer.getData('block-tree');
    const isDelete = e.dataTransfer.getData('delete-block');
    if (blockTreeData && isDelete && onDropFromInput) {
      const { id } = JSON.parse(blockTreeData);
      onDropFromInput(id);
    }
  };
  return (
    <div className="block-palette" style={{ marginBottom: 16 }} onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
      {blockPaletteGroups.map(group => (
        <div key={group.label} style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 600, color: group.color, marginBottom: 2 }}>{group.label}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {group.blocks.map(block => (
              <span
                key={block.type}
                style={{
                  background: group.color,
                  borderRadius: 6,
                  padding: '3px',
                  border: `1px solid ${darkenColor(group.color)}`,
                  display: 'inline-block',
                  cursor: 'grab',
                  userSelect: 'none',
                  minWidth: 32,
                  boxShadow: `0 2px 8px 0 #3332`, // changed from border-like shadow to drop shadow
                  alignItems: 'center',
                  verticalAlign: 'middle',
                }}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('block-type', block.type);
                  onDragStart(e, block.type);
                }}
              >
                {block.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Main Block Input Area ---
export function BlockInput({ value, onChange }: { value?: BlockNode; onChange: (root: BlockNode | null) => void }) {
  const [root, setRoot] = useState<BlockNode | null>(value || null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  // Handle drag start from palette (for custom drag image if needed)
  const handlePaletteDragStart = () => {
    // Optionally set a custom drag image here
  };

  // Handle drop from palette to root
  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('block-type');
    const paletteBlock = blockPaletteGroups.flatMap(g => g.blocks).find(b => b.type === data);
    if (!paletteBlock) return;
    const newBlock: BlockNode = { id: uuidv4(), type: paletteBlock.type, children: paletteBlock.slots ? Array(paletteBlock.slots).fill(null) : undefined };
    setRoot(newBlock);
    onChange(newBlock);
  };

  // Handle drop into a slot
  const handleDrop = (blockOrTree: BlockNode, slotIdx: number, parentId: string) => {
    // If slotIdx === -1, blockOrTree is the new root (from move)
    if (slotIdx === -1) {
      setRoot(blockOrTree);
      onChange(blockOrTree);
    } else {
      // Find parent and update its children
      function findAndUpdate(node: BlockNode | null): BlockNode | null {
        if (!node) return null;
        if (node.id === parentId) {
          const children = node.children ? [...node.children] : [];
          children[slotIdx] = blockOrTree;
          return { ...node, children };
        }
        if (node.children) {
          const newChildren = node.children.map(child => findAndUpdate(child));
          return { ...node, children: newChildren };
        }
        return node;
      }
      const updatedRoot = findAndUpdate(root);
      setRoot(updatedRoot);
      onChange(updatedRoot);
    }
  };

  // Remove block and all its children by id
  const handleDelete = (id: string) => {
    function removeById(node: BlockNode | null): BlockNode | null {
      if (!node) return null;
      if (node.id === id) return null;
      if (node.children) {
        const newChildren = node.children.map(child => removeById(child));
        return { ...node, children: newChildren };
      }
      return node;
    }
    const updated = removeById(root);
    setRoot(updated);
    onChange(updated);
  };

  // --- Clear Button ---
  const handleClear = () => {
    setRoot(null);
    onChange(null);
  };

  // Helper to hide a block (and its children) if it's being dragged
  function filterDragged(node: BlockNode | null): BlockNode | null {
    if (!node) return null;
    if (node.id === draggedBlockId) return null;
    if (node.children) {
      const newChildren = node.children.map(child => filterDragged(child));
      return { ...node, children: newChildren };
    }
    return node;
  }

  // Modified BlockRenderer to pass drag state
  function BlockRendererWithDrag(props: any) {
    return <BlockRenderer {...props} onDragStartBlock={setDraggedBlockId} onDragEndBlock={() => setDraggedBlockId(null)} />;
  }

  // Render input area: if root is null, show editable input for expression
  return (
    <div>
      <BlockPalette onDragStart={handlePaletteDragStart} onDropFromInput={handleDelete} />
      <div
        className="block-input-area"
        onDragOver={e => e.preventDefault()}
        onDrop={handleRootDrop}
        style={{ position: 'relative', padding: 8, borderRadius: 8, background: '#f9fafb', border: '2px dashed #2563eb', minHeight: 40 }}
      >
        {root ? (
          <BlockRendererWithDrag block={filterDragged(root)} onDrop={handleDrop} onValueChange={(id: string, value: string) => {
            function findAndUpdate(node: BlockNode | null): BlockNode | null {
              if (!node) return null;
              if (node.id === id) {
                return { ...node, value };
              }
              if (node.children) {
                const newChildren = node.children.map(child => findAndUpdate(child));
                return { ...node, children: newChildren };
              }
              return node;
            }
            const updatedRoot = findAndUpdate(root);
            setRoot(updatedRoot);
            onChange(updatedRoot);
          }} root={root} />
        ) : (
          <span style={{ minWidth: 30, display: 'inline-block', background: 'transparent', borderRadius: 4, margin: '0 2px', position: 'relative' }}>
            <AutoResizingInput
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onBlur={() => {
                if (inputValue.trim() !== '') {
                  const exprBlock: BlockNode = { id: uuidv4(), type: 'expression', value: inputValue.trim() };
                  setRoot(exprBlock);
                  onChange(exprBlock);
                  setInputValue('');
                }
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && inputValue.trim() !== '') {
                  const exprBlock: BlockNode = { id: uuidv4(), type: 'expression', value: inputValue.trim() };
                  setRoot(exprBlock);
                  onChange(exprBlock);
                  setInputValue('');
                }
              }}
              style={{
                border: '2px dashed #8884',
                borderRadius: 4,
                background: '#fff',
                verticalAlign: 'middle',
                margin: '0 2px',
                padding: '0 4px',
                fontSize: 15,
                outline: 'none',
              }}
              placeholder=""
              autoFocus
            />
          </span>
        )}
      </div>
      <div style={{ marginTop: 12, textAlign: 'right' }}>
        <button
          onClick={handleClear}
          disabled={!root}
          style={{
            background: !root ? '#e5e7eb' : '#ef4444',
            color: !root ? '#888' : 'white',
            border: 'none',
            borderRadius: 6,
            padding: '4px 16px',
            fontWeight: 600,
            fontSize: 15,
            marginTop: 2,
            cursor: !root ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 4px #0001',
            transition: 'background 0.2s',
            outline: 'none',
          }}
          tabIndex={0}
          aria-disabled={!root}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export function blockTreeToMathjs(block: BlockNode | null): string {
  if (!block) return '';

  switch (block.type) {
    case 'plus':
      return `(${blockTreeToMathjs(block.children?.[0] || null)} + ${blockTreeToMathjs(block.children?.[1] || null)})`;
    case 'minus':
      return `(${blockTreeToMathjs(block.children?.[0] || null)} - ${blockTreeToMathjs(block.children?.[1] || null)})`;
    case 'multiply':
      return `(${blockTreeToMathjs(block.children?.[0] || null)} * ${blockTreeToMathjs(block.children?.[1] || null)})`;
    case 'divide':
    case 'fraction': // treat same as divide
      return `((${blockTreeToMathjs(block.children?.[0] || null)}) / (${blockTreeToMathjs(block.children?.[1] || null)}))`;
    case 'power':
      return `(${blockTreeToMathjs(block.children?.[0] || null)})^(${blockTreeToMathjs(block.children?.[1] || null)})`;
    case 'root':
      // nth root: root with two children, first is radicand, second is degree
      // mathjs uses nthRoot(x, n)
      return `nthRoot(${blockTreeToMathjs(block.children?.[0] || null)}, ${blockTreeToMathjs(block.children?.[1] || null)})`;
    case 'logbase':
      // log base n: mathjs uses log(x, base)
      return `log(${blockTreeToMathjs(block.children?.[1] || null)}, ${blockTreeToMathjs(block.children?.[0] || null)})`;
    case 'log':
      return `log(${blockTreeToMathjs(block.children?.[0] || null)})`; // natural log by default
    case 'ln':
      return `log(${blockTreeToMathjs(block.children?.[0] || null)})`;
    case 'sin':
    case 'cos':
    case 'tan':
    case 'csc':
    case 'sec':
    case 'cot':
      return `${block.type}(${blockTreeToMathjs(block.children?.[0] || null)})`;
    case 'arcsin':
      return `asin(${blockTreeToMathjs(block.children?.[0] || null)})`;
    case 'arccos':
      return `acos(${blockTreeToMathjs(block.children?.[0] || null)})`;
    case 'arctan':
      return `atan(${blockTreeToMathjs(block.children?.[0] || null)})`;
    case 'paren':
      return `(${blockTreeToMathjs(block.children?.[0] || null)})`;
    case 'variable':
      return block.value || 'x';
    case 'expression':
      return block.value || '';
    default:
      return '';
  }
}
