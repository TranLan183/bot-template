import { tele_bot } from ".."
import { LINK_DAPP_TELEGRAM } from "../../../../config"
import { ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { convertActionContext } from "../../telegram.lib"
import { handleInvalidCacheUserStorage } from "../helper_bot"
import { getUserStorage } from "../telegram_cache/cache.data_user"

const methodAction = {
}

export const handleBotAction = () => {
    tele_bot.on('callback_query', async (ctx) => {
        const { callbackData, userId, callbackId, gameInfo, gameShortName, username } = convertActionContext(ctx);
        try {
            let dataUserStorage = await getUserStorage(userId)
            if (!dataUserStorage) dataUserStorage = await handleInvalidCacheUserStorage(userId, username)
            if (gameInfo && gameShortName) {
                await ctx.telegram.answerCbQuery(callbackId, undefined, {
                    url: `${LINK_DAPP_TELEGRAM}/game`
                })
            } else {
                const [keyCallback] = callbackData.split('&')
                if (methodAction[keyCallback]) await methodAction[keyCallback](ctx, dataUserStorage)
                await ctx.telegram.answerCbQuery(callbackId)
            }
        } catch (error) {
            ErrorHandler(error, { callbackData, userId }, handleBotAction.name)
            ConvertTeleError(error, tele_bot, callbackId)
        }
    });
}