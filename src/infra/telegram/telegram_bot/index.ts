import { ENABLE_TELEGRAM, TELEGRAM_BOT_NAME, TELEGRAM_BOT_TOKEN, REDIS_URI, REDIS_DB_NUMBER } from "../../../config";
import { TelegramBotService } from "../telegrot";
import { TelegramBotConfigTemplate } from "./template";
import { TeleBotErrorList, TeleBotErrorListLifeTime } from "./error_list";
import { handleBotAction } from "./telegram_action";
import { handleBotCommand } from "./telegram_command";
import { handleBotHelp } from "./telegram_help";
import { handleBotInlineMode } from "./telegram_inline_query";
import en from "./telegram_language/en.json";
import { handleBotMessage } from "./telegram_message";
import { handleBotStart } from "./telegram_start";
import { TelegramBotConfigCache } from './cache/cache.user_setting'

let bot_example: TelegramBotService<any, any, any>

const file_template = {
    en
}

const initBotExample = () => {
    bot_example = new TelegramBotService({
        bot_name: TELEGRAM_BOT_NAME,
        bot_token: TELEGRAM_BOT_TOKEN,
        is_enable: ENABLE_TELEGRAM,
        bot_config: {
            template: new TelegramBotConfigTemplate(file_template),
            cache: new TelegramBotConfigCache(TELEGRAM_BOT_NAME, REDIS_URI, REDIS_DB_NUMBER)
        },
        bot_error_list: [TeleBotErrorList, TeleBotErrorListLifeTime],
    }, {

    }, (bot_method) => {
        handleBotStart(bot_method)
        handleBotHelp(bot_method)
        handleBotCommand(bot_method)
        handleBotAction(bot_method)
        handleBotMessage(bot_method)
        handleBotInlineMode(bot_method)
    })
}

export {
    bot_example,
    file_template,
    initBotExample
};
