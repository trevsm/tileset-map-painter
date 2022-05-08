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
  const { getDimensions, setDimensions, getGrid, offsetGrid, setGrid } =
    useTileGrid();

  const [dim, setDim] = useState(getDimensions());
  const storedSize = getStoredSize();
  const [tilesetSize, setTilesetSize] = useState(
    storedSize ? storedSize : size
  );
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  const handleImport = (e: any) => {
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);

    reader.onload = (event: any) => {
      const result = JSON.parse(event.target.result);
      setGrid(result);
    };
  };

  useEffect(() => {
    setSize(tilesetSize);
  }, []);

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
          Offset Artwork:{" "}
          <SizeInput
            type="number"
            value={offset.x}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setOffset((state) => ({
                ...state,
                x: value,
              }));
            }}
          />
          <SizeInput
            type="number"
            value={offset.y}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setOffset((state) => ({
                ...state,
                y: value,
              }));
            }}
          />
          <button
            onClick={() => {
              offsetGrid(offset);
            }}
          >
            set
          </button>
        </label>
        <br />
        <br />
        <label>
          Tileset Size:{" "}
          <SizeInput
            type="number"
            value={tilesetSize?.widthCount}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setTilesetSize((state) => ({
                ...state,
                widthCount: value,
              }));
            }}
          />
          <SizeInput
            type="number"
            value={tilesetSize?.heightCount}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setTilesetSize((state) => ({
                ...state,
                heightCount: value,
              }));
            }}
          />
          <button
            onClick={() => {
              if (
                tilesetLimit(tilesetSize.heightCount) &&
                tilesetLimit(tilesetSize.widthCount)
              )
                setSize(tilesetSize);
              else
                alert(
                  "Unable to set tileset size. Must be within {0<values<30}"
                );
            }}
          >
            set
          </button>
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
              setDim((state) => ({
                ...state,
                heightCount: value,
              }));
            }}
          />
          <button
            onClick={() => {
              if (
                artboardLimit(dim.widthCount) &&
                artboardLimit(dim.heightCount)
              )
                setDimensions(dim);
              else alert("Unable to set. Must be within {0<values<100}");
            }}
          >
            set
          </button>
        </label>
      </p>
      <hr />
      <label>
        <p>Upload tileset image:</p>
        <input type="file" onChange={handleTilesetImageUpload} />
      </label>
      <label>
        <p>Import artboard (.json)</p>
        <input type="file" onChange={handleImport} accept="application/json" />
      </label>
      <button onClick={handleDownload}>Export artboard </button>
    </div>
  );
}
