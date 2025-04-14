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
import { ioredis } from "../../cache/redis";
import { BotServiceType } from "./type";
import { TelegramBotConfigCacheDate } from "./cache/cache.date";

const file_template = {
    en
}

const initBotExample = () => {
    const bot_example = new TelegramBotService({
        bot_name: TELEGRAM_BOT_NAME,
        bot_token: TELEGRAM_BOT_TOKEN,
        is_enable: ENABLE_TELEGRAM,
        bot_config: {
            template: new TelegramBotConfigTemplate(file_template),
            cache: {
                user_setting: new TelegramBotConfigCache(TELEGRAM_BOT_NAME, ioredis),
                date: new TelegramBotConfigCacheDate(TELEGRAM_BOT_NAME, ioredis)
            }
        },
        bot_error_list: [TeleBotErrorList, TeleBotErrorListLifeTime],
    }, {

    }, (bot_method: BotServiceType) => {
        handleBotStart(bot_method)
        handleBotHelp(bot_method)
        handleBotCommand(bot_method)
        handleBotAction(bot_method)
        handleBotMessage(bot_method)
        handleBotInlineMode(bot_method)
    })
    return bot_example
}

export {
    file_template,
    initBotExample
};
