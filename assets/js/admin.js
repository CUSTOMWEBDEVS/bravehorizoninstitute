(() => {
"use strict";
const cfg=window.BHI_CONFIG, login=document.getElementById("login-view"), dash=document.getElementById("dashboard-view");
const lm=document.getElementById("login-message"), cm=document.getElementById("content-message");let records=[];
const session=()=>sessionStorage.getItem(cfg.SESSION_STORAGE_KEY)||"", setSession=t=>sessionStorage.setItem(cfg.SESSION_STORAGE_KEY,t), clear=()=>sessionStorage.removeItem(cfg.SESSION_STORAGE_KEY);
async function api(action,payload={}){
 if(!String(cfg.API_URL||"").startsWith("https://script.google.com/")) throw new Error("Configure API_URL in assets/js/config.js");
 const r=await fetch(cfg.API_URL,{method:"POST",redirect:"follow",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,...payload})});
 const d=await r.json(); if(!d.ok) throw new Error(d.error||"Request failed"); return d;
}
const showDash=()=>{login.hidden=true;dash.hidden=false}, showLogin=()=>{login.hidden=false;dash.hidden=true};
document.getElementById("login-form").addEventListener("submit",async e=>{e.preventDefault();lm.textContent="Signing in…";try{const d=await api("login",{password:document.getElementById("admin-password").value});setSession(d.token);document.getElementById("admin-password").value="";lm.textContent="";showDash();await load();}catch(err){lm.textContent=err.message}});
document.getElementById("logout-button").addEventListener("click",async()=>{const t=session();clear();showLogin();try{await api("logout",{token:t})}catch{}});
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function table(){document.getElementById("content-table-body").innerHTML=records.map(i=>`<tr><td>${esc(i.title)}</td><td>${esc(i.type)}</td><td>${esc(i.status)}</td><td>${esc(i.updatedAt||"")}</td><td class="table-actions"><button class="mini-button" data-edit="${i.id}">Edit</button><button class="mini-button danger" data-delete="${i.id}">Delete</button></td></tr>`).join("");
 document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>edit(b.dataset.edit));document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>del(b.dataset.delete));
}
async function load(){try{const d=await api("adminList",{token:session()});records=d.items||[];table()}catch(e){if(/session|authorized/i.test(e.message)){clear();showLogin()}cm.textContent=e.message}}
function record(){return{id:document.getElementById("record-id").value,type:document.getElementById("content-type").value,status:document.getElementById("content-status").value,title:document.getElementById("content-title").value.trim(),summary:document.getElementById("content-summary").value.trim(),body:document.getElementById("content-body").value.trim(),url:document.getElementById("content-url").value.trim(),imageUrl:document.getElementById("content-image").value.trim(),category:document.getElementById("content-category").value.trim(),publishDate:document.getElementById("content-date").value}}
document.getElementById("content-form").addEventListener("submit",async e=>{e.preventDefault();cm.textContent="Saving…";try{await api("saveContent",{token:session(),item:record()});cm.textContent="Saved.";reset();await load()}catch(err){cm.textContent=err.message}});
function edit(id){const i=records.find(x=>x.id===id);if(!i)return;for(const [k,v] of [["record-id",i.id],["content-type",i.type],["content-status",i.status],["content-title",i.title],["content-summary",i.summary],["content-body",i.body],["content-url",i.url],["content-image",i.imageUrl],["content-category",i.category],["content-date",i.publishDate]])document.getElementById(k).value=v||"";window.scrollTo({top:0,behavior:"smooth"})}
async function del(id){if(!confirm("Delete this public content record?"))return;try{await api("deleteContent",{token:session(),id});await load()}catch(e){cm.textContent=e.message}}
function reset(){document.getElementById("content-form").reset();document.getElementById("record-id").value=""}document.getElementById("cancel-edit").onclick=reset;
(async()=>{if(!session())return showLogin();try{await api("verifySession",{token:session()});showDash();await load()}catch{clear();showLogin()}})();
})();