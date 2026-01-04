const { minify } = require('terser');
const fs = require('fs');
const path = require('path');

// 配置：需要压缩的目录列表
const DIRECTORIES = [
  'analytics_with_cloudflare',
  // 在此添加更多目录...
];

// Terser 压缩配置
const TERSER_OPTIONS = {
  compress: {
    drop_console: false, // 保留 console.log
    drop_debugger: true,
    passes: 2,
  },
  mangle: {
    toplevel: false,
  },
  format: {
    comments: false,
  },
};

/**
 * 递归查找目录中所有的 .js 文件（排除 .min.js）
 */
function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findJsFiles(filePath, fileList);
    } else if (
      file.endsWith('.js') && 
      !file.endsWith('.min.js')
    ) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

/**
 * 压缩单个 JS 文件
 */
async function minifyFile(inputPath) {
  const outputPath = inputPath.replace(/\.js$/, '.min.js');
  
  try {
    const code = fs.readFileSync(inputPath, 'utf8');
    const result = await minify(code, TERSER_OPTIONS);
    
    if (result.code) {
      fs.writeFileSync(outputPath, result.code, 'utf8');
      
      const originalSize = Buffer.byteLength(code, 'utf8');
      const minifiedSize = Buffer.byteLength(result.code, 'utf8');
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      
      console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
      console.log(`   ${originalSize} bytes → ${minifiedSize} bytes (${savings}% smaller)`);
    }
  } catch (error) {
    console.error(`❌ Error minifying ${inputPath}:`, error.message);
  }
}

/**
 * 主函数
 */
async function main() {
  const rootDir = __dirname;
  let allJsFiles = [];
  
  console.log('🔍 Scanning for JS files...\n');
  
  for (const dir of DIRECTORIES) {
    const fullPath = path.join(rootDir, dir);
    
    if (fs.existsSync(fullPath)) {
      const files = findJsFiles(fullPath);
      allJsFiles = allJsFiles.concat(files);
    } else {
      console.warn(`⚠️  Directory not found: ${dir}`);
    }
  }
  
  if (allJsFiles.length === 0) {
    console.log('No JS files found to minify.');
    return;
  }
  
  console.log(`Found ${allJsFiles.length} file(s) to minify:\n`);
  
  for (const file of allJsFiles) {
    await minifyFile(file);
    console.log('');
  }
  
  console.log('✨ Minification complete!');
}

main().catch(console.error);
