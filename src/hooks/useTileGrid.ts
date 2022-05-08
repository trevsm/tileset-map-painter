import create from "zustand";
import { convertToRealPosition } from "../tools";

const localGridKey = "tile-grid";
const localDimensionsKey = "tile-grid-dimensions";

export interface Tile {
  x: number;
  y: number;
}

const initialDimensions = {
  widthCount: 10,
  heightCount: 10,
};

export interface TileGridState {
  dimensions: { widthCount: number; heightCount: number };
  getDimensions: () => { widthCount: number; heightCount: number };
  setDimensions: (dimensions: {
    widthCount: number; // integers
    heightCount: number; // integers
  }) => void;
  initilizeGrid: () => void;
  resizeGrid: () => void;
  offsetGrid: (offset: { x: number; y: number }) => void;
  getGrid: () => Tile[][];
  setGrid: (grid: (Tile | null)[][]) => void;
  setTile: ({
    tile,
    position,
  }: {
    tile: Tile | null;
    position: { x: number; y: number };
  }) => void;
  loopGrid: (
    board: { width: number; height: number },
    callback: (
      position: { X: number; Y: number },
      index: { x: number; y: number } | null
    ) => void
  ) => void;
}

export const useTileGrid = create<TileGridState>((set, get) => ({
  dimensions: initialDimensions,
  getDimensions: () => {
    const dimensions = localStorage.getItem(localDimensionsKey);
    return dimensions ? JSON.parse(dimensions) : initialDimensions;
  },
  setDimensions: (dimensions) => {
    if (
      dimensions.widthCount > 0 &&
      dimensions.heightCount > 0 &&
      dimensions.widthCount <= 100 &&
      dimensions.heightCount <= 100
    ) {
      localStorage.setItem(localDimensionsKey, JSON.stringify(dimensions));
      set({ dimensions });
    }
  },
  offsetGrid: ({ x, y }) => {
    const { setGrid, setDimensions } = get();
    const grid = get().getGrid();

    let newGrid = [...grid];

    console.log(grid);

    if (x > 0)
      newGrid = [...Array(x).fill(Array(grid[0].length).fill(null)), ...grid];
    console.log(newGrid);

    if (x < 0) newGrid = newGrid.filter((_, idx) => idx >= Math.abs(x));

    if (y > 0) newGrid = newGrid.map((row) => [...Array(y).fill(null), ...row]);
    if (y < 0)
      newGrid = newGrid.map((row) =>
        row.filter((_, idx) => idx >= Math.abs(y))
      );

    if (x !== 0 || y !== 0) {
      setDimensions({
        widthCount: newGrid.length,
        heightCount: newGrid[0].length,
      });
      setGrid(newGrid);
    }
  },
  initilizeGrid: () => {
    const { widthCount, heightCount } = get().getDimensions();
    const { setGrid } = get();
    const initial = Array(widthCount)
      .fill(null)
      .map(() => Array(heightCount).fill(null));
    setGrid(initial);
  },
  resizeGrid: () => {
    const { widthCount, heightCount } = get().getDimensions();
    const { setGrid } = get();
    const grid = get().getGrid();
    if (!grid || !grid[0]) return;
    if (grid.length > widthCount || grid[0].length > heightCount) return;
    const newGrid = Array(widthCount)
      .fill(null)
      .map(() => Array(heightCount).fill(null));
    newGrid.forEach((row, x) =>
      row.forEach((_, y) => {
        if (grid[x] && grid[x][y]) {
          newGrid[x][y] = grid[x][y];
        }
      })
    );
    setGrid(newGrid);
  },
  getGrid: () => {
    const grid = localStorage.getItem(localGridKey);
    return grid ? JSON.parse(grid) : [];
  },
  setGrid: (grid) => {
    localStorage.setItem(localGridKey, JSON.stringify(grid));
  },
  setTile: ({ tile, position }) => {
    const { setGrid, getGrid } = get();

    const newGrid = getGrid().map((row, x) =>
      row.map((cell, y) => {
        if (x === position.x && y === position.y) {
          return tile;
        }
        return cell;
      })
    );

    setGrid(newGrid);
  },
  loopGrid: (board, callback) => {
    const grid = get().getGrid();
    const gridSize = get().getDimensions();
    const { width, height } = board;

    grid.forEach((row, x) =>
      row.forEach((tile, y) => {
        const index = tile ? { x: tile.x, y: tile.y } : null;
        const position = convertToRealPosition({
          position: { x, y },
          size: { width, height },
          gridSize,
        });

        callback(position, index);
      })
    );
  },
}));
