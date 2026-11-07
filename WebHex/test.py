import struct
import time
import uuid

def uleb128(val: int) -> bytes:
    res = bytearray()
    while True:
        byte = val & 0x7F
        val >>= 7
        if val == 0:
            res.append(byte)
            break
        res.append(byte | 0x80)
    return bytes(res)

def sleb128(val: int) -> bytes:
    res = bytearray()
    while True:
        byte = val & 0x7F
        val >>= 7
        sign_bit = (byte & 0x40) != 0
        if (val == 0 and not sign_bit) or (val == -1 and sign_bit):
            res.append(byte)
            break
        res.append(byte | 0x80)
    return bytes(res)

fields = [
    (b"int8", struct.pack("<b", -42)),
    (b"uint8", struct.pack("<B", 200)),
    (b"int16", struct.pack("<h", -12345)),
    (b"uint16", struct.pack("<H", 54321)),
    (b"int32", struct.pack("<i", -2147483648)),
    (b"uint32", struct.pack("<I", 3000000000)),
    (b"int64", struct.pack("<q", -9000000000000000000)),
    (b"uint64", struct.pack("<Q", 18000000000000000000)),
    (b"float32", struct.pack("<f", 3.1415926)),
    (b"float64", struct.pack("<d", 2.718281828459045)),
    (b"char8", b"A"),
    (b"char16", "B".encode("utf-16le")),
    (b"utf8", "한".encode("utf-8")),
    (b"time32", struct.pack("<I", int(time.time()))),
    (b"time64", struct.pack("<q", int(time.time()))),
    (b"leb128", sleb128(-624485)),
    (b"uleb128", uleb128(624485)),
    (b"uuid", uuid.UUID("12345678-1234-5678-1234-567812345678").bytes),
]

payload = bytearray()
for name, raw in fields:
    payload.extend(name)
    payload.extend(raw)

with open("test.bin", "wb") as f:
    f.write(payload)