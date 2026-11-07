import { FileHandler } from './FileHandler.js';
import { HexView } from './HexView.js';
import { SelectionManager } from './SelectionManager.js';
import { DataInspector } from './DataInspector.js';

// Application entry point bootstrapping all subsystems
class App {
    constructor() {
        this.fileHandler = new FileHandler();
        this.hexView = null;
        this.selectionManager = null;
        this.dataInspector = null;
        this.resizeObserver = null;
        this.currentBpr = 16;
        this.userBpr = null;
    }

    // Initialize application elements, components, and event handlers
    Init() {
        this.dom = {
            openBtn: document.getElementById('open-file-btn'),
            fileInput: document.getElementById('file-input'),
            fileInfo: document.getElementById('file-info'),
            fileName: document.getElementById('file-name'),
            fileSizeEl: document.getElementById('file-size'),
            bprIndicator: document.getElementById('bpr-indicator'),
            hexContainer: document.getElementById('hex-container'),
            hexContent: document.getElementById('hex-content'),
            hexSpacer: document.getElementById('hex-spacer'),
            hexColHeaders: document.getElementById('hex-col-headers'),
            dataPanel: document.getElementById('data-panel'),
            dropOverlay: document.getElementById('drop-overlay'),
            welcomeScreen: document.getElementById('welcome-screen'),
            warningToast: document.getElementById('warning-toast'),
            warningMsg: document.getElementById('warning-msg'),
            warningClose: document.getElementById('warning-close'),
            truncateInfo: document.getElementById('truncate-info'),
            gotoInput: document.getElementById('goto-input'),
            gotoBtn: document.getElementById('goto-btn'),
        };

        // Hex View
        this.hexView = new HexView({
            container: this.dom.hexContainer,
            content: this.dom.hexContent,
            spacer: this.dom.hexSpacer,
            columnHeader: this.dom.hexColHeaders,
            fileHandler: this.fileHandler,
            onSelectionChange: (start, end) => this.onSelectionChange(start, end),
        });

        // Data Inspector
        this.dataInspector = new DataInspector({
            container: this.dom.dataPanel,
            fileHandler: this.fileHandler,
            onActiveTypeChange: (typeId) => {
                if (this.hexView && this.hexView.selStart >= 0) {
                    const size = this.dataInspector.GetTypeSizeAtOffset(this.hexView.selStart, typeId);
                    const end = Math.min(this.hexView.selStart + size - 1, this.fileHandler.loadedSize - 1);
                    this.hexView.SetSelection(this.hexView.selStart, end);
                }
            },
            onSizeResolved: (offset, typeId, size) => {
                if (this.hexView && this.hexView.selStart === offset && typeId === this.dataInspector.activeTypeId) {
                    const curLen = this.hexView.selEnd - this.hexView.selStart + 1;
                    if (curLen !== size) {
                        const end = Math.min(offset + size - 1, this.fileHandler.loadedSize - 1);
                        this.hexView.SetSelection(offset, end);
                    }
                }
            },
        });

        // Selection Manager
        this.selectionManager = new SelectionManager({
            hexView: this.hexView,
            container: this.dom.hexContent,
            getSelectionSize: (offset) => this.dataInspector.GetTypeSizeAtOffset(offset),
        });

        // Open file event
        this.dom.openBtn.addEventListener('click', () => this.dom.fileInput.click());
        this.dom.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) this.openFile(e.target.files[0]);
        });

        // File drop event
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dom.dropOverlay.classList.add('visible');
        });
        document.addEventListener('dragleave', (e) => {
            if (e.relatedTarget === null) this.dom.dropOverlay.classList.remove('visible');
        });
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dom.dropOverlay.classList.remove('visible');
            if (e.dataTransfer.files.length > 0) this.openFile(e.dataTransfer.files[0]);
        });

        // Warning close event
        this.dom.warningClose.addEventListener('click', () => {
            this.dom.warningToast.classList.remove('visible');
        });

        // Go to offset event
        this.dom.gotoBtn.addEventListener('click', () => this.gotoOffset());
        this.dom.gotoInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.gotoOffset();
        });

        // Bytes per row event
        this.dom.bprIndicator.style.cursor = 'pointer';
        this.dom.bprIndicator.title = 'Click to switch BPR (Auto / 8 / 16 / 32 / 64)';
        this.dom.bprIndicator.addEventListener('click', () => {
            const steps = [null, 8, 16, 32, 64];
            const currIdx = steps.indexOf(this.userBpr);
            const nextIdx = (currIdx + 1) % steps.length;
            this.userBpr = steps[nextIdx];
            this.updateBytesPerRow();
        });

        // Window resize event
        this.resizeObserver = new ResizeObserver(() => this.updateBytesPerRow());
        this.resizeObserver.observe(this.dom.hexContainer);

        // Keyboard event
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'o') {
                e.preventDefault();
                this.dom.fileInput.click();
            }
            if (e.ctrlKey && e.key === 'g') {
                e.preventDefault();
                this.dom.gotoInput.focus();
                this.dom.gotoInput.select();
            }
        });
    }

    // Open binary file.
    async openFile(file) {
        const result = await this.fileHandler.Open(file);
        if (!result.success) {
            this.showWarning(result.message);
            return;
        }
        if (result.warning) {
            this.showWarning(result.warning);
        }

        // Get name and loaded size
        const info = this.fileHandler.GetInfo();
        this.dom.fileName.textContent = info.name;
        this.dom.fileSizeEl.textContent = info.isTruncated
            ? `${info.loadedSizeFormatted} of ${info.totalSizeFormatted} loaded`
            : info.loadedSizeFormatted;
        this.dom.fileInfo.classList.add('visible');
        if (info.isTruncated) {
            this.dom.truncateInfo.classList.add('visible');
            this.dom.truncateInfo.textContent = `⚠ Showing first 1 GiB of ${info.totalSizeFormatted}`;
        } else {
            this.dom.truncateInfo.classList.remove('visible');
        }

        // Update UI
        this.dom.welcomeScreen.classList.add('hidden');
        this.updateBytesPerRow();
        this.hexView.Init(this.fileHandler.loadedSize);
        this.selectionManager.SetFileSize(this.fileHandler.loadedSize);
        this.dataInspector.Clear();
        this.dom.fileInput.value = '';
    }

    // Update inspector panel upon byte selection change
    onSelectionChange(start) {
        if (start >= 0) {
            this.dataInspector.Update(start);
        }
    }

    // Jump view position to user-specified hex or decimal offset
    gotoOffset() {
        if (this.fileHandler.loadedSize <= 0) return;
        const text = this.dom.gotoInput.value.trim();
        if (!text) return;
        let offset = text.startsWith('0x') || text.startsWith('0X') ? parseInt(text, 16) : parseInt(text, 10);
        if (isNaN(offset) || offset < 0) return;
        offset = Math.min(offset, this.fileHandler.loadedSize - 1);
        this.hexView.ScrollToOffset(offset);
        this.hexView.SetSelection(offset, offset);
    }

    // Recalculate adaptive bytes-per-row count based on container width
    updateBytesPerRow() {
        const containerWidth = this.dom.hexContainer.clientWidth;
        let bpr = 16;
        if (this.userBpr !== null) {
            bpr = this.userBpr;
        } else {
            if (containerWidth > 1600) bpr = 64;
            else if (containerWidth > 1000) bpr = 32;
            else if (containerWidth > 600) bpr = 16;
            else bpr = 8;
        }
        this.dom.bprIndicator.textContent = this.userBpr !== null ? `${bpr} BPR (fixed)` : `${bpr} bytes/row`;
        if (bpr !== this.currentBpr) {
            this.currentBpr = bpr;
            this.hexView.SetBytesPerRow(bpr);
        }
    }

    // Display temporary warning toast message
    showWarning(msg) {
        this.dom.warningMsg.textContent = msg;
        this.dom.warningToast.classList.add('visible');
        setTimeout(() => {
            this.dom.warningToast.classList.remove('visible');
        }, 10000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.Init();
});