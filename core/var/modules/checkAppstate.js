
import { resolve as resolvePath } from 'path';
import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

/**
 * Check the encrypt state of the appstate then return the decrypted one.
 */
async function checkAppstate(APPSTATE_PATH, APPSTATE_PROTECTION) {
    const logger = global.modules.get('logger');
    /*const { isReplit, isGlitch } = global.modules.get('environments.get');*/

    let objAppState;
    APPSTATE_PATH = resolvePath(APPSTATE_PATH);

    if (!isExists(APPSTATE_PATH, "file")) {
        throw getLang('modules.checkAppstate.error.noAppstate');
    } else {
        logger.custom(getLang('modules.checkAppstate.foundAppstate'), 'LOGIN');
    }

    let appState = readFileSync(APPSTATE_PATH, 'utf8');
    appState = appState.startsWith("\"") ? JSON.parse(appState) : appState; // fixed...
    logger.custom(getLang('modules.checkAppstate.noProtection'), 'LOGIN');
        objAppState = await getAppStateNoProtection(APPSTATE_PATH, appState);
    

    return objAppState;
}

async function getAppStateNoProtection(APPSTATE_PATH, appState) {
    const logger = global.modules.get('logger');
    const aes = global.modules.get('aes');

    let objAppState, APPSTATE_SECRET_KEY;

    try {
        if (isJSON(appState)) {
            objAppState = JSON.parse(appState);
            if (objAppState.length == 0) {
                if (!isExists(resolvePath('.data', 'appstate.json'))) throw getLang('modules.checkAppstate.error.invalid');

                objAppState = JSON.parse(readFileSync(resolvePath('.data', 'appstate.json'), 'utf8'));
                writeFileSync(APPSTATE_PATH, JSON.stringify(objAppState, null, 2), 'utf8');
            }
        } else {
            throw getLang('modules.checkAppstate.error.invalid');
        }
    } catch (error) {
        throw error;
    }

    return objAppState;
}


export default checkAppstate;
