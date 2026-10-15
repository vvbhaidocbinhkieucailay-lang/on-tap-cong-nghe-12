# Cập nhật trang ôn tập Sinh học 10 — khối 10

Bản cập nhật ngày 15/10/2026. Trang đã triển khai trên GitHub Pages; bản này bổ sung nhận kết quả vào Google Sheets.

## Cập nhật bằng giao diện GitHub

1. Giải nén `SINH10_10A10_CAP_NHAT.zip`.
2. Mở kho `vvbhaidocbinhkieucailay-lang/on-tap-cong-nghe-12` trên GitHub, chọn nhánh đang được GitHub Pages sử dụng (bản nguồn tải về là `main`).
3. Mở đúng thư mục **sinh-10**. Chọn **Add file → Upload files**.
4. Cập nhật **năm tệp trong thư mục sinh-10**: `index.html`, `app.js`, `styles.css`, `exams.js`, `submission.js`. Không kéo cả thư mục vào bên trong thư mục cùng tên, tránh tạo `sinh-10/sinh-10`.
5. Ghi nội dung cập nhật, ví dụ: `Cập nhật ôn tập Sinh 10: lớp 10A10, đề 102/103, chọn ý bằng số`, rồi lưu thay đổi.
6. Chờ GitHub Pages triển khai thành công. Mở lại hai link, tải lại trang nếu còn giao diện cũ, kiểm tra lớp và mã đề trước khi gửi cho học sinh.

Hai tệp `bank-a.js`, `bank-b.js` cũ có thể để nguyên để tham khảo; bản mới không tải hai tệp này. Không thay `index.html` ở thư mục gốc của kho vì đó là trang Công nghệ 12.

## Link học sinh dùng sau khi cập nhật

- Đề 102: https://vvbhaidocbinhkieucailay-lang.github.io/on-tap-cong-nghe-12/sinh-10/?made=102
- Đề 103: https://vvbhaidocbinhkieucailay-lang.github.io/on-tap-cong-nghe-12/sinh-10/?made=103

Link giữ nguyên. Học sinh nhập họ tên, chọn lớp trong 10A2, 10A10, 10A13, 10A14, 10A17, nhập số thứ tự theo danh sách lớp rồi bắt đầu. Mã tự tạo theo lớp và số thứ tự, ví dụ 10A13-01. Chỉ có hai mã 102 và 103; mỗi mã cố định 34 câu, 60 phút, 10 điểm.

## Cách chấm

- 24 câu trắc nghiệm: 0,25 điểm/câu, tối đa 6 điểm.
- 2 câu đúng/sai, mỗi câu 4 ý: 0,25 điểm/ý, tối đa 2 điểm.
- 8 câu chọn ý bằng số: 0,25 điểm/câu, tối đa 2 điểm. Chỉ đúng khi chọn đủ các ý đúng và không chọn ý sai.
- Ví dụ đáp án `[1,4]`: `1,4`, `4,1`, `1 4`, `1;4` được chấp nhận. `1`, `1,2,4`, `14`, chữ hoặc số ngoài phạm vi không đúng. Số trùng được coi là một ý.
- Đáp án, ý sai, ý chọn thừa/còn thiếu và giải thích chỉ hiện ở phần chữa bài sau khi nộp. Có lọc câu chưa đúng, làm lại và tải kết quả dạng TXT.

## Kết quả và dữ liệu

Khi nộp bài, mã học sinh, số thứ tự, họ tên, lớp, mã đề, phiếu trả lời và điểm được gửi vào bộ nhận bài Google Apps Script. Máy chủ chấm lại và lưu vào bảng riêng của giáo viên:

https://docs.google.com/spreadsheets/d/1UC1Ba2mDkUF_B1jiTFuOdQHhbSjgxEQftNSOw6PsECM/edit

Trang Kết quả lớp có năm cột theo yêu cầu, mỗi học sinh một dòng với điểm lần nộp được máy chủ nhận gần nhất, xếp theo lớp rồi số thứ tự. Trang Lịch sử làm bài giữ từng lượt, mã đề, thời gian nhận và phiếu trả lời. Bảng không chia sẻ công khai cho học sinh.

Trang chỉ báo đã lưu khi máy chủ trả xác nhận đúng mã lượt và điểm. Nếu mất mạng, có nút Gửi lại; dữ liệu chờ gửi được giữ trong trình duyệt nếu bộ nhớ cho phép. Gửi lại cùng mã lượt không thêm dòng trùng. Học sinh vẫn có thể tải kết quả TXT.

Chưa có lưu bài đang làm để khôi phục sau khi đóng trang. Trang cảnh báo trước khi rời đi; nên làm xong rồi tải kết quả. Bài tĩnh công khai đáp án trong mã nguồn, phù hợp ôn tập, không dùng làm bài thi chính thức.

Chi tiết triển khai và bảo trì nằm trong `google-apps-script/README.md`. Mã học sinh được học sinh tự khai theo số thứ tự lớp; chưa có đăng nhập hoặc đối chiếu danh sách tên của trường.

## Chỉnh sửa lần sau

- Nội dung và đáp án hai đề: `sinh-10/exams.js`.
- Giao diện: `sinh-10/index.html`, `sinh-10/styles.css`.
- Chấm điểm và thao tác: `sinh-10/app.js`.
- Gửi kết quả và gửi lại: `sinh-10/submission.js`; nhận bài và chấm lại: `google-apps-script/Code.gs`, `google-apps-script/AnswerKeys.gs`.
- Câu chọn ý bằng số dùng `loai: "TLN"`, `cacNhanDinh: [{so:1,noiDung:"...",dung:true}, ...]`, `dapAn:[1,4]`. Danh sách `dapAn` phải đúng bằng các số có `dung:true`.
- Đọc `BAO_CAO_Ra_SOAT.md` để biết những câu đã thay đổi nội dung. Đây là phiên bản ôn tập đã biên tập lại, không phải bản số hóa giữ nguyên toàn bộ đề cũ.

## Kiểm tra trước khi phát link

Mở cả hai link; chọn lớp; chuyển giữa các câu để kiểm tra giữ lựa chọn; thử câu chọn số; nộp bài và xem lời chữa; tải kết quả. Đã kiểm tra bộ chấm bằng 515 kiểm tra tự động, gồm 16 tập con có thể chọn cho mỗi câu TLN, điểm tối đa 10 và bỏ trống được 0. Đã thử thao tác trình duyệt cho cả hai mã, nhập sai định dạng, đảo thứ tự, chọn thiếu/thừa, nộp bài và tải TXT; đã xem bố cục ở màn hình nhỏ và màn hình máy tính.
