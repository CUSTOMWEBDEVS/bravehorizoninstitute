(() => {
"use strict";
const cfg = window.BHI_CONFIG || {};
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
const toggle=document.querySelector(".nav-toggle"),nav=document.getElementById("site-nav");
toggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
document.querySelectorAll("[data-booking-link]").forEach(a=>a.href=cfg.BOOKING_URL||"#");
document.querySelectorAll("[data-consultation-link]").forEach(a=>a.href=cfg.CONSULTATION_URL||"#");

const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const safeUrl=v=>{try{const u=new URL(v);return ["https:","mailto:"].includes(u.protocol)?u.href:"#"}catch{return"#"}};
function cards(items,limit){
  const data=(items||[]).slice(0,limit||items.length);
  return data.map(i=>`<article class="resource-card" data-type="${esc(i.type)}">
    ${i.imageUrl?`<img src="${safeUrl(i.imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer">`:""}
    <div class="resource-meta"><span>${esc(i.type)}</span><span>${esc(i.category||"Resource")}</span></div>
    <h3>${esc(i.title)}</h3><p>${esc(i.summary)}</p>
    <a class="arrow-link" href="${safeUrl(i.url||"#")}" ${safeUrl(i.url||"#").startsWith("http")?'target="_blank" rel="noopener noreferrer"':""}>${i.type==="video"?"Watch video":i.type==="link"?"Open resource":"Read article"} →</a>
  </article>`).join("");
}
async function load(){
  if(!String(cfg.API_URL||"").startsWith("https://script.google.com/")) return;
  try{
    const r=await fetch(`${cfg.API_URL}?action=publicContent`,{redirect:"follow",cache:"no-store"});
    const d=await r.json(); if(!d.ok) throw new Error(d.error||"Load failed");
    const rg=document.getElementById("resource-grid"); if(rg) rg.innerHTML=cards(d.items||[])||'<div class="empty-state">No published resources yet.</div>';
    const hg=document.getElementById("home-resource-grid"); if(hg) hg.innerHTML=cards(d.items||[],3)||'<div class="empty-state">New resources will appear here.</div>';
  }catch(e){console.error(e)}
}
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  const t=btn.dataset.filter;document.querySelectorAll(".resource-card").forEach(c=>c.hidden=t!=="all"&&c.dataset.type!==t);
}));
load();
})();