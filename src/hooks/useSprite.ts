import create from "zustand";
import { Tile } from "./useTileGrid";

interface SpriteState {
  currentTile: Tile | null;
  tilesetSource: HTMLImageElement | null;
  setCurrentTile: (tile: { x: number; y: number }) => void;
  setTilesetSource: (source: HTMLImageElement | null) => void;
}

export const useSprite = create<SpriteState>((set) => ({
  currentTile: { x: 0, y: 0 },
  setCurrentTile: (tile) => set({ currentTile: tile }),
  tilesetSource: null,
  setTilesetSource: (source: HTMLImageElement | null) =>
    set({ tilesetSource: source }),
}));
