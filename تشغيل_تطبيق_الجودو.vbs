Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd /d c:\Users\ThinkPad\CascadeProjects\judo-manager && set NODE_OPTIONS=--max-old-space-size=4096 && npm run dev", 0, False
WScript.Sleep 3000
WshShell.Run "http://localhost:3000"
