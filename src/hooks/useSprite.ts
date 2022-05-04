import create from "zustand";
import { Tile } from "./useTileGrid";

interface SpriteState {
  currentTile: Tile | null;
  size: { widthCount: number; heightCount: number };
  setSize: (size: { widthCount: number; heightCount: number }) => void;
  getStoredSize: () => { widthCount: number; heightCount: number } | null;
  tilesetSource: HTMLImageElement | null;
  getStoredSource: () => string | null;
  setCurrentTile: (tile: { x: number; y: number }) => void;
  setTilesetSource: (source: HTMLImageElement | null) => void;
}

const sourceKey = "tilset-source";
const sizeKey = "tilset-size";

export const useSprite = create<SpriteState>((set) => ({
  currentTile: { x: 0, y: 0 },
  size: { widthCount: 10, heightCount: 10 },
  setSize: (size) => {
    localStorage.setItem(sizeKey, JSON.stringify(size));
    set({ size });
  },
  getStoredSize: () => {
    const size = localStorage.getItem(sizeKey);
    if (size) return JSON.parse(size);
    return null;
  },
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
