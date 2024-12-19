import { initRedis } from "../infra/cache/redis"
import { bot_template } from "../infra/telegram/telegram_bot/index"

const test = async () => {

    await initRedis()
    bot_template.init()
    // const data = await bot_template.tele_bot.telegram.sendMessage('5196685279', 'test', {
    //     disable_notification: false,
    //     parse_mode: 'Markdown',
    //     link_preview_options: {
    //         is_disabled: true
    //     },
    // })
    // console.log(data);
    bot_template.bot_script.sendMessage('5196685279', {
        template: 'welcome',
        reply_markup: 'force_reply',
        parse_mode: true
    })
}

// test()
