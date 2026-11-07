import { DecodeLeb128Signed, DecodeLeb128Unsigned, FormatUuid, FormatUnixTime, DecodeUtf8Char } from './Utils.js';

// Data types supported by the inspector panel
export const DataTypes = [
    { name: 'int8', id: 'int8', size: 1, category: 'Integer' },
    { name: 'uint8', id: 'uint8', size: 1, category: 'Integer' },
    { name: 'int16', id: 'int16', size: 2, category: 'Integer' },
    { name: 'uint16', id: 'uint16', size: 2, category: 'Integer' },
    { name: 'int32', id: 'int32', size: 4, category: 'Integer' },
    { name: 'uint32', id: 'uint32', size: 4, category: 'Integer' },
    { name: 'int64', id: 'int64', size: 8, category: 'Integer' },
    { name: 'uint64', id: 'uint64', size: 8, category: 'Integer' },
    { name: 'float32', id: 'float32', size: 4, category: 'Float' },
    { name: 'float64', id: 'float64', size: 8, category: 'Float' },
    { name: 'char8', id: 'char8', size: 1, category: 'Character' },
    { name: 'char16', id: 'char16', size: 2, category: 'Character' },
    { name: 'UTF-8', id: 'utf8', size: 0, category: 'Character' },
    { name: 'time32', id: 'time32', size: 4, category: 'Time' },
    { name: 'time64', id: 'time64', size: 8, category: 'Time' },
    { name: 'LEB128', id: 'leb128', size: 0, category: 'Variable' },
    { name: 'ULEB128', id: 'uleb128', size: 0, category: 'Variable' },
    { name: 'UUID', id: 'uuid', size: 16, category: 'Structured' },
];

// Inspector panel component (raw bytes into multiple types)
export class DataInspector {
    constructor(opts) {
        this.container = opts.container;
        this.fileHandler = opts.fileHandler;
        this.onActiveTypeChange = opts.onActiveTypeChange || (() => { });
        this.onSizeResolved = opts.onSizeResolved || (() => { });

        this.littleEndian = true;
        this.activeTypeId = 'uint8';
        this.currentOffset = -1;
        this.variableSizes = new Map();

        this.buildUi();
    }

    // Determine byte length of a given type at a specific offset
    GetTypeSizeAtOffset(offset, typeId = this.activeTypeId) {
        const dt = DataTypes.find(d => d.id === typeId);
        if (!dt) return 1;
        if (dt.size > 0) return dt.size;

        // Mutable size
        if (offset >= 0 && this.fileHandler) {
            const bytes = this.fileHandler.ReadSync(offset, offset + 16);
            if (bytes && bytes.length > 0) {
                const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
                if (typeId === 'utf8') {
                    const res = DecodeUtf8Char(view, 0);
                    if (res.bytesRead > 0) return res.bytesRead;
                } else if (typeId === 'leb128') {
                    const res = DecodeLeb128Signed(view, 0);
                    if (!res.error && res.bytesRead > 0) return res.bytesRead;
                } else if (typeId === 'uleb128') {
                    const res = DecodeLeb128Unsigned(view, 0);
                    if (!res.error && res.bytesRead > 0) return res.bytesRead;
                }
            }
        }

        return this.variableSizes.get(typeId) || 1;
    }

    // Update the inspector values for a newly selected offset
    async Update(offset) {
        this.currentOffset = offset;
        await this.refresh();
    }

    // Reset all rendered field values to blank state
    Clear() {
        this.currentOffset = -1;
        const cells = this.tbody.querySelectorAll('.dv-value');
        cells.forEach(c => c.textContent = '—');
        document.getElementById('dv-offset-info').textContent = 'Offset: —';
    }

    // Render the layout and category tables
    buildUi() {
        this.container.innerHTML = '';

        // Toolbar endian button
        this.endianBtn = document.getElementById('dv-endian-btn');
        if (this.endianBtn) {
            this.endianBtn.onclick = () => {
                this.littleEndian = !this.littleEndian;
                this.endianBtn.textContent = this.littleEndian ? 'LE' : 'BE';
                this.refresh();
            };
        }

        // Create table
        const tableWrap = document.createElement('div');
        tableWrap.className = 'dv-table-wrap';
        const table = document.createElement('table');
        table.className = 'dv-table';
        const tbody = document.createElement('tbody');
        tbody.id = 'dv-tbody';
        table.appendChild(tbody);
        tableWrap.appendChild(table);
        this.container.appendChild(tableWrap);

        this.tbody = tbody;

        // Render data type table
        let currentCategory = '';
        for (const dt of DataTypes) {
            if (dt.category !== currentCategory) {
                currentCategory = dt.category;
                const catRow = document.createElement('tr');
                catRow.className = 'dv-category-row';
                catRow.innerHTML = `<td colspan="2" class="dv-category">${currentCategory}</td>`;
                tbody.appendChild(catRow);
            }

            // Data type row
            const row = document.createElement('tr');
            row.className = 'dv-row';
            row.dataset.typeId = dt.id;
            if (dt.id === this.activeTypeId) row.classList.add('dv-active');
            row.innerHTML = `<td class="dv-name">${dt.name}</td><td class="dv-value">—</td>`;
            tbody.appendChild(row);
            row.addEventListener('click', () => this.setActiveType(dt.id));
        }

        // Offset info
        const offsetInfo = document.createElement('div');
        offsetInfo.className = 'dv-offset-info';
        offsetInfo.id = 'dv-offset-info';
        offsetInfo.textContent = 'Offset: —';
        this.container.appendChild(offsetInfo);
    }

