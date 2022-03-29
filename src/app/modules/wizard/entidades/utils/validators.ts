import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if((control.value as string).indexOf(' ') >= 0){
      return {noWhiteSpace: true}
    }
    return null;
  }
}
