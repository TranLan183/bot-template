import { bot_template } from "../.."
import { TDataContext } from "../../../../../lib/telegram/type"
import { TUserSetting } from "../../telegram_cache/cache.data_user"

export const handlePublicChat = async (dataMessageContext: TDataContext, dataUserSetting: TUserSetting) => {
    const { message, userId, username, chatId } = dataMessageContext
    const { ConvertTeleError } = bot_template
    const { language } = dataUserSetting
    try {
        // console.log(dataMessageContext);
        return
    } catch (error) {
        ConvertTeleError(error, { context_id: chatId, language }, handlePublicChat.name)
    }
}