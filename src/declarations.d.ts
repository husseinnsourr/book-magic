declare module 'node-tesseract-ocr' {
  export interface Config {
    lang?: string;
    oem?: number;
    psm?: number;
    [key: string]: any;
  }

  export function recognize(image: string | Buffer, config?: Config): Promise<string>;
}

declare module 'pdfjs-dist/legacy/build/pdf.mjs' {
  export * from 'pdfjs-dist';
}
