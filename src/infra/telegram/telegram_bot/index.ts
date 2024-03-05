import { Telegraf } from "telegraf"
import { ENABLE_TELEGRAM, TELEGRAM_GAME_NAME, TELEGRAM_TPLANT_BOT_NAME, TELEGRAM_TPLANT_BOT_TOKEN, } from "../../../config"
import { successConsoleLog } from "../../../lib/color-log"
import { ErrorHandler } from "../../../lib/error_handler"
import { handleBotAction } from "./telegram_action"
import { handleBotMessage } from "./telegram_message"
import { handleBotStart } from "./telegram_start"
import { handleBotInlineMode } from "./telegram_inline_query"
import { SetCommandsByBot } from "../telegram.lib"
import { all_commands, handleBotCommand } from "./telegram_command"

const Steps = {
    welcome: "welcome",
    finish: "finish",
}

const tele_bot = new Telegraf(TELEGRAM_TPLANT_BOT_TOKEN)

const initTelegramTplantBot = async () => {
    try {
        if (ENABLE_TELEGRAM) {
            SetCommandsByBot(tele_bot, all_commands())
            handleBotStart()
            handleBotCommand()
            handleBotAction()
            handleBotMessage()
            handleBotInlineMode()
            successConsoleLog(`🚀 Telegram bot ${TELEGRAM_TPLANT_BOT_NAME}: ready`)
            await tele_bot.launch()
        } else {
            console.log(`Disable Telegram Bot ... To open please change env ENABLE_TELEGRAM to true`)
        }
    } catch (e) {
        console.log(`initTelegramBotMarket error!`)
        ErrorHandler(e, {}, initTelegramTplantBot.name)
        await tele_bot.launch()
    }
}

export {
    Steps,
    initTelegramTplantBot, tele_bot
}

