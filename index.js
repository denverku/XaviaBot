import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { spawn, execSync } from 'child_process';
import semver from 'semver';
import axios from 'axios';

import { } from 'dotenv/config';
import logger from './core/var/modules/logger.js';
import loadPlugins from './core/var/modules/installDep.js';

import environments from './core/var/modules/environments.get.js';

/*const { isGlitch, isReplit, isGitHub } = environments;*/

console.clear();

// Install newer node version on some old Repls
function upNodeReplit() {
    return new Promise(resolve => {
        execSync('npm i --save-dev node@16 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH');
        resolve();
    })
}

(async () => {
    

    
    
        logger.warn("Running on GitHub is not recommended.");
    
})();

// End


// CHECK UPDATE
async function checkUpdate() {
    logger.custom("Checking for updates...", "UPDATE");
    try {
        const res = await axios.get('https://raw.githubusercontent.com/XaviaTeam/XaviaBot/main/package.json');

        const { version } = res.data;
        const currentVersion = JSON.parse(readFileSync('./package.json')).version;
        if (semver.lt(currentVersion, version)) {
            logger.warn(`New version available: ${version}`);
            logger.warn(`Current version: ${currentVersion}`);
        } else {
            logger.custom("No updates available.", "UPDATE");
        }
    } catch (err) {
        logger.error('Failed to check for updates.');
    }
}


// Child handler
const _1_MINUTE = 60000;
let restartCount = 0;

async function main() {
    
   /*await loadPlugins();*/
    const child = spawn('node', ['--trace-warnings', '--experimental-import-meta-resolve', '--expose-gc', 'core/_build.js'], {
        cwd: process.cwd(),
        stdio: 'inherit',
        env: process.env
    });

    child.on("close", async (code) => {
        handleRestartCount();
        if (code !== 0 && restartCount < 5) {
            console.log();
            logger.error(`An error occurred with exit code ${code}`);
            logger.warn("Restarting Xavia Workers Handler...");
            await new Promise(resolve => setTimeout(resolve, 2000));
            main();
        } else {
            console.log();
            logger.error("Xavia has been closed.");
            process.exit(0);
        }
    });
};

function handleRestartCount() {
    restartCount++;
    setTimeout(() => {
        restartCount--;
    }, _1_MINUTE);
}

main();

