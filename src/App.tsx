import React, { useState, useEffect, useRef } from 'react';
import { FunctionInput } from './components/FunctionInput';
import { GraphSidebar } from './components/GraphSidebar';
import { GraphRenderer } from './components/GraphRenderer';
import { GraphSettings, GraphOptions, AxisOptions } from './types';

// Add this at the top level to declare MathJax on window for TypeScript
declare global {
  interface Window {
    MathJax: any;
  }
}

function getDefaultAxisOptions(axis: 'x' | 'y'): AxisOptions {
  return {
    show: true,
    color: axis === 'x' ? '#374151' : '#374151',
    showNumbers: true,
    decimals: 0,
    numberPlacement: axis === 'x' ? 'below' : 'left',
  };
}

function MathWritingModule() {
  const [input, setInput] = useState('');
  const mathJaxRef = useRef<HTMLDivElement>(null);

  // Dynamically load MathJax if not already loaded
  useEffect(() => {
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Render LaTeX using MathJax
  useEffect(() => {
    if (window.MathJax && mathJaxRef.current) {
      window.MathJax.typesetClear && window.MathJax.typesetClear();
      window.MathJax.typesetPromise([mathJaxRef.current]);
    }
  }, [input]);

  const handleDownload = () => {
    try {
      if (!window.MathJax || !mathJaxRef.current) {
        alert('MathJax is not loaded.');
        return;
      }
      // Find the SVG element rendered by MathJax
      const svg = mathJaxRef.current.querySelector('svg');
      if (svg) {
        // Set SVG height to 100px and preserve aspect ratio for width
        const viewBox = svg.getAttribute('viewBox');
        if (viewBox) {
          const parts = viewBox.split(' ');
          if (parts.length === 4) {
            const vbWidth = parseFloat(parts[2]);
            const vbHeight = parseFloat(parts[3]);
            if (vbHeight > 0) {
              svg.setAttribute('height', '100');
              svg.setAttribute('width', String((vbWidth / vbHeight) * 100));
            }
          }
        }
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        // Download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'math.svg';
        link.click();
      } else {
        alert('SVG rendering failed.');
      }
    } catch (e) {
      alert('Error rendering LaTeX.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Math Writing
      </h2>
      <textarea
        className="w-full px-4 py-3 border-2 rounded-lg font-mono text-lg mb-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        rows={3}
        placeholder="Type LaTeX here, e.g. x^2 + 2x - 1"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div className="mb-2 min-h-[2.5em]" ref={mathJaxRef}>
        {input && (
          <span>{`$$${input}$$`}</span>
        )}
      </div>
      <button
        onClick={handleDownload}
        disabled={!input.trim()}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-200"
      >
        Download as SVG
      </button>
    </div>
  );
}

function App() {
  const [module, setModule] = useState<null | 'graph' | 'math'>(null);
  const [functionExpression, setFunctionExpression] = useState('x^2');
  const [settings, setSettings] = useState<GraphSettings>({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
  });
  const [options, setOptions] = useState<GraphOptions>({
    lineColor: '#2563eb',
    backgroundColor: '#ffffff',
    showVerticalGrid: true,
    showHorizontalGrid: true,
    lineWidth: 2,
    lineStyle: 'solid',
    showArrows: false,
    arrowColor: '#2563eb',
    arrowRadius: 10,
    arrowWidth: 2.2,
    xAxis: getDefaultAxisOptions('x'),
    yAxis: getDefaultAxisOptions('y'),
    gridBorderColor: '#d1d5db',
    gridBorderRadius: 0,
    gridBorderWidth: 1,
    showGridBorder: true,
  });

  const handleSettingsChange = (key: keyof GraphSettings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  const handleOptionsChange = (key: keyof GraphOptions, value: any) => {
    if (key === 'xAxis' || key === 'yAxis') {
      setOptions(prev => ({ ...prev, [key]: { ...prev[key], ...value } }));
    } else {
      setOptions(prev => ({ ...prev, [key]: value }));
    }
  };
  const handleCopy = async () => {
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
          }
        });
      }
    } catch (error) {
      console.error('Failed to copy graph:', error);
    }
  };
  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'graph.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };
  const isValidFunction = !functionExpression.startsWith('y=') && !functionExpression.startsWith('y =');

  // Module selection page
  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
          {/* Graphing Card */}
          <button
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => setModule('graph')}
          >
            <span className="text-3xl mb-2">📈</span>
            <h2 className="text-2xl font-bold mb-1 text-gray-800">Graphing</h2>
            <p className="text-gray-600 text-center">Plot and customize mathematical functions with a modern UI.</p>
          </button>
          {/* Math Writing Card */}
          <button
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
            onClick={() => setModule('math')}
          >
            <span className="text-3xl mb-2">📝</span>
            <h2 className="text-2xl font-bold mb-1 text-gray-800">Math Writing</h2>
            <p className="text-gray-600 text-center">Type LaTeX and download as SVG for beautiful math documents.</p>
          </button>
        </div>
      </div>
    );
  }

  // Module header with back chevron
  const ModuleHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <header className="flex items-center gap-2 mb-8">
      <button
        className="mr-2 p-2 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        onClick={() => setModule(null)}
        aria-label="Back"
      >
        <span className="text-2xl">‹</span>
      </button>
      <div className="flex-1 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-1">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </header>
  );

  if (module === 'math') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <ModuleHeader title="Math Writing" subtitle="Type LaTeX and download as SVG" />
          <MathWritingModule />
        </div>
      </div>
    );
  }

  // Graphing module
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <ModuleHeader title="Mathematical Function Graphing" subtitle="Enter a mathematical function and visualize it with customizable options" />
        {/* Function Input on Top (keeps its own white box) */}
        <div className="max-w-2xl mx-auto w-full">
          <FunctionInput
            value={functionExpression}
            onChange={setFunctionExpression}
            onCopy={handleCopy}
            onDownload={handleDownload}
            isValid={isValidFunction}
          />
        </div>
        {/* Graph in its own white box */}
        <div className="max-w-2xl mx-auto w-full mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full flex items-center justify-center">
            <GraphRenderer
              functionExpression={functionExpression}
              settings={settings}
              options={options}
              width={500}
              height={400}
            />
          </div>
        </div>
        {/* Settings below graph, in white box */}
        <div className="max-w-2xl mx-auto w-full mt-6">
          <GraphSidebar
            settings={settings}
            options={options}
            onSettingsChange={handleSettingsChange}
            onOptionsChange={handleOptionsChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;