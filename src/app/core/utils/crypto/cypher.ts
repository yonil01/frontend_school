import * as CryptoJS from 'crypto-js';

export const encryptText = (password: string, secretKey: string) => {
  return CryptoJS.AES.encrypt(password, secretKey).toString();
};

export const decryptText = (password: string, secretKey: string) => {
  const bytes  = CryptoJS.AES.decrypt(password, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
