import { file_template } from "."
import { TelegramBotService } from "../telegrot"
import { TDefaultReplyMarkup, TReplyMarkup ,TCacheDataUser} from "../telegrot/type"

type BotReplyMarkup = TDefaultReplyMarkup & {
    welcome: () => TReplyMarkup
    reply_btn_kb_inline_keyboard: () => TReplyMarkup
}

type BotTemplate = keyof typeof file_template.en

type TUserSetting = TCacheDataUser & {
    createAt?: number
}

type BotServiceType = TelegramBotService<BotReplyMarkup, BotTemplate, TUserSetting>

export {
    BotReplyMarkup,
    BotServiceType,
    BotTemplate,
    TUserSetting
}