import {Injectable} from '@angular/core';
import {supportedFormats} from "@app/core/utils/static/data";

const signatures: any = {
  JVBERi0: {contentType: 'application/pdf', extension: 'pdf'},
  R0lGODdh: {contentType: 'image/gif', extension: 'gif'},
  R0lGODlh: {contentType: 'image/gif', extension: 'gif'},
  iVBORw0KGgo: {contentType: 'image/png', extension: 'png'},
  '/9j/4AAQSkZ': {contentType: 'image/jpeg', extension: 'jpg'},
  PD94bWwgdm: {contentType: 'image/svg+xml', extension: 'svg'},
  SUkq: {contentType: 'image/tif', extension: 'tif'},
};

@Injectable({
  providedIn: 'root',
})
export class SourceFileService {
  constructor() {
  }

  // private getBlob(b64Data: string, contentType = '', sliceSize = 512): Blob {
  //   const byteCharacters = atob(b64Data);
  //   const byteArrays = [];

  //   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  //     const slice = byteCharacters.slice(offset, offset + sliceSize);

  //     const byteNumbers = new Array(slice.length);
  //     for (let i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }

  //     const byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }

  //   const blob = new Blob(byteArrays, { type: contentType });
  //   return blob;
  // }

  private getType(b64: string): { contentType: string; extension: string } {
    for (const s in signatures) {
      if (b64.indexOf(s) === 0) {
        return signatures[s];
      }
    }
    return {
      contentType: '',
      extension: ''
    }
  }

  public getSourceFile(fileEncode: string, extension: string = ''): { urlBase64: string; contentType: string; extension: string } {
    const type = this.getType(fileEncode);
    const urlBase64 = `data:${type?.contentType};base64,${fileEncode}`;
    return {urlBase64: urlBase64, ...type};
  }

  private getTypeFile(extension: string) {
    const formatFile: any = supportedFormats.find((format: any) => {
      return format.extension === extension
    })

    return formatFile ? {
      contentType: formatFile.type,
      extension: formatFile.extension
    } : {
      contentType: '',
      extension: ''
    }

  }

  public getSourceFileV2(fileEncode: string, extension: string = '') {
    const type = this.getTypeFile(extension);
    const urlBase64 = `data:${type?.contentType};base64,${fileEncode}`;
    return {urlBase64: urlBase64, ...type};
  }
}
