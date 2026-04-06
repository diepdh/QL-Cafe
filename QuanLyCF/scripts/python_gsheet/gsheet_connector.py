import os
import gspread
from google.oauth2.service_account import Credentials

# --- CẤU HÌNH ---
# Spreadsheet ID từ TASK_001
SPREADSHEET_ID = '1El4U6sCqolDR33A5o0_Z68IL8TOfBH09GQuK610SwUk'
# Đường dẫn file credentials
CRED_PATH = os.path.join(os.path.dirname(__file__), 'service_account.json')

def get_client():
    """Tạo client gspread để tương tác với Google Sheets"""
    scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]
    
    if not os.path.exists(CRED_PATH):
        raise FileNotFoundError(f"⚠️ Không tìm thấy file {CRED_PATH}. Hãy tạo Service Account và tải file JSON về.")
        
    creds = Credentials.from_service_account_file(CRED_PATH, scopes=scopes)
    return gspread.authorize(creds)

def get_spreadsheet():
    """Lấy đối tượng spreadsheet"""
    client = get_client()
    return client.open_by_key(SPREADSHEET_ID)

def get_sheet_data(sheet_name):
    """Lấy toàn bộ dữ liệu từ 1 sheet dưới dạng danh sách dict"""
    sh = get_spreadsheet()
    sheet = sh.worksheet(sheet_name)
    return sheet.get_all_records()

def verify_all_sheets():
    """Kiểm tra sự tồn tại của 14 sheets bắt buộc"""
    required_sheets = [
        'CONFIG', 'USERS', 'STAFF', 'CATEGORIES', 'PRODUCTS',
        'RAW_MATERIALS', 'REFINED_MATERIALS', 'RECIPES',
        'ORDERS', 'ORDER_ITEMS', 'PROCUREMENT', 'SUPPLIERS',
        'PROCESSING_LOG', 'ATTENDANCE', 'CASHFLOW'
    ]
    
    sh = get_spreadsheet()
    all_sheets = [s.title for s in sh.worksheets()]
    
    results = []
    for name in required_sheets:
        exists = name in all_sheets
        count = 0
        if exists:
            # Lấy số lượng dòng dữ liệu (không tính header)
            count = len(sh.worksheet(name).get_all_values()) - 1
            
        results.append({
            "name": name,
            "exists": exists,
            "has_data": count > 0,
            "rows": count
        })
    return results

if __name__ == "__main__":
    try:
        print(f"🔄 Đang kết nối tới Spreadsheet ID: {SPREADSHEET_ID}...")
        results = verify_all_sheets()
        print("\n📊 KẾT QUẢ KIỂM TRA SHEETS:")
        print("-" * 50)
        for res in results:
            status = "✅" if res['exists'] else "❌"
            data_status = "📦" if res['has_data'] else "⚪"
            print(f"{status} {res['name']:20} | Dữ liệu: {data_status} | Dòng: {res['rows']}")
        print("-" * 50)
    except Exception as e:
        print(f"❌ LỖI: {str(e)}")
