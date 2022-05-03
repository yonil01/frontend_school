export const onlyNumbers = (value: KeyboardEvent) => {
  const key = value.charCode;
  return key >= 48 && key <= 57;
};

export const onlyLetters = (value: KeyboardEvent): boolean => {
  const key = value.keyCode || value.which;
  let tecla = String.fromCharCode(key).toLowerCase();
  let letras = " áéíóúabcdefghijklmnñopqrstuvwxyzñ";
  let especiales = [8, 37, 39];
  let tecla_especial = false;
  for (let i in especiales) {
    if (key == especiales[i]) {
      tecla_especial = true;
      break;
    }
  }

  return !(letras.indexOf(tecla) == -1 && !tecla_especial);
}
