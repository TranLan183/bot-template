import { Context } from "telegraf"
import { ERROR_CODE, ErrMsg, ErrorHandler } from "../../../../lib/error_handler"
import { convertMessageContext } from "../../telegrot/utils"
import { handleInvalidCacheUserSetting, isCacheUserSettingFieldsMissing } from '../helper_bot'
import { BotServiceType } from "../type"

const methodCommand = {

}

const handleToListenCommand = async (ctx: Context, bot_method: BotServiceType, command: string) => {
    const { setLastMessageReceivedDate, messageInQueue, isBotReadyToStart, bot_start_at, ConvertTeleError, bot_script } = bot_method
    setLastMessageReceivedDate()
    const dataConvertContext = convertMessageContext(ctx)
    const { chatId, userId, timeInSec } = dataConvertContext
    if (timeInSec < (bot_start_at.getTime() / 1000)) return
    if (!isBotReadyToStart()) {
        messageInQueue.set(chatId, { type: "command", ctx: dataConvertContext })
        return
    }
    let dataUserSetting = await bot_script.cache.user_setting.getUserSetting(userId)
    try {
        if (!dataUserSetting || isCacheUserSettingFieldsMissing(dataUserSetting)) dataUserSetting = await handleInvalidCacheUserSetting(bot_method, userId)
        if (!('keyCommand' in dataConvertContext)) throw ErrMsg(ERROR_CODE.COMMAND_INVALID_ARGUMENTS)
        methodCommand[command](dataConvertContext, bot_method, dataUserSetting)
    } catch (error) {
        ErrorHandler(error, { chatId, userId }, handleBotCommand.name)
        ConvertTeleError(error, { context_id: chatId, language: dataUserSetting?.language })
    }
}

const handleBotCommand = (bot_method: BotServiceType) =>
    bot_method.bot_script.all_commands().forEach(({ command }) =>
        bot_method.tele_bot.command(command, ctx => handleToListenCommand(ctx, bot_method, command))
    )

export {
    handleBotCommand
}