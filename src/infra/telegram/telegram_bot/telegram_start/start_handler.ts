import { tele_bot } from ".."
import { ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { convertMessageContext } from "../../telegram.lib"
import { TCacheDataUser, TMessageContext } from "../../telegram.type"
import { verify_welcome_handler } from "../telegram_verify/verify.welcome_handler"

export const start_handler = async (ctx: TMessageContext, user_cache?: TCacheDataUser) => {
    const dataMessageContext = convertMessageContext(ctx)
    const { userId, chatId, username } = dataMessageContext
    try {
        console.table({ userId, username, command: '/Start' })
        // const message = getTemplateMessage("start_welcome", { gameName: TELEGRAM_GAME_NAME }, user_cache?.language)
        // SendMessageByBot(game_bot, chatId, message)
        // if (user_cache?.user_step) {
        //     await start_continue_handler(dataMessageContext, user_cache)
        //     return
        // }
        await verify_welcome_handler(dataMessageContext, user_cache?.language)
    } catch (e) {
        ErrorHandler(e, { userId, chatId }, start_handler.name)
        ConvertTeleError(e, tele_bot, chatId, user_cache?.language)
    }
}
