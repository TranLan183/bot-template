import { tele_bot } from ".."
import { ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { convertMessageContext } from "../../telegram.lib"
import { TMessageContext } from "../../telegram.type"
import { handleInvalidCacheUserStorage } from "../helper_bot"
import { getDataUserCache } from "../telegram_cache/cache.data_user"
import { handlePrivateChat } from "./private_message"
import { handlePublicChat } from "./public_message"

const listenMessageToHandleChatType = async (ctx: TMessageContext) => {
    const dataMessageContext = convertMessageContext(ctx)
    const { chatType, chatId, message, userId, username } = dataMessageContext
    let dataUserStorage = await getDataUserCache(userId)
    if (!dataUserStorage) dataUserStorage = await handleInvalidCacheUserStorage(userId, username)
    const { language } = dataUserStorage
    try {
        switch (chatType) {
            case "group":
            case "supergroup":
                await handlePublicChat(dataMessageContext, dataUserStorage)
                break;
            case "channel":
                break;
            default:
                await handlePrivateChat(dataMessageContext, dataUserStorage)
                break;
        }
    } catch (error) {
        ErrorHandler(error, { chatId, userId, message }, listenMessageToHandleChatType.name)
        ConvertTeleError(error, tele_bot, chatId, language)
    }
}

export const handleBotMessage = () => tele_bot.on("message", (ctx) => listenMessageToHandleChatType(ctx))