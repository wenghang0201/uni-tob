const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

// 打包输出目录
const filePath = path.resolve(__dirname, './unpackage/dist/build/web/index.html');
const buildDate = dayjs().format('YYYY-MM-DD HH:mm:ss');

if (!fs.existsSync(filePath)) {
  console.error('index.html not found:', filePath);
  process.exit(1);
}

let html = fs.readFileSync(filePath, 'utf-8');

// 正则查找已有的 build-date meta
const metaReg = /<meta\s+name=["']build-date["'][^>]*>/i;

if (metaReg.test(html)) {
  // 已有，替换 content
  html = html.replace(
    /(<meta\s+name=["']build-date["'][^>]*content=["'])[^"']*([^>]*>)/i,
    `$1${buildDate}$2`
  );
  console.log('已替换 build-date meta');
} else {
  // 没有，插入到 <head> 里
  html = html.replace(
    /<head>/i,
    `<head>\n    <meta name="build-date" content="${buildDate}">`
  );
  console.log('已插入 build-date meta');
}

fs.writeFileSync(filePath, html, 'utf-8');
console.log('build-date injected:', buildDate);