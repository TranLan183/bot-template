import { tele_bot } from '..';
import { ErrorHandler } from '../../../../lib/error_handler';
import { mongo } from '../../../database/mongo/mongo';
import { ConvertTeleError } from '../../telegram.error';
import { SendMessageByBot } from '../../telegram.lib';
import { TDataContext } from '../../telegram.type';
import { bot_script } from '../../telegram_script';
import { TTemplateLanguage } from '../../telegram_script/type';

export const verify_welcome_handler = async (dataContext: TDataContext, language?: TTemplateLanguage) => {
    // const session = mongo.startSession()
    const { userId, chatId, userFullName, startPayload } = dataContext
    try {

    } catch (e) {
        // if (session?.inTransaction()) await session.abortTransaction()
        ErrorHandler(e, { userId, userFullName, chatId }, verify_welcome_handler.name)
        ConvertTeleError(e, tele_bot, chatId, language)
    }
    // finally {
    //     await session.endSession()
    // }
}