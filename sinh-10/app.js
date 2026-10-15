'use strict';
// Chỉ dùng để ôn tập. Dữ liệu và đáp án công khai trên trang tĩnh.
const CODES = ['102', '103'];
const CLASSES = ['10A2', '10A10', '10A13', '10A14', '10A17'];
const LIMIT_SECONDS = 60 * 60;
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const formatScore = n => n.toLocaleString('vi-VN', {maximumFractionDigits:2});
const formatTime = seconds => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
const typeName = q => ({TN:'Trắc nghiệm', DS:'Đúng / Sai', TLN:'Chọn ý bằng số'}[q.loai]);
const state = {code:'102', name:'', className:'', number:0, studentId:'', submissionId:'', index:0, answers:{}, started:0, active:false, timer:null, result:null};

// Tách số nguyên theo dấu phẩy, chấm phẩy hoặc khoảng trắng; không suy diễn "14" thành "1, 4".
function parseNumbers(raw, count) {
  const text=String(raw ?? '').trim();
  if(!text) return {valid:true, values:[]};
  if(!/^\d+(?:\s*[,;]\s*\d+|\s+\d+)*$/.test(text)) return {valid:false, values:[]};
  const values=[...new Set(text.split(/[\s,;]+/).map(Number))].sort((a,b)=>a-b);
  return {valid:values.every(n=>Number.isSafeInteger(n)&&n>=1&&n<=count), values};
}
function gradeQuestion(q, answer) {
  let points=0, correct=false;
  if(q.loai==='TN') {correct=answer===q.dapAn; points=correct?.25:0;}
  if(q.loai==='DS') {const n=q.cacY.filter((y,i)=>answer?.[i]===y.dapAn).length;points=n*.25;correct=n===q.cacY.length;}
  if(q.loai==='TLN') {
    const parsed=parseNumbers(answer,q.cacNhanDinh.length);
    correct=parsed.valid && parsed.values.length===q.dapAn.length && parsed.values.every(n=>q.dapAn.includes(n));
    points=correct?.25:0;
  }
  return {correct, points};
}
function isAnswered(q, answer) {
  if(q.loai==='TN') return Number.isInteger(answer)&&answer>=0&&answer<q.luaChon.length;
  if(q.loai==='DS') return q.cacY.every((_,i)=>typeof answer?.[i]==='boolean');
  const parsed=parseNumbers(answer,q.cacNhanDinh.length);return parsed.valid&&parsed.values.length>0;
}
function gradeExam(questions,answers) {
  const rows=questions.map((q,i)=>({q,index:i,answer:answers[q.id],...gradeQuestion(q,answers[q.id])}));
  const totals={TN:0,DS:0,TLN:0};rows.forEach(r=>totals[r.q.loai]+=r.points);
  return {rows,totals,score:totals.TN+totals.DS+totals.TLN,correct:rows.filter(r=>r.correct).length};
}
const questions = () => window.EXAMS[state.code];
function showScreen(id) {
  ['setup','quiz','results'].forEach(name=>$(name).hidden=name!==id);
  window.scrollTo(0,0);
}
function setCode(code,updateURL=false) {
  state.code=CODES.includes(code)?code:'102';
  document.querySelectorAll('input[name="exam"]').forEach(el=>el.checked=el.value===state.code);
  $('link-note').textContent=`Đã chọn đề ${state.code} · Em có thể đổi mã đề trước khi bắt đầu.`;
  if(updateURL) {const url=new URL(location.href);url.searchParams.set('made',state.code);try{history.replaceState(null,'',url);}catch{}}
}
function startExam() {
  state.submissionId=crypto.randomUUID();
  clearInterval(state.timer);state.index=0;state.answers={};state.started=Date.now();state.active=true;state.result=null;
  $('only-errors').checked=false;
  $('quiz-code').textContent=`SINH HỌC 10 · ĐỀ ${state.code}`;
  $('student-info').textContent=`${state.name} · ${state.studentId} · Lớp ${state.className}`;
  showScreen('quiz');renderQuestion();updateTimer();state.timer=setInterval(updateTimer,1000);
}
function updateTimer() {
  if(!state.active)return;
  const remaining=Math.max(0,LIMIT_SECONDS-Math.floor((Date.now()-state.started)/1000));
  $('timer').textContent=formatTime(remaining);$('timer').classList.toggle('warning',remaining<=300);
  if(remaining===0) submitExam(true);
}
function updateProgress() {
  const qs=questions(), done=qs.filter(q=>isAnswered(q,state.answers[q.id])).length;
  $('progress-label').textContent=`Câu ${state.index+1} / ${qs.length}`;
  $('answered-label').textContent=`Đã trả lời ${done} / ${qs.length}`;
  $('progress').value=done;$('progress').max=qs.length;
  if($('palette').children.length!==qs.length) $('palette').innerHTML=qs.map((_,i)=>`<button type="button" data-index="${i}" aria-label="Câu ${i+1}">${i+1}</button>`).join('');
  Array.from($('palette').children).forEach((b,i)=>{
    const completed=isAnswered(qs[i],state.answers[qs[i].id]);
    b.classList.toggle('done',completed);b.classList.toggle('current',i===state.index);
    b.setAttribute('aria-label',`Câu ${i+1}, ${completed?'đã trả lời':'chưa trả lời đủ'}`);
    if(i===state.index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');
  });
}
function renderQuestion() {
  const q=questions()[state.index], answer=state.answers[q.id];
  let html=`<div class="question-meta"><span>CÂU ${state.index+1} · ${typeName(q)}</span><span>Bài ${q.bai} · ${q.loai==='DS'?'1':'0,25'} điểm</span></div><h2 id="question-title" class="question-title" tabindex="-1">${escapeHTML(q.noiDung)}</h2>`;
  if(q.loai==='TN') html+=q.luaChon.map((text,i)=>`<button type="button" class="option${answer===i?' selected':''}" aria-pressed="${answer===i}" data-choice="${i}"><span class="letter">${'ABCD'[i]}</span><span>${escapeHTML(text)}</span></button>`).join('');
  if(q.loai==='DS') html+=q.cacY.map((y,i)=>`<div class="ds-item"><p id="statement-${i}"><b>${escapeHTML(y.kyHieu)}.</b> ${escapeHTML(y.noiDung)}</p><div class="ds-buttons" role="group" aria-labelledby="statement-${i}">${[true,false].map(v=>`<button type="button" data-statement="${i}" data-value="${v}" class="${answer?.[i]===v?'selected':''}" aria-pressed="${answer?.[i]===v}">${v?'Đúng':'Sai'}</button>`).join('')}</div></div>`).join('');
  if(q.loai==='TLN') {
    html+='<p class="tip">Chọn tất cả nhận định đúng. Bấm lại một ý để bỏ chọn.</p>';
    html+=q.cacNhanDinh.map(y=>`<button type="button" class="number-option" data-number="${y.so}" aria-pressed="false"><span class="letter">${y.so}</span><span>${escapeHTML(y.noiDung)}</span></button>`).join('');
    html+=`<div class="number-entry"><label for="number-answer">Các ý em chọn</label><input id="number-answer" type="text" value="${escapeHTML(answer)}" maxlength="50" autocomplete="off" spellcheck="false" placeholder="Ví dụ: 1, 4" aria-describedby="number-help number-error"><p id="number-help" class="small">Có thể nhập số cách nhau bằng dấu phẩy, dấu chấm phẩy hoặc khoảng trắng.</p><p id="number-error" class="error" aria-live="polite"></p></div>`;
  }
  $('question').innerHTML=html;
  if(q.loai==='TLN') syncNumberChoices();
  $('previous').disabled=state.index===0;$('next').textContent=state.index===questions().length-1?'Nộp bài':'Câu tiếp →';
  updateProgress();
}
function syncNumberChoices() {
  const q=questions()[state.index], parsed=parseNumbers(state.answers[q.id],q.cacNhanDinh.length);
  $('question').querySelectorAll('[data-number]').forEach(b=>{
    const selected=parsed.valid&&parsed.values.includes(Number(b.dataset.number));b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));
  });
  $('number-answer').setAttribute('aria-invalid',String(!parsed.valid));
  $('number-error').textContent=parsed.valid?'':`Chỉ nhập số từ 1 đến ${q.cacNhanDinh.length}, cách nhau bằng dấu phẩy (ví dụ: 1, 4).`;
}
function navigate(index) {state.index=index;renderQuestion();$('question-title').focus();$('question').scrollIntoView({block:'start'});}
function requestSubmit() {
  if(!state.active)return;
  const missing=questions().filter(q=>!isAnswered(q,state.answers[q.id])).length;
  $('submit-message').textContent=missing?`Em còn ${missing} câu chưa trả lời đầy đủ hoặc nhập số chưa hợp lệ. Em muốn tiếp tục làm hay nộp ngay?`:`Em đã trả lời đủ ${questions().length} câu. Nộp bài để xem điểm và giải thích nhé.`;
  $('submit-dialog').showModal();
}
function submitExam(expired=false) {
  if(!state.active)return;state.active=false;clearInterval(state.timer);
  if($('submit-dialog').open)$('submit-dialog').close();
  state.result={...gradeExam(questions(),state.answers),code:state.code,name:state.name,className:state.className,studentId:state.studentId,number:state.number,submissionId:state.submissionId,elapsed:Math.min(LIMIT_SECONDS,Math.floor((Date.now()-state.started)/1000)),submittedAt:new Date().toISOString(),expired,saveStatus:'sending'};
  const r=state.result;
  $('score').textContent=formatScore(r.score);$('result-student').textContent=`${r.name} · ${r.studentId} · ${r.className} · Đề ${r.code} · ${formatTime(r.elapsed)}${expired?' · Hết giờ':''}`;
  $('feedback').textContent=r.score>=8?'Em đã nắm tốt nhiều nội dung.':r.score>=5?'Cùng xem lại những câu còn vướng nhé.':'Hãy đọc giải thích rồi luyện lại từng phần.';
  $('result-summary').textContent=`Đúng hoàn toàn ${r.correct} / ${r.rows.length} câu. Câu đúng/sai được tính 0,25 điểm cho mỗi ý trả lời đúng.`;
  $('breakdown').innerHTML=`<span>Trắc nghiệm: ${formatScore(r.totals.TN)} / 6</span><span>Đúng/sai: ${formatScore(r.totals.DS)} / 2</span><span>Chọn ý bằng số: ${formatScore(r.totals.TLN)} / 2</span>`;
  renderReview();showScreen('results');
  $('resend').hidden=true;
  window.Submissions.enqueue({version:'20261015',submissionId:r.submissionId,studentId:r.studentId,number:r.number,name:r.name,className:r.className,code:r.code,score:r.score,elapsed:r.elapsed,answers:structuredClone(state.answers)});
}
function numberFeedback(q,answer) {
  const p=parseNumbers(answer,q.cacNhanDinh.length), selected=p.valid?p.values:[];
  return {valid:p.valid,selected,wrong:q.cacNhanDinh.filter(y=>!y.dung).map(y=>y.so),extra:selected.filter(n=>!q.dapAn.includes(n)),missing:q.dapAn.filter(n=>!selected.includes(n))};
}
function renderReview() {
  const rows=state.result.rows.filter(r=>!$('only-errors').checked||!r.correct);
  $('review').innerHTML=rows.map(r=>{
    const {q,answer}=r;let body='';
    if(q.loai==='TN') {
      body=`<p>Em chọn: <b>${answer===undefined?'Chưa trả lời':escapeHTML('ABCD'[answer]+'. '+q.luaChon[answer])}</b></p><p class="correct-text">Đáp án đúng: ${escapeHTML('ABCD'[q.dapAn]+'. '+q.luaChon[q.dapAn])}</p>`;
    } else if(q.loai==='DS') {
      body=q.cacY.map((y,i)=>`<p><b>${escapeHTML(y.kyHieu)}.</b> ${escapeHTML(y.noiDung)}<br><span class="${answer?.[i]===y.dapAn?'correct-text':'wrong-text'}">Em chọn: ${typeof answer?.[i]==='boolean'?(answer[i]?'Đúng':'Sai'):'Chưa chọn'} · Đáp án: ${y.dapAn?'Đúng':'Sai'}</span></p>`).join('');
    } else {
      const f=numberFeedback(q,answer);
      body=`<p>Em chọn: <b>${escapeHTML(answer||'Chưa trả lời')}</b>${f.valid?'':' (cách nhập chưa hợp lệ)'}</p><p class="correct-text">Các ý đúng: ${q.dapAn.join(', ')}</p><p class="wrong-text">Các ý sai: ${f.wrong.join(', ')||'Không có'}</p>`;
      if(!r.correct)body+=`<p>Chọn thừa: <b>${f.extra.join(', ')||'Không có'}</b> · Còn thiếu: <b>${f.missing.join(', ')||'Không có'}</b></p>`;
      body+=`<ol class="statement-review">${q.cacNhanDinh.map(y=>`<li>${escapeHTML(y.noiDung)} <b class="${y.dung?'correct-text':'wrong-text'}">(${y.dung?'Đúng':'Sai'})</b></li>`).join('')}</ol>`;
    }
    return `<details class="review-card"${r.correct?'':' open'}><summary><span class="badge${r.correct?'':' wrong'}">${r.correct?'Đúng':'Chưa đúng'}</span>Câu ${r.index+1} · ${typeName(q)} · ${formatScore(r.points)} điểm</summary><div class="review-body"><p><b>${escapeHTML(q.noiDung)}</b></p>${body}<p class="explanation"><b>Giải thích:</b> ${escapeHTML(q.giaiThich)}</p></div></details>`;
  }).join('')||'<p class="card">Em đã trả lời đúng tất cả các câu.</p>';
}
function downloadResult() {
  const r=state.result;
  const lines=['KẾT QUẢ ÔN TẬP SINH HỌC 10',`Mã học sinh: ${r.studentId}`,`Số thứ tự: ${r.number}`,`Họ tên: ${r.name}`,`Lớp: ${r.className}`,`Mã đề: ${r.code}`,`Điểm: ${formatScore(r.score)}/10`,`Thời gian: ${formatTime(r.elapsed)}`,`Nộp lúc: ${new Date(r.submittedAt).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}`,r.saveStatus==='saved'?'Đã lưu vào bảng của giáo viên.':'Chưa xác nhận đã lưu vào bảng của giáo viên.',`Mã lượt làm: ${r.submissionId}`,''];
  for(const row of r.rows){const q=row.q;lines.push(`Câu ${row.index+1} (${q.id}): ${row.correct?'Đúng':'Chưa đúng'} · ${formatScore(row.points)} điểm`);if(q.loai==='TLN'){const f=numberFeedback(q,row.answer);lines.push(`Em chọn: ${row.answer||'Chưa trả lời'}; Ý đúng: ${q.dapAn.join(', ')}; Ý sai: ${f.wrong.join(', ')}`);}}
  const url=URL.createObjectURL(new Blob(['\ufeff'+lines.join('\n')],{type:'text/plain;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=`Ket-qua-Sinh10-${r.code}-${r.className}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.addEventListener('DOMContentLoaded',()=>{
  if(!window.EXAMS||!CODES.every(code=>Array.isArray(window.EXAMS[code])&&window.EXAMS[code].length===34)){$('form-error').textContent='Chưa tải đủ dữ liệu đề. Em hãy tải lại trang khi có mạng.';$('start-form').querySelector('button').disabled=true;return;}
  setCode(new URLSearchParams(location.search).get('made'));
  const previewId=()=>{const n=Number($('student-number').value),className=$('student-class').value;$('student-id-preview').textContent=CLASSES.includes(className)&&Number.isInteger(n)&&n>=1&&n<=99?`Mã học sinh: ${className}-${String(n).padStart(2,'0')}`:'Chọn lớp và nhập đúng số thứ tự của em trong danh sách lớp (1–99).';};
  $('student-number').addEventListener('input',previewId);$('student-class').addEventListener('change',previewId);
  document.querySelectorAll('input[name="exam"]').forEach(input=>input.addEventListener('change',()=>setCode(input.value,true)));
  $('start-form').addEventListener('submit',event=>{
    event.preventDefault();const name=$('student-name').value.trim().replace(/\s+/g,' '),className=$('student-class').value;
    const number=Number($('student-number').value);
    if(name.length<2||name.length>60||!/^[\p{L}\p{M} .’'-]+$/u.test(name)||!/\p{L}/u.test(name)||!CLASSES.includes(className)||!Number.isInteger(number)||number<1||number>99){$('form-error').textContent='Em nhập họ tên, chọn lớp và số thứ tự đúng theo danh sách lớp nhé.';return;}
    state.name=name.normalize('NFC');state.className=className;state.number=number;state.studentId=`${className}-${String(number).padStart(2,'0')}`;$('form-error').textContent='';startExam();
  });
  $('question').addEventListener('click',event=>{
    if(!state.active)return;const button=event.target.closest('button');if(!button)return;
    const q=questions()[state.index];
    if(button.dataset.choice!==undefined){state.answers[q.id]=Number(button.dataset.choice);renderQuestion();$('question').querySelector(`[data-choice="${button.dataset.choice}"]`).focus();}
    else if(button.dataset.statement!==undefined){const answer=state.answers[q.id]||q.cacY.map(()=>null);answer[Number(button.dataset.statement)]=button.dataset.value==='true';state.answers[q.id]=answer;renderQuestion();$('question').querySelector(`[data-statement="${button.dataset.statement}"][data-value="${button.dataset.value}"]`).focus();}
    else if(button.dataset.number!==undefined){const n=Number(button.dataset.number),parsed=parseNumbers(state.answers[q.id],q.cacNhanDinh.length),values=parsed.valid?parsed.values:[];state.answers[q.id]=(values.includes(n)?values.filter(x=>x!==n):[...values,n]).sort((a,b)=>a-b).join(', ');$('number-answer').value=state.answers[q.id];syncNumberChoices();updateProgress();}
  });
  $('question').addEventListener('input',event=>{if(state.active&&event.target.id==='number-answer'){state.answers[questions()[state.index].id]=event.target.value;syncNumberChoices();updateProgress();}});
  $('palette').addEventListener('click',event=>{const b=event.target.closest('[data-index]');if(b&&state.active)navigate(Number(b.dataset.index));});
  $('previous').addEventListener('click',()=>{if(state.index>0)navigate(state.index-1);});
  $('next').addEventListener('click',()=>state.index<questions().length-1?navigate(state.index+1):requestSubmit());
  $('submit').addEventListener('click',requestSubmit);$('cancel-submit').addEventListener('click',()=>$('submit-dialog').close());$('confirm-submit').addEventListener('click',()=>submitExam());
  $('retry').addEventListener('click',startExam);$('choose-exam').addEventListener('click',()=>showScreen('setup'));
  $('only-errors').addEventListener('change',renderReview);$('download').addEventListener('click',downloadResult);
  window.addEventListener('submission-status',event=>{const {id,status,message}=event.detail;if(state.result?.submissionId!==id)return;state.result.saveStatus=status;$('save-status').textContent=message;$('resend').hidden=status!=='failed';});
  $('resend').addEventListener('click',()=>window.Submissions.retryAll());
  window.Submissions?.retryAll();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateTimer();});
  window.addEventListener('beforeunload',event=>{if(state.active||window.Submissions?.hasPending()){event.preventDefault();event.returnValue='';}});
});
