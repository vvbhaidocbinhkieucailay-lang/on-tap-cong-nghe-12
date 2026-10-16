# Ôn tập Sinh học 10 — bản v2

Website chính dùng hai mã đề 102 và 103. Các lớp: 10A2, 10A10, 10A13, 10A14, 10A17. Mã học sinh gồm lớp và số thứ tự (1–99), ví dụ 10A2-01.

- Giao diện chính: `sinh-10/index.html`.
- Đường dẫn cũ `sinh-10-test/` chỉ chuyển hướng sang website chính, không phục vụ đề thử.
- Ngân hàng câu hỏi và đáp án được quản lý trong Google Sheet riêng tư. Apps Script cấp đề, chấm điểm và lưu bài; trình duyệt chỉ gửi câu trả lời.
- Đề 102/103 đang ở chế độ ôn tập. Học sinh xem điểm và lời giải sau khi máy chủ xác nhận lưu.
- TLN chọn các nhận định đúng: `1,4`, `4;1`, `1 4` tương đương; `14` và chuỗi sai định dạng không được tính như tập hợp 1 và 4.

## Khi sửa đề

Sửa Sheet ngân hàng riêng tư, kiểm tra cả nội dung và đáp án, chạy `KIEM_TRA_DE`, thử ở môi trường riêng rồi mới áp dụng. Lượt đang làm dùng bản đề và chính sách công bố đã lưu khi bắt đầu.

Kết quả lớp giữ điểm của lượt nộp gần nhất, sắp theo lớp rồi số thứ tự. Lịch sử ghi mỗi lượt một dòng. Nếu chưa có xác nhận lưu, bài chờ được giữ trong trình duyệt khi bộ nhớ cho phép; học sinh có thể gửi lại hoặc tải bản sao.

## Triển khai và khôi phục

Địa chỉ Web App chính nằm trong `APPS_SCRIPT_URL` của giao diện chính. Dùng đúng bảng kết quả chính trong Script Properties. Không đưa ngân hàng, đáp án, khóa quản trị hoặc bản sao riêng tư vào kho này.

Nhánh `backup-sinh10-truoc-v2` lưu website v1. Bản sao Apps Script và bảng kết quả được lưu riêng tư. Khi khôi phục giao diện cũ, phải đồng thời dùng lại máy chủ v1 tương ứng.

Đáp án của v1 từng công khai và còn trong lịch sử Git; chuyển sang v2 không làm bí mật trở lại những câu đã công bố. Hệ thống chưa xác thực danh tính từng học sinh; giáo viên đối chiếu mã và tên với danh sách lớp.
