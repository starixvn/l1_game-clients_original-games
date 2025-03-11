const { execSync } = require('child_process');
const { chdir } = require('process');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

async function copyDirectory(source, target) {
    try {
        await fs.copy(source, target);
    } catch (err) {
        console.error(err);
    }
}

async function publishNpm() {
    try {
        console.log("Start publish npm");

        const packageJson = require('./package.json');
        const version = packageJson.version;
        console.log("Current version:", version);

        const targetDir = path.resolve('../../../../seal-components');
        chdir(targetDir);
        console.log("Change directory to seal-components");

        // 根據作業系統選擇適當的 shell
        const options = {
            stdio: 'inherit',
            shell: os.platform() === 'win32' ? 'cmd.exe' : '/bin/sh'
        };

        // 使用跨平台兼容的命令
        execSync("git pull && git checkout npm-release", options);
        console.log("Checkout branch done");

        await copyDirectory('dist', targetDir);
        console.log("Copy dist folder done");

        // 使用單引號包裝 commit message，避免跨平台問題
        execSync(`git add . && git commit -m 'release: ${version}' && git push`, options);
        console.log("Finish publish npm");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

publishNpm();