import { BotCommand, InlineKeyboardButton } from 'telegraf/types'
import { TelegramBotInlineKeyBoard } from "../../../lib/telegram/inline_keyboard"
import { EFlag, TelegramBotTemplate } from "../../../lib/telegram/template"
import { ITelegramConfig, TCustomInlineKeyboardParams, TFileTemplate, TTemplateLanguage } from "../../../lib/telegram/type"
import { BotReplyMarkup, BotTemplateType } from "./type"

class TelegramConfig extends TelegramBotTemplate<BotReplyMarkup, BotTemplateType> implements ITelegramConfig<BotReplyMarkup, BotTemplateType> {

    private callback_data = {
        unknown_callback: 'unknown_callback',
        test: 'test',
        btn_switch_language: 'btn_switch_language'
    }

    private customInlineKeyboard = (params: TCustomInlineKeyboardParams) => {
        const { arr_message, callback_key, current_value, current_index, extra_callback_key } = params
        let keyboardDefault: InlineKeyboardButton = { text: current_value, callback_data: `${callback_key}&${current_value}` }
        switch (callback_key) {
            case this.callback_data.btn_switch_language: {
                const flag = current_value.split(' ')[0]
                keyboardDefault.callback_data = `${callback_key}&${EFlag[flag]}&${flag}`
                break
            }
            default:
                break
        }
        return keyboardDefault
    }

    constructor(file_template: TFileTemplate, default_language: TTemplateLanguage = 'en') {
        super(file_template, default_language)
    }

    private CustomTelegramKeyboard = new TelegramBotInlineKeyBoard(this.template_message, this.customInlineKeyboard, this.callback_data)
    private handleMultipleInlineKeyBoard = this.CustomTelegramKeyboard.handleMultipleInlineKeyBoard
    private handlePaginationInlineKeyBoard = this.CustomTelegramKeyboard.handlePaginationInlineKeyBoard


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
                        ...this.handleMultipleInlineKeyBoard({
                            template: 'btn_switch_language',
                            callback_key: this.callback_data.btn_switch_language,
                            language
                        }),
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
