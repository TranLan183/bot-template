import { BotCommand } from "telegraf/typings/core/types/typegram"
import { game_bot } from ".."
import { ERROR_CODE, ErrMsg, ErrorHandler } from "../../../../lib/error_handler"
import { ConvertTeleError } from "../../telegram.error"
import { convertMessageContext } from "../../telegram.lib"
import { TCacheDataUser, TDataContext } from "../../telegram.type"
import { handleInvalidCacheUserStorage } from '../helper_bot'
import { getUserStorage } from "../telegram_cache/cache.telegram_user_storage"
import { TTemplateLanguage } from "../../telegram_template/type"

const all_commands = (language: TTemplateLanguage = 'en'): BotCommand[] => {
    const commands: BotCommand[] = [
        {
            command: "test",
            description: "test"
        },
        {
            command: 'total_members',
            description: "total members"
        }
    ]
    return commands
}

const methodCommand = {
    test: (dataContext: TDataContext, dataCacheUser: TCacheDataUser) => {
        return
    },
    total_members: async (dataContext: TDataContext, dataCacheUser: TCacheDataUser) => {
        return
    }
}

const handleBotCommand = () => {
    const dataCommand = all_commands()
    dataCommand.forEach(data => {
        const { command } = data
        game_bot.command(command, async (ctx) => {
            const dataConvertContext = convertMessageContext(ctx)
            const { chatId, userId, username } = dataConvertContext
            try {
                let dataCacheUser = await getUserStorage(userId)
                if (!dataCacheUser) dataCacheUser = await handleInvalidCacheUserStorage(userId, username)
                if (!('keyCommand' in dataConvertContext)) throw ErrMsg(ERROR_CODE.COMMAND_INVALID_ARGUMENTS)
                methodCommand[command](dataConvertContext, dataCacheUser)
            } catch (error) {
                ErrorHandler(error, { chatId, userId }, handleBotCommand.name)
                ConvertTeleError(error, game_bot, chatId)
            }
        })
    })
}

export {
    all_commands,
    handleBotCommand
}
