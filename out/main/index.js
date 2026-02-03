"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const Database = require("better-sqlite3");
const fs = require("fs");
const zod = require("zod");
const lruCache = require("lru-cache");
const child_process = require("child_process");
const net = require("net");
function createTables(db2) {
  const run = (sql) => db2.prepare(sql).run();
  run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      profile_picture TEXT,
      join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      preferences TEXT DEFAULT '{}',
      statistics TEXT DEFAULT '{}'
    )
  `);
  run(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER DEFAULT 1,
      title TEXT NOT NULL,
      author TEXT,
      isbn TEXT,
      publisher TEXT,
      publication_year INTEGER,
      language TEXT DEFAULT 'ar',
      cover_image TEXT,
      file_path TEXT NOT NULL,
      original_pdf_path TEXT,
      page_count INTEGER DEFAULT 0,
      file_size INTEGER DEFAULT 0,
      format TEXT DEFAULT 'PDF',
      added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_opened DATETIME,
      reading_progress INTEGER DEFAULT 0,
      current_page INTEGER DEFAULT 0,
      status TEXT DEFAULT 'unread' CHECK(status IN ('unread', 'reading', 'completed', 'wishlist')),
      rating REAL DEFAULT 0,
      is_favorite INTEGER DEFAULT 0,
      notes TEXT,
      summary TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      name_ar TEXT,
      description TEXT,
      icon TEXT,
      color TEXT DEFAULT '#bb86fc'
    )
  `);
  run(`
    CREATE TABLE IF NOT EXISTS book_categories (
      book_id INTEGER,
      category_id INTEGER,
      PRIMARY KEY (book_id, category_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);
  run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      color TEXT DEFAULT '#03dac6'
    )
  `);
  run(`
    CREATE TABLE IF NOT EXISTS book_tags (
      book_id INTEGER,
      tag_id INTEGER,
      PRIMARY KEY (book_id, tag_id),
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    )
  `);
  run(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      quote_text TEXT NOT NULL,
      page_number INTEGER,
      note TEXT,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    )
  `);
  run(`
    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      start_page INTEGER,
      end_page INTEGER,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    )
  `);
  run(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      page_number INTEGER NOT NULL,
      note TEXT,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    )
  `);
  run(`
    CREATE TABLE IF NOT EXISTS reading_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      date DATE NOT NULL,
      pages_read INTEGER DEFAULT 0,
      duration_minutes INTEGER DEFAULT 0,
      start_page INTEGER,
      end_page INTEGER,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    )
  `);
  run(`
    CREATE TABLE IF NOT EXISTS book_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      page_number INTEGER NOT NULL,
      content TEXT,
      has_images BOOLEAN DEFAULT 0,
      is_scanned BOOLEAN DEFAULT 0,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    )
  `);
  run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_book_pages_unique ON book_pages(book_id, page_number)`);
  run(`
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER DEFAULT 1,
      name TEXT NOT NULL,
      description TEXT,
      cover_image TEXT,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  run(`
    CREATE TABLE IF NOT EXISTS collection_books (
      collection_id INTEGER,
      book_id INTEGER,
      added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (collection_id, book_id),
      FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    )
  `);
  run(`CREATE INDEX IF NOT EXISTS idx_books_title ON books(title)`);
  run(`CREATE INDEX IF NOT EXISTS idx_books_author ON books(author)`);
  run(`CREATE INDEX IF NOT EXISTS idx_books_status ON books(status)`);
  run(`CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating)`);
  run(`CREATE INDEX IF NOT EXISTS idx_books_added_date ON books(added_date)`);
  run(`CREATE INDEX IF NOT EXISTS idx_reading_sessions_date ON reading_sessions(date)`);
  const defaultCategories = [
    ["Literature", "الأدب والروايات", "📚", "#e91e63"],
    ["Science", "العلوم والتكنولوجيا", "🔬", "#2196f3"],
    ["History", "التاريخ والسياسة", "📜", "#ff9800"],
    ["Self-Development", "التطوير الذاتي", "🎯", "#4caf50"],
    ["Religion", "الدين والفلسفة", "🕌", "#9c27b0"],
    ["Children", "كتب الأطفال", "🧒", "#00bcd4"],
    ["Other", "أخرى", "📖", "#607d8b"]
  ];
  const insertCategory = db2.prepare(`INSERT OR IGNORE INTO categories (name, name_ar, icon, color) VALUES (?, ?, ?, ?)`);
  for (const cat of defaultCategories) {
    insertCategory.run(cat[0], cat[1], cat[2], cat[3]);
  }
  run(`
    INSERT OR IGNORE INTO users (id, username, email, password_hash) 
    VALUES (1, 'default', 'user@bookmagic.app', 'local_user')
  `);
  console.log("All tables created successfully");
}
let db = null;
function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}
function initDatabase() {
  if (db) return db;
  const userDataPath = electron.app.getPath("userData");
  const dataDir = path.join(userDataPath, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, "library.db");
  console.log("Initializing database at:", dbPath);
  try {
    db = new Database(dbPath, { verbose: console.log });
    db.pragma("journal_mode = WAL");
    createTables(db);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
  return db;
}
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
let pdfjs = null;
async function getPdfJs() {
  if (!pdfjs) {
    pdfjs = await import("pdfjs-dist");
  }
  return pdfjs;
}
class PdfProcessor {
  // Cache to store open PDF instances
  pdfCache;
  constructor() {
    this.pdfCache = new lruCache.LRUCache({
      max: 5,
      // Keep max 5 PDFs open
      ttl: 1e3 * 60 * 10,
      // 10 minutes
      dispose: (pdf) => {
        if (pdf && typeof pdf.destroy === "function") {
          pdf.destroy();
        }
      }
    });
  }
  /**
   * Get or create cached PDF document
   */
  async getPdfDocument(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }
    if (this.pdfCache.has(filePath)) {
      return this.pdfCache.get(filePath);
    }
    const { getDocument } = await getPdfJs();
    try {
      const data = new Uint8Array(fs.readFileSync(filePath));
      const loadingTask = getDocument({
        data,
        useSystemFonts: true,
        disableFontFace: false,
        verbosity: 0
        // Suppress warnings
      });
      const pdf = await loadingTask.promise;
      this.pdfCache.set(filePath, pdf);
      return pdf;
    } catch (error) {
      console.error(`CRITICAL: Failed to load PDF document: ${filePath}`);
      console.error("Error details:", error);
      throw error;
    }
  }
  async getMetadata(filePath) {
    try {
      const pdf = await this.getPdfDocument(filePath);
      const meta = await pdf.getMetadata();
      const info = meta.info;
      const stats = fs.statSync(filePath);
      return {
        title: info?.Title || filePath.split(/[\\/]/).pop()?.replace(".pdf", "") || "بدون عنوان",
        author: info?.Author || "غير معروف",
        pageCount: pdf.numPages,
        fileSize: stats.size,
        format: "PDF"
      };
    } catch (error) {
      console.error("Error reading PDF metadata:", error);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        const fileName = filePath.split(/[\\/]/).pop() || "Unknown";
        return {
          title: fileName.replace(".pdf", ""),
          author: "غير معروف",
          pageCount: 0,
          fileSize: stats.size,
          format: "PDF"
        };
      }
      throw error;
    }
  }
  async extractText(filePath, pageNum) {
    try {
      const pdf = await this.getPdfDocument(filePath);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      return textContent.items.map((item) => item.str).join(" ");
    } catch (error) {
      console.error(`Error extracting text from page ${pageNum}:`, error);
      throw new Error(`Failed to extract text: ${String(error)}`);
    }
  }
  /**
   * Clear cache for specific file (call when book is closed)
   */
  clearCache(filePath) {
    if (filePath) {
      if (this.pdfCache.has(filePath)) {
        const pdf = this.pdfCache.get(filePath);
        if (pdf && typeof pdf.destroy === "function") {
          pdf.destroy();
        }
        this.pdfCache.delete(filePath);
      }
    } else {
      this.pdfCache.clear();
    }
  }
  async getPageAsImage(filePath, pageNum) {
    try {
      const pdf = await this.getPdfDocument(filePath);
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      const { createCanvas } = await import("canvas");
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext("2d");
      await page.render({
        canvasContext: context,
        viewport
      }).promise;
      return canvas.toBuffer("image/png");
    } catch (error) {
      console.error(`Error rendering page ${pageNum} as image:`, error);
      throw error;
    }
  }
}
const pdfProcessor = new PdfProcessor();
class PythonManager {
  process = null;
  port = 5e3;
  isReady = false;
  startupLog = [];
  readyFromStdout = false;
  /**
   * Start Python OCR engine
   */
  async start() {
    try {
      const portFree = await this.isPortAvailable(this.port);
      if (!portFree) {
        console.log(`[Python] Port ${this.port} is busy, checking if Python is already running...`);
        try {
          const response = await fetch(`http://127.0.0.1:${this.port}/health`, {
            signal: AbortSignal.timeout(3e3)
          });
          if (response.ok) {
            console.log(`[Python] ✅ Python already running on port ${this.port}`);
            this.isReady = true;
            return { success: true, port: this.port };
          }
        } catch {
          console.error(`[Python] ❌ Port ${this.port} is occupied by another process`);
          return { success: false, error: `Port ${this.port} is occupied` };
        }
      }
      const pythonExe = this.getPythonExecutable();
      const scriptPath = this.getScriptPath();
      console.log(`[Python] Starting OCR engine...`);
      console.log(`[Python] Executable: ${pythonExe}`);
      console.log(`[Python] Script: ${scriptPath}`);
      console.log(`[Python] Port: ${this.port}`);
      this.process = child_process.spawn(pythonExe, [scriptPath, "--port", String(this.port)], {
        env: {
          ...process.env,
          PYTHONUNBUFFERED: "1",
          PYTHONIOENCODING: "utf-8"
        },
        stdio: ["ignore", "pipe", "pipe"]
      });
      this.process.stdout?.on("data", (data) => {
        const message = data.toString().trim();
        console.log(`[Python] ${message}`);
        this.startupLog.push(message);
        if (message.includes("Running on")) {
          console.log(`[Python] ✅ Detected "Running on" in stdout - Flask is ready!`);
          this.readyFromStdout = true;
        }
      });
      this.process.stderr?.on("data", (data) => {
        const error = data.toString().trim();
        console.error(`[Python Error] ${error}`);
        this.startupLog.push(`ERROR: ${error}`);
        if (error.includes("Running on")) {
          console.log(`[Python] ✅ Detected "Running on" in stderr - Flask is ready!`);
          this.readyFromStdout = true;
        }
      });
      this.process.on("exit", (code) => {
        console.log(`[Python] Process exited with code ${code}`);
        this.isReady = false;
        this.readyFromStdout = false;
        this.process = null;
      });
      await this.waitForReady(3e4);
      console.log(`[Python] ✅ OCR engine fully ready on port ${this.port}`);
      return { success: true, port: this.port };
    } catch (error) {
      console.error("[Python] Failed to start:", error);
      console.error("[Python] Startup log:", this.startupLog.join("\n"));
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  /**
   * Stop Python process
   */
  async stop() {
    if (this.process) {
      console.log("[Python] Stopping engine...");
      this.process.kill("SIGTERM");
      setTimeout(() => {
        if (this.process && !this.process.killed) {
          console.warn("[Python] Force killing process");
          this.process.kill("SIGKILL");
        }
      }, 5e3);
      this.process = null;
      this.isReady = false;
      this.readyFromStdout = false;
      this.port = 5e3;
    }
  }
  /**
   * Get Python executable path
   */
  getPythonExecutable() {
    if (electron.app.isPackaged) {
      if (process.platform === "win32") {
        const exePath = path.join(process.resourcesPath, "python", "ocr_engine.exe");
        if (require("fs").existsSync(exePath)) {
          return exePath;
        }
        return path.join(process.resourcesPath, "python-runtime", "python.exe");
      }
    }
    return "python";
  }
  /**
   * Get script path
   */
  getScriptPath() {
    if (electron.app.isPackaged) {
      return path.join(process.resourcesPath, "python", "ocr_engine.py");
    }
    return path.join(__dirname, "../../src/python/ocr_engine.py");
  }
  /**
   * Wait for Python to be ready
   */
  async waitForReady(timeout = 3e4) {
    const startTime = Date.now();
    console.log("[Python] Waiting for Flask to start (watching stdout)...");
    while (!this.readyFromStdout) {
      if (Date.now() - startTime > timeout) {
        throw new Error("Python engine failed to start (timeout waiting for Flask)");
      }
      if (!this.process || this.process.killed) {
        throw new Error("Python process crashed before starting Flask");
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    console.log("[Python] Flask started, now verifying with health check...");
    for (let i = 0; i < 5; i++) {
      try {
        const response = await fetch(`http://127.0.0.1:${this.port}/health`, {
          method: "GET",
          signal: AbortSignal.timeout(3e3)
        });
        if (response.ok) {
          const data = await response.json();
          console.log("[Python] ✅ Health check passed:", data);
          this.isReady = true;
          return;
        }
        console.log(`[Python] Health check attempt ${i + 1}/5, status: ${response.status}`);
      } catch (error) {
        console.log(`[Python] Health check attempt ${i + 1}/5 failed:`, error.message);
      }
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
    throw new Error("Python engine started but health check failed after 5 attempts");
  }
  /**
   * Check if port is available
   */
  isPortAvailable(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once("error", () => resolve(false));
      server.once("listening", () => {
        server.close();
        resolve(true);
      });
      server.listen(port, "127.0.0.1");
    });
  }
  // Getters
  getPort() {
    return this.port;
  }
  isAvailable() {
    return this.isReady;
  }
  getStartupLog() {
    return [...this.startupLog];
  }
}
const pythonManager = new PythonManager();
class PythonOcrClient {
  baseUrl;
  constructor(baseUrl = "http://localhost:5000") {
    this.baseUrl = baseUrl;
  }
  setPort(port) {
    this.baseUrl = `http://localhost:${port}`;
  }
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.status === "ok";
    } catch (error) {
      return false;
    }
  }
  async ocrPage(filePath, pageNum, preprocess = true) {
    try {
      const response = await fetch(`${this.baseUrl}/ocr/page`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_path: filePath, page_num: pageNum, preprocess })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
  async ocrBatch(filePath, pages, preprocess = true) {
    try {
      const response = await fetch(`${this.baseUrl}/ocr/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_path: filePath, pages, preprocess })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
  async smartExtract(filePath, pageNum) {
    try {
      const response = await fetch(`${this.baseUrl}/pdf/smart-extract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_path: filePath, page_num: pageNum })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
  async getMetadata(filePath) {
    try {
      const response = await fetch(`${this.baseUrl}/pdf/metadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_path: filePath })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
}
const pythonOcr = new PythonOcrClient();
const BookSchema = zod.z.object({
  id: zod.z.number().optional(),
  title: zod.z.string().default("بدون عنوان"),
  author: zod.z.string().default("غير معروف"),
  filePath: zod.z.string(),
  coverImage: zod.z.string().optional(),
  pageCount: zod.z.number().min(0).default(0),
  status: zod.z.enum(["unread", "reading", "completed", "wishlist"]).default("unread"),
  rating: zod.z.number().min(0).max(5).default(0),
  isFavorite: zod.z.boolean().default(false),
  format: zod.z.string().default("PDF")
});
const PageContentSchema = zod.z.object({
  bookId: zod.z.number(),
  pageNum: zod.z.number(),
  content: zod.z.string()
});
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#0f0f0f",
    titleBarStyle: "hiddenInset",
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(async () => {
  utils.electronApp.setAppUserModelId("com.bookmagic.app");
  try {
    initDatabase();
    console.log("Database ready!");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
  try {
    const result = await pythonManager.start();
    if (result.success && result.port) {
      pythonOcr.setPort(result.port);
      console.log("Python OCR connected!");
    } else {
      console.error("Failed to start Python OCR:", result.error);
    }
  } catch (error) {
    console.error("Python startup error:", error);
  }
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  electron.ipcMain.handle("db:getBooks", async () => {
    try {
      const db2 = getDatabase();
      const books = db2.prepare(`
        SELECT 
          id, user_id as userId, title, author, isbn, publisher, 
          publication_year as publicationYear, language, cover_image as coverImage,
          file_path as filePath, original_pdf_path as originalPdfPath,
          page_count as pageCount, file_size as fileSize, format,
          added_date as addedDate, last_opened as lastOpened,
          reading_progress as readingProgress, current_page as currentPage,
          status, rating, is_favorite as isFavorite, notes, summary
        FROM books 
        ORDER BY added_date DESC
      `).all();
      return books.map((b) => ({
        ...b,
        isFavorite: Boolean(b.isFavorite)
      }));
    } catch (error) {
      console.error("Error getting books:", error);
      return [];
    }
  });
  electron.ipcMain.handle("db:getBook", async (_, id) => {
    try {
      const db2 = getDatabase();
      const book = db2.prepare(`
        SELECT 
          id, user_id as userId, title, author, isbn, publisher, 
          publication_year as publicationYear, language, cover_image as coverImage,
          file_path as filePath, original_pdf_path as originalPdfPath,
          page_count as pageCount, file_size as fileSize, format,
          added_date as addedDate, last_opened as lastOpened,
          reading_progress as readingProgress, current_page as currentPage,
          status, rating, is_favorite as isFavorite, notes, summary
        FROM books 
        WHERE id = ?
      `).get(id);
      if (book) {
        book.isFavorite = Boolean(book.isFavorite);
      }
      return book;
    } catch (error) {
      console.error("Error getting book:", error);
      return null;
    }
  });
  const saveBookHandler = async (_, rawBook) => {
    try {
      const validation = BookSchema.safeParse(rawBook);
      if (!validation.success) {
        console.error("Validation error:", validation.error);
        return { success: false, error: "Invalid book data" };
      }
      const book = validation.data;
      const db2 = getDatabase();
      let fileSize = 0;
      if (book.filePath && fs.existsSync(book.filePath)) {
        const stats = fs.statSync(book.filePath);
        fileSize = stats.size;
      }
      if (book.id) {
        db2.prepare(`
          UPDATE books 
          SET title = ?, author = ?, page_count = ?, file_path = ?, 
              cover_image = ?, status = ?, rating = ?, is_favorite = ?
          WHERE id = ?
        `).run(
          book.title,
          book.author,
          book.pageCount,
          book.filePath,
          book.coverImage || "",
          book.status,
          book.rating,
          book.isFavorite ? 1 : 0,
          book.id
        );
        return { success: true, id: book.id };
      } else {
        const result = db2.prepare(`
          INSERT INTO books (title, author, page_count, file_size, file_path, cover_image, format, status, rating, is_favorite) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          book.title,
          book.author,
          book.pageCount,
          fileSize,
          book.filePath,
          book.coverImage || "",
          book.format,
          book.status,
          book.rating,
          book.isFavorite ? 1 : 0
        );
        return { success: true, id: result.lastInsertRowid };
      }
    } catch (error) {
      console.error("Error saving book:", error);
      return { success: false, error: String(error) };
    }
  };
  electron.ipcMain.handle("db:saveBook", saveBookHandler);
  electron.ipcMain.handle("db:addBook", saveBookHandler);
  electron.ipcMain.handle("db:updateBook", async (_, id, data) => {
    try {
      if (!id) throw new Error("No ID provided");
      const db2 = getDatabase();
      const keys = Object.keys(data).filter((k) => k !== "id");
      if (keys.length === 0) return { success: true };
      const columnMap = {
        title: "title",
        author: "author",
        pageCount: "page_count",
        filePath: "file_path",
        coverImage: "cover_image",
        status: "status",
        rating: "rating",
        isFavorite: "is_favorite",
        readingProgress: "reading_progress",
        currentPage: "current_page",
        lastOpened: "last_opened"
      };
      const sets = [];
      const values = [];
      for (const key of keys) {
        const col = columnMap[key] || key;
        sets.push(`${col} = ?`);
        let val = data[key];
        if (key === "isFavorite") val = val ? 1 : 0;
        values.push(val);
      }
      values.push(id);
      db2.prepare(`UPDATE books SET ${sets.join(", ")} WHERE id = ?`).run(...values);
      return { success: true };
    } catch (error) {
      console.error("Error updating book:", error);
      return { success: false, error: String(error) };
    }
  });
  electron.ipcMain.handle("db:deleteBook", async (_, id) => {
    try {
      const db2 = getDatabase();
      db2.prepare("DELETE FROM books WHERE id = ?").run(id);
      return { success: true };
    } catch (error) {
      console.error("Error deleting book:", error);
      return { success: false, error: String(error) };
    }
  });
  electron.ipcMain.handle("db:savePageContent", async (_, rawData) => {
    try {
      const validation = PageContentSchema.safeParse(rawData);
      if (!validation.success) {
        return { success: false, error: "Invalid page data" };
      }
      const { bookId, pageNum, content } = validation.data;
      const db2 = getDatabase();
      db2.prepare(`
        INSERT INTO book_pages (book_id, page_number, content) 
        VALUES (?, ?, ?)
        ON CONFLICT(book_id, page_number) 
        DO UPDATE SET content = excluded.content, is_scanned = 0
      `).run(bookId, pageNum, content);
      return { success: true };
    } catch (error) {
      console.error("Error saving page content:", error);
      return { success: false, error: String(error) };
    }
  });
  electron.ipcMain.handle("db:getCategories", async () => {
    try {
      const db2 = getDatabase();
      return db2.prepare("SELECT * FROM categories").all();
    } catch (error) {
      console.error("Error getting categories:", error);
      return [];
    }
  });
  electron.ipcMain.handle("db:getTags", async () => {
    try {
      const db2 = getDatabase();
      return db2.prepare("SELECT * FROM tags").all();
    } catch (error) {
      console.error("Error getting tags:", error);
      return [];
    }
  });
  electron.ipcMain.handle("db:getStatistics", async () => {
    try {
      const db2 = getDatabase();
      const totalBooks = db2.prepare("SELECT COUNT(*) as count FROM books").get();
      const booksRead = db2.prepare("SELECT COUNT(*) as count FROM books WHERE status = 'completed'").get();
      const currentlyReading = db2.prepare("SELECT COUNT(*) as count FROM books WHERE status = 'reading'").get();
      const pagesRead = db2.prepare("SELECT SUM(reading_progress * page_count / 100) as count FROM books").get();
      return {
        // @ts-ignore
        totalBooks: totalBooks?.count || 0,
        // @ts-ignore
        booksRead: booksRead?.count || 0,
        // @ts-ignore
        currentlyReading: currentlyReading?.count || 0,
        // @ts-ignore
        pagesRead: Math.round(pagesRead?.count || 0),
        readingGoal: 50
        // TODO: Make configurable
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return {
        totalBooks: 0,
        booksRead: 0,
        currentlyReading: 0,
        pagesRead: 0,
        readingGoal: 50
      };
    }
  });
  electron.ipcMain.handle("file:selectPdf", async () => {
    const result = await electron.dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [
        { name: "الكتب", extensions: ["pdf", "epub", "mobi", "azw", "azw3", "djvu", "fb2", "txt", "doc", "docx", "rtf"] },
        { name: "PDF", extensions: ["pdf"] },
        { name: "EPUB", extensions: ["epub"] },
        { name: "جميع الملفات", extensions: ["*"] }
      ]
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });
  electron.ipcMain.handle("pdf:getMetadata", async (_, filePath) => {
    try {
      const stats = fs.statSync(filePath);
      if (filePath.toLowerCase().endsWith(".pdf")) {
        try {
          const result = await pythonOcr.getMetadata(filePath);
          if (result.success) {
            return {
              title: result.title || "بدون عنوان",
              author: result.author || "غير معروف",
              pageCount: result.pages || 0,
              fileSize: result.file_size || stats.size,
              format: "PDF",
              metadata: result.metadata
            };
          }
        } catch (pdfError) {
          console.error("Python metadata error:", pdfError);
        }
      }
      const fileName = filePath.split(/[\\/]/).pop() || "Unknown";
      const format = fileName.split(".").pop()?.toUpperCase() || "UNKNOWN";
      return {
        title: fileName.replace(/\.[^/.]+$/, ""),
        author: "غير معروف",
        pageCount: 0,
        fileSize: stats.size,
        format
      };
    } catch (error) {
      console.error("Error getting metadata:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("pdf:extractText", async (_, filePath, page) => {
    try {
      const result = await pythonOcr.smartExtract(filePath, page);
      if (result.success) {
        return result.text || "";
      }
      return "";
    } catch (error) {
      console.error("Error extracting text:", error);
      return "";
    }
  });
  electron.ipcMain.handle("pdf:getPageAsImage", async (_, filePath, pageNum) => {
    try {
      return await pdfProcessor.getPageAsImage(filePath, pageNum);
    } catch (error) {
      console.error("Error getting page image:", error);
      return null;
    }
  });
  electron.ipcMain.handle("pdf:closeBook", async () => {
    pdfProcessor.clearCache();
    return { success: true };
  });
  electron.ipcMain.handle("ocr:recognize", async (_, _buffer, _lang) => {
    return "";
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  closeDatabase();
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("before-quit", async () => {
  closeDatabase();
  await pythonManager.stop();
});
