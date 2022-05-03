import create from "zustand";
import { Tile } from "./useTileGrid";

interface SpriteState {
  currentTile: Tile | null;
  tilesetSource: HTMLImageElement | null;
  getStoredSource: () => string | null;
  setCurrentTile: (tile: { x: number; y: number }) => void;
  setTilesetSource: (source: HTMLImageElement | null) => void;
}

const sourceKey = "tilset-source";

export const useSprite = create<SpriteState>((set) => ({
  currentTile: { x: 0, y: 0 },
  setCurrentTile: (tile) => set({ currentTile: tile }),
  tilesetSource: null,
  getStoredSource: () => {
    const source = localStorage.getItem(sourceKey);
    if (source) return source;
    return null;
  },
  setTilesetSource: (source: HTMLImageElement | null) => {
    set({ tilesetSource: source });
    localStorage.setItem(sourceKey, source?.src as string);
  },
}));
