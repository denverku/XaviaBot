import moment from 'moment-timezone';
/*import handleEvents from './events.js';*/
/*import { handleDatabase } from './database.js';*/


export default async function handleListen() {
    /*const { handleCommand, handleReaction, handleMessage, handleReply, handleUnsend, handleEvent } = await handleEvents();*/
    const eventlog_excluded = ["typ", "presence", "read_receipt"];
    const logger = global.modules.get('logger');

    function handleEventLog(event) {
        const { LOG_LEVEL, timezone } = global.config;
        const { api } = global;
        /*const { threadID, messageID, senderID, args } = event;*/
  
        if (LOG_LEVEL == 0) return;
        if (eventlog_excluded.includes(event.type)) return;
        const { type, threadID, messageID, body, senderID } = event;
        if (LOG_LEVEL == 1) {
            let time = moment().tz(timezone).format('YYYY-MM-DD_HH:mm:ss');

            if (type == 'message' || type == 'message_reply') {
                logger.custom(`${threadID} • ${senderID} • hot ${body ? body : 'Photo, video, sticker, etc.'}`, `${time}`);
            }
        } else if (LOG_LEVEL == 2) {
            console.log(event);
        }
        return;
    }

    function handleMessage(event) {
   const { api } = global;
   const { type, threadID, messageID, body, senderID } = event;
   api.setMessageReaction('🕓', messageID, null, true);
   api.sendMessage('test', threadID, messageID);
}


    return (err, event) => {
        if (global.maintain && !global.config.MODERATORS.some(e => e == event.senderID)) return;
        handleEventLog(event);
        if (global.config.ALLOW_INBOX !== true && event.isGroup === false) return;
        (async () => {
            /*if (!eventlog_excluded.includes(event.type)) {
                await handleDatabase({ ...event });
            }*/
            
            logger.custom(event.type, `hi`);
            switch (event.type) {
                case "message":
                case "message_reply":
                    handleMessage({ ...event });
                     
                    break;
                case "message_reaction":
                    /*handleReaction({ ...event });*/
                    break;
                case "message_unsend":
                    /*handleUnsend({ ...event });*/
                    break;
                case "event":
                case "change_thread_image":
                   /* handleEvent({ ...event });*/
                    break;
                case "typ":
                    break;
                case "presence":
                    break;
                case "read_receipt":
                    break;
                default:
                    break;
            }
        })();
    }
}

