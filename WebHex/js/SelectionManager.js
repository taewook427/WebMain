// Manage synchronized drag and click byte selection
export class SelectionManager {
    constructor(opts) {
        this.hexView = opts.hexView;
        this.container = opts.container;
        this.getSelectionSize = opts.getSelectionSize || (() => 1);

        this.isDragging = false;
        this.dragAnchor = -1;
        this.dragAnchorSize = 1;
        this.lastFileSize = 0;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.container.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    // Set loaded file size bound for selection clamping
    SetFileSize(size) {
        this.lastFileSize = size;
    }

    // Detach all window event listeners upon destruction
    Destroy() {
        this.container.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    // Handle initial mouse click to begin or extend selection
    onMouseDown(e) {
        if (e.button !== 0) return;
        const offset = this.hexView.GetOffsetFromElement(e.target);
        if (offset < 0) return;
        const column = this.hexView.GetColumnFromElement(e.target);
        if (!column) return;
        e.preventDefault();

        // Shift-click to extend selection
        if (e.shiftKey && this.hexView.selStart >= 0) {
            const anchor = this.dragAnchor >= 0 ? this.dragAnchor : this.hexView.selStart;
            this.dragAnchor = anchor;
            if (offset >= anchor) {
                const itemSize = this.getSelectionSize(offset);
                const end = Math.min(offset + itemSize - 1, this.lastFileSize - 1);
                this.updateSelection(anchor, end);
            } else {
                const anchorEnd = Math.min(anchor + this.dragAnchorSize - 1, this.lastFileSize - 1);
                this.updateSelection(offset, anchorEnd);
            }
        } else {
            this.isDragging = true;
            this.dragAnchor = offset;
            const selSize = this.getSelectionSize(offset);
            this.dragAnchorSize = selSize;
            const endOffset = Math.min(offset + selSize - 1, this.lastFileSize - 1);
            this.updateSelection(offset, endOffset);
        }
    }

    // Handle mouse drag movement to continuously update selection range
    onMouseMove(e) {
        if (!this.isDragging) return;
        const offset = this.hexView.GetOffsetFromElement(e.target);
        if (offset < 0) return;
        e.preventDefault();

        // Drag selection logic
        if (offset >= this.dragAnchor) {
            const itemSize = this.getSelectionSize(offset);
            const end = Math.min(offset + itemSize - 1, this.lastFileSize - 1);
            this.updateSelection(this.dragAnchor, end);
        } else {
            const anchorEnd = Math.min(this.dragAnchor + this.dragAnchorSize - 1, this.lastFileSize - 1);
            this.updateSelection(offset, anchorEnd);
        }
    }

    // Finish drag selection operation on mouse release
    onMouseUp() {
        this.isDragging = false;
    }

    // Clamp and apply calculated selection boundaries to HexView
    updateSelection(a, b) {
        const start = Math.max(0, Math.min(a, b));
        const end = Math.min(Math.max(a, b), this.lastFileSize - 1);
        this.hexView.SetSelection(start, end);
    }
}