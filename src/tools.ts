export function getMouseTilePosition({
  event,
  size,
  gridSize,
}: {
  event: any;
  size: { width: number; height: number };
  gridSize: { widthCount: number; heightCount: number };
}) {
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  const xPos = event.clientX - rect.left;
  const yPos = event.clientY - rect.top;

  const x = Math.floor(xPos / (size.width / gridSize.widthCount));
  const y =
    gridSize.heightCount -
    1 -
    Math.floor(yPos / (size.height / gridSize.heightCount));

  return { x, y };
}

export const convertToRealPosition = ({
  position,
  size,
  gridSize,
}: {
  position: { x: number; y: number };
  size: { width: number; height: number };
  gridSize: { heightCount: number; widthCount: number };
}) => {
  const X = (size.width / gridSize.widthCount) * position.x;
  const Y =
    size.height - (size.height / gridSize.heightCount) * (position.y + 1);
  return { X, Y };
};

export function downloadObjectAsJson(exportObj: any, exportName: string) {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
