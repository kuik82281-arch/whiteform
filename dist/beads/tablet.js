'use strict';
// Tablet panels and explicit pan mode avoid relying on mouse or keyboard shortcuts.
function setTabletPanel(panel){if(!['draw','tools','colors'].includes(panel))return;document.body.dataset.panel=panel;document.querySelectorAll('[data-panel]').forEach(b=>b.classList.toggle('active',b.dataset.panel===panel));const target=$(panel==='draw'?'drawPanel':panel==='tools'?'toolsPanel':'colorsPanel');target?.scrollIntoView?.({behavior:'smooth',block:'start'});}
setTabletPanel('draw');document.querySelectorAll('#tabletTabs [data-panel]').forEach(b=>b.onclick=()=>setTabletPanel(b.dataset.panel));
var tabletPanMode=false,tabletPanGesture=null;
$('panCanvas').onclick=()=>{tabletPanMode=!tabletPanMode;$('panCanvas').classList.toggle('active',tabletPanMode);$('panCanvas').textContent=tabletPanMode?'✎ 返回绘制':'✋ 移动画布';notice(tabletPanMode?'移动模式：在画布上拖动平移，＋／−缩放':'绘制模式：用手指或笔添加豆子')};
const tabletBoardDown=board.onpointerdown,tabletBoardMove=board.onpointermove,tabletBoardUp=board.onpointerup,tabletBoardCancel=board.onpointercancel;
board.onpointerdown=e=>{if(!tabletPanMode){tabletBoardDown(e);return}tabletPanGesture={x:e.clientX,y:e.clientY,left:$('viewport').scrollLeft,top:$('viewport').scrollTop};board.setPointerCapture(e.pointerId)};
board.onpointermove=e=>{if(!tabletPanGesture){tabletBoardMove(e);return}$('viewport').scrollLeft=tabletPanGesture.left+tabletPanGesture.x-e.clientX;$('viewport').scrollTop=tabletPanGesture.top+tabletPanGesture.y-e.clientY};
board.onpointerup=e=>{if(tabletPanGesture){tabletPanGesture=null;return}tabletBoardUp(e)};board.onpointercancel=e=>{tabletPanGesture=null;tabletBoardCancel(e)};

function fitFullCanvas(){const viewport=$('viewport');if(!viewport.clientWidth||!viewport.clientHeight)return;zoom=Math.max(2,Math.min(60,Math.floor(Math.min((viewport.clientWidth-26)/(state.width+2),(viewport.clientHeight-26)/(state.height+2)))));render()}
$('fit').onclick=fitFullCanvas;
var canvasFocused=false;
async function toggleCanvasFullscreen(){const stage=$('canvasStage');canvasFocused=!canvasFocused;document.body.classList.toggle('canvas-focus',canvasFocused);$('canvasFullscreen').textContent=canvasFocused?'✕ 退出全屏':'⤢ 全屏画布';try{if(canvasFocused&&stage.requestFullscreen)await stage.requestFullscreen();else if(!canvasFocused&&document.fullscreenElement&&document.exitFullscreen)await document.exitFullscreen()}catch{/* CSS focus mode also works on tablet browsers without Fullscreen API. */}if(typeof requestAnimationFrame==='function')requestAnimationFrame(fitFullCanvas)}
$('canvasFullscreen').onclick=toggleCanvasFullscreen;
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&canvasFocused){canvasFocused=false;document.body.classList.toggle('canvas-focus',false);$('canvasFullscreen').textContent='⤢ 全屏画布';if(typeof requestAnimationFrame==='function')requestAnimationFrame(fitFullCanvas)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&canvasFocused&&!document.fullscreenElement)toggleCanvasFullscreen()});
if(typeof requestAnimationFrame==='function')requestAnimationFrame(fitFullCanvas);
