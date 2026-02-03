export {}

declare global {
  interface Window {
    api: {
      getBook: (id: number) => Promise<any>
      extractPdfText: (filePath: string, pageNum: number) => Promise<string>
      getPageAsImage: (filePath: string, pageNum: number) => Promise<any>
      performOcr: (imageBuffer: any, lang: string) => Promise<string>
      closeBook: (filePath: string) => void
    }
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>
        on: (channel: string, func: any) => void
        removeListener: (channel: string, func: any) => void
      }
    }
  }
}
