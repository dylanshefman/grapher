export interface GraphSettings {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface AxisOptions {
  show: boolean;
  color: string;
  showNumbers: boolean;
  decimals: number;
  numberPlacement: string; // 'above' | 'below' for X, 'left' | 'right' for Y
}

export interface GraphOptions {
  lineColor: string;
  backgroundColor: string;
  showVerticalGrid: boolean;
  showHorizontalGrid: boolean;
  lineWidth: number;
  lineStyle?: 'solid' | 'dotted' | 'dashed';
  showArrows?: boolean;
  arrowColor?: string;
  arrowRadius?: number;
  arrowWidth?: number;
  xAxis: AxisOptions;
  yAxis: AxisOptions;
  gridBorderColor?: string;
  gridBorderRadius?: number;
  gridBorderWidth?: number;
  showGridBorder?: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface MathSymbol {
  symbol: string;
  display: string;
  description: string;
}