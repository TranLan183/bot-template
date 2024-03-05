import { tele_bot } from "..";
import { ErrorHandler } from "../../../../lib/error_handler";
import { ConvertTeleError } from "../../telegram.error";
import { convertMessageContext } from "../../telegram.lib";
import { TMessageContext } from "../../telegram.type";
import { getDataUserCache } from "../telegram_cache/cache.data_user";
import { start_handler } from "./start_handler";

const listenToHandleStart = async (ctx: TMessageContext) => {
    const { userId, chatId, chatType } = convertMessageContext(ctx)
    try {
        const dataUserStorage = await getDataUserCache(userId)
        if (chatType === "group" || chatType === "supergroup") {
            return
        }
        start_handler(ctx, dataUserStorage || undefined)
    } catch (error) {
        ErrorHandler(error, { userId, chatId, chatType }, handleBotStart.name)
        ConvertTeleError(error, tele_bot, chatId)
    }
}

export const handleBotStart = () => tele_bot.start(async (ctx) => await listenToHandleStart(ctx))