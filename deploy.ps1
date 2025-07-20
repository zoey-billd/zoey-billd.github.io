# deploy.ps1
Write-Host "正在生成静态网站..." -ForegroundColor Cyan
hugo

Write-Host "提交源码变更到私有仓库..." -ForegroundColor Cyan
git add .
git commit -m "内容更新: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push origin main

Write-Host "部署到 GitHub Pages..." -ForegroundColor Cyan
cd public
git add .
git commit -m "站点更新: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push origin main
cd ..

Write-Host "`n✅ 部署成功！稍后访问: https://zoey-billd.github.io" -ForegroundColor Green
Start-Sleep -Seconds 5
Start-Process "https://zoey-billd.github.io"