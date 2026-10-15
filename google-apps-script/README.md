# Nhận kết quả Sinh học 10 – lớp 10A10

## Bảng của giáo viên

https://docs.google.com/spreadsheets/d/1UC1Ba2mDkUF_B1jiTFuOdQHhbSjgxEQftNSOw6PsECM/edit

Bảng ở thư mục ChatGPT trong Drive. Giữ quyền truy cập riêng tư.

- **Kết quả lớp:** Số thứ tự, Mã học sinh, Họ tên, Lớp, Điểm số. Mỗi mã học sinh có một dòng, lấy điểm của lượt được máy chủ nhận gần nhất, xếp theo lớp rồi số thứ tự.
- **Lịch sử làm bài:** giữ từng lượt, mã đề, thời gian nhận theo giờ Việt Nam, thời gian làm và phiếu trả lời. Điểm được máy chủ chấm lại từ đáp án đã kiểm tra.
- Mã học sinh được tạo từ lớp và số thứ tự: số 1 của lớp 10A10 là 10A10-01. Học sinh phải nhập đúng số thứ tự theo danh sách lớp. Chưa có danh sách tên để tự xác minh người nhập.

## Trạng thái ngày 15/10/2026

Bảng đã tạo. Mã nguồn đã lưu trong dự án Apps Script sau:

https://script.google.com/u/0/home/projects/1VRxnr3XxjRtEpFoYb3jBAYp20_6JeATfdiy5Udvg6l4ERPuzedUn-1Zy/edit

Chủ tài khoản đã cấp quyền và chạy initialize thành công. Web app phiên bản 1 đã triển khai với Execute as: Me, Who has access: Anyone.

URL nhận bài: https://script.google.com/macros/s/AKfycbwgawivwigBLd_qGg7k1lvGrnGN_mea4f6L63GV7XHPKxPqQrQGCUTx-66jJoJAKmmDkQ/exec

Đã thử nộp thật từ trình duyệt cho cả đề 102 và 103, kiểm tra biên nhận và dòng trong bảng. Đã thử gửi lại cùng mã lượt: máy chủ báo duplicate và không thêm dòng. Bảng tổng hợp xếp số 98 trước số 99 dù nộp sau. Hai dòng thử có tên Kiểm Thử Hệ Thống được dọn trước khi sử dụng.

## Hoàn tất kết nối

1. Trong Apps Script, hoàn tất cấp quyền Google Sheets bằng tài khoản sở hữu bảng (đã hoàn tất).
2. Triển khai Web app, Execute as: Me, Who has access: Anyone. Dịch vụ chỉ nhận bài và trả biên nhận của chính lượt gửi, không có chức năng đọc bảng điểm công khai.
3. Chép URL Web app kết thúc bằng /exec vào `window.SUBMISSION_URL` trong `sinh-10/submission.js`.
4. Thử nộp từ trang web, kiểm tra biên nhận và dòng thật trong bảng; kiểm tra gửi lại cùng mã lượt không thêm dòng. Xóa các dòng thử xác định rõ trước khi dùng cho học sinh.
5. Cập nhật GitHub Pages và kiểm tra lại cả hai link đề 102, 103.

## Khi cập nhật về sau

`Code.gs` chứa bộ nhận bài. `AnswerKeys.gs` chứa đáp án rút gọn từ `sinh-10/exams.js`. Khi đổi nội dung đề hoặc cách chấm, đồng bộ cả hai nơi và tăng phiên bản đề.

Trang chỉ báo đã lưu khi nhận được phản hồi JSON xác nhận đúng mã lượt và điểm. Nếu mất mạng, bài chờ gửi được giữ trong trình duyệt khi bộ nhớ cho phép; thử lại khi mở trang/có mạng hoặc bấm Gửi lại. Khi đã xác nhận lưu, dữ liệu chờ gửi được xóa khỏi trình duyệt.

Đây là hệ thống ôn tập có đáp án công khai, không có đăng nhập xác thực từng học sinh. Giáo viên đối chiếu mã và tên với danh sách lớp khi sử dụng điểm.

Tham khảo cơ chế triển khai: https://developers.google.com/apps-script/guides/web
