import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const files=fs.readdirSync(root,{recursive:true}).filter(file=>file.endsWith('.html'));
let checks=0;const failures=[];
for(const file of files){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
 const duplicate=ids.filter((id,i)=>ids.indexOf(id)!==i);
 if(duplicate.length)failures.push(`${file}: duplicate IDs ${duplicate}`);
 const h1=[...html.matchAll(/<h1(?:\s[^>]*)?>/g)];
 if(h1.length!==1)failures.push(`${file}: expected one h1, found ${h1.length}`);
 for(const [,raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^(https?:|mailto:|tel:|data:)/.test(raw))continue;
  const [url,anchor]=raw.split('#');
  const target=path.resolve(path.dirname(path.join(root,file)),url||path.basename(file));
  checks++;
  if(!fs.existsSync(target)){failures.push(`${file}: missing ${raw}`);continue;}
  if(anchor&&target.endsWith('.html')){
   const content=target===path.join(root,file)?html:fs.readFileSync(target,'utf8');
   if(!content.includes(`id="${anchor}"`))failures.push(`${file}: missing anchor ${raw}`);
  }
 }
 if(!html.includes('motion.js')||!html.includes('ScrollTrigger.min.js')||!html.includes('lenis.min.js'))failures.push(`${file}: missing motion runtime`);
 if(/Registry Waypoint|\$12,000|\$25,000|\$50,000|Edit with Lovable/.test(html))failures.push(`${file}: superseded content`);
 if(file.startsWith('request-')||file==='sign-in.html'){
  const forms=[...html.matchAll(/<form\b[\s\S]*?<\/form>/g)].map(match=>match[0]).join('');
  if(/Preview only|not connected|not sent or stored/i.test(html)||/\bdisabled\b/i.test(forms))failures.push(`${file}: public backend status or disabled form`);
 }
 if(file!=='sign-in.html'&&(html.match(/class="social-icon" disabled/g)||[]).length!==4)failures.push(`${file}: expected four disabled approved social icons`);
}
console.log(`${files.length} pages; ${checks} local asset/link/anchor checks.`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log('PASS: routes, assets, anchors, IDs, page headings, motion runtime, and content boundaries.');
