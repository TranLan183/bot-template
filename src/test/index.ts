import { initRedis } from "../infra/cache/redis"
import { TeleConfigBotTemplate } from "../infra/telegram/telegram_bot/config_bot_script"
import { bot_template } from "../infra/telegram/telegram_bot/index"
import en from '../infra/telegram/telegram_bot/telegram_language/en.json'
const test = async () => {

    await initRedis()
    bot_template.init()

    const data = new TeleConfigBotTemplate({ en })
    console.log(JSON.stringify(data.reply_markup().welcome()));
}

test()
