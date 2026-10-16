/* NEXUS CONSULTANT - interactions: menu drawer, reveal, counters, calculator, form, header */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
$('#yr').textContent=new Date().getFullYear();
// drawer
const dr=$('#drawer'),sc=$('#scrim'),bu=$('#burger'),cl=$('#close');
function setMenu(o){dr.classList.toggle('on',o);sc.classList.toggle('on',o);document.body.classList.toggle('lock',o);bu.setAttribute('aria-expanded',o);dr.setAttribute('aria-hidden',!o);dr.inert=!o;if(o)setTimeout(()=>cl.focus(),50);else if(document.activeElement&&dr.contains(document.activeElement))bu.focus()}
bu.onclick=()=>setMenu(true);cl.onclick=()=>setMenu(false);sc.onclick=()=>setMenu(false);
$$('a',dr).forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(!dr.classList.contains('on'))return;if(e.key==='Escape')setMenu(false);
 if(e.key==='Tab'){const f=$$('a,button',dr),a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
$('#top-btn').onclick=()=>scrollTo({top:0,behavior:RM?'auto':'smooth'});
// reveal + counters + line
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
$$('.rv,.svc,#growth').forEach(el=>io.observe(el));
const co=new IntersectionObserver(e=>e.forEach(x=>{if(!x.isIntersecting)return;co.unobserve(x.target);const el=x.target,n=+el.dataset.n,d=+el.dataset.d||0,p=el.dataset.p||'',s=el.dataset.s||'';if(RM)return;const t0=performance.now();
 (function f(t){const k=Math.min((t-t0)/1500,1);el.textContent=p+(n*(1-Math.pow(1-k,3))).toFixed(d)+s;if(k<1)requestAnimationFrame(f)})(t0)}),{threshold:.6});
$$('[data-n]').forEach(el=>co.observe(el));
// calculator
const pk={'Sole Proprietor':{n:'Starter',b:['Simple monthly bookkeeping','KRA iTax filing support']},'SME':{n:'Growth',b:['Full bookkeeping & monthly P&L','VAT and withholding tax returns','Quarterly review with your advisor']},'Enterprise':{n:'Enterprise Partner',b:['Dedicated finance team','Audit-ready reporting & payroll','Monthly advisory & compliance calendar']}};
const ex={Accounting:'Accounting & bookkeeping set-up',Tax:'Tax planning & compliance health check',Registration:'Company registration, KRA PIN & permits',Advisory:'Cash flow forecasting & growth advisory'};
function calc(){const size=$('input[name=size]:checked').value,needs=$$('#needs input:checked').map(i=>i.value),p=pk[size];
 $('#rName').textContent=p.n+' Package · '+size;$('#rList').innerHTML=[...needs.map(n=>ex[n]),...p.b].map(t=>`<li>${t}</li>`).join('');return{size,needs,name:p.n}}
$$('.calc input').forEach(i=>i.onchange=calc);calc();
const sel=$('#svc'),msg=$('#msg');
const goForm=()=>{$('#contact').scrollIntoView({behavior:RM?'auto':'smooth'});setTimeout(()=>$('input[name=name]').focus({preventScroll:true}),700)};
$('#rCta').onclick=()=>{const c=calc();msg.value=`I'm interested in the ${c.name} package for my ${c.size} business. Services needed: ${c.needs.join(', ')||'to be discussed'}.`;
 const m={Accounting:0,Tax:1,Registration:2,Advisory:3};sel.selectedIndex=c.needs.length===1?m[c.needs[0]]:4;goForm()};
$$('[data-svc]').forEach(b=>b.onclick=()=>{[...sel.options].forEach((o,i)=>{if(o.value===b.dataset.svc)sel.selectedIndex=i});goForm()});
// form
const f=$('#form'),ok=$('#ok');
function err(i,m){let s=i.parentNode.querySelector('.err');if(m){if(!s){s=document.createElement('span');s.className='err';s.id=i.name+'-e';i.parentNode.append(s);i.setAttribute('aria-describedby',s.id)}s.textContent=m;i.setAttribute('aria-invalid','true')}else{s&&s.remove();i.removeAttribute('aria-invalid')}return !m}
const rules={name:v=>v.trim().length<2&&'Enter your full name.',phone:v=>!/^[+\d][\d\s()-]{6,}$/.test(v.trim())&&'Enter a phone number, e.g. +254 700 000 000.',email:v=>!/^\S+@\S+\.\S+$/.test(v.trim())&&'Enter a valid email, e.g. name@company.com.'};
Object.keys(rules).forEach(k=>f.elements[k].addEventListener('blur',e=>err(e.target,rules[k](e.target.value))));
f.onsubmit=e=>{e.preventDefault();let first=null;Object.keys(rules).forEach(k=>{const i=f.elements[k];if(!err(i,rules[k](i.value))&&!first)first=i});
 if(first){first.focus();ok.className='ok';return}
 const d=Object.fromEntries(new FormData(f)),t=`Hello Nexus Consultant, my name is ${d.name}. I need help with: ${d.service}. Phone: ${d.phone}. Email: ${d.email}. ${d.msg}`;
 ok.className='ok show';ok.innerHTML=`Thank you, ${d.name.split(' ')[0]}. Your request is ready. <a href="https://wa.me/254701269546?text=${encodeURIComponent(t)}" target="_blank" rel="noopener"><b>Send it on WhatsApp for the fastest reply</b></a>.`;f.reset()};
// header: shadow on scroll + active-link highlight
const hd=$('header'),onS=()=>hd.classList.toggle('scrolled',scrollY>8);addEventListener('scroll',onS,{passive:true});onS();
const nl=$$('.main-nav a'),so=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)nl.forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+x.target.id))}),{rootMargin:'-40% 0px -55% 0px'});
nl.forEach(a=>{const t=$(a.getAttribute('href'));t&&so.observe(t)});
