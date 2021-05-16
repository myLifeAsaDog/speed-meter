export interface MeterProps {
  gaugeHeight?: number;           // メーターの横幅(px)
  gaugeWidth?: number;            // メーターの縦幅(px)
  gaugeStart?: number;            // 目盛りの始まりの角度(deg)
  gaugeEnd?: number;              // 目盛りの終わりの角度(deg)
  gaugeScales?: number;           // 目盛りの数
  gaugeUnits?: string;            // 単位表示
  gaugeInterval?: number;         // 目盛りに数値を表示する間隔
  currentValue: number;           // ゲージの現在の値
  scaleCoefficient?: number;      // 目盛りの係数
  gaugeLimit: number;             // メーターの最高値
  redzone?: number;               // レッドゾーン
  gaugeOutlineColor?: string;     // 外枠の色
  gaugeColor?: string;            // 目盛りと文字の色
  gaugeBackgroundColor?: string;  // 背景色
}

export interface StyleProps {
  'gauge-height': string; 
  'gauge-width': string;
  'scale-deg': string;
  'offset-deg': string;
  'outline-border': string;
  'scale-height': string;
  'scale-origin': string;
  'meter-deg': string;
  'gauge-outline-color': string;
  'gauge-color': string;
  'gauge-background-color': string;
};