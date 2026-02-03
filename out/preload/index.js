"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  // Database operations
  getBooks: () => electron.ipcRenderer.invoke("db:getBooks"),
  getBook: (id) => electron.ipcRenderer.invoke("db:getBook", id),
  addBook: (book) => electron.ipcRenderer.invoke("db:addBook", book),
  updateBook: (id, data) => electron.ipcRenderer.invoke("db:updateBook", id, data),
  deleteBook: (id) => electron.ipcRenderer.invoke("db:deleteBook", id),
  // Categories
  saveBook: (book) => electron.ipcRenderer.invoke("db:saveBook", book),
  // Modified: Replaced getBook, addBook, updateBook, deleteBook with saveBook
  // Categories (kept from original)
  getCategories: () => electron.ipcRenderer.invoke("db:getCategories"),
  // Tags (kept from original)
  getTags: () => electron.ipcRenderer.invoke("db:getTags"),
  // Statistics (kept from original)
  getStatistics: () => electron.ipcRenderer.invoke("db:getStatistics"),
  // PDF operations (new/modified from original file operations)
  selectPdfFile: () => electron.ipcRenderer.invoke("file:selectPdf"),
  getPdfMetadata: (path) => electron.ipcRenderer.invoke("pdf:getMetadata", path),
  extractPdfText: (path, page) => electron.ipcRenderer.invoke("pdf:extractText", path, page),
  savePageContent: (bookId, pageNum, content) => electron.ipcRenderer.invoke("db:savePageContent", { bookId, pageNum, content }),
  closeBook: (path) => electron.ipcRenderer.invoke("pdf:closeBook", path),
  getPageAsImage: (path, pageNum) => electron.ipcRenderer.invoke("pdf:getPageAsImage", path, pageNum),
  // OCR operations (new)
  performOcr: (imageBuffer, lang) => electron.ipcRenderer.invoke("ocr:recognize", imageBuffer, lang),
  // Progress events (modified callback signature)
  onProgress: (callback) => {
    electron.ipcRenderer.on("pdf:progress", (_, data) => callback(data));
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
