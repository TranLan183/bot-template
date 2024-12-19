import { BotCommand, InlineKeyboardButton } from "telegraf/typings/core/types/typegram"
import { TelegramBotInlineKeyBoard } from "../telegrot/inline_keyboard"
import { TelegramBotTemplate } from "../telegrot/template"
import { ITelegramConfig, TCustomInlineKeyboardParams, TFileTemplate, TTemplateLanguage } from "../telegrot/type"
import { TTemplate } from "./index"
import { BotReplyMarkup } from "./type"

class TelegramConfig extends TelegramBotTemplate<BotReplyMarkup, TTemplate> implements ITelegramConfig<BotReplyMarkup, TTemplate> {
    constructor(file_template: TFileTemplate, default_language: TTemplateLanguage = 'en') {
        super(file_template, default_language)
    }
    private callback_data = {
        unknown_callback: 'unknown_callback',
    }

    private customInlineKeyboard = (params: TCustomInlineKeyboardParams) => {
        const { arr_message, callback_key, current_value, current_index, extra_callback_key } = params
        let keyboardDefault: InlineKeyboardButton = { text: current_value, callback_data: `${callback_key}&${current_value}` }
        switch (callback_key) {
            default:
                break
        }
        return keyboardDefault
    }

    private H = new TelegramBotInlineKeyBoard(this.template_message, this.customInlineKeyboard, this.callback_data)
    private handleMultipleInlineKeyBoard = this.H.handleMultipleInlineKeyBoard
    private handlePaginationInlineKeyBoard = this.H.handlePaginationInlineKeyBoard


    all_commands: (language?: TTemplateLanguage) => BotCommand[] = (language = this.default_language) => {
        const commands: BotCommand[] = [

        ]
        return commands
    }

    reply_markup(language?: TTemplateLanguage): BotReplyMarkup {
        const dataReplyMarkup: BotReplyMarkup = {
            ...super.reply_markup(),
            welcome: () => {
                return {
                    inline_keyboard: [
                        [
                            { text: this.template_message({ template: 'test' }), callback_data: 'test' }
                        ]
                    ]
                }
            },
        }
        return dataReplyMarkup
    }
}

export {
    TelegramConfig as TeleConfigBotTemplate
}
