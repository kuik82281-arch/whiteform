// Only accept an image from the window that opened this local editor.
(function(){
const parent=window.parent!==window?window.parent:window.opener;if(!parent||!new URLSearchParams(location.search).has('from'))return;
const target=location.origin==='null'?'*':location.origin;
window.addEventListener('message',async event=>{if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='whiteform-beads-image')return;const blob=event.data.blob;if(!(blob instanceof Blob)||blob.type!=='image/png'||blob.size>40*1024*1024){notice('传入图片无效或过大，请手动导入');return;}try{importQueue=[];$('importMode').value='image';$('iw').value=64;$('ih').value=64;await loadImportImage(new File([blob],'白物效果图.png',{type:'image/png'}));$('importMode').value='image';$('ih').value=Math.max(1,Math.min(200,Math.round(64*image.height/image.width)));sourceDraw();updateConversionPreview();notice('白物效果图已载入：可框选主体，设置行列与颜色数后转换。');parent.postMessage({type:'whiteform-beads-loaded'},target);}catch(error){notice('图片载入失败：'+error.message);}});
parent.postMessage({type:'whiteform-beads-ready'},target);
})();
