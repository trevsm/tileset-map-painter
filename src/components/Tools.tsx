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
  const { currentTile, setTilesetSource, size, setSize, getStoredSize } =
    useSprite();
  const { selectedTool, setTool } = useTools();
  const { getDimensions, setDimensions, getGrid } = useTileGrid();

  const [dim, setDim] = useState(getDimensions());
  const storedSize = getStoredSize();
  const [tilsetSize, setTilesetSize] = useState(storedSize ? storedSize : size);

  const artboardLimit = (value: number) => {
    if (value > 0 && value <= 100) return true;
    return false;
  };

  const tilesetLimit = (value: number) => {
    if (value > 0 && value <= 30) return true;
    return false;
  };

  const handleDownload = () => {
    const { widthCount, heightCount } = getDimensions();

    // grid trimmed to widthCount and heightCount
    const finalGrid = getGrid()
      .filter((_, i) => i < widthCount)
      .map((row) => row.filter((_, i) => i < heightCount));

    downloadObjectAsJson(finalGrid, "tileset_values");
  };

  const handleTilesetImageUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      const image = new Image();
      image.src = reader.result as string;
      image.onload = () => {
        setTilesetSource(image);
      };
    };
  };

  useEffect(() => {
    setDimensions(dim);
  }, [dim]);

  useEffect(() => {
    setSize(tilsetSize);
  }, [tilsetSize]);

  useEffect(() => {
    if (selectedTool == Tool.erase) setTool(Tool.draw);
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
      <label>
        Fill All
        <input
          type="radio"
          name="tool"
          onChange={() => setTool(Tool.replaceAll)}
          checked={selectedTool === Tool.replaceAll}
        />
      </label>
      <br />
      <p>
        <label>
          Tileset Size:{" "}
          <SizeInput
            type="number"
            value={tilsetSize?.widthCount}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (tilesetLimit(value))
                setTilesetSize((state) => ({
                  ...state,
                  widthCount: value,
                }));
            }}
          />
          <SizeInput
            type="number"
            value={tilsetSize?.heightCount}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (tilesetLimit(value))
                setTilesetSize((state) => ({
                  ...state,
                  heightCount: value,
                }));
            }}
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
              if (artboardLimit(value))
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
              if (artboardLimit(value))
                setDim((state) => ({
                  ...state,
                  heightCount: value,
                }));
            }}
          />
        </label>
      </p>
      <hr />
      <label>
        <p>Upload tileset image:</p>
        <input type="file" onChange={handleTilesetImageUpload} />
      </label>
      <button onClick={handleDownload}>Download Json</button>
    </div>
  );
}
