import fs from 'node:fs';

// Source-authored artwork: no fabricated metrics or operational claims.
export function relationshipArt(kind=0){
  const labels=[['Deployment','Principal','Source reference'],['Sponsor','Agent','Confirm ownership'],['Scope','Evidence','Inspect the source']][kind%3];
  return `<div class="relationship-art relationship-${kind%3}" aria-hidden="true"><div class="art-orbit"></div><div class="art-thread"></div><div class="art-tile tile-one"><span>01</span><b>${labels[0]}</b><i></i><i></i></div><div class="art-tile tile-two"><span>02</span><b>${labels[1]}</b><i></i><i></i></div><span class="art-annotation">${labels[2]}</span></div>`;
}
export function cinema(p=''){
  return `<section class="authority-cinema" data-chapter><img src="${p}assets/images/authority-chain.webp" alt="Connected smoked-glass panels on burgundy bases, a conceptual illustration of the authority chain" width="1536" height="1024" loading="lazy" class="cinema-image"><div class="cinema-shade"></div><div class="container cinema-content"><p class="eyebrow">People / identity / authority</p><h2>Responsibility is<br>a relationship.</h2><p>Follow the connections.<br>Keep the person in the picture.</p><div class="cinema-cards"><div><span>01 / SOURCE</span><b>A reference.</b><p>Where the relationship begins.</p></div><div><span>02 / REVIEW</span><b>A named person.</b><p>Who can confirm the context.</p></div><div><span>03 / EVIDENCE</span><b>An inspectable record.</b><p>What the next reviewer can follow.</p></div></div><span class="cinema-caption">Conceptual illustration / not a product interface</span></div></section>`;
}
export function socialIcons(){
  return `<div class="footer-socials" aria-label="Social media">${[['linkedin','LinkedIn'],['x','X'],['youtube','YouTube'],['instagram','Instagram']].map(([slug,name])=>{
    const svg=fs.readFileSync(new URL(`./assets/icons/social-${slug}.svg`,import.meta.url),'utf8').replace(/<svg /,'<svg aria-hidden="true" ');
    return `<button type="button" class="social-icon" disabled aria-label="${name} — link not yet available" title="${name}">${svg}</button>`;
  }).join('')}</div>`;
}
export function footerArtwork(p){return `<a class="footer-signature" href="${p}index.html" aria-label="OwnerStamp home"><img src="${p}assets/logo/ownerstamp-inverse.svg" alt="" width="1200" height="256" loading="lazy"></a>`;}
export function decorateContent(html,p){
  let gap=0,process=0;
  html=html.replaceAll('<article class="gap-card">',()=>`<article class="gap-card">${relationshipArt(gap++)}`);
  html=html.replaceAll('<article class="process-step">',()=>`<article class="process-step">${relationshipArt(process++)}`);
  html=html.replaceAll('<article class="card">',()=>`<article class="card">${relationshipArt(gap++)}`);
  html=html.replaceAll('<a class="usecase-card" href="use-cases.html">',()=>`<a class="usecase-card" href="use-cases.html">${relationshipArt(gap++)}`);
  // Pages without a product hero get a real art panel, not an empty second column.
  if(html.includes('class="page-hero "')){
    html=html.replace('class="page-hero "','class="page-hero with-visual editorial-hero"');
    const end=html.indexOf('</section>');
    const hero=html.slice(0,end).replace(/<\/div><\/div>$/,`<div class="editorial-art"><img src="${p}assets/images/evidence-layers.webp" alt="Layered paper and glass records, an illustration of source, review, and evidence" width="1536" height="1024" fetchpriority="high"><span>THE OWNERSTAMP RECORD / SOURCE → REVIEW → EVIDENCE</span></div></div></div>`);
    html=hero+html.slice(end);
  }
  return html;
}
