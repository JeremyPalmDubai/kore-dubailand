
const cfg=window.KORE_CONFIG||{};
if(cfg.tallyUrl && /^https:\/\/tally.so\/(r|embed)\/[a-zA-Z0-9]+/.test(cfg.tallyUrl)){
const u=new URL(cfg.tallyUrl.replace('/r/','/embed/'));u.searchParams.set('language',document.documentElement.lang);u.searchParams.set('source',location.pathname);u.searchParams.set('hideTitle','1');u.searchParams.set('transparentBackground','1');u.searchParams.set('alignLeft','1');u.searchParams.set('dynamicHeight','1');
const frame=document.createElement('iframe');frame.src=u.href;frame.title='KORE enquiry';frame.width='100%';frame.height='680';frame.loading='lazy';frame.setAttribute('data-tally-src',u.href);frame.setAttribute('referrerpolicy','strict-origin-when-cross-origin');frame.style.border='0';document.getElementById('tally-container').replaceChildren(frame);const widget=document.createElement('script');widget.src='https://tally.so/widgets/embed.js';widget.onload=()=>{if(window.Tally)window.Tally.loadEmbeds();};document.body.appendChild(widget);
}

const sticky=document.querySelector(".sticky-cta"); new IntersectionObserver(entries=>{sticky.style.display=entries[0].isIntersecting?"none":"inline-flex";},{threshold:0.15}).observe(document.querySelector(".hero"));

const picker=document.querySelector('.language-picker');
document.addEventListener('click',e=>{if(!picker.contains(e.target))picker.open=false;});
document.addEventListener('keydown',e=>{if(e.key==='Escape' && picker.open){picker.open=false;picker.querySelector('summary').focus();}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced && 'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});
 document.querySelectorAll('main section:not(.hero) .title, main section:not(.hero) .copy, .residence-grid article, #payment article, #faq details').forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${(i%3)*65}ms`);observer.observe(el);});
}
const header=document.querySelector('.nav');
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>20),{passive:true});

document.querySelectorAll('[data-brochure-request]').forEach(link=>link.addEventListener('click',()=>{
 document.getElementById('enquire').dataset.intent='brochure';
 const frame=document.querySelector('#tally-container iframe');
 if(frame){const u=new URL(frame.src);if(u.searchParams.get('intent')!=='brochure'){u.searchParams.set('intent','brochure');frame.src=u.href;frame.setAttribute('data-tally-src',u.href);}}
}));
