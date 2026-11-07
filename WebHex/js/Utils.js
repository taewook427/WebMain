// Maximum supported file size
export const MaxFileSize = 1024 * 1024 * 1024; // 1GiB

// Convert a byte value into a two-digit hexadecimal string
export function ByteToHex(value) {
    return value.toString(16).toUpperCase().padStart(2, '0'); // 0-255
}

// Convert a byte value into ASCII display info
export function GetAsciiInfo(value) {
    if (value >= 0x20 && value <= 0x7E) { // ASCII
        return { charVal: String.fromCharCode(value), isMapped: false, isPrintable: true };
    }
    if (value >= 0x80) { // Overflowed ASCII
        const mappedValue = value - 128;
        if (mappedValue >= 0x20 && mappedValue <= 0x7E) {
            return { charVal: String.fromCharCode(mappedValue), isMapped: true, isPrintable: true };
        }
        return { charVal: '.', isMapped: true, isPrintable: false };
    }
    return { charVal: '.', isMapped: false, isPrintable: false };
}

// Format byte count into a human-readable unit string
export function FormatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KiB', 'MiB', 'GiB'];
    const kilo = 1024;
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(kilo)), units.length - 1);
    const value = bytes / Math.pow(kilo, index);
    return value.toFixed(index === 0 ? 0 : 2) + ' ' + units[index];
}

// Format a numeric byte offset into a padded hexadecimal string
export function FormatOffset(offset, fileSize) {
    let width = 8;
    if (fileSize > 0xFFFFFFFF) width = 12;
    else if (fileSize > 0xFFFFFF) width = 8;
    else if (fileSize > 0xFFFF) width = 6;
    return offset.toString(16).toUpperCase().padStart(Math.max(width, 8), '0');
}

// Format a 16-byte slice as a standard UUID string
export function FormatUuid(view, offset) {
    if (offset + 16 > view.byteLength) return null;
    const hexParts = [];
    for (let i = 0; i < 16; i++) {
        hexParts.push(ByteToHex(view.getUint8(offset + i)));
    }
    return [
        hexParts.slice(0, 4).join(''),
        hexParts.slice(4, 6).join(''),
        hexParts.slice(6, 8).join(''),
        hexParts.slice(8, 10).join(''),
        hexParts.slice(10, 16).join('')
    ].join('-');
}

// Format a Unix timestamp into a readable UTC date string
export function FormatUnixTime(timestamp) {
    if (Number(timestamp) === 0) return '1970-01-01 00:00:00 UTC';
    try {
        const date = new Date(Number(timestamp) * 1000);
        if (isNaN(date.getTime())) return '(invalid)';
        return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
    } catch {
        return '(invalid)';
    }
}


// Decode a signed LEB128 integer from a DataView buffer
export function DecodeLeb128Signed(view, offset) {
    let result = 0n;
    let shift = 0n;
    let bytesRead = 0;
    let byteVal;
    const maxBytes = Math.min(10, view.byteLength - offset);

    do {
        if (bytesRead >= maxBytes) {
            return { value: result, bytesRead, error: true };
        }
        byteVal = view.getUint8(offset + bytesRead);
        result |= BigInt(byteVal & 0x7F) << shift;
        shift += 7n;
        bytesRead++;
    } while (byteVal & 0x80);

    if (shift < 64n && (byteVal & 0x40)) {
        result |= -(1n << shift);
    }

    return { value: result, bytesRead, error: false };
}

// Decode an unsigned LEB128 integer from a DataView buffer
export function DecodeLeb128Unsigned(view, offset) {
    let result = 0n;
    let shift = 0n;
    let bytesRead = 0;
    let byteVal;
    const maxBytes = Math.min(10, view.byteLength - offset);

    do {
        if (bytesRead >= maxBytes) {
            return { value: result, bytesRead, error: true };
        }
        byteVal = view.getUint8(offset + bytesRead);
        result |= BigInt(byteVal & 0x7F) << shift;
        shift += 7n;
        bytesRead++;
    } while (byteVal & 0x80);

    return { value: result, bytesRead, error: false };
}


// Decode a single UTF-8 character from a DataView buffer
export function DecodeUtf8Char(view, offset) {
    const remaining = view.byteLength - offset;
    if (remaining <= 0) return { charVal: '', bytesRead: 0 };
    const byte0 = view.getUint8(offset);
    let bytesNeeded, codePoint;

    if (byte0 < 0x80) {
        return { charVal: String.fromCodePoint(byte0), bytesRead: 1 };
    } else if ((byte0 & 0xE0) === 0xC0) {
        bytesNeeded = 2;
        codePoint = byte0 & 0x1F;
    } else if ((byte0 & 0xF0) === 0xE0) {
        bytesNeeded = 3;
        codePoint = byte0 & 0x0F;
    } else if ((byte0 & 0xF8) === 0xF0) {
        bytesNeeded = 4;
        codePoint = byte0 & 0x07;
    } else {
        return { charVal: '\uFFFD', bytesRead: 1 };
    }

    if (remaining < bytesNeeded) {
        return { charVal: '\uFFFD', bytesRead: 1 };
    }

    for (let i = 1; i < bytesNeeded; i++) {
        const byteN = view.getUint8(offset + i);
        if ((byteN & 0xC0) !== 0x80) {
            return { charVal: '\uFFFD', bytesRead: 1 };
        }
        codePoint = (codePoint << 6) | (byteN & 0x3F);
    }

    return { charVal: String.fromCodePoint(codePoint), bytesRead: bytesNeeded };
}