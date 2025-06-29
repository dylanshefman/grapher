import React from 'react';
import { Settings, Palette, Grid } from 'lucide-react';
import { GraphSettings, GraphOptions } from '../types';

interface GraphSidebarProps {
  settings: GraphSettings;
  options: GraphOptions;
  onSettingsChange: (key: keyof GraphSettings, value: number) => void;
  onOptionsChange: (key: keyof GraphOptions, value: any) => void;
}

const colorOptions = [
  { name: 'Blue', value: '#2563eb' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Pink', value: '#db2777' },
];

const backgroundOptions = [
  { name: 'White', value: '#ffffff' },
  { name: 'Light Gray', value: '#f8fafc' },
  { name: 'Dark', value: '#1f2937' },
  { name: 'Transparent', value: 'transparent' },
];

const axisColorOptions = [
  { name: 'Dark Gray', value: '#374151' },
  { name: 'Black', value: '#000000' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Red', value: '#dc2626' },
];

export const GraphSidebar: React.FC<GraphSidebarProps> = ({
  settings,
  options,
  onSettingsChange,
  onOptionsChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full space-y-8">
      {/* Domain and Range */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-gray-800 text-lg">Domain & Range</h3>
        </div>
        <div className="flex gap-2 items-end">
          <input
            type="number"
            value={settings.xMin}
            onChange={(e) => onSettingsChange('xMin', parseFloat(e.target.value))}
            className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            step="0.1"
            placeholder="X Min"
          />
          <input
            type="number"
            value={settings.xMax}
            onChange={(e) => onSettingsChange('xMax', parseFloat(e.target.value))}
            className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            step="0.1"
            placeholder="X Max"
          />
          <input
            type="number"
            value={settings.yMin}
            onChange={(e) => onSettingsChange('yMin', parseFloat(e.target.value))}
            className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            step="0.1"
            placeholder="Y Min"
          />
          <input
            type="number"
            value={settings.yMax}
            onChange={(e) => onSettingsChange('yMax', parseFloat(e.target.value))}
            className="flex-1 min-w-0 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            step="0.1"
            placeholder="Y Max"
          />
        </div>
        <div className="flex gap-2 mt-1">
          <span className="block text-xs text-gray-700 flex-1 min-w-0">X Min</span>
          <span className="block text-xs text-gray-700 flex-1 min-w-0">X Max</span>
          <span className="block text-xs text-gray-700 flex-1 min-w-0">Y Min</span>
          <span className="block text-xs text-gray-700 flex-1 min-w-0">Y Max</span>
        </div>
      </div>

      {/* Function Line */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-gray-800 text-lg">Function Line</h3>
        </div>
        <div className="flex gap-4 items-end">
          {/* Color buttons in a single row, height matches input */}
          <div className="flex flex-col justify-end">
            <div className="flex gap-2 mb-1">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onOptionsChange('lineColor', color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-colors ${options.lineColor === color.value ? 'border-gray-800' : 'border-gray-300'}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <span className="block text-xs text-gray-700 mt-1">Color</span>
          </div>
          {/* Line Style selector with symbols only */}
          <div className="flex flex-col justify-end">
            <div className="flex gap-2 mb-1">
              <button
                onClick={() => onOptionsChange('lineStyle', 'solid')}
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors ${options.lineStyle === 'solid' ? 'border-blue-700' : 'border-gray-300'}`}
                title="Smooth"
              >
                <svg width="24" height="24"><line x1="4" y1="12" x2="20" y2="12" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" /></svg>
              </button>
              <button
                onClick={() => onOptionsChange('lineStyle', 'dotted')}
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors ${options.lineStyle === 'dotted' ? 'border-blue-700' : 'border-gray-300'}`}
                title="Dotted"
              >
                <svg width="24" height="24"><line x1="4" y1="12" x2="20" y2="12" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeDasharray="1,7" /></svg>
              </button>
              <button
                onClick={() => onOptionsChange('lineStyle', 'dashed')}
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors ${options.lineStyle === 'dashed' ? 'border-blue-700' : 'border-gray-300'}`}
                title="Dashed"
              >
                <svg width="24" height="24"><line x1="4" y1="12" x2="20" y2="12" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeDasharray="7,7" /></svg>
              </button>
            </div>
            <span className="block text-xs text-gray-700 mt-1">Style</span>
          </div>
          {/* Only Line Width input remains here */}
          <div className="flex-1 flex gap-4 items-end">
            <div className="flex-1 flex flex-col justify-end">
              <input
                type="number"
                value={options.lineWidth}
                onChange={(e) => onOptionsChange('lineWidth', parseInt(e.target.value))}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                min="1"
                max="10"
              />
              <span className="block text-xs text-gray-700 mt-1">Line Width</span>
            </div>
          </div>
        </div>
      </div>

      {/* Axes */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Grid className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-gray-800 text-lg">Axes</h3>
        </div>
        <div className="grid grid-cols-2 gap-8 items-start">
          {/* X Axis Settings */}
          <div
            className="bg-gray-50 rounded-lg p-4 flex flex-col items-stretch shadow-md relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              minHeight: '0',
              height: 'auto',
              paddingBottom: options.xAxis?.show ? undefined : '1rem',
              overflow: 'hidden',
              transitionProperty: 'box-shadow, background, padding, min-height, max-height',
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-blue-700 tracking-wide">X Axis</h4>
              <button
                onClick={() => onOptionsChange('xAxis', { ...options.xAxis, show: !options.xAxis?.show })}
                className={`w-12 h-6 rounded-full transition-colors ${options.xAxis?.show ? 'bg-blue-600' : 'bg-gray-300'}`}
                aria-label="Toggle X Axis"
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${options.xAxis?.show ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {options.xAxis?.show && (
              <>
                <div className="flex flex-col items-start mb-2 mt-2">
                  <div className="flex gap-2 flex-wrap">
                    {axisColorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => onOptionsChange('xAxis', { ...options.xAxis, color: color.value })}
                        className={`w-7 h-7 rounded-full border-2 transition-colors ${options.xAxis?.color === color.value ? 'border-blue-700' : 'border-gray-300'}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <span className="block text-xs text-gray-600 mt-1">Color</span>
                </div>
                <div className="flex items-center justify-between mt-2 mb-0">
                  <span className="font-medium text-blue-700 text-sm">Numbers</span>
                  <button
                    onClick={() => onOptionsChange('xAxis', { ...options.xAxis, showNumbers: !options.xAxis?.showNumbers })}
                    className={`w-10 h-5 rounded-full transition-colors ${options.xAxis?.showNumbers ? 'bg-blue-600' : 'bg-gray-300'}`}
                    aria-label="Toggle X Axis Numbers"
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${options.xAxis?.showNumbers ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
                {options.xAxis?.showNumbers && (
                  <div className="flex items-center gap-4 mt-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{overflow: 'hidden', maxHeight: options.xAxis?.showNumbers ? 200 : 0}}>
                    <div className="flex flex-col items-start">
                      <select
                        value={options.xAxis.numberPlacement || 'below'}
                        onChange={e => onOptionsChange('xAxis', { ...options.xAxis, numberPlacement: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-left"
                      >
                        <option value="below">Below</option>
                        <option value="above">Above</option>
                      </select>
                    </div>
                    <div className="flex flex-col items-start">
                      <input
                        type="number"
                        value={options.xAxis.decimals ?? 0}
                        onChange={e => onOptionsChange('xAxis', { ...options.xAxis, decimals: parseInt(e.target.value) })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-left"
                        min="0"
                        max="5"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {/* Y Axis Settings */}
          <div
            className="bg-gray-50 rounded-lg p-4 flex flex-col items-stretch shadow-md relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              minHeight: '0',
              height: 'auto',
              paddingBottom: options.yAxis?.show ? undefined : '1rem',
              overflow: 'hidden',
              transitionProperty: 'box-shadow, background, padding, min-height, max-height',
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-blue-700 tracking-wide">Y Axis</h4>
              <button
                onClick={() => onOptionsChange('yAxis', { ...options.yAxis, show: !options.yAxis?.show })}
                className={`w-12 h-6 rounded-full transition-colors ${options.yAxis?.show ? 'bg-blue-600' : 'bg-gray-300'}`}
                aria-label="Toggle Y Axis"
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${options.yAxis?.show ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {options.yAxis?.show && (
              <>
                <div className="flex flex-col items-start mb-2 mt-2">
                  <div className="flex gap-2 flex-wrap">
                    {axisColorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => onOptionsChange('yAxis', { ...options.yAxis, color: color.value })}
                        className={`w-7 h-7 rounded-full border-2 transition-colors ${options.yAxis?.color === color.value ? 'border-blue-700' : 'border-gray-300'}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <span className="block text-xs text-gray-600 mt-1">Color</span>
                </div>
                <div className="flex items-center justify-between mt-2 mb-0">
                  <span className="font-medium text-blue-700 text-sm">Numbers</span>
                  <button
                    onClick={() => onOptionsChange('yAxis', { ...options.yAxis, showNumbers: !options.yAxis?.showNumbers })}
                    className={`w-10 h-5 rounded-full transition-colors ${options.yAxis?.showNumbers ? 'bg-blue-600' : 'bg-gray-300'}`}
                    aria-label="Toggle Y Axis Numbers"
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${options.yAxis?.showNumbers ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
                {options.yAxis?.showNumbers && (
                  <div className="flex items-center gap-4 mt-2 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{overflow: 'hidden', maxHeight: options.yAxis?.showNumbers ? 200 : 0}}>
                    <div className="flex flex-col items-start">
                      <select
                        value={options.yAxis.numberPlacement || 'left'}
                        onChange={e => onOptionsChange('yAxis', { ...options.yAxis, numberPlacement: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-left"
                      >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                    <div className="flex flex-col items-start">
                      <input
                        type="number"
                        value={options.yAxis.decimals ?? 0}
                        onChange={e => onOptionsChange('yAxis', { ...options.yAxis, decimals: parseInt(e.target.value) })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-left"
                        min="0"
                        max="5"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid & Background */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Grid className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-gray-800 text-lg">Grid & Background</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Vertical Grid</label>
            <button
              onClick={() => onOptionsChange('showVerticalGrid', !options.showVerticalGrid)}
              className={`w-12 h-6 rounded-full transition-colors ${options.showVerticalGrid ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${options.showVerticalGrid ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Horizontal Grid</label>
            <button
              onClick={() => onOptionsChange('showHorizontalGrid', !options.showHorizontalGrid)}
              className={`w-12 h-6 rounded-full transition-colors ${options.showHorizontalGrid ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${options.showHorizontalGrid ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
        {/* Grid border options - moved below background, with header and improved layout */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {backgroundOptions.map((bg) => (
              <button
                key={bg.value}
                onClick={() => onOptionsChange('backgroundColor', bg.value)}
                className={`w-8 h-8 rounded-full border-2 transition-colors ${options.backgroundColor === bg.value ? 'border-gray-800' : 'border-gray-300'}`}
                style={{ 
                  backgroundColor: bg.value === 'transparent' ? 'transparent' : bg.value,
                  backgroundImage: bg.value === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                  backgroundSize: bg.value === 'transparent' ? '4px 4px' : 'auto',
                  backgroundPosition: bg.value === 'transparent' ? '0 0, 0 2px, 2px -2px, -2px 0px' : 'auto'
                }}
                title={bg.name}
              />
            ))}
          </div>
        </div>
        {/* Border options, toggleable and progressive disclosure */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2 bg-blue-50 rounded-lg px-3 py-2">
            <span className="font-semibold text-blue-700 text-base">Border</span>
            <button
              onClick={() => onOptionsChange('showGridBorder', !options.showGridBorder)}
              className={`w-10 h-5 rounded-full transition-colors ${options.showGridBorder ? 'bg-blue-600' : 'bg-gray-300'}`}
              aria-label="Toggle Grid Border"
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${options.showGridBorder ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          {options.showGridBorder && (
            <div className="flex gap-6 flex-wrap items-end mt-2">
              {/* Color options */}
              <div className="flex flex-col items-start">
                <div className="flex gap-2 flex-wrap">
                  {axisColorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => onOptionsChange('gridBorderColor', color.value)}
                      className={`w-7 h-7 rounded-full border-2 transition-colors ${options.gridBorderColor === color.value ? 'border-blue-700' : 'border-gray-300'}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <span className="block text-xs text-gray-600 mt-1">Color</span>
              </div>
              {/* Radius input */}
              <div className="flex flex-col items-start">
                <input
                  type="number"
                  min={0}
                  max={32}
                  value={options.gridBorderRadius}
                  onChange={e => onOptionsChange('gridBorderRadius', parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-left"
                  title="Grid Border Radius"
                />
                <span className="block text-xs text-gray-600 mt-1">Radius</span>
              </div>
              {/* Border Width input */}
              <div className="flex flex-col items-start">
                <input
                  type="number"
                  min={0.5}
                  max={8}
                  step={0.1}
                  value={options.gridBorderWidth}
                  onChange={e => onOptionsChange('gridBorderWidth', parseFloat(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-left"
                  title="Grid Border Width"
                />
                <span className="block text-xs text-gray-600 mt-1">Width</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};