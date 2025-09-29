import { ENABLE_TELEGRAM, isProductionRun, TELEGRAM_BOT_NAME, TELEGRAM_BOT_TOKEN, TG_BOT_IS_USE_LOCAL_TELEGRAM, TG_BOT_IS_USE_WEBHOOK, TG_BOT_LOCAL_TELEGRAM_URL, TG_BOT_WEBHOOK_PORT, TG_BOT_WEBHOOK_URL } from "../../../config";
import { TelegramBotService } from "../../../lib/telegram";
import { TeleConfigBotTemplate } from "./config_bot_script";
import { TeleBotErrorList, TeleBotErrorListLifeTime } from "./error_list";
import { handleBotAction } from "./telegram_action";
import { handleBotCommand } from "./telegram_command";
import { handleBotHelp } from "./telegram_help";
import { handleBotInlineMode } from "./telegram_inline_query";
import en from "./telegram_language/en.json";
import { handleBotMessage } from "./telegram_message";
import { handleBotStart } from "./telegram_start";
import { BotTemplateServiceType } from "./type";

const file_template = {
    en
}

const bot_config = new TeleConfigBotTemplate(file_template)

const bot_template = new TelegramBotService({
    bot_name: TELEGRAM_BOT_NAME,
    bot_token: TELEGRAM_BOT_TOKEN,
    is_enable: ENABLE_TELEGRAM,
    bot_config,
    bot_error_list: [TeleBotErrorList, TeleBotErrorListLifeTime],
}, {
    is_use_local_telegram: TG_BOT_IS_USE_LOCAL_TELEGRAM,
    is_use_webhook: TG_BOT_IS_USE_WEBHOOK,
    delay_bot_start: isProductionRun ? 10000 : 2000,
    webhook_url: TG_BOT_WEBHOOK_URL,
    webhook_port: TG_BOT_WEBHOOK_PORT,
    local_telegram_url: TG_BOT_LOCAL_TELEGRAM_URL
}, (bot_method: BotTemplateServiceType) => {
    handleBotStart(bot_method)
    handleBotHelp(bot_method)
    handleBotCommand(bot_method)
    handleBotAction(bot_method)
    handleBotMessage(bot_method)
    handleBotInlineMode(bot_method)
})

export {
    bot_template,
    file_template,
};
