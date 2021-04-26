export interface MeterProps {
  guageHeight?: number;       // メーターの横幅(px)
  guageWidth?: number;        //メーターの縦幅(px)
  guageStart?: number;        // 目盛りの始まりの角度(deg)
  guageEnd?: number;          //目盛りの終わりの角度(deg)
  guageScales?: number;       // 目盛りの数
  guageUnits?: string;        // 単位表示
  guageInterval?: number;     // 目盛りに数値を表示する間隔
  currentValue: number;       //ゲージの現在の値
  scaleCoefficient?: number;  //目盛りの係数
  guageLimit: number;         //メーターの最高値
}

export type PickType<T, K extends keyof T> = T[K];

export interface StyleProps {
  'guage-height': string; 
  'guage-width': string;
  'scale-deg': string;
  'offset-deg': string;
  'outline-border': string;
  'scale-height': string;
  'scale-origin': string;
  'meter-deg': string;
};