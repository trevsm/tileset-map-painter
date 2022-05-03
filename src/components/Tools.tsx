import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSprite } from "../hooks/useSprite";
import { useTileGrid } from "../hooks/useTileGrid";
import { useTools, Tool } from "../hooks/useTools";
import { downloadObjectAsJson } from "../tools";

const SizeInput = styled.input`
  width: 50px;
`;

export default function Tools() {
  const { currentTile } = useSprite();
  const { selectedTool, setTool } = useTools();
  const { getDimensions, setDimensions, getGrid } = useTileGrid();

  const [dim, setDim] = useState(getDimensions());

  const withinLimit = (value: number) => {
    if (value > 0 && value <= 100) return true;
    return false;
  };

  const handleDownload = () => {
    const { widthCount, heightCount } = getDimensions();

    // grid trimmed to widthCount and heightCount
    const finalGrid = getGrid()
      .map((row) => row.filter((_, i) => i < widthCount))
      .filter((_, i) => i < heightCount);

    downloadObjectAsJson(finalGrid, "tileset_values");
  };

  useEffect(() => {
    setDimensions(dim);
  }, [dim]);

  useEffect(() => {
    setTool(Tool.draw);
  }, [currentTile]);

  return (
    <div>
      <label>
        Draw
        <input
          type="radio"
          name="tool"
          onChange={() => setTool(Tool.draw)}
          checked={selectedTool === Tool.draw}
        />
      </label>
      <label>
        Erase
        <input
          type="radio"
          name="tool"
          onChange={() => setTool(Tool.erase)}
          checked={selectedTool === Tool.erase}
        />
      </label>
      <br />
      <br />
      <label>
        Artboard Size:{" "}
        <SizeInput
          type="number"
          value={dim.widthCount}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (withinLimit(value))
              setDim((state) => ({
                ...state,
                widthCount: value,
              }));
          }}
        />
        <SizeInput
          type="number"
          value={dim.heightCount}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (withinLimit(value))
              setDim((state) => ({
                ...state,
                heightCount: value,
              }));
          }}
        />
      </label>
      <br />
      <br />
      <button onClick={handleDownload}>Download Json</button>
    </div>
  );
}
