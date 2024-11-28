import { BotCommand, BotCommandScope, InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { ELifetime, ITelegramConfig, TOptionSendAnswerCbQuery, TOptionSendBufferPhoto, TOptionSendMessage, TOptionSendUrlPhoto, TTemplateMessageConfig } from './type';
import { MILLISECOND_PER_ONE_SEC } from '../../../lib/constants';

class TelegramBotScript<GReplyMarkup, GTemplate> {
    constructor(private configBot: ITelegramConfig<GReplyMarkup, GTemplate>) { }
    private _bot_tele = this.configBot.bot_tele
    public templateMessage = this.configBot.template_message
    public entities_message = this.configBot.message_entities
    public replyMarkup = this.configBot.reply_markup
    public all_commands = this.configBot.all_commands

    private setLifeTime = (chat_id: string | number, message_id: number, life_time: ELifetime) => {
        let result_lifetime_num: number = 0
        switch (life_time) {
            case 'long':
                result_lifetime_num = 30
                break;
            case 'medium':
                result_lifetime_num = 15
                break;
            case 'short':
                result_lifetime_num = 5
                break;
            default:
                result_lifetime_num = life_time
                break;
        }
        setTimeout(() => this.deleteMessage(chat_id, message_id), result_lifetime_num * MILLISECOND_PER_ONE_SEC);
    }

    sendMessage = async (chat_id: string | number, options: TOptionSendMessage<GTemplate>) => {
        const { template, language, parse_mode, reply_markup, args, message_id, life_time } = options
        const resultMessage = await this._bot_tele.telegram.sendMessage(chat_id, this.templateMessage(options), {
            link_preview_options: {
                is_disabled: true
            },
            parse_mode: parse_mode ? typeof parse_mode === 'boolean' ? 'Markdown' : parse_mode : undefined,
            reply_markup: reply_markup ? typeof reply_markup === 'boolean' ? this.configBot.reply_markup(language)[template as unknown as string](args) : reply_markup === 'force_reply' ? this.configBot.reply_markup(language)['force_reply']() : reply_markup : undefined,
            reply_parameters: message_id ? { message_id } : undefined,
        });
        if (life_time) this.setLifeTime(chat_id, resultMessage.message_id, life_time)
        return resultMessage;
    }

    sendAnswerCbQuery = (callbackQueryId: string, options: TOptionSendAnswerCbQuery<GTemplate>) => {
        return this._bot_tele.telegram.answerCbQuery(callbackQueryId, this.templateMessage(options), options)
    }

    sendBufferPhoto = async (chat_id: string | number, options: TOptionSendBufferPhoto<GTemplate>) => {
        const { life_time, source, reply_markup, callback } = options
        const img_msg_data = await this._bot_tele.telegram.sendPhoto(chat_id,
            {
                source,
            },
            {
                caption: this.templateMessage(options) + (life_time ? `\n\n_Note: This message will disappear after ${life_time} seconds_` : ""),
                parse_mode: "Markdown",
                reply_markup,
            }
        );
        if (life_time) {
            setTimeout(() => this._bot_tele.telegram.deleteMessage(chat_id, img_msg_data.message_id), life_time * MILLISECOND_PER_ONE_SEC);
        }
        callback(img_msg_data);
    }

    sendUrlPhoto = async (chat_id: string | number, options: TOptionSendUrlPhoto<GTemplate>) => {
        const { life_time, url, reply_markup, callback } = options
        const img_msg_data = await this._bot_tele.telegram.sendPhoto(chat_id,
            {
                url,
            },
            {
                caption: this.templateMessage(options) + (life_time ? `\n\n_Note: This message will disappear after ${life_time} seconds_` : ""),
                parse_mode: "Markdown",
                reply_markup
            }
        );
        if (life_time) {
            setTimeout(() => this.deleteMessage(chat_id, img_msg_data.message_id), life_time * MILLISECOND_PER_ONE_SEC);
        }
        callback(img_msg_data);
    }

    editMessage = (chat_id: string | number, message_id: number, options: TOptionSendMessage<GTemplate>) => {
        const { template, language, parse_mode, reply_markup, args, life_time } = options
        const resultEditMessage = this._bot_tele.telegram.editMessageText(chat_id, message_id, undefined, this.templateMessage(options), {
            link_preview_options: {
                is_disabled: true
            },
            parse_mode: parse_mode ? typeof parse_mode === 'boolean' ? 'Markdown' : parse_mode : undefined,
            reply_markup: reply_markup ? typeof reply_markup === 'boolean' ? this.replyMarkup(language)[template as unknown as string](args) : reply_markup === 'force_reply' ? this.configBot.reply_markup(language)['force_reply']() : reply_markup : undefined
        })
        if (life_time) this.setLifeTime(chat_id, message_id, life_time)
        return resultEditMessage
    }

    editMessageReplyMarkup = (chat_id: string | number, message_id: number, markup: InlineKeyboardMarkup) => {
        return this._bot_tele.telegram.editMessageReplyMarkup(chat_id, message_id, undefined, markup).catch((err) => console.log(err))
    }

    editMessageCaption = (chat_id: string | number, message_id: number, message: string) => {
        return this._bot_tele.telegram.editMessageCaption(chat_id, message_id, undefined, message).catch((err) => console.log(err))
    }

    deleteMessage = (chat_id: string | number, message_id: number) => {
        return this._bot_tele.telegram.deleteMessage(chat_id, message_id).catch(err => console.log(err))
    }

    setCommands = (data_command: BotCommand[], scope?: BotCommandScope) => {
        const commandScope = scope ? { scope } : undefined
        this._bot_tele.telegram.setMyCommands(data_command, commandScope)
    }

    setDescription = (params: TTemplateMessageConfig<GTemplate>) => {
        return this._bot_tele.telegram.setMyDescription(this.templateMessage(params))
    }

    setShortDescription = (params: TTemplateMessageConfig<GTemplate>) => {
        return this._bot_tele.telegram.setMyShortDescription(this.templateMessage(params))
    }
}

export {
    TelegramBotScript
};

