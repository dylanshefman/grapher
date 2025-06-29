import { create, all } from 'mathjs';
import { Point } from '../types';

const math = create(all);
math.import({
  import: () => { throw new Error('Function import is disabled'); },
  createUnit: () => { throw new Error('Function createUnit is disabled'); },
  evaluate: () => { throw new Error('Function evaluate is disabled'); },
  parse: () => { throw new Error('Function parse is disabled'); },
  simplify: () => { throw new Error('Function simplify is disabled'); },
  derivative: () => { throw new Error('Function derivative is disabled'); }
}, { override: true });

export class MathParser {
  public static isValidFunction(func: string): boolean {
    const cleaned = func.trim().replace(/^y\s*=\s*/, '');
    try {
      const compiled = math.compile(cleaned);
      // Check that it has a dependency on "x"
      return compiled.toString().includes('x');
    } catch {
      return false;
    }
  }

  public static evaluateFunction(func: string, x: number): number | null {
    try {
      const cleaned = func.trim().replace(/^y\s*=\s*/, '');
      const scope = { x };
      const result = math.evaluate(cleaned, scope);
      if (typeof result !== 'number' || !isFinite(result)) return null;
      return result;
    } catch {
      return null;
    }
  }

  public static generatePoints(func: string, xMin: number, xMax: number, steps = 1000): Point[] {
    const cleaned = func.trim().replace(/^y\s*=\s*/, '');
    let compiled;
    try {
      compiled = math.compile(cleaned);
    } catch {
      return [];
    }

    const points: Point[] = [];
    const stepSize = (xMax - xMin) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * stepSize;
      try {
        const y = compiled.evaluate({ x });
        if (typeof y === 'number' && isFinite(y)) {
          points.push({ x, y });
        }
      } catch {
        // skip invalid points
      }
    }

    return points;
  }
}
