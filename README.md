# Educational Guidance

เว็บข้อมูลโรงเรียนเพื่อการแนะแนว สร้างด้วย Vite + React และรันแบบ static site

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

ไฟล์ production จะอยู่ใน `dist`

## GitHub Pages

โปรเจกต์นี้มี workflow ที่ `.github/workflows/deploy.yml` สำหรับ build และ deploy ไป GitHub Pages อัตโนมัติเมื่อ push เข้า branch `main`

ใน GitHub ให้เปิด `Settings > Pages` แล้วเลือก source เป็น `GitHub Actions`
