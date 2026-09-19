import { Presets } from 'rete-react-plugin'
import styled from 'styled-components'

const { Menu, Item } = Presets.contextMenu

/** Same look as the former context-menu.js theme: white, rounded, shadowed. */
export const ContextMenuRoot = styled(Menu)`
  padding: 2px 0;
  width: max-content;
  min-width: 125px;
  max-width: 320px;
  background-color: #fff;
  border: none;
  border-radius: 5px;
  box-shadow: 4px 5px 12px rgba(0, 0, 0, 0.5);
  font-family: Arial, sans-serif;
  font-size: 13px;
`

// `hasSubitems` is a styling prop of the preset item; keep it away from the DOM.
export const ContextMenuItem = styled(Item).withConfig({
  shouldForwardProp: (prop) => prop !== 'hasSubitems',
})`
  padding: 6px 12px;
  color: #000;
  background-color: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`
