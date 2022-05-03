export interface IConfig {
  tilesetPath: string;
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
  tilesetPath: "assets/tileset2.png",
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
