/* KORE: consent-based Meta measurement; never forward Tally answers. */
(() => {
  const PIXEL = '1388103596722854', FORM = '810Zjr', KEY = 'kore-marketing-consent-v1';
  const copy = {
    en: ['Allow Meta advertising measurement? The form works either way.', 'Accept', 'Decline', 'Cookie settings'],
    es: ['¿Permites la medición publicitaria de Meta? El formulario funciona en ambos casos.', 'Aceptar', 'Rechazar', 'Configurar cookies'],
    fr: ['Autoriser la mesure publicitaire Meta ? Le formulaire fonctionne dans les deux cas.', 'Accepter', 'Refuser', 'Réglages cookies'],
    de: ['Meta-Werbemessung erlauben? Das Formular funktioniert in beiden Fällen.', 'Akzeptieren', 'Ablehnen', 'Cookie-Einstellungen'],
    nl: ['Meta-advertentiemeting toestaan? Het formulier werkt in beide gevallen.', 'Accepteren', 'Weigeren', 'Cookie-instellingen'],
    pt: ['Permitir a medição publicitária da Meta? O formulário funciona em ambos os casos.', 'Aceitar', 'Recusar', 'Definições de cookies']
  }[document.documentElement.lang] || ['Allow Meta advertising measurement? The form works either way.', 'Accept', 'Decline', 'Cookie settings'];
  let consent = false, started = false;
  const seen = new Set();
  try { consent = localStorage.getItem(KEY) === 'granted'; } catch (_) {}
  function start() {
    if (started) { window.fbq('consent', 'grant'); return; }
    started = true;
    if (!window.fbq) {
      const q = function () { q.callMethod ? q.callMethod.apply(q, arguments) : q.queue.push(arguments); };
      q.queue = []; q.loaded = true; q.version = '2.0'; q.push = q;
      window.fbq = q; window._fbq = window._fbq || q;
      const s = document.createElement('script'); s.async = true;
      s.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.appendChild(s);
    }
    window.fbq('consent', 'grant');
    window.fbq('set', 'autoConfig', false, PIXEL);
    window.fbq('init', PIXEL);
    window.fbq('trackSingle', PIXEL, 'PageView');
  }
  window.addEventListener('message', e => {
    if (!consent || e.origin !== 'https://tally.so') return;
    const frame = document.querySelector('#tally-container iframe');
    if (!frame || e.source !== frame.contentWindow) return;
    let data = e.data;
    try { if (typeof data === 'string') data = JSON.parse(data); } catch (_) { return; }
    if (!data || data.event !== 'Tally.FormSubmitted') return;
    const p = data.payload;
    if (!p || p.formId !== FORM || typeof p.id !== 'string' || !p.id) return;
    const key = 'kore-lead-' + p.id;
    if (seen.has(key)) return;
    try { if (sessionStorage.getItem(key)) return; } catch (_) {}
    seen.add(key);
    try { sessionStorage.setItem(key, '1'); } catch (_) {}
    window.fbq('trackSingle', PIXEL, 'Lead', {content_name: 'KORE by Imtiaz', content_category: 'Property enquiry'}, {eventID: key});
  });
  const panel = document.createElement('aside'); panel.setAttribute('aria-label', copy[3]);
  panel.style.cssText = 'position:fixed;bottom:18px;left:18px;max-width:380px;padding:18px;background:#fff;color:#151a21;border:1px solid #ccc;border-radius:12px;z-index:9999;font:14px/1.5 sans-serif;box-shadow:0 4px 24px #0002';
  const text = document.createElement('p'); text.textContent = copy[0]; panel.append(text);
  function choose(value) {
    consent = value; try {localStorage.setItem(KEY,value ? 'granted' : 'denied');} catch (_) {}
    if (value) start(); else if (window.fbq) window.fbq('consent','revoke');
    panel.remove();
  }
  [true,false].forEach((value,i) => { const b = document.createElement('button'); b.type='button'; b.textContent=copy[i+1]; b.style.cssText='padding:9px 15px;margin:10px 8px 0 0;border:1px solid #151a21;border-radius:6px;background:white;color:#151a21;cursor:pointer'; b.addEventListener('click',()=>choose(value)); panel.append(b); });
  const settings=document.createElement('button'); settings.type='button'; settings.textContent=copy[3]; settings.style.cssText='display:block;margin:15px auto;padding:8px;text-decoration:underline;font:13px sans-serif'; settings.addEventListener('click',()=>document.body.append(panel));
  (document.querySelector('footer') || document.body).append(settings);
  let saved; try {saved=localStorage.getItem(KEY);} catch (_) {}
  if (!saved) document.body.append(panel);
  if (consent) start();
})();


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
