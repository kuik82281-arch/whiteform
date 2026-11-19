const fs=require('fs');let html=fs.readFileSync('dist/beads/index.html','utf8');
html=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+fs.readFileSync('dist/beads/style.css','utf8')+'</style>');
html=html.replace(/<script src="([^"?]+)(?:\?[^\"]*)?"><\/script>/g,(_,name)=>'<script>'+fs.readFileSync('dist/beads/'+name,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
html=html.replace('href="../index.html"','href="白物-离线版.html"');fs.writeFileSync('拼豆编辑-离线版.html',html);console.log('Bead offline editor generated');
