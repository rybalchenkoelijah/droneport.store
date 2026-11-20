// Compiles project/tokens.json to tokens.css the way the Design System page does, then checks the system.
import fs from 'node:fs';
const root=new URL('../project/',import.meta.url).pathname;
const t=JSON.parse(fs.readFileSync(root+'tokens.json','utf8'));
const themes=t.color.themes.map(x=>x.id), first=themes[0];
const val=(x,th)=>typeof x.value==='string'?x.value:(x.value[th]??x.value[first]);
let css=`/* ${t.name} — generated from tokens.json */\n`;
const themed=[...t.color.tokens,...(t.shadow?.tokens??[])];
css+=`:root, [data-theme="${first}"] {\n${themed.map(x=>`  --${x.name}: ${val(x,first)};`).join('\n')}\n}\n`;
for(const th of themes.slice(1))css+=`[data-theme="${th}"] {\n${themed.map(x=>`  --${x.name}: ${val(x,th)};`).join('\n')}\n  color-scheme: dark;\n}\n`;
const flat=Object.entries(t).filter(([k,v])=>v&&v.tokens&&!['color','shadow'].includes(k)).flatMap(([,v])=>v.tokens);
css+=`:root {\n${flat.map(x=>`  --${x.name}: ${x.value};`).join('\n')}\n${Object.entries(t.type.families).map(([k,v])=>`  --font-${k}: ${v};`).join('\n')}\n}\n`;
for(const g of t.type.groups)for(const s of g.styles)css+=`.${s.name} { font-family: var(--font-${s.family??g.family}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight}; }\n`;
fs.writeFileSync(root+'tokens.css',css);

// ---- checks ----
const errs=[], notes=[];
const parse=c=>{c=c.trim();if(c[0]==='#'){let h=c.slice(1);if(h.length===3)h=[...h].map(x=>x+x).join('');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)).concat(h.length===8?parseInt(h.slice(6),16)/255:1)}const m=c.match(/[\d.]+/g).map(Number);return [m[0],m[1],m[2],m[3]??1]};
const over=(f,b)=>[0,1,2].map(i=>f[i]*f[3]+b[i]*(1-f[3])).concat(1);
const lum=c=>{const [r,g,b]=c.slice(0,3).map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};
const ratio=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+.05)/(y+.05)};
const col=(n,th)=>parse(val(t.color.tokens.find(x=>x.name===n),th));
const pairs=[['text','bg',4.5],['text','bg-side',4.5],['text','bg-raised',4.5],['text-2','bg',4.5],['text-2','bg-side',4.5],['text-2','bg-raised',4.5],['text-3','bg',4.5],['text-3','bg-raised',4.5],['olive-ink','bg',4.5],['olive-ink','bg-side',4.5],['on-olive','olive',4.5],['warn','bg',4.5],['danger','bg',4.5],['line-control','bg',3],['olive-ink','bg-raised',3],['olive','bg',3]];
for(const th of themes)for(const [f,b,min] of pairs){const bg=over(col(b,th),th==='light'?[255,255,255,1]:[0,0,0,1]);const r=ratio(over(col(f,th),bg),bg);(r<min?errs:notes).push(`${th} ${f} on ${b}: ${r.toFixed(2)} (need ${min})`)}
// text on tinted fills
for(const th of themes){const bg=over(col('fill-strong',th),over(col('bg',th),[0,0,0,1]));const r=ratio(over(col('text',th),bg),bg);if(r<4.5)errs.push(`${th} text on fill-strong ${r.toFixed(2)}`)}
for(const [k,v] of Object.entries(t))if(v&&v.tokens)for(const x of v.tokens)if(!x.usage)errs.push(`no usage: ${x.name}`);
const names=[...themed,...flat].map(x=>x.name);
const dup=names.filter((n,i)=>names.indexOf(n)!==i);if(dup.length)errs.push('duplicate names: '+dup);
if(fs.existsSync(root+'components/bundle.css')){
  const b=fs.readFileSync(root+'components/bundle.css','utf8').replace(/\/\*[\s\S]*?\*\//g,'');
  const body=b.replace(/@font-face\s*{[^}]*}/g,'');
  const raw=body.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g)||[];if(raw.length)errs.push('raw colours in bundle.css: '+[...new Set(raw)].join(' '));
  if(/gradient\(/.test(body))errs.push('gradient in bundle.css');
  const used=new Set([...b.matchAll(/var\(--([A-Za-z0-9_.-]+)/g)].map(m=>m[1]));
  const known=new Set([...names,...Object.keys(t.type.families).map(k=>'font-'+k)]);
  const unknown=[...used].filter(u=>!known.has(u)&&!u.startsWith('_'));if(unknown.length)errs.push('unknown vars: '+unknown.join(', '));
  const prev=fs.existsSync(root+'components')?fs.readdirSync(root+'components',{recursive:true}).filter(f=>String(f).endsWith('.html')).map(f=>fs.readFileSync(root+'components/'+f,'utf8')).join('\n'):'';
  const unused=names.filter(n=>!used.has(n)&&!prev.includes('--'+n)&&!/^bp-|^brand$/.test(n));if(unused.length)notes.push('unused tokens: '+unused.join(', '));
  const comps=fs.readdirSync(root+'components',{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
  for(const c of comps){const has=f=>fs.existsSync(`${root}components/${c}/${f}`);if(!has('preview.html'))errs.push(c+': no preview.html');else{const p=fs.readFileSync(`${root}components/${c}/preview.html`,'utf8');if(!p.startsWith('<!-- @dsCard'))errs.push(c+': marker missing on line 1');const rawp=p.replace(/<svg[\s\S]*?<\/svg>/g,'').match(/#[0-9a-fA-F]{6}\b|rgba?\(/g);if(rawp&&c!=='Cover')errs.push(c+': raw colour in preview');}
    if(c!=='Cover'&&!has('README.md'))errs.push(c+': no README.md');if(c==='Cover'&&has('README.md'))errs.push('Cover must stay bare')}
  notes.push('components: '+comps.length);
}
console.log(`colors ${t.color.tokens.length}, type styles ${t.type.groups.reduce((a,g)=>a+g.styles.length,0)}, spacing ${t.spacing.tokens.length}, radius ${t.radius.tokens.length}`);
if(process.argv.includes('-v'))console.log(notes.join('\n'));
console.log(errs.length?'FAIL\n'+errs.join('\n'):'OK');process.exit(errs.length?1:0);
