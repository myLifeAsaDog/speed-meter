export interface MeterProps {
  height?: number; // メーターの横幅(px)
  width?: number; //メーターの縦幅(px)
  start?: number; // 目盛りの始まりの角度(deg)
  end?: number; //目盛りの終わりの角度(deg)
  scales?: number; // 目盛りの数、0があるので実際にはこれより一つ多くなる
}

export type PickType<T, K extends keyof T> = T[K];

export interface StyleProps {
  'height': string; 
  'width': string;
  'scale-deg': string;
  'offset-deg': string;
  'outline-border': string;
  'scale-height': string;
  'scale-origin': string;
  'meter-deg': string;
};