"""Start the local tools again after a computer restart, then open the browser."""
from pathlib import Path
import subprocess
import sys
import time
import urllib.request
import webbrowser

ROOT = Path(__file__).resolve().parent
URL = 'http://127.0.0.1:8766/'

def ready():
    try:
        with urllib.request.urlopen(URL, timeout=1) as response:
            return '白物' in response.read().decode('utf-8')
    except Exception:
        return False

if not ready():
    subprocess.Popen(
        [sys.executable, '-m', 'http.server', '8766', '--bind', '127.0.0.1'],
        cwd=ROOT / 'dist', stdin=subprocess.DEVNULL,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0),
    )
    for _ in range(30):
        if ready():
            break
        time.sleep(0.2)

if ready():
    webbrowser.open(URL)
else:
    print('本地服务未能启动，请直接打开 白物-离线版.html 或 素材排版-离线版.html。')
    input('按回车关闭。')
