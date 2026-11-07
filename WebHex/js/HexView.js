import { ByteToHex, GetAsciiInfo, FormatOffset } from './Utils.js';

// Virtual-scrolling hex view
export class HexView {
    constructor(opts) {
        this.container = opts.container;
        this.content = opts.content;
        this.spacer = opts.spacer;
        this.fileHandler = opts.fileHandler;
        this.onSelectionChange = opts.onSelectionChange || (() => { });
        this.columnHeader = opts.columnHeader || null;

        this.bytesPerRow = 16;
        this.rowHeight = 22;
        this.bufferRows = 20;
        this.totalRows = 0;
        this.renderedStart = -1;
        this.renderedEnd = -1;
        this.cachedData = null;
        this.cachedDataStart = -1;
        this.renderRaf = null;
        this.fileSize = 0;

        this.selStart = -1;
        this.selEnd = -1;

        this.onScroll = this.onScroll.bind(this);
        this.container.addEventListener('scroll', this.onScroll, { passive: true });
    }

    // Initialize hex view upon opening a new file
    Init(fileSize) {
        this.fileSize = fileSize;
        this.totalRows = Math.ceil(fileSize / this.bytesPerRow);
        this.selStart = -1;
        this.selEnd = -1;
        this.renderedStart = -1;
        this.renderedEnd = -1;
        this.cachedData = null;
        this.updateSpacerHeight();
        this.updateColumnHeaders(this.bytesPerRow);
        this.container.scrollTop = 0;
        this.scheduleRender();
    }

    // Change bytes rendered per row and trigger full re-render
    SetBytesPerRow(bpr) {
        if (bpr === this.bytesPerRow) return;
        this.bytesPerRow = bpr;
        this.totalRows = Math.ceil(this.fileSize / this.bytesPerRow);
        this.renderedStart = -1;
        this.renderedEnd = -1;
        this.cachedData = null;
        this.updateSpacerHeight();
        this.updateColumnHeaders(bpr);
        this.scheduleRender();
    }

    // Set selection range and schedule rendering update
    SetSelection(start, end) {
        if (start > end) [start, end] = [end, start];
        this.selStart = start;
        this.selEnd = end;
        this.scheduleRender(true);
        this.onSelectionChange(start, end);
    }

    // Reset grid view state when file is closed
    Clear() {
        this.totalRows = 0;
        this.fileSize = 0;
        this.selStart = -1;
        this.selEnd = -1;
        this.content.innerHTML = '';
        this.spacer.style.height = '0px';
        this.cachedData = null;
    }

    // Scroll viewport to center the target byte offset
    ScrollToOffset(offset) {
        const row = Math.floor(offset / this.bytesPerRow);
        const targetScroll = row * this.rowHeight;
        const viewHeight = this.container.clientHeight;
        this.container.scrollTop = Math.max(0, targetScroll - viewHeight / 2);
    }

    // Extract byte offset from DOM event target element
    GetOffsetFromElement(target) {
        const el = target.closest('[data-offset]');
        if (!el) return -1;
        return parseInt(el.dataset.offset, 10);
    }

    // Identify whether target element belongs to Hex or ASCII column
    GetColumnFromElement(target) {
        if (target.closest('.hex-col')) return 'hex';
        if (target.closest('.ascii-col')) return 'ascii';
        return null;
    }

    // Regenerate the column header labels matching the byte-per-row layout
    updateColumnHeaders(bpr) {
        if (!this.columnHeader) return;

        const offsetPart = '<span class="col-header-offset">Offset</span>';
        const hexParts = [];
        for (let i = 0; i < bpr; i++) {
            hexParts.push(`<span class="col-hdr-byte">${i.toString(16).toUpperCase().padStart(2, '0')}</span>`);
            if ((i + 1) % 8 === 0 && i + 1 < bpr) {
                hexParts.push('<span class="col-hdr-sep"> </span>');
            }
        }
        const hexPart = `<span class="col-header-hex">${hexParts.join('')}</span>`;
        const asciiPart = '<span class="col-header-ascii">ASCII</span>';

        this.columnHeader.innerHTML = `${offsetPart}${hexPart}${asciiPart}`;
    }

    // Recalculate spacer element height and scroll scaling factor
    updateSpacerHeight() {
        const totalHeight = this.totalRows * this.rowHeight;
        this.useScaledScroll = totalHeight > 10_000_000;
        if (this.useScaledScroll) {
            this.virtualHeight = 10_000_000;
            this.scrollScale = this.totalRows / this.virtualHeight;
            this.spacer.style.height = this.virtualHeight + 'px';
        } else {
            this.virtualHeight = totalHeight;
            this.scrollScale = 1 / this.rowHeight;
            this.spacer.style.height = totalHeight + 'px';
        }
    }