    // Re-evaluate and render all supported type for active offset
    async refresh() {
        const offset = this.currentOffset;
        if (offset < 0) return;
        let data;
        try {
            data = await this.fileHandler.Read(offset, offset + 32);
        } catch {
            return;
        }
        if (data.length === 0) return;

        // Get endian and length
        const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
        const le = this.littleEndian;
        const remaining = data.length;
        const offsetHex = offset.toString(16).toUpperCase().padStart(8, '0');
        document.getElementById('dv-offset-info').textContent = `Offset: 0x${offsetHex} (${offset})`;

        // Update for each rows
        const rows = this.tbody.querySelectorAll('.dv-row');
        for (const row of rows) {
            const typeId = row.dataset.typeId;
            const valueCell = row.querySelector('.dv-value');
            const dt = DataTypes.find(d => d.id === typeId);

            if (!dt) continue;
            if (dt.size > 0 && remaining < dt.size) {
                valueCell.textContent = '(insufficient data)';
                continue;
            }

            try {
                const result = await this.interpretType(typeId, view, 0, le, remaining);
                valueCell.textContent = result;
            } catch {
                valueCell.textContent = '(error)';
            }
        }

        const resolvedSize = this.GetTypeSizeAtOffset(offset, this.activeTypeId);
        this.onSizeResolved(offset, this.activeTypeId, resolvedSize);
    }

    // Set the primary active data type
    setActiveType(typeId) {
        this.activeTypeId = typeId;
        const rows = this.tbody.querySelectorAll('.dv-row');
        rows.forEach(r => r.classList.toggle('dv-active', r.dataset.typeId === typeId));
        this.onActiveTypeChange(typeId);
    }

    // Parse bytes into string according to type
    async interpretType(typeId, view, off, le, remaining) {
        switch (typeId) {
            case 'int8': return view.getInt8(off).toString();
            case 'uint8': return view.getUint8(off).toString();
            case 'int16': return view.getInt16(off, le).toString();
            case 'uint16': return view.getUint16(off, le).toString();
            case 'int32': return view.getInt32(off, le).toString();
            case 'uint32': return view.getUint32(off, le).toString();
            case 'int64': return view.getBigInt64(off, le).toString();
            case 'uint64': return view.getBigUint64(off, le).toString();
            case 'float32': return view.getFloat32(off, le).toPrecision(7);
            case 'float64': return view.getFloat64(off, le).toPrecision(15);
            case 'char8': {
                const b = view.getUint8(off);
                const ch = String.fromCharCode(b);
                const printChar = (b >= 0x20 && b <= 0x7E) ? `'${ch}'` : `(0x${b.toString(16).toUpperCase()})`;
                return `${printChar}  [${b}]`;
            }
            case 'char16': {
                const code = view.getUint16(off, le);
                return `'${String.fromCharCode(code)}'  [U+${code.toString(16).toUpperCase().padStart(4, '0')}]`;
            }
            case 'utf8': {
                const { charVal, bytesRead } = DecodeUtf8Char(view, off);
                if (bytesRead === 0) return '(empty)';
                this.variableSizes.set('utf8', bytesRead);
                return `'${charVal}'  [U+${charVal.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}] (${bytesRead}B)`;
            }
            case 'time32': return FormatUnixTime(view.getUint32(off, le));
            case 'time64': return FormatUnixTime(view.getBigInt64(off, le));
            case 'leb128': {
                const res = DecodeLeb128Signed(view, off);
                if (res.error) return '(error)';
                this.variableSizes.set('leb128', res.bytesRead);
                return `${res.value} (${res.bytesRead}B)`;
            }
            case 'uleb128': {
                const res = DecodeLeb128Unsigned(view, off);
                if (res.error) return '(error)';
                this.variableSizes.set('uleb128', res.bytesRead);
                return `${res.value} (${res.bytesRead}B)`;
            }
            case 'uuid': return FormatUuid(view, off) || '(error)';
            default: return '—';
        }
    }
}