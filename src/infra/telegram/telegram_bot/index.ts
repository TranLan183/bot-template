import { Telegraf } from "telegraf";
import { TTelegramBot } from "../telegram_bot";
import { ENABLE_TELEGRAM, isProductionRun, TELEGRAM_BOT_NAME, TELEGRAM_BOT_TOKEN, TG_BOT_IS_USE_LOCAL_TELEGRAM, TG_BOT_IS_USE_WEBHOOK, TG_BOT_LOCAL_TELEGRAM_URL, TG_BOT_WEBHOOK_PORT, TG_BOT_WEBHOOK_URL } from "../../../config";
import { TelegramBotScript } from "../telegram_script";
import { TeleConfigBotTemplate } from "./config_bot_script";
import { handleBotStart } from "./telegram_start";
import { handleBotHelp } from "./telegram_help";
import { handleBotCommand } from "./telegram_command";
import { handleBotAction } from "./telegram_action";
import { handleBotMessage } from "./telegram_message";
import { handleBotInlineMode } from "./telegram_inline_query";

const bot_template = new TTelegramBot({
    bot_name: TELEGRAM_BOT_NAME,
    bot_token: TELEGRAM_BOT_TOKEN,
    is_enable: ENABLE_TELEGRAM,
    bot_error_list: [],
    bot_script: (tele_bot: Telegraf) => new TelegramBotScript(new TeleConfigBotTemplate(tele_bot)),
}, {
    is_use_local_telegram: TG_BOT_IS_USE_LOCAL_TELEGRAM,
    is_use_webhook: TG_BOT_IS_USE_WEBHOOK,
    delay_bot_start: isProductionRun ? 10000 : 2000,
    webhook_url: TG_BOT_WEBHOOK_URL,
    webhook_port: TG_BOT_WEBHOOK_PORT,
    local_telegram_url: TG_BOT_LOCAL_TELEGRAM_URL
},
    () => {
        handleBotStart()
        handleBotHelp()
        handleBotCommand()
        handleBotAction()
        handleBotMessage()
        handleBotInlineMode()
    })

export {
    bot_template
}