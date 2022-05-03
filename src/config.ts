export interface IConfig {
  quality: number;
  scale: [number, number];
  blockSize: number;
  tileset: {
    widthCount: number;
    heightCount: number;
    outline: {
      width: number;
      padding: number;
    };
  };
}

export const config: IConfig = {
  quality: 5,
  scale: [10, 10],
  blockSize: 16,
  tileset: {
    widthCount: 8,
    heightCount: 8,
    outline: {
      width: 2,
      padding: 2,
    },
  },
};
