import {WebcamImage} from "ngx-webcam";

export const replaceAll = (str: string, find: string, replace: string): string => {
  return str.replace(new RegExp(find, 'g'), replace);
}

export const convertImagesToDocuments = (documents: WebcamImage[]) => {
  const images: any[] = [];
  for (let image of documents) {
    if (image.imageAsDataUrl !== '') {
      images.push({
        image: image.imageAsDataUrl.replace('data:image/png;base64,', ''),
        width: 591,
        height: 837,
      });
    }
  }
  return images;
}
