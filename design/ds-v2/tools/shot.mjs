// Renders component previews the way the Design System page frames them. Usage: node tools/shot.mjs [Comp ...] [--out dir] [--w 960]
import fs from 'node:fs';import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('playwright');
const root=new URL('../project/',import.meta.url).pathname, args=process.argv.slice(2);
const opt=k=>{const i=args.indexOf(k);return i<0?null:args.splice(i,2)[1]};
const out=opt('--out')||'/tmp/claude-0/-home-user-droneport-store/18492631-5d0a-5634-a255-46eeb1c9e21e/scratchpad/ds-shots', w=+(opt('--w')||960);
fs.mkdirSync(out,{recursive:true});
const comps=args.length?args:fs.readdirSync(root+'components',{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
const css=fs.readFileSync(root+'tokens.css','utf8')+fs.readFileSync(root+'components/bundle.css','utf8').replace(/@font-face\s*{[^}]*}/g,'');
const fonts='<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geologica:wght@400..600&family=Martian+Mono:wdth,wght@87.5,400..600&display=swap"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Science+Gothic:wght@900&display=swap">';
const b=await chromium.launch();let bad=0;
for(const c of comps){const f=`${root}components/${c}/preview.html`;if(!fs.existsSync(f)){console.log(c,'NO PREVIEW');bad++;continue}
  const src=fs.readFileSync(f,'utf8'), h=+(src.match(/height=(\d+)/)||[0,120])[1];
  for(const th of ['light','dark']){const p=await b.newPage({viewport:{width:w,height:Math.max(h,60)}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
    await p.setContent(`<!doctype html><html data-theme="${th}"><head><meta charset="utf-8">${fonts}<style>${css}</style></head><body>${src}</body></html>`,{waitUntil:'networkidle'});
    const m=await p.evaluate(()=>({sh:document.documentElement.scrollHeight,sw:document.documentElement.scrollWidth,iw:innerWidth,ih:innerHeight}));
    await p.screenshot({path:`${out}/${c}-${th}.png`,fullPage:true});
    const flag=(m.sw>m.iw?' OVERFLOW-X':'')+(m.sh>m.ih+2?` TALLER-THAN-MARKER(${m.sh}>${m.ih})`:'')+(errs.length?' ERR '+errs.join('; '):'');if(flag)bad++;
    console.log(`${c} ${th}${flag||' ok'}`);await p.close()}}
await b.close();console.log('shots in',out);process.exit(bad?1:0);
