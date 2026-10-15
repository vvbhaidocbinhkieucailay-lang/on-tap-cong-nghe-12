'use strict';
// Bộ nhận bài chỉ trả biên nhận; bảng điểm của giáo viên giữ riêng tư.
window.SUBMISSION_URL = 'https://script.google.com/macros/s/AKfycbwgawivwigBLd_qGg7k1lvGrnGN_mea4f6L63GV7XHPKxPqQrQGCUTx-66jJoJAKmmDkQ/exec';
window.Submissions = (()=>{
  const key='sinh10-pending-v1', pending=new Map(), sending=new Set();
  let storageAvailable=true;
  try {JSON.parse(localStorage.getItem(key)||'[]').forEach(p=>{if(p?.submissionId)pending.set(p.submissionId,p);});} catch {storageAvailable=false;}
  const persist=()=>{try{localStorage.setItem(key,JSON.stringify([...pending.values()]));}catch{storageAvailable=false;}};
  const update=(id,status,message)=>window.dispatchEvent(new CustomEvent('submission-status',{detail:{id,status,message}}));
  async function send(p) {
    if(sending.has(p.submissionId))return;
    sending.add(p.submissionId);update(p.submissionId,'sending','Đang gửi kết quả cho giáo viên…');
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),45000);
    try {
      if(!window.SUBMISSION_URL)throw Error('Chưa cấu hình nơi nhận bài.');
      const response=await fetch(window.SUBMISSION_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(p),signal:controller.signal,redirect:'follow',credentials:'omit'});
      if(!response.ok)throw Error('Máy chủ chưa phản hồi.');
      const reply=await response.json();
      if(!reply.ok||reply.submissionId!==p.submissionId)throw Error(reply.message||'Chưa xác nhận được bài đã lưu.');
      if(typeof reply.score!=='number'||reply.score!==p.score)throw Error('Điểm chấm lại chưa khớp. Em tải kết quả và báo giáo viên.');
      pending.delete(p.submissionId);persist();
      update(p.submissionId,'saved',`Đã lưu vào bảng của giáo viên · ${new Date(reply.receivedAt).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}.`);
    } catch(error) {
      update(p.submissionId,'failed',`Chưa xác nhận đã lưu. ${error.name==='AbortError'?'Kết nối quá lâu.':error.message} Em bấm Gửi lại khi có mạng.${storageAvailable?'':' Trình duyệt không giữ được bài chờ gửi; em hãy tải kết quả trước khi đóng trang.'}`);
    } finally {clearTimeout(timeout);sending.delete(p.submissionId);}
  }
  function enqueue(p){pending.set(p.submissionId,p);persist();return send(p);}
  function retryAll(){for(const p of pending.values())send(p);}
  window.addEventListener('online',retryAll);
  return {enqueue,retryAll,hasPending:()=>pending.size>0};
})();
