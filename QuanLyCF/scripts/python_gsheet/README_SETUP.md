# 🛠️ SETUP GOOGLE SHEETS API (PYTHON)

Thư mục này chứa các script Python giúp Gemini CLI tương tác trực tiếp với Google Sheets database của dự án.

## 📋 Yêu cầu hệ thống
- Python 3.8+
- Thư viện: `gspread`, `google-auth`

## 🚀 Các bước cài đặt
1. Cài đặt thư viện:
   ```bash
   pip install gspread google-auth
   ```
2. Đặt file `service_account.json` (tải từ Google Cloud Console) vào thư mục này.
3. Chia sẻ quyền **Editor** cho email của Service Account trong file Google Sheet "QuanLyCF-DB".
4. Thêm `scripts/python_gsheet/service_account.json` vào `.gitignore` để bảo mật.

## 📂 Danh sách file
- `gsheet_connector.py`: Module chính xử lý kết nối.
- `verify_sheets.py`: Script kiểm tra cấu hình sheets (thay thế verifySheetSetup).
- `seed_data.py`: Script hỗ trợ nạp dữ liệu mẫu nhanh.
