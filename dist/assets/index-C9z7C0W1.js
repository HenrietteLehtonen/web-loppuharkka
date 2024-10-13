(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const c of e)if(c.type==="childList")for(const t of c.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&l(t)}).observe(document,{childList:!0,subtree:!0});function o(e){const c={};return e.integrity&&(c.integrity=e.integrity),e.referrerPolicy&&(c.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?c.credentials="include":e.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function l(e){if(e.ep)return;e.ep=!0;const c=o(e);fetch(e.href,c)}})();const C=s=>{const{name:n,address:o,company:l}=s,e=document.createElement("tr"),c=document.createElement("td");c.innerText=n;const t=document.createElement("td");t.innerText=o;const r=document.createElement("td");r.innerText=l;const i=document.createElement("div");i.setAttribute("id","button-container");const d=document.createElement("button");d.setAttribute("class","show-menu-btn"),d.innerText="Daily Menu";const u=document.createElement("button");u.setAttribute("class","show-menu-btn"),u.innerText="Weekly Menu",i.appendChild(d),i.appendChild(u);const m=document.createElement("td");return m.appendChild(i),e.appendChild(c),e.appendChild(t),e.appendChild(r),e.appendChild(m),{rivi:e,dailyMenuBtn:d,weeklyMenuBtn:u}},x=(s,n)=>{const{name:o,address:l,city:e,postalCode:c,phone:t,company:r}=s;let i=`
    <div class="dialog-container">
      <h2>${o}</h2>
      <h3>${r}</h3>
      <h3>${l} ${c} ${e}</h3>
      <h3>${t}</h3>
    </div>
      <table>
        <tr>
          <th>Ruokalaji</th>
          <th>Allergeenit</th>
          <th>Hinta</th>
        </tr>

    `;return n.courses.forEach(d=>{const{name:u,diets:m,price:h}=d;i+=`
          <tr>
            <td>${u}</td>
            <td>${m??" - "}</td>
            <td>${h??" - "}</td>
          </tr>
          `}),i+="</table>",i},b=s=>`
        <h3>Error</h3>
        <p>${s}</p>
        `,B=(s,n)=>{const{name:o,address:l,city:e,postalCode:c,phone:t,company:r}=s;let i=`
    <div class="dialog-container">
      <h2>${o}</h2>
      <h3>${r}</h3>
      <h3>${l} ${c} ${e}</h3>
      <h3>${t}</h3>
    </div>
      <table>
        <tr>
          <th>Päivä</th>
          <th>Ruokalaji</th>
          <th>Allergeenit</th>
          <th>Hinta</th>
        </tr>

    `;return n.days.forEach(d=>{const{date:u,courses:m}=d;m.forEach((h,f)=>{const{name:g,diets:y,price:k}=h;i+=`
        <tr>
          <td id=date-menu>${f===0?u:""}</td> <!-- päivämäärä ekalle riville --!>
          <td>${g}</td>
          <td>${y??" - "}</td>
          <td>${k??" - "}</td>
        </tr>
      `})}),i+="</table>",i},E=async(s,n={})=>{const o=await fetch(s,n);if(!o.ok)throw new Error(`Error ${o.status} occured`);return o.json()},M="https://media1.edu.metropolia.fi/restaurant/api/v1",T={enableHighAccuracy:!0,timeout:5e3,maximumAge:0},H=document.querySelector("#info-btn"),L=document.querySelector("#dialog-info"),S=document.querySelector("#info-btn-close"),$=document.querySelector(".dialog-login"),q=document.querySelector("#login-btn"),A=document.querySelector("#close-btn"),w=document.getElementById("checkbox");w?console.log("Checkbox found"):console.error("Checkbox not found");function R(){console.log("toggle"),document.documentElement.classList.toggle("dark")}w.addEventListener("change",()=>{R()});H.addEventListener("click",()=>{console.log("click"),L.showModal()});q.addEventListener("click",()=>{$.showModal()});S.addEventListener("click",()=>{L.close()});A.addEventListener("click",()=>{$.close()});const a=document.getElementById("dialog-menu");if(!a)throw new Error("Modal not found");a.addEventListener("click",()=>{a.close()});const v=(s,n,o,l)=>Math.sqrt((o-s)**2+(l-n)**2),p=s=>{const n=document.querySelector("table");n&&(n.innerHTML="",s.forEach(o=>{const{rivi:l,dailyMenuBtn:e,weeklyMenuBtn:c}=C(o);n.appendChild(l),e.addEventListener("click",async()=>{console.log("Click",o);try{a.innerHTML="";const t=await E(M+`/restaurants/daily/${o._id}/fi`);console.log(t);const r=x(o,t);a.insertAdjacentHTML("beforeend",r),a.showModal()}catch(t){a.innerHTML=b(t.message),a.showModal()}}),c.addEventListener("click",async()=>{console.log("Click",o);try{a.innerHTML="";const t=await E(M+`/restaurants/weekly/${o._id}/fi`);console.log(t);const r=B(o,t);a.insertAdjacentHTML("beforeend",r),a.showModal()}catch(t){a.innerHTML=b(t.message),a.showModal()}})}))},O=s=>{console.warn(`ERROR(${s.code}): ${s.message}`)},j=async s=>{try{const n=s.coords,o=await E(M+"/restaurants");console.log(o),o.sort((t,r)=>{const i=n.latitude,d=n.longitude,u=t.location.coordinates[1],m=t.location.coordinates[0],h=v(i,d,u,m),f=r.location.coordinates[1],g=r.location.coordinates[0],y=v(i,d,f,g);return h-y}),p(o);const l=document.querySelector("#sodexo"),e=document.querySelector("#compass"),c=document.querySelector("#reset");if(!l){console.log("Sodexo button missing in hötömölö");return}if(l.addEventListener("click",()=>{const t=o.filter(r=>r.company==="Sodexo");console.log(t),p(t)}),!e){console.log("Compass button missing in hötömölö");return}if(e.addEventListener("click",()=>{const t=o.filter(r=>r.company==="Compass Group");console.log(t),p(t)}),!c){console.log("Reset button missing in hötömölö");return}c.addEventListener("click",()=>{p(o)})}catch(n){a.innerHTML=b(n.message),a.showModal()}};navigator.geolocation.getCurrentPosition(j,O,T);
