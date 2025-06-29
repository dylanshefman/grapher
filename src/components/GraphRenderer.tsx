import React, { useRef, useEffect } from 'react';
import { GraphSettings, GraphOptions } from '../types';
import { create, all, MathJsStatic, MathNode } from 'mathjs';

const math: MathJsStatic = create(all, {});

interface GraphRendererProps {
  functionExpression: string; // mathjs-compatible string, e.g. "atan(x) + 2"
  settings: GraphSettings;
  options: GraphOptions;
  width?: number;
  height?: number;
}

export const GraphRenderer: React.FC<GraphRendererProps> = ({
  functionExpression,
  settings,
  options,
  width = 600,
  height = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Enforce aspect ratio for square units
  const xRange = settings.xMax - settings.xMin;
  const yRange = settings.yMax - settings.yMin;
  let enforcedWidth = width;
  let enforcedHeight = height;
  if (xRange > 0 && yRange > 0) {
    const aspect = xRange / yRange;
    if (aspect > width / height) {
      enforcedWidth = width;
      enforcedHeight = width / aspect;
    } else {
      enforcedHeight = height;
      enforcedWidth = height * aspect;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }
    canvas.width = enforcedWidth;
    canvas.height = enforcedHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, enforcedWidth, enforcedHeight);

    // Background
    if (options.backgroundColor !== 'transparent') {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, enforcedWidth, enforcedHeight);
    }

    // Scale and origin
    const xScale = enforcedWidth / xRange;
    const yScale = enforcedHeight / yRange;
    const originX = -settings.xMin * xScale;
    const originY = enforcedHeight + settings.yMin * yScale;

    // Convert math coords to canvas coords
    const mathToCanvas = (x: number, y: number) => ({
      x: originX + x * xScale,
      y: originY - y * yScale,
    });

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    if (options.showVerticalGrid) {
      const xStep = Math.max(1, Math.floor(xRange / 20));
      for (
        let x = Math.ceil(settings.xMin / xStep) * xStep;
        x <= settings.xMax;
        x += xStep
      ) {
        if (x !== 0) {
          const cx = mathToCanvas(x, 0).x;
          ctx.beginPath();
          ctx.moveTo(cx, 0);
          ctx.lineTo(cx, enforcedHeight);
          ctx.stroke();
        }
      }
    }

    if (options.showHorizontalGrid) {
      const yStep = Math.max(1, Math.floor(yRange / 20));
      for (
        let y = Math.ceil(settings.yMin / yStep) * yStep;
        y <= settings.yMax;
        y += yStep
      ) {
        if (y !== 0) {
          const cy = mathToCanvas(0, y).y;
          ctx.beginPath();
          ctx.moveTo(0, cy);
          ctx.lineTo(enforcedWidth, cy);
          ctx.stroke();
        }
      }
    }

    // Draw axes
    ctx.strokeStyle = options.xAxis.color;
    ctx.lineWidth = 2;

    if (options.xAxis.show && settings.yMin <= 0 && settings.yMax >= 0) {
      const y0 = mathToCanvas(0, 0).y;
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(enforcedWidth, y0);
      ctx.stroke();
    }

    if (options.yAxis.show && settings.xMin <= 0 && settings.xMax >= 0) {
      ctx.strokeStyle = options.yAxis.color;
      const x0 = mathToCanvas(0, 0).x;
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, enforcedHeight);
      ctx.stroke();
    }

    // Draw axis numbers (same as before)
    // ... (copy your existing code for axis numbers here)

    // Draw function
    if (!functionExpression) return;

    let compiled;
    try {
      compiled = math.compile(functionExpression);
    } catch (err) {
      console.error('Failed to compile expression:', err);
      return;
    }

    // Generate points
    const steps = 1000;
    const stepSize = (settings.xMax - settings.xMin) / steps;
    ctx.strokeStyle = options.lineColor;
    ctx.lineWidth = options.lineWidth;

    if (options.lineStyle === 'dotted') {
      ctx.setLineDash([options.lineWidth, options.lineWidth * 2.5]);
      ctx.lineCap = 'round';
    } else if (options.lineStyle === 'dashed') {
      ctx.setLineDash([options.lineWidth * 4, options.lineWidth * 2.5]);
      ctx.lineCap = 'butt';
    } else {
      ctx.setLineDash([]);
      ctx.lineCap = 'round';
    }

    ctx.beginPath();
    let isFirstPoint = true;
    for (let i = 0; i <= steps; i++) {
      const x = settings.xMin + i * stepSize;
      let y: number;
      try {
        y = compiled.evaluate({ x });
      } catch {
        y = NaN;
      }
      if (typeof y !== 'number' || !isFinite(y)) {
        isFirstPoint = true; // break line if invalid
        continue;
      }
      if (y < settings.yMin || y > settings.yMax) {
        isFirstPoint = true; // break line out of bounds
        continue;
      }
      const pt = mathToCanvas(x, y);
      if (isFirstPoint) {
        ctx.moveTo(pt.x, pt.y);
        isFirstPoint = false;
      } else {
        ctx.lineTo(pt.x, pt.y);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineCap = 'round';
  }, [functionExpression, settings, options, enforcedWidth, enforcedHeight]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};
