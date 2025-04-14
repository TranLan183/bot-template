import { file_template } from "."
import { TelegramBotService } from "../telegrot"
import { TDefaultReplyMarkup, TReplyMarkup, TCacheDataUser, ITelegramCache } from "../telegrot/type"
import { TelegramBotConfigCacheDate } from "./cache/cache.date"
import { TelegramBotConfigCache } from "./cache/cache.user_setting"

type BotReplyMarkup = TDefaultReplyMarkup & {
    welcome: () => TReplyMarkup
    reply_btn_kb_inline_keyboard: () => TReplyMarkup
}

type BotTemplate = keyof typeof file_template.en

type TUserSetting = TCacheDataUser & {
    createAt?: number
}
 
interface BotCache {
    user_setting: TelegramBotConfigCache
    date: TelegramBotConfigCacheDate
}


type BotServiceType = TelegramBotService<BotReplyMarkup, BotTemplate, BotCache>



export {
    BotReplyMarkup,
    BotServiceType,
    BotTemplate,
    TUserSetting
}