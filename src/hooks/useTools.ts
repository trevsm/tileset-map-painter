import create from "zustand";

export enum Tool {
  draw,
  erase,
  replaceAll,
}

interface ToolState {
  selectedTool: Tool;
  setTool: (tool: Tool) => void;
}

export const useTools = create<ToolState>((set) => ({
  selectedTool: Tool.draw,
  setTool: (tool: Tool) => set({ selectedTool: tool }),
}));
