import { InlineQueryResult } from "telegraf/typings/core/types/typegram";
import { game_bot } from "..";
import { convertInlineContext } from "../../telegram.lib";

export const handleBotInlineMode = () => {
    game_bot.on('inline_query', async (ctx) => {
        // console.log(JSON.stringify(ctx));
        const { } = convertInlineContext(ctx)
        const result: InlineQueryResult[] = [
            // {
            //     type: 'photo',
            //     id: 'image_test',
            //     photo_url: 'https://res.cloudinary.com/dfxltugeh/image/upload/v1704884542/t-dragon/tele_vscyvj.png',
            //     thumbnail_url: 'https://res.cloudinary.com/dfxltugeh/image/upload/v1704884542/t-dragon/tele_vscyvj.png',
            //     reply_markup: {
            //         inline_keyboard: [
            //             [
            //                 { text: 'play', callback_data: 'test' }
            //             ],
            //         ],
            //     }
            // }
        ]
        await ctx.answerInlineQuery(result)
    });
}