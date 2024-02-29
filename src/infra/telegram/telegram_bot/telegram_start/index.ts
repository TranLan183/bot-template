import { tele_bot } from "..";
import { ErrorHandler } from "../../../../lib/error_handler";
import { ConvertTeleError } from "../../telegram.error";
import { convertMessageContext } from "../../telegram.lib";
import { getUserStorage } from "../telegram_cache/cache.telegram_user_storage";
import { start_handler } from "./start_handler";

export const handleBotStart = () => {
    tele_bot.start(async (ctx) => {
        const { userId, chatId } = convertMessageContext(ctx)
        try {
            const dataUserStorage = await getUserStorage(userId)
            if (ctx.message.chat.type === "group" || ctx.message.chat.type === "supergroup") {
                return
            }
            await start_handler(ctx, dataUserStorage || undefined)
        } catch (error) {
            ErrorHandler(error, {}, handleBotStart.name)
            ConvertTeleError(error, tele_bot, chatId)
        }
    })
}