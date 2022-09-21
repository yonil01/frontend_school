export interface DropdownModel {
  container: container;
  optionContainer: container;
  textColor: string;
}

interface container {
  background: string;
  border: borderStyle;
}

interface borderStyle {
  color: string;
  size: string;
  style: string;
  round: string;
  hover: string;
}
