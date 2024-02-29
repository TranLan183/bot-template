import { Steps, game_bot } from ".."
import { ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { TCacheDataUser, TDataContext } from "../../telegram.type"
import { handleInvalidCacheUserStorage } from "../helper_bot"

export const start_continue_handler = async (dataContext: TDataContext, user_cache?: TCacheDataUser) => {
    const { userId, username, chatId, startPayload } = dataContext
    let dataUserStorage = user_cache
    if (!dataUserStorage) dataUserStorage = await handleInvalidCacheUserStorage(userId, username)
    const { user_step, language } = dataUserStorage
    try {
        switch (user_step) {
            case Steps.finish: {

                break
            }
            default:
                break
        }
    } catch (e) {
        ErrorHandler(e, { userId, username, chatId }, start_continue_handler.name)
        ConvertTeleError(e, game_bot, chatId, language)
    }
}