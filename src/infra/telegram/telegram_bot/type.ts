import { TDefaultReplyMarkup, TReplyMarkup } from "../../../lib/telegram/type"
import { TelegramBotService } from "../../../lib/telegram"
import { file_template } from "."


type BotReplyMarkup = TDefaultReplyMarkup & {
    welcome: () => TReplyMarkup
}

type BotTemplateType = keyof typeof file_template.en

type BotTemplateServiceType = TelegramBotService<BotReplyMarkup, BotTemplateType>

export {
    BotReplyMarkup,
    BotTemplateServiceType,
    BotTemplateType
}