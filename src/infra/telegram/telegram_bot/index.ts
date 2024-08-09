import { Telegraf } from "telegraf";


const { TG_SCAN_BOT_IS_USE_WEBHOOK, TG_SCAN_BOT_IS_USE_LOCAL_TELEGRAM, TELEGRAM_SCAN_BOT_TOKEN, TELEGRAM_SCAN_BOT_NAME, TG_SCAN_BOT_WEBHOOK_URL, TG_SCAN_BOT_WEBHOOK_PORT, TG_SCAN_BOT_LOCAL_TELEGRAM_URL } = AppEnvConfig.app.scan_bot

const tele_scan_bot = new TTelegramBot({
    bot_name: TELEGRAM_SCAN_BOT_NAME,
    bot_token: TELEGRAM_SCAN_BOT_TOKEN,
    is_enable: AppEnvConfig.app.tg.ENABLE_TELEGRAM,
    bot_error_list: [TeleBotScanErrorList],
    bot_script: (tele_bot: Telegraf) => new TelegramBotScript(new TelegramConfigBotScan(tele_bot, 'scan_bot')),
}, {
    is_use_local_telegram: TG_SCAN_BOT_IS_USE_LOCAL_TELEGRAM,
    is_use_webhook: TG_SCAN_BOT_IS_USE_WEBHOOK,
    delay_bot_start: AppEnvConfig.common.isProductionRun ? 10000 : 2000,
    webhook_url: TG_SCAN_BOT_WEBHOOK_URL,
    webhook_port: TG_SCAN_BOT_WEBHOOK_PORT,
    local_telegram_url: TG_SCAN_BOT_LOCAL_TELEGRAM_URL
},
    () => {
        // handleBotStart()
        // handleBotHelp()
        // handleBotCommand()
        // handleBotAction()
        // handleBotMessage()
        // handleBotInlineMode()
    })

export {
    tele_scan_bot
}