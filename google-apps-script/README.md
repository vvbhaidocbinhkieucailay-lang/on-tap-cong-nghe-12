# Máy chủ Sinh học 10 v2

Apps Script chính quản lý cấp đề, chấm bài và ghi kết quả vào Google Sheet riêng tư. Mã máy chủ và ngân hàng được lưu ngoài kho công khai này.

Giao diện gọi Web App chính qua `APPS_SCRIPT_URL` trong `sinh-10/index.html`. Môi trường `sinh-10-test/` dùng Web App và bảng thử riêng.

Script Properties cần khai báo `BANK_SHEET_ID`, `RESULTS_SHEET_ID`, `GRACE_SECONDS`. `ADMIN_KEY` chỉ đặt riêng tư khi cần bật công bố sớm; để trống thì chức năng đó bị tắt.

Trước khi triển khai hoặc đổi đề, chạy `KIEM_TRA_DE` và đối chiếu bài nộp thật trong bảng kết quả. Chi tiết vận hành xem `HUONG_DAN_CAP_NHAT_SINH10.md`.

Mã và đáp án v1 đã được sao lưu riêng trước khi gỡ khỏi phiên bản hiện hành. Chúng vẫn tồn tại trong lịch sử Git.
