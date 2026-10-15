# Cập nhật trang ôn tập Sinh học 10 — lớp 10A10

Bản chuẩn bị ngày 15/10/2026. Đã sửa trên bản sao mã nguồn, chưa đưa lên GitHub.

## Cập nhật bằng giao diện GitHub

1. Giải nén `SINH10_10A10_CAP_NHAT.zip`.
2. Mở kho `vvbhaidocbinhkieucailay-lang/on-tap-cong-nghe-12` trên GitHub, chọn nhánh đang được GitHub Pages sử dụng (bản nguồn tải về là `main`).
3. Mở đúng thư mục **sinh-10**. Chọn **Add file → Upload files**.
4. Kéo **bốn tệp bên trong thư mục sinh-10 của gói giải nén** vào: `index.html`, `app.js`, `styles.css`, `exams.js`. Không kéo cả thư mục vào bên trong thư mục cùng tên, tránh tạo `sinh-10/sinh-10`.
5. Ghi nội dung cập nhật, ví dụ: `Cập nhật ôn tập Sinh 10: lớp 10A10, đề 102/103, chọn ý bằng số`, rồi lưu thay đổi.
6. Chờ GitHub Pages triển khai thành công. Mở lại hai link, tải lại trang nếu còn giao diện cũ, kiểm tra lớp và mã đề trước khi gửi cho học sinh.

Hai tệp `bank-a.js`, `bank-b.js` cũ có thể để nguyên để tham khảo; bản mới không tải hai tệp này. Không thay `index.html` ở thư mục gốc của kho vì đó là trang Công nghệ 12.

## Link học sinh dùng sau khi cập nhật

- Đề 102: https://vvbhaidocbinhkieucailay-lang.github.io/on-tap-cong-nghe-12/sinh-10/?made=102
- Đề 103: https://vvbhaidocbinhkieucailay-lang.github.io/on-tap-cong-nghe-12/sinh-10/?made=103

Link giữ nguyên. Học sinh nhập họ tên, chọn lớp 10A10 rồi bắt đầu. Chỉ có hai mã 102 và 103; mỗi mã cố định 34 câu, 60 phút, 10 điểm.

## Cách chấm

- 24 câu trắc nghiệm: 0,25 điểm/câu, tối đa 6 điểm.
- 2 câu đúng/sai, mỗi câu 4 ý: 0,25 điểm/ý, tối đa 2 điểm.
- 8 câu chọn ý bằng số: 0,25 điểm/câu, tối đa 2 điểm. Chỉ đúng khi chọn đủ các ý đúng và không chọn ý sai.
- Ví dụ đáp án `[1,4]`: `1,4`, `4,1`, `1 4`, `1;4` được chấp nhận. `1`, `1,2,4`, `14`, chữ hoặc số ngoài phạm vi không đúng. Số trùng được coi là một ý.
- Đáp án, ý sai, ý chọn thừa/còn thiếu và giải thích chỉ hiện ở phần chữa bài sau khi nộp. Có lọc câu chưa đúng, làm lại và tải kết quả dạng TXT.

## Kết quả và dữ liệu

Địa chỉ Apps Script trong mã gốc để trống. Bản này là **tự luyện và chấm tại thiết bị**, chưa có hệ thống nhận bài của giáo viên. Nút “Nộp bài” kết thúc lượt luyện và chấm điểm; không tự gửi dữ liệu đi. Học sinh tải kết quả hoặc chụp màn hình để gửi theo yêu cầu của giáo viên.

Chưa có lưu bài đang làm để khôi phục sau khi đóng trang. Trang cảnh báo trước khi rời đi; nên làm xong rồi tải kết quả. Bài tĩnh công khai đáp án trong mã nguồn, phù hợp ôn tập, không dùng làm bài thi chính thức.

Nếu cần thu bài vào Google Sheets, bước tiếp theo là cung cấp đúng URL Apps Script đang triển khai và kiểm tra cơ chế xác nhận lưu thành công; không chỉ đổi dòng thông báo thành “Đã gửi”.

## Chỉnh sửa lần sau

- Nội dung và đáp án hai đề: `sinh-10/exams.js`.
- Giao diện: `sinh-10/index.html`, `sinh-10/styles.css`.
- Chấm điểm và thao tác: `sinh-10/app.js`.
- Câu chọn ý bằng số dùng `loai: "TLN"`, `cacNhanDinh: [{so:1,noiDung:"...",dung:true}, ...]`, `dapAn:[1,4]`. Danh sách `dapAn` phải đúng bằng các số có `dung:true`.
- Đọc `BAO_CAO_Ra_SOAT.md` để biết những câu đã thay đổi nội dung. Đây là phiên bản ôn tập đã biên tập lại, không phải bản số hóa giữ nguyên toàn bộ đề cũ.

## Kiểm tra trước khi phát link

Mở cả hai link; chọn lớp; chuyển giữa các câu để kiểm tra giữ lựa chọn; thử câu chọn số; nộp bài và xem lời chữa; tải kết quả. Đã kiểm tra bộ chấm bằng 515 kiểm tra tự động, gồm 16 tập con có thể chọn cho mỗi câu TLN, điểm tối đa 10 và bỏ trống được 0. Đã thử thao tác trình duyệt cho cả hai mã, nhập sai định dạng, đảo thứ tự, chọn thiếu/thừa, nộp bài và tải TXT; đã xem bố cục ở màn hình nhỏ và màn hình máy tính.
