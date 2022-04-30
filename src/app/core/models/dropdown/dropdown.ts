import {DropdownModel} from "ecapture-ng-ui/lib/modules/dropdown/models/dropdown";

export const dropStyle: DropdownModel = {
  container: {
    background: 'bg-mono-10 border-mono-10 border-4 rounded-lg border-solid border-mono-30 h-12 hover:border-mono-30',
    border: {
      color: 'border-mono-10',
      size: 'border-4',
      round: 'rounded-lg',
      style: 'border-solid',
      hover: 'border-mono-30'
    }
  },
  optionContainer: {
    background: 'bg-mono-10 border-mono-30 border-2 rounded border-solid mt-2 w-full p-4',
    border: {
      color: 'border-mono-30',
      size: 'border-2',
      round: 'rounded',
      style: 'border-solid pl-2',
      hover: 'bg-mono-30'
    }
  },
  textColor: 'text-black'
};
