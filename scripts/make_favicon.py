#!/usr/bin/env python3
"""Rasterize the Win With Dez emblem (green rounded square + white check)
to PNG/ICO with no third-party libraries. Supersampled for anti-aliasing."""
import struct, zlib, math

# Emblem geometry in a 32x32 logical space
R_CORNER = 8.0
C0 = (92, 186, 60)   # #5cba3c
C1 = (47, 158, 42)   # #2f9e2a
CHECK = [(8.0, 16.5), (13.0, 21.5), (24.0, 9.5)]
HALFW = 1.75         # half of stroke-width 3.5

def clamp(v, a, b): return a if v < a else b if v > b else v

def rrect_sdf(px, py):
    # signed distance to rounded rect centered in 32x32, radius R_CORNER
    qx = abs(px - 16.0) - (16.0 - R_CORNER)
    qy = abs(py - 16.0) - (16.0 - R_CORNER)
    ox, oy = max(qx, 0.0), max(qy, 0.0)
    return math.hypot(ox, oy) + min(max(qx, qy), 0.0) - R_CORNER

def seg_dist(px, py, a, b):
    ax, ay = a; bx, by = b
    dx, dy = bx - ax, by - ay
    l2 = dx * dx + dy * dy
    t = 0.0 if l2 == 0 else clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0.0, 1.0)
    cx, cy = ax + t * dx, ay + t * dy
    return math.hypot(px - cx, py - cy)

def check_dist(px, py):
    return min(seg_dist(px, py, CHECK[0], CHECK[1]),
               seg_dist(px, py, CHECK[1], CHECK[2]))

def render(size, ss=4):
    """Return raw RGBA bytes for a size x size icon."""
    out = bytearray()
    scale = 32.0 / size
    inv = 1.0 / (size * ss)
    for y in range(size):
        for x in range(size):
            ar = ag = ab = aa = 0.0
            for sy in range(ss):
                for sx in range(ss):
                    lx = ((x * ss + sx + 0.5) * inv) * 32.0
                    ly = ((y * ss + sy + 0.5) * inv) * 32.0
                    if rrect_sdf(lx, ly) > 0:      # outside the rounded square
                        continue
                    if check_dist(lx, ly) <= HALFW:
                        r, g, b = 255, 255, 255    # white check
                    else:
                        t = clamp((lx + ly) / 64.0, 0.0, 1.0)  # diagonal gradient
                        r = C0[0] + (C1[0] - C0[0]) * t
                        g = C0[1] + (C1[1] - C0[1]) * t
                        b = C0[2] + (C1[2] - C0[2]) * t
                    ar += r; ag += g; ab += b; aa += 1.0
            n = ss * ss
            alpha = aa / n
            if aa > 0:
                r = int(round(ar / aa)); g = int(round(ag / aa)); b = int(round(ab / aa))
            else:
                r = g = b = 0
            out += bytes((r, g, b, int(round(alpha * 255))))
    return bytes(out)

def png_bytes(size, raw):
    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data +
                struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff))
    # add filter byte 0 per scanline
    stride = size * 4
    filtered = bytearray()
    for y in range(size):
        filtered.append(0)
        filtered += raw[y * stride:(y + 1) * stride]
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    return (b"\x89PNG\r\n\x1a\n" +
            chunk(b"IHDR", ihdr) +
            chunk(b"IDAT", zlib.compress(bytes(filtered), 9)) +
            chunk(b"IEND", b""))

def ico_bytes(entries):
    """entries: list of (size, png_data)."""
    n = len(entries)
    header = struct.pack("<HHH", 0, 1, n)
    dir_entries = b""
    offset = 6 + 16 * n
    payload = b""
    for size, data in entries:
        w = 0 if size >= 256 else size
        dir_entries += struct.pack("<BBBBHHII", w, w, 0, 0, 1, 32, len(data), offset)
        payload += data
        offset += len(data)
    return header + dir_entries + payload

base = "/home/user/Winwithdez-funnel/"
targets = {16: "favicon-16.png", 32: "favicon-32.png",
           180: "apple-touch-icon.png", 192: "icon-192.png", 512: "icon-512.png"}
pngs = {}
for size, name in targets.items():
    ss = 4 if size <= 192 else 3
    data = png_bytes(size, render(size, ss))
    pngs[size] = data
    with open(base + name, "wb") as f:
        f.write(data)
    print(f"wrote {name} ({len(data)} bytes)")

with open(base + "favicon.ico", "wb") as f:
    f.write(ico_bytes([(16, pngs[16]), (32, pngs[32])]))
print("wrote favicon.ico")