    // Calculate top visible row index based on vertical scroll offset
    scrollTopToRow(scrollTop) {
        if (this.useScaledScroll) return Math.floor(scrollTop * this.scrollScale);
        return Math.floor(scrollTop / this.rowHeight);
    }

    // Calculate Y pixel position corresponding to a row index
    rowToY(row) {
        if (this.useScaledScroll) return row / this.scrollScale;
        return row * this.rowHeight;
    }

    // Synchronize column header horizontal scroll position
    onScroll() {
        if (this.columnHeader) {
            this.columnHeader.scrollLeft = this.container.scrollLeft;
        }
        this.scheduleRender();
    }

    // Schedule frame-deferred rendering via requestAnimationFrame
    scheduleRender(force = false) {
        if (this.renderRaf && !force) return;
        if (this.renderRaf) cancelAnimationFrame(this.renderRaf);
        this.renderRaf = requestAnimationFrame(() => {
            this.renderRaf = null;
            this.render();
        });
    }

    // Execute viewport calculation and render visible rows
    async render() {
        if (this.totalRows === 0) return;

        const scrollTop = this.container.scrollTop;
        const viewHeight = this.container.clientHeight;
        const visibleRows = Math.ceil(viewHeight / this.rowHeight);

        const firstVisibleRow = this.scrollTopToRow(scrollTop);
        const renderStart = Math.max(0, firstVisibleRow - this.bufferRows);
        const renderEnd = Math.min(this.totalRows, firstVisibleRow + visibleRows + this.bufferRows);

        const needsFetch = (
            renderStart !== this.renderedStart ||
            renderEnd !== this.renderedEnd ||
            this.cachedData === null
        );

        // Fetches data if needed
        if (needsFetch) {
            const byteStart = renderStart * this.bytesPerRow;
            const byteEnd = Math.min(renderEnd * this.bytesPerRow, this.fileSize);
            try {
                this.cachedData = await this.fileHandler.Read(byteStart, byteEnd);
                this.cachedDataStart = byteStart;
            } catch {
                return;
            }
        }

        this.renderedStart = renderStart;
        this.renderedEnd = renderEnd;
        this.buildRows(renderStart, renderEnd);
    }

    // Construct and inject HTML string for rendered viewport rows
    buildRows(startRow, endRow) {
        const data = this.cachedData;
        const dataStart = this.cachedDataStart;
        const bpr = this.bytesPerRow;
        const fileSize = this.fileSize;
        const parts = [];
        const topOffset = this.rowToY(startRow);

        // Iterate each rows
        for (let row = startRow; row < endRow; row++) {
            const rowByteStart = row * bpr;
            const rowByteEnd = Math.min(rowByteStart + bpr, fileSize);
            const rowDataOffset = rowByteStart - dataStart;
            const y = (row - startRow) * this.rowHeight;

            const offsetStr = FormatOffset(rowByteStart, fileSize);
            const hexParts = [];
            const asciiParts = [];

            // Iterate bytes-per-row
            for (let i = 0; i < bpr; i++) {
                const byteOffset = rowByteStart + i;
                if (byteOffset >= rowByteEnd) { // end byte not coming here
                    hexParts.push('<span class="hex-byte hex-pad">  </span>');
                    asciiParts.push('<span class="ascii-char ascii-pad"> </span>');

                } else { // comes here
                    const b = data[rowDataOffset + i];
                    const hexStr = ByteToHex(b);
                    const asciiInfo = GetAsciiInfo(b);

                    const isSelected = byteOffset >= this.selStart && byteOffset <= this.selEnd;
                    const selClass = isSelected ? ' selected' : '';
                    const mappedClass = asciiInfo.isMapped ? ' ascii-mapped' : '';
                    const nonPrintClass = !asciiInfo.isPrintable ? ' non-printable' : '';

                    // HTML escape
                    const charDisplay = asciiInfo.charVal === '<' ? '&lt;' :
                        asciiInfo.charVal === '>' ? '&gt;' :
                            asciiInfo.charVal === '&' ? '&amp;' : asciiInfo.charVal;

                    hexParts.push(`<span class="hex-byte${selClass}" data-offset="${byteOffset}">${hexStr}</span>`);
                    asciiParts.push(`<span class="ascii-char${selClass}${mappedClass}${nonPrintClass}" data-offset="${byteOffset}">${charDisplay}</span>`);
                }

                // separate every 8B
                if ((i + 1) % 8 === 0 && i + 1 < bpr) {
                    hexParts.push('<span class="hex-group-sep"> </span>');
                }
            }

            parts.push(
                `<div class="hex-row" style="transform:translateY(${y}px)" data-row="${row}">` +
                `<span class="offset-col">${offsetStr}</span>` +
                `<span class="hex-col">${hexParts.join('')}</span>` +
                `<span class="ascii-col">${asciiParts.join('')}</span>` +
                `</div>`
            );
        }

        this.content.style.transform = `translateY(${topOffset}px)`;
        this.content.innerHTML = parts.join('');
    }
}