(()=>{
'use strict';
const root=document.documentElement;
const nav=document.getElementById('main-nav');
const menuBtn=document.getElementById('menu-btn');
const langBtn=document.getElementById('lang-btn');
const year=document.getElementById('current-year');
if(year) year.textContent=new Date().getFullYear();

let lang='en';
try{lang=localStorage.getItem('narges-lang')==='fa'?'fa':'en';}catch(e){}
function setLanguage(newLang){
  lang=newLang==='fa'?'fa':'en';
  root.lang=lang;root.dir=lang==='fa'?'rtl':'ltr';
  document.querySelectorAll('[data-en][data-fa]').forEach(node=>{node.textContent=node.getAttribute(`data-${lang}`);});
  if(langBtn){langBtn.textContent=lang==='fa'?'EN':'FA';langBtn.setAttribute('aria-label',lang==='fa'?'Switch to English':'تغییر زبان به فارسی');}
  document.title=lang==='fa'? (document.querySelector('h1')?.textContent||'نرگس سلمان‌زاده')+' | نرگس سلمان‌زاده' : (document.querySelector('h1')?.textContent||'Narges Salmanzadeh')+' | Narges Salmanzadeh';
  try{localStorage.setItem('narges-lang',lang);}catch(e){}
}
setLanguage(lang);
langBtn?.addEventListener('click',()=>setLanguage(lang==='en'?'fa':'en'));
menuBtn?.addEventListener('click',()=>{
  const isOpen=nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',String(isOpen));
  menuBtn.setAttribute('aria-label',isOpen?'Close menu':'Open menu');
});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));

const filters=document.querySelectorAll('.filter-btn');
filters.forEach(button=>button.addEventListener('click',()=>{
  const selected=button.dataset.filter;
  filters.forEach(x=>x.classList.toggle('active',x===button));
  document.querySelectorAll('.filter-card').forEach(card=>{
    card.hidden=selected!=='all' && card.dataset.category!==selected;
  });
}));

const lb=document.getElementById('lightbox');
const lbImg=lb?.querySelector('img');
const lbCap=lb?.querySelector('figcaption');
const galleryButtons=[...document.querySelectorAll('button[data-gallery]')];
let index=0,previousFocus=null;
function showImage(newIndex){
 if(!galleryButtons.length)return;
 index=(newIndex+galleryButtons.length)%galleryButtons.length;
 const button=galleryButtons[index];
 lbImg.src=button.dataset.src;
 lbImg.alt=button.getAttribute('data-caption-en')||'Architecture illustration';
 lbCap.textContent=button.getAttribute('data-caption-'+lang)||'';
}
function openGallery(idx){if(!lb)return;previousFocus=document.activeElement;showImage(idx);lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.classList.add('no-scroll');lb.querySelector('.lb-close')?.focus();}
function closeGallery(){if(!lb)return;lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');if(lbImg)lbImg.src='';previousFocus?.focus();}
galleryButtons.forEach((button,i)=>button.addEventListener('click',()=>openGallery(i)));
lb?.querySelector('.lb-close')?.addEventListener('click',closeGallery);
lb?.querySelector('.lb-prev')?.addEventListener('click',()=>showImage(index-1));
lb?.querySelector('.lb-next')?.addEventListener('click',()=>showImage(index+1));
lb?.addEventListener('click',e=>{if(e.target===lb)closeGallery();});
document.addEventListener('keydown',e=>{
 if(!lb?.classList.contains('open'))return;
 if(e.key==='Escape')closeGallery();
 if(e.key==='ArrowRight')showImage(index+(lang==='fa'?-1:1));
 if(e.key==='ArrowLeft')showImage(index+(lang==='fa'?1:-1));
});

const form=document.getElementById('contact-form');
form?.addEventListener('submit',event=>{
 event.preventDefault();
 if(!form.reportValidity())return;
 const name=form.elements.name.value.trim();
 const email=form.elements.email.value.trim();
 const topic=form.elements.topic.value;
 const message=form.elements.message.value.trim();
 const subject=`Architecture portfolio inquiry — ${topic}`;
 const body=`Name: ${name}\nEmail: ${email}\nProject type: ${topic}\n\n${message}`;
 const link=`mailto:nrrgssa@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 const status=document.querySelector('.form-status');
 if(status)status.textContent=lang==='fa'?'برنامه ایمیل شما با متن آماده باز می‌شود.':'Opening your email application with your prepared message.';
 window.location.href=link;
});
})();
