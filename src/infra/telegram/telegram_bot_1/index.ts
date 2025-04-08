import { REDIS_DB_NUMBER, REDIS_URI } from "../../../config"
import { file_template } from "../telegram_bot"
import { TelegramBotConfigCache } from "../telegram_bot/cache/cache.user_setting"
import { TeleBotErrorList, TeleBotErrorListLifeTime } from "../telegram_bot/error_list"
import { TelegramBotConfigTemplate } from "../telegram_bot/template"
import { TelegramBotService } from "../telegrot"

const bot_example_1 = new TelegramBotService({
    bot_name: "test_bot_1",
    bot_token: '5917559991:AAH4SfG-QGeMKI0OscyikKMSj0c3LU8kHHM',
    is_enable: true,
    bot_config: {
        template: new TelegramBotConfigTemplate(file_template),
        cache: new TelegramBotConfigCache("test_bot_1", REDIS_URI, REDIS_DB_NUMBER)
    },
    bot_error_list: [TeleBotErrorList, TeleBotErrorListLifeTime],
}, {

}, (bot_method) => {
    // handleBotStart(bot_method)
    // handleBotHelp(bot_method)
    // handleBotCommand(bot_method)
    // handleBotAction(bot_method)
    // handleBotMessage(bot_method)
    // handleBotInlineMode(bot_method)
})

export {
    bot_example_1
}