#!/usr/bin/env node
// Дронопорт: одна команда збирає все, що залежить від дизайн-системи.
//   node design/build.mjs           система → droneport.css → блоки → сторінки в design/dist/
//   node design/build.mjs --watch   те саме після кожної зміни
// Ланцюжок залежностей: system/project (токени, стилі, поведінка) → system/droneport.css → blocks/*.html → pages/*.html → dist/*.html
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const here=path.dirname(new URL(import.meta.url).pathname);
const P=(...a)=>path.join(here,...a);

function build(){
  const errs=[],notes=[];
  // 1. Система: перевірки, tokens.css і єдиний droneport.css.
  try{execFileSync('node',[P('system/tools/build.mjs')],{stdio:'pipe'})}
  catch(e){console.log(String(e.stdout||'')+String(e.stderr||''));return false}
  const css=fs.readFileSync(P('system/droneport.css'),'utf8');
  const known=new Set([...css.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/\.([A-Za-z][\w-]*)/g)].map(m=>m[1]));

  // 2. Блоки: кожен файл blocks/**/*.html — фрагмент розмітки на класах системи.
  const blocks=new Map();
  (function walk(dir,pre){for(const d of fs.readdirSync(dir,{withFileTypes:true})){
    if(d.isDirectory())walk(path.join(dir,d.name),pre+d.name+'/');
    else if(d.name.endsWith('.html'))blocks.set(pre+d.name.slice(0,-5),fs.readFileSync(path.join(dir,d.name),'utf8').replace(/^<!--[\s\S]*?-->\s*/,'').trim());
  }})(P('blocks'),'');
  const used=new Set(),deps={};
  const attrs=s=>Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
  function render(src,params,stack,page){
    src=src.replace(/\{\{([\w-]+)\}\}/g,(m,k)=>params[k]??'');
    return src.replace(/<!--\s*@block\s+([\w\/-]+)((?:\s+[\w-]+="[^"]*")*)\s*-->/g,(m,name,a)=>{
      if(!blocks.has(name)){errs.push(`${page}: немає блока «${name}»`);return ''}
      if(stack.includes(name)){errs.push(`${page}: блок «${name}» вкладено сам у себе`);return ''}
      used.add(name);if(!name.startsWith('icons/'))(deps[page]??=new Set()).add(name);
      return render(blocks.get(name),attrs(a),[...stack,name],page);
    });
  }
  // Правила для блоків і сторінок: жодних власних стилів — усе береться із системи.
  function lint(name,html){
    if(/<style[\s>]/i.test(html))errs.push(`${name}: блок <style> заборонено, стилі живуть у системі`);
    if(/<link[^>]+stylesheet/i.test(html))errs.push(`${name}: власний <link rel="stylesheet"> заборонено`);
    const noSvg=html.replace(/<svg[\s\S]*?<\/svg>/g,'');
    for(const m of noSvg.matchAll(/\sstyle="([^"]*)"/g))if(!/^(\s*--_[\w-]+\s*:[^;"]+;?)+$/.test(m[1]))errs.push(`${name}: inline-стиль «${m[1]}» — дозволено лише змінні стану --_назва`);
    if(/#[0-9a-fA-F]{6}\b|rgba?\(/.test(noSvg))errs.push(`${name}: сирий колір`);
    for(const m of html.matchAll(/\sclass="([^"]*)"/g))for(const c of m[1].split(/\s+/).filter(Boolean))if(!known.has(c))errs.push(`${name}: класу «${c}» немає в дизайн-системі`);
  }

  // 3. Сторінки: pages/*.html = рядок <!-- @page … --> і вміст із блоків та компонентів.
  fs.rmSync(P('dist'),{recursive:true,force:true});fs.mkdirSync(P('dist'),{recursive:true});
  fs.copyFileSync(P('system/droneport.css'),P('dist/droneport.css'));
  fs.copyFileSync(P('system/project/components/bundle.js'),P('dist/droneport.js'));
  const pages=fs.readdirSync(P('pages')).filter(f=>f.endsWith('.html')).sort();
  for(const f of pages){
    const src=fs.readFileSync(P('pages',f),'utf8');
    const head=src.match(/^<!--\s*@page((?:\s+[\w-]+="[^"]*")*)\s*-->\s*/);
    if(!head){errs.push(`${f}: перший рядок має бути <!-- @page title="…" -->`);continue}
    const meta=attrs(head[1]);
    let body=render(src.slice(head[0].length),meta,[],f);
    if(meta.current){const n=body.split(`data-id="${meta.current}"`).length-1;if(!n)errs.push(`${f}: current="${meta.current}" не знайдено в навігації`);body=body.replaceAll(`data-id="${meta.current}"`,`data-id="${meta.current}" aria-current="page"`)}
    lint(f,body);
    fs.writeFileSync(P('dist',f),`<!doctype html>
<html lang="uk" data-theme-auto>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title||'Дронопорт'}</title>
<link rel="stylesheet" href="droneport.css">
<script src="droneport.js"></script>
</head>
<body>
${body.trim()}
</body>
</html>
`);
  }
  // Варіант головної сторінки для публікації артефактом: без <html>/<head>, їх додає сам артефакт.
  if(fs.existsSync(P('dist/index.html'))){const b=fs.readFileSync(P('dist/index.html'),'utf8').match(/<body>([\s\S]*)<\/body>/)[1];
    fs.writeFileSync(P('dist/_artifact.html'),`<title>Макети Дронопорту</title>\n<link rel="stylesheet" href="droneport.css">\n<script>document.documentElement.setAttribute('data-theme-auto','')</script>\n<script src="droneport.js"></script>\n${b.trim()}\n`)}
  for(const [n,h] of blocks)if(!used.has(n))notes.push(`блок «${n}» не вжито на жодній сторінці`);
  for(const f of pages)console.log(`${f} ← ${[...(deps[f]||[])].join(', ')||'без блоків'}`);
  console.log(`система: droneport.css ${Math.round(css.length/1024)} КБ · блоків ${[...blocks.keys()].filter(n=>!n.startsWith('icons/')).length} · іконок ${[...blocks.keys()].filter(n=>n.startsWith('icons/')).length} · сторінок ${pages.length}`);
  if(notes.length)console.log(notes.join('\n'));
  console.log(errs.length?'FAIL\n'+[...new Set(errs)].join('\n'):'OK → design/dist/');
  return !errs.length;
}

const ok=build();
if(process.argv.includes('--watch')){
  let t;const again=()=>{clearTimeout(t);t=setTimeout(()=>{console.log('\n— зміна, збираю —');build()},150)};
  for(const d of ['system/project','blocks','pages'])fs.watch(P(d),{recursive:true},(e,f)=>{if(f&&!String(f).endsWith('tokens.css'))again()});
  console.log('стежу за system/project, blocks, pages…');
}else process.exit(ok?0:1);
