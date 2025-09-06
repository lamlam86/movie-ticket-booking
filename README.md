# 🚀 Hướng dẫn dùng Git hằng ngày

## 📥 Lấy code mới nhất (mỗi ngày trước khi code)
```bash
git checkout <ten-nhanh-cua-ban>   # chuyển sang nhánh của mình
git fetch origin                   # lấy thông tin repo
git pull origin main               # cập nhật code từ main

💾 Lưu và đẩy code sau khi làm xong
git add .
git commit -m "Mô tả chức năng vừa làm"
git push origin <ten-nhanh-cua-ban>
