import { bot_template } from "../index"
import { ERROR_CODE, ErrMsg, ErrorHandler } from "../../../../lib/error_handler"
import { convertMessageContext } from "../../../../lib/telegram/utils"
import { handleInvalidCacheUserSetting, isCacheUserSettingFieldsMissing } from '../helper'
import { getDataUserCache } from "../cache/cache.data_user"
import { BotTemplateServiceType } from "../type"
import { Context } from "telegraf"

const methodCommand = {
}

const handleListenCommand = async (ctx: Context, bot_method: BotTemplateServiceType, command: string) => {
    const { setLastMessageReceivedDate, messageInQueue, isBotReadyToStart, bot_start_at, ConvertTeleError, bot_script } = bot_method
    setLastMessageReceivedDate()
    const dataConvertContext = convertMessageContext(ctx)
    const { chatId, userId, timeInSec } = dataConvertContext
    if (timeInSec < (bot_start_at.getTime() / 1000)) return
    if (!isBotReadyToStart()) {
        messageInQueue.set(chatId, { type: "command", ctx: dataConvertContext })
        return
    }
    try {
        let dataUserSetting = await getDataUserCache(userId)
        if (!dataUserSetting || isCacheUserSettingFieldsMissing(dataUserSetting)) dataUserSetting = await handleInvalidCacheUserSetting(userId)
        if (!('keyCommand' in dataConvertContext)) throw ErrMsg(ERROR_CODE.COMMAND_INVALID_ARGUMENTS)
        methodCommand[command](dataConvertContext, dataUserSetting)
    } catch (error) {
        ConvertTeleError(error, { context_id: chatId, }, handleBotCommand.name)
    }
}

const handleBotCommand = (bot_method: BotTemplateServiceType) => {
    const { all_commands } = bot_method.bot_script
    all_commands().forEach(({ command }) => bot_method.tele_bot.command(command, ctx => handleListenCommand(ctx, bot_method, command)))
}

export {
    handleBotCommand
}
