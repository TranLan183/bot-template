import { initRedis } from '../infra/cache/redis';
import { handMultipleInlineKeyBoard } from '../infra/telegram/telegram.lib';
import { initTelegramTplantBot } from '../infra/telegram/telegram_tplant_bot';

const test = async () => {
    await initRedis()
    initTelegramTplantBot()
}
test()