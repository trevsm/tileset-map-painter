import Artboard from "./Artboard";
import Tools from "./Tools";
import "./styles.css";
import { TilesetPicker } from "./TilesetPicker";
import styled from "styled-components";
import { useState } from "react";

const Floating = styled.div<{ visible: boolean }>`
  width: fit-content;
  padding: 10px;
  opacity: 0.95;
  position: fixed;
  right: 0;
  top: 0;
  background-color: white;
  box-shadow: 0 0 12px 1px #00000040;
  transform: translateX(${({ visible }) => (visible ? "0" : "100%")});
  transition: transform 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  font-family: monospace;
  transform: translateX(-67px) translateY(25px) rotate(-90deg);
`;

export default function App() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <Floating visible={visible}>
        <CloseButton onClick={() => setVisible(!visible)}>
          {visible ? "hide tools" : "show tools"}
        </CloseButton>
        <TilesetPicker />
        <Tools />
      </Floating>
      <Artboard />
    </>
  );
}
