import { game_bot } from '../infra/telegram/telegram_tplant_bot';

const getChatMember = async () => {
    try {
        const data = await game_bot.telegram.getChatMember('@SunIO_Defi', 5196685279)
        // const data = await game_bot.telegram.getChatMember('@testbot_channel_3', 1574718703)
        // const data = await game_bot.telegram.getChat('@stUSDTofficial')
        return data
    } catch (e) {
        console.log(e)
    }
}

const test = async () => {
    const data = await getChatMember()
    console.log(data);
}

test()
