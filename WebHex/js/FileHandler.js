import { MaxFileSize, FormatFileSize } from './Utils.js';

// Manage file loading, chunked reading, and memory caching.
export class FileHandler {
    constructor() {
        this.file = null;
        this.fileSize = 0;
        this.loadedSize = 0;
        this.isTruncated = false;
        this.chunkCache = new Map();
        this.chunkSize = 256 * 1024;
        this.maxCachedChunks = 64;
    }

    // Open a binary file and set up truncation limits
    async Open(file) {
        this.Close();
        this.file = file;
        this.fileSize = file.size;

        // Size check
        if (this.fileSize === 0) {
            return { success: false, message: 'File is empty.' };
        }
        if (this.fileSize > MaxFileSize) {
            this.loadedSize = MaxFileSize;
            this.isTruncated = true;
            return {
                success: true,
                warning: `File is ${FormatFileSize(this.fileSize)}, which exceeds the 1 GiB limit. Only the first 1 GiB will be loaded.`
            };
        }

        this.loadedSize = this.fileSize;
        this.isTruncated = false;
        return { success: true };
    }

    // Read a byte range asynchronously
    async Read(start, end) {
        if (!this.file) throw new Error('No file opened');

        // Calculate chunks to read
        start = Math.max(0, start);
        end = Math.min(end, this.loadedSize);
        if (start >= end) return new Uint8Array(0);
        const startChunk = Math.floor(start / this.chunkSize);
        const endChunk = Math.floor((end - 1) / this.chunkSize);

        // Single chunk
        if (startChunk === endChunk) {
            const chunk = await this.getChunk(startChunk);
            const offsetInChunk = start - startChunk * this.chunkSize;
            return new Uint8Array(chunk.buffer, offsetInChunk, end - start);
        }

        // Multiple chunks
        const result = new Uint8Array(end - start);
        let writePos = 0;

        for (let i = startChunk; i <= endChunk; i++) {
            const chunk = await this.getChunk(i);
            const chunkStart = i * this.chunkSize;
            const readFrom = Math.max(start, chunkStart) - chunkStart;
            const readTo = Math.min(end, chunkStart + chunk.buffer.byteLength) - chunkStart;
            const slice = new Uint8Array(chunk.buffer, readFrom, readTo - readFrom);
            result.set(slice, writePos);
            writePos += slice.length;
        }

        return result;
    }

    // Read a byte range synchronously (memory cache)
    ReadSync(start, end) {
        if (!this.file) return null;

        // Calculate chunks to read
        start = Math.max(0, start);
        end = Math.min(end, this.loadedSize);
        if (start >= end) return new Uint8Array(0);
        const startChunk = Math.floor(start / this.chunkSize);
        const endChunk = Math.floor((end - 1) / this.chunkSize);

        // Single chunk
        if (startChunk === endChunk) {
            const chunk = this.chunkCache.get(startChunk);
            if (chunk) {
                chunk.lastAccess = performance.now();
                const offsetInChunk = start - startChunk * this.chunkSize;
                return new Uint8Array(chunk.buffer, offsetInChunk, end - start);
            }
            return null;
        }

        // Multiple chunks
        for (let i = startChunk; i <= endChunk; i++) {
            if (!this.chunkCache.has(i)) return null;
        }

        const result = new Uint8Array(end - start);
        let writePos = 0;
        for (let i = startChunk; i <= endChunk; i++) {
            const chunk = this.chunkCache.get(i);
            chunk.lastAccess = performance.now();
            const chunkStart = i * this.chunkSize;
            const readFrom = Math.max(start, chunkStart) - chunkStart;
            const readTo = Math.min(end, chunkStart + chunk.buffer.byteLength) - chunkStart;
            const slice = new Uint8Array(chunk.buffer, readFrom, readTo - readFrom);
            result.set(slice, writePos);
            writePos += slice.length;
        }
        return result;
    }

    // Clear loaded file and free cached memory
    Close() {
        this.file = null;
        this.fileSize = 0;
        this.loadedSize = 0;
        this.isTruncated = false;
        this.chunkCache.clear();
    }

    // Retrieve summary details of loaded file
    GetInfo() {
        if (!this.file) return null;
        return {
            name: this.file.name,
            totalSize: this.fileSize,
            loadedSize: this.loadedSize,
            isTruncated: this.isTruncated,
            totalSizeFormatted: FormatFileSize(this.fileSize),
            loadedSizeFormatted: FormatFileSize(this.loadedSize)
        };
    }

    // Fetch or load a file chunk
    async getChunk(chunkIndex) {
        // Cache
        if (this.chunkCache.has(chunkIndex)) {
            const entry = this.chunkCache.get(chunkIndex);
            entry.lastAccess = performance.now();
            return entry;
        }
        while (this.chunkCache.size >= this.maxCachedChunks) {
            this.evictOldestChunk();
        }

        // Read
        const start = chunkIndex * this.chunkSize;
        const end = Math.min(start + this.chunkSize, this.loadedSize);
        const blob = this.file.slice(start, end);
        const buffer = await blob.arrayBuffer();

        const entry = {
            buffer,
            start,
            end,
            lastAccess: performance.now()
        };

        this.chunkCache.set(chunkIndex, entry);
        return entry;
    }

    // Evict the least recently accessed chunk from memory cache
    evictOldestChunk() {
        let oldestKey = null;
        let oldestTime = Infinity;
        for (const [key, entry] of this.chunkCache) {
            if (entry.lastAccess < oldestTime) {
                oldestTime = entry.lastAccess;
                oldestKey = key;
            }
        }
        if (oldestKey !== null) {
            this.chunkCache.delete(oldestKey);
        }
    }
}