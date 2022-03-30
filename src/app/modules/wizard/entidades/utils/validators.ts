import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if((control.value as string).indexOf(' ') >= 0){
      return {noWhiteSpace: true}
    }
    return null;
  }
}
export function nonUpperCaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /^[a-z0-9_\-]+$/g
    if (regex.test(control.value)) {
      return null;
    } else {
      return { lowercase: true }
    }
  }
}

