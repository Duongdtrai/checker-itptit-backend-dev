# Backend CheckerITPTIT project

Dự án được xây dựng bởi team web ITPTIT.

## Các bước thực hiện

Đối với lần đầu kéo dự án về, cần copy file .env.template thành .env

Đầu tiên, chạy câu lệnh để tạo môi trường mysql

### `npm run dcc:up`

Tiếp theo, nếu lần đầu kéo dự án về thì chạy câu lệnh

### `npm install`

Tiếp theo, chạy câu lệnh để migrate file migrations, từ đó tạo bảng và cấu trúc
(thường thì chỉ cần chạy lần đầu tiên kéo dự án về, nếu sau code có update file migration mới thì mới cần chạy lại)
### `npm run migratedb`

Chạy backend

### `npm run dev`

Nếu muốn tắt mysql đi, thì chạy câu lệnh

### `npm run dcc:down`
