import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { config } from "../config";
import { useCanvasContext } from "../hooks/useCanvasContext";
import { useSprite } from "../hooks/useSprite";
import { convertToRealPosition, getMouseTilePosition } from "../tools";

const Tileset = styled.canvas`
  cursor: pointer;
`;

export function TilesetPicker() {
  const { tilesetSource, setCurrentTile, getStoredSource, setTilesetSource } =
    useSprite();
  const [useStore] = useState(() => useCanvasContext());
  const { context, setContext, drawRect } = useStore();

  const tilesetRef = useRef<HTMLCanvasElement>(null);
  const { padding } = config.tileset.outline;

  const handleTilesetClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !tilesetRef.current || !tilesetSource) return;

    const { width, height } = tilesetRef.current;
    const { tileset } = config;

    const mousePos = getMouseTilePosition({
      event: e,
      size: { width, height },
      gridSize: tileset,
    });

    setCurrentTile(mousePos);

    const { X, Y } = convertToRealPosition({
      position: mousePos,
      size: tilesetRef.current,
      gridSize: tileset,
    });

    context.clearRect(0, 0, width, height);

    context.drawImage(
      tilesetSource,
      0,
      0,
      tilesetRef.current.width,
      tilesetRef.current.height
    );

    drawRect({
      size: {
        width: width / tileset.widthCount - padding,
        height: height / tileset.heightCount - padding,
      },
      position: { x: X + padding / 2, y: Y + padding / 2 },
      outline: config.tileset.outline,
    });
  };

  useEffect(() => {
    if (!tilesetRef.current) return;

    const { tileset, scale, quality } = config;

    tilesetRef.current.width = tileset.widthCount * scale[0] * quality;
    tilesetRef.current.height = tileset.heightCount * scale[1] * quality;

    const tilesetContext = tilesetRef.current.getContext("2d");
    if (!tilesetContext) return;
    tilesetContext.imageSmoothingEnabled = false;
    setContext(tilesetContext);

    if (tilesetSource) {
      tilesetContext.drawImage(
        tilesetSource,
        0,
        0,
        tilesetRef.current.width,
        tilesetRef.current.height
      );
      const { width, height } = tilesetRef.current;
      const { tileset } = config;
      const { X, Y } = convertToRealPosition({
        position: { x: 0, y: 0 },
        size: tilesetRef.current,
        gridSize: tileset,
      });
      drawRect({
        size: {
          width: width / tileset.widthCount - padding,
          height: height / tileset.heightCount - padding,
        },
        position: { x: X + padding / 2, y: Y + padding / 2 },
        outline: config.tileset.outline,
      });
    } else {
      const imageSrc = getStoredSource();
      if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
          setTilesetSource(image);
        };
        return;
      }
    }
  }, [tilesetSource]);

  return <Tileset ref={tilesetRef} onMouseDown={handleTilesetClick}></Tileset>;
}
