import { bot_template } from "../index"
import { ERROR_CODE, ErrMsg, ErrorHandler } from "../../../../lib/error_handler"
import { convertMessageContext } from "../../telegram.lib"
import { handleInvalidCacheUserSetting, isCacheUserSettingFieldsMissing } from '../helper_bot'
import { getDataUserCache } from "../telegram_cache/cache.data_user"

const methodCommand = {
}

const handleBotCommand = () => {
    const { tele_bot, setLastMessageReceivedDate, messageInQueue, isBotReadyToStart, bot_start_at, ConvertTeleError, bot_script } = bot_template
    const dataCommand = bot_script.all_commands()
    dataCommand.forEach(data => {
        const { command } = data
        tele_bot.command(command, async (ctx) => {
            setLastMessageReceivedDate()
            const dataConvertContext = convertMessageContext(ctx)
            const { chatId, userId, username, timeInSec } = dataConvertContext
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
                ErrorHandler(error, { chatId, userId }, handleBotCommand.name)
                ConvertTeleError(error, {
                    context_id: chatId,
                })
            }
        })
    })
}

export {
    handleBotCommand
}
