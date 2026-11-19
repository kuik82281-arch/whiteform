(function(root){
const previous=root.WhiteFilter.render;
const modes=new Set(['ascii','iceblue','scanner','frost','xrayblue','xraydark','vision','redconstruct']);
function noise(x,y){let n=Math.imul(x+31,374761393)^Math.imul(y+17,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function mix(a,b,t){return a+(b-a)*t;}
function pixels(p,o){const {w,h,base,lines,halo,volume,rgba}=p,out=new Uint8ClampedArray(w*h*4),power=(o.body??80)/100,glow=(o.glow??45)/100,line=(o.line??12)/100,grain=(o.color??55)/100;const bg=(base[0]+base[w-1]+base[(h-1)*w]+base[w*h-1])/4;
for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,j=i*4,l=base[i]/255,t=1-l,edge=Math.min(1,lines[i]*.8+halo[i]*1.6),signal=Math.min(1,Math.abs(base[i]-bg)/155),relief=Math.min(1,Math.abs(base[i]-volume[i])/25),n=(noise(x,y)-.5),s=o.style;let r,g,b;
if(s==='iceblue'){const v=242-Math.pow(t,.9)*(85+power*100);r=v-30*t;g=v+5*t;b=v+24*t;r+=n*9*grain;g+=n*9*grain;b+=n*9*grain;}
else if(s==='xrayblue'){const v=244-signal*(65+power*85);r=v-edge*15;g=v+signal*13;b=v+signal*29;}
else if(s==='xraydark'){const lum=Math.min(1,signal*.33+edge*(.5+line*.5)+relief*.3),v=lum*(130+power*110);r=4+v*.82;g=7+v*.91;b=13+v;}
else if(s==='frost'){const d=signal*(32+power*55),shine=edge*(18+glow*30),pink=relief*25;r=211-d+shine+pink;g=247-d*.55+shine-pink*.5;b=252-d*.22+shine;r+=n*8*grain;g+=n*8*grain;b+=n*8*grain;}
else if(s==='scanner'){const a=Math.max(0,Math.min(1,signal*.8+edge*.65)),scan=(y%4===0?.82:1),phase=Math.sin(t*8+signal*5),v=30+a*190;r=(35+a*(70+100*Math.max(0,phase)))*scan;g=(18+a*(205-130*Math.max(0,phase)))*scan;b=v*scan;r+=n*28*grain;g+=n*28*grain;b+=n*28*grain;}
else if(s==='redconstruct'){const shift=Math.round(w*.006),ii=y*w+Math.max(0,Math.min(w-1,x+shift)),cyan=lines[ii],v=signal>.58?signal>.86?25:150:250;r=v===150?183:v;g=v===150?12:v;b=v===150?29:v;if(edge>.4){r=95;g=2;b=12;}if(cyan>.4&&edge<.2){r=90;g=210;b=210;}}
else {const a=rgba[j+3]/255;r=rgba[j]*a+255*(1-a);g=rgba[j+1]*a+255*(1-a);b=rgba[j+2]*a+255*(1-a);}
out[j]=r;out[j+1]=g;out[j+2]=b;out[j+3]=255;}
return out;}
function surface(p){const c=document.createElement('canvas');c.width=p.w;c.height=p.h;return [c,c.getContext('2d',{willReadFrequently:true})];}
function annotations(ctx,p,style){const {w,h,lines}=p,step=Math.max(18,Math.round(Math.min(w,h)/15)),candidates=[];for(let y=step;y<h-step;y+=step)for(let x=step;x<w-step;x+=step){let score=0;for(let yy=y;yy<Math.min(h,y+step);yy+=2)for(let xx=x;xx<Math.min(w,x+step);xx+=2)score+=lines[yy*w+xx];if(score>2)candidates.push({x,y,score});}candidates.sort((a,b)=>b.score-a.score);ctx.lineWidth=Math.max(.7,w/1300);const selected=candidates.slice(0,style==='vision'?35:12);for(let k=0;k<selected.length;k++){const a=selected[k],sz=step*(.7+(k%3)*.35);ctx.strokeStyle=style==='scanner'?'#e5ff78':k%3===0?'#2554ed':'#ee3945';ctx.strokeRect(a.x,a.y,sz,sz);ctx.fillStyle=ctx.strokeStyle;ctx.fillRect(a.x-2,a.y-2,4,4);if(style==='scanner'&&k<5){ctx.font=Math.max(9,w/95)+'px monospace';ctx.fillText('SCAN '+String(k+1).padStart(2,'0'),a.x+3,a.y-6);}}
}
function ascii(p,o){const [c,ctx]=surface(p),size=Math.max(7,Math.round(Math.max(p.w,p.h)/(80+(o.line??12)*.5))),cw=Math.max(4,Math.round(size*.61)),ch=size+1,chars=' .,:;+=ox%#@',bg=(p.base[0]+p.base[p.w-1]+p.base[(p.h-1)*p.w]+p.base[p.w*p.h-1])/4;ctx.fillStyle='#03070c';ctx.fillRect(0,0,p.w,p.h);ctx.font=size+'px monospace';ctx.textBaseline='top';for(let y=0;y<p.h;y+=ch)for(let x=0;x<p.w;x+=cw){let tone=0,ed=0,count=0;for(let yy=y;yy<Math.min(p.h,y+ch);yy+=2)for(let xx=x;xx<Math.min(p.w,x+cw);xx+=2){const i=yy*p.w+xx;tone+=Math.abs(p.base[i]-bg)/255;ed+=p.lines[i];count++;}tone=Math.min(1,tone/count+ed/count*.6);if(tone<.035)continue;const character=chars[Math.max(1,Math.min(chars.length-1,Math.floor(tone*(chars.length-1))))],v=90+tone*150,hue=185+y/p.h*130;ctx.fillStyle='hsl('+hue+' 65% '+Math.min(88,v/2.8)+'%)';ctx.fillText(character,x,y);}return ctx.getImageData(0,0,p.w,p.h).data;}
root.WhiteFilter.render=function(p,o){if(!modes.has(o.style))return previous(p,o);if(o.style==='ascii')return ascii(p,o);const out=pixels(p,o);if(o.style==='vision'||o.style==='scanner'){const [c,ctx]=surface(p);ctx.putImageData(new ImageData(out,p.w,p.h),0,0);annotations(ctx,p,o.style);return ctx.getImageData(0,0,p.w,p.h).data;}return out;};
root.ExtraEffects={pixels,modes};
})(globalThis);
