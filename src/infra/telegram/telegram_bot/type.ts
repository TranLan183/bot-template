import { file_template } from "."
import { TelegramBotService } from "../telegrot"
import { TDefaultReplyMarkup, TReplyMarkup } from "../telegrot/type"


type BotReplyMarkup = TDefaultReplyMarkup & {
    welcome: () => TReplyMarkup
    reply_btn_kb_inline_keyboard: () => TReplyMarkup
}

type BotTemplate = keyof typeof file_template.en

type BotServiceType = TelegramBotService<BotReplyMarkup, BotTemplate>

export {
    BotReplyMarkup,
    BotServiceType,
    BotTemplate
}