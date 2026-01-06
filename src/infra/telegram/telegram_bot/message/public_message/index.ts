import { Context } from "telegraf"
import { convertMessageContext } from "../../../../../lib/telegram/utils"
import { TUserSetting } from "../../cache/cache.data_user"
import { BotTemplateServiceType } from "../../type"

export const handlePublicChat = async (ctx: Context, bot_method: BotTemplateServiceType, dataUserSetting: TUserSetting) => {
    const { ConvertTeleError } = bot_method
    const { message, userId, username, chatId } = convertMessageContext(ctx)
    const { language } = dataUserSetting
    try {
        // console.log(dataMessageContext);
        return
    } catch (error) {
        ConvertTeleError(error, { context_id: chatId, language }, handlePublicChat.name)
    }
}