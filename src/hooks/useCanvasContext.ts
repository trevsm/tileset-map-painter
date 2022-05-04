import create from "zustand";
import { IConfig } from "../config";
import { Tile } from "./useTileGrid";

export interface CanvasState {
  context: CanvasRenderingContext2D | null;
  setContext: (context: CanvasRenderingContext2D | null) => void;
  drawRect: ({
    size,
    position,
    outline,
  }: {
    size: { width: number; height: number };
    position: { X: number; Y: number };
    outline: { width: number; padding: number; color?: string };
  }) => void;
  drawTile: ({
    image,
    index,
    position,
    altContext,
    opacity,
  }: {
    image: HTMLImageElement;
    index: Tile | null;
    position: { X: number; Y: number };
    altContext?: CanvasRenderingContext2D;
    config: IConfig;
    opacity?: number;
  }) => void;
}
export const useCanvasContext = () =>
  create<CanvasState>((set, get) => ({
    context: null,
    setContext: (context) => {
      set({ context });
    },
    drawRect: ({ size, position, outline }) => {
      const { context } = get();
      if (context) {
        context.lineWidth = outline.width;
        context.strokeStyle = outline.color || "#000";
        context.beginPath();
        context.rect(position.X, position.Y, size.width, size.height);
        context.stroke();
      }
    },
    drawTile: ({ image, index, position, altContext, config, opacity = 1 }) => {
      const { blockSize, tileset } = config;

      const int = 1;

      const width = 50;
      const height = 50;

      const { context } = get();

      if (!index) {
        context?.clearRect(position.X, position.Y, width, height);
        return;
      }

      const sx = blockSize * index.x;
      const sy = blockSize * (tileset.heightCount - 1 - index.y);

      if (altContext) {
        altContext.globalAlpha = opacity;
        altContext.drawImage(
          image,
          sx + int / 2,
          sy + int / 2,
          blockSize - int,
          blockSize - int,
          position.X,
          position.Y,
          width,
          height
        );
        return;
      }
      if (context) context.globalAlpha = opacity;
      context?.drawImage(
        image,
        sx + int / 2,
        sy + int / 2,
        blockSize - int,
        blockSize - int,
        position.X,
        position.Y,
        width,
        height
      );
    },
  }));
