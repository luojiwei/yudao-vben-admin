import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 检查项目是否在 package.json 中引用了 @vue-office 系列依赖
 * 且每个依赖都有对应的入口文件 index.js
 * 如果入口文件不存在，尝试执行 postinstall 脚本修复
 */

const vueOfficePackages = ['pdf', 'excel', 'docx', 'pptx'];
// 直接使用当前工作目录，避免路径问题
const rootDir = process.cwd();

// 检查项目是否在 package.json 中引用了 @vue-office 依赖
function checkPackageJson() {
  const packageJsonPath = path.join(rootDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json 文件不存在');
    return [];
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const installedPackages = vueOfficePackages.filter((packageName) => {
      const fullPackageName = `@vue-office/${packageName}`;
      return fullPackageName in dependencies;
    });

    if (installedPackages.length === 0) {
      console.log('ℹ️  项目未引用 @vue-office 系列依赖，跳过检查');
    } else {
      console.log(
        `ℹ️  项目引用了以下 @vue-office 依赖: ${installedPackages.map((p) => `@vue-office/${p}`).join(', ')}`,
      );
    }

    return installedPackages;
  } catch (error) {
    console.error('❌ 读取 package.json 文件失败:', error.message);
    return [];
  }
}

function checkAndFixPackage(packageName) {
  const packagePath = path.join(
    rootDir,
    'node_modules',
    '@vue-office',
    packageName,
  );

  // 检查包是否安装
  if (!fs.existsSync(packagePath)) {
    console.log(`ℹ️  @vue-office/${packageName} 包未安装，跳过检查`);
    return;
  }

  const entryPath = path.join(packagePath, 'lib', 'index.js');

  if (fs.existsSync(entryPath)) {
    console.log(`✅ @vue-office/${packageName} 入口文件已存在`);
  } else {
    console.log(
      `⚠️  @vue-office/${packageName} 入口文件不存在，执行 postinstall 脚本...`,
    );
    try {
      const postinstallScript = path.join(
        packagePath,
        'lib',
        'script',
        'postinstall.js',
      );
      if (fs.existsSync(postinstallScript)) {
        execSync(`node ${postinstallScript}`, { stdio: 'inherit' });
        console.log(`✅ @vue-office/${packageName} 入口文件已生成`);
      } else {
        console.error(`❌ @vue-office/${packageName} postinstall 脚本不存在`);
      }
    } catch (error) {
      console.error(
        `❌ 执行 @vue-office/${packageName} postinstall 脚本失败:`,
        error.message,
      );
    }
  }
}

console.log('检查 @vue-office 系列包的入口文件...');
const installedPackages = checkPackageJson();
installedPackages.forEach((packageName) => checkAndFixPackage(packageName));
console.log('检查完成！');
