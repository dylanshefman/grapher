import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { BlockInput, blockTreeToMathjs } from './BlockInput';

interface FunctionInputProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
}

export const FunctionInput: React.FC<FunctionInputProps> = ({
  value,
  onChange,
  isValid
}) => {
  const [blockRoot, setBlockRoot] = useState<any>(null);

  // When block tree changes, update parent with mathJS string
  const handleBlockChange = (root: any) => {
    setBlockRoot(root);
    const mathJS = blockTreeToMathjs(root);
    onChange(mathJS);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Function Input</h2>
      </div>
      <div className="space-y-4">
        <BlockInput value={blockRoot} onChange={handleBlockChange} />
        {blockRoot && (
          <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2">
            <BlockMath math={`y=${blockTreeToMathjs(blockRoot)}`} />
          </div>
        )}
      </div>
    </div>
  );
};