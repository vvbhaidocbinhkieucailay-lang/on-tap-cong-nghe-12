// Nơi nhận bài ôn tập Sinh học 10. Không có chức năng đọc bảng điểm công khai.
const SPREADSHEET_ID = '1UC1Ba2mDkUF_B1jiTFuOdQHhbSjgxEQftNSOw6PsECM';
const EXAM_VERSION = '20261015';
const SUMMARY = 'Kết quả lớp';
const HISTORY = 'Lịch sử làm bài';

function doGet() {
  return json_({ok:true, service:'Sinh học 10 – nhận kết quả', version:EXAM_VERSION});
}
function doPost(e) {
  try {
    if (!e || !e.postData || e.postData.contents.length > 20000) throw Error('Dữ liệu bài làm không hợp lệ.');
    return json_(saveSubmission_(JSON.parse(e.postData.contents)));
  } catch (error) {
    return json_({ok:false, message:error.message || 'Chưa lưu được bài. Em hãy gửi lại.'});
  }
}
function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
function validate_(p) {
  if (!p || p.version !== EXAM_VERSION || !['102','103'].includes(p.code)) throw Error('Phiên bản đề không khớp. Em tải lại trang nhé.');
  if (!/^[a-zA-Z0-9-]{20,80}$/.test(p.submissionId || '')) throw Error('Mã lượt làm không hợp lệ.');
  if (p.className !== '10A10' || !Number.isInteger(p.number) || p.number < 1 || p.number > 99) throw Error('Số thứ tự hoặc lớp không hợp lệ.');
  const studentId = p.className + '-' + String(p.number).padStart(2,'0');
  if (p.studentId !== studentId) throw Error('Mã học sinh không khớp số thứ tự lớp.');
  if (typeof p.name !== 'string') throw Error('Thiếu họ tên.');
  const name = p.name.normalize('NFC').trim().replace(/\s+/g,' ');
  if (name.length < 2 || name.length > 60 || !/^[\p{L}\p{M} .’'-]+$/u.test(name) || !/\p{L}/u.test(name)) throw Error('Họ tên chưa hợp lệ.');
  if (!p.answers || typeof p.answers !== 'object' || Array.isArray(p.answers) || JSON.stringify(p.answers).length > 12000) throw Error('Phiếu trả lời không hợp lệ.');
  if (!Number.isInteger(p.elapsed) || p.elapsed < 0 || p.elapsed > 3600) throw Error('Thời gian làm bài không hợp lệ.');
  return {...p,name,studentId};
}
function score_(code, answers) {
  return ANSWER_KEYS[code].reduce((score,q)=>{
    const a=answers[q.id];
    if(q.type==='TN') return score+(a===q.answer ? .25:0);
    if(q.type==='DS') return score+q.answer.filter((v,i)=>Array.isArray(a)&&a[i]===v).length*.25;
    const text=String(a ?? '').trim();
    if(!/^\d+(?:\s*[,;]\s*\d+|\s+\d+)*$/.test(text))return score;
    const values=[...new Set(text.split(/[\s,;]+/).map(Number))].sort((a,b)=>a-b);
    return score+(values.length===q.answer.length&&values.every((v,i)=>v===q.answer[i])?.25:0);
  },0);
}
function saveSubmission_(input) {
  const p=validate_(input), score=score_(p.code,p.answers);
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(20000)) throw Error('Đang có nhiều bạn nộp bài. Em bấm Gửi lại sau ít giây.');
  try {
    const ss=SpreadsheetApp.openById(SPREADSHEET_ID), history=ss.getSheetByName(HISTORY), summary=ss.getSheetByName(SUMMARY);
    if(!history||!summary)throw Error('Thiếu trang tính nhận bài. Báo giáo viên để kiểm tra.');
    const rows=history.getLastRow()>1 ? history.getRange(2,1,history.getLastRow()-1,10).getValues() : [];
    const previous=rows.find(r=>r[1]===p.submissionId);
    if(previous){
      if(previous[3]!==p.studentId || String(previous[6])!==p.code || previous[7]!==score || previous[9]!==JSON.stringify(p.answers))throw Error('Mã lượt làm bị trùng với nội dung khác.');
      rebuildSummary_(summary,rows);
      SpreadsheetApp.flush();
      return {ok:true,submissionId:p.submissionId,score:previous[7],receivedAt:new Date(previous[0]).toISOString(),duplicate:true};
    }
    const now=new Date();
    const row=[now,p.submissionId,p.number,p.studentId,p.name,p.className,p.code,score,p.elapsed,JSON.stringify(p.answers)];
    const next=history.getLastRow()+1;
    if(next>history.getMaxRows())history.insertRowsAfter(history.getMaxRows(),500);
    history.getRange(next,1,1,10).setValues([row]);
    history.getRange(next,1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
    history.getRange(next,8).setNumberFormat('0.00');
    rows.push(row);rebuildSummary_(summary,rows);SpreadsheetApp.flush();
    return {ok:true,submissionId:p.submissionId,score,receivedAt:now.toISOString()};
  } finally {lock.releaseLock();}
}
function rebuildSummary_(sheet,rows) {
  const latest={};
  rows.forEach(r=>{if(!latest[r[3]]||new Date(r[0]).getTime()>=new Date(latest[r[3]][0]).getTime())latest[r[3]]=r;});
  const values=Object.values(latest).sort((a,b)=>String(a[5]).localeCompare(String(b[5]))||a[2]-b[2]).map(r=>[r[2],r[3],r[4],r[5],r[7]]);
  if(!values.length)return;
  if(values.length+1>sheet.getMaxRows())sheet.insertRowsAfter(sheet.getMaxRows(),values.length+1-sheet.getMaxRows());
  sheet.getRange(2,1,values.length,5).setValues(values);
  sheet.getRange(2,5,values.length,1).setNumberFormat('0.00');
}
function initialize() {
  const ss=SpreadsheetApp.openById(SPREADSHEET_ID);
  ss.setSpreadsheetTimeZone('Asia/Ho_Chi_Minh');ss.setSpreadsheetLocale('vi_VN');
  [[SUMMARY,5],[HISTORY,10]].forEach(([name,width])=>{
    const sheet=ss.getSheetByName(name);sheet.setFrozenRows(1);
    if(!sheet.getFilter())sheet.getRange(1,1,sheet.getMaxRows(),width).createFilter();
  });
}
