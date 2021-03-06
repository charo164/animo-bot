module.exports = {
  commands: {
    TOPUPCOMING_C: '/topupcoming',
    TOPAIRING_C: '/topairing',
    TOPMOVIE_C: '/topmovie',
    TOPTV_C: '/toptv',
    TOPOVA_C: '/topova',
    TOPSPECIAL_C: '/topspecial',
    FAVORITES_C: '/favorites',
    SEARCH_C: '/search',
    ANIME_C: '/anime',
    START_C: '/start',
    TRAILER_C: '/trailer',
    ALL_SYNOPSIS_C: '/allsynopsis',
    HELP_C: '/help',
    STOP_C: '/stop',
    EMPTY_C: '/empty',
    WALLPAPER_C: '/wallpaper',
    RANDOM_WALLPAPERS_C: '/randomwallpaper',
  },
  msg: {
    DONE_MSG: 'Done 👌',
    FAVORITE_TITLE_MSG: '\n\n🗑 /empty_favorites',
    EMPTY_FAVORITES_MSG: "You haven't saved a favorites 🌵",
    NO_TRAILER_MSG: 'No trailer found 🌵',
    NO_ANIME_MSG: 'No anime found 🌵',
    NO_UNDERSTAND_MSG: 'Sorry 🙁, can’t understand your command.\nDo you need /help❔',
    WAIT_MSG: 'Please wait... 🕐',
    FEEDBACK_MSG: 'Was I useful to you❔',
    WATCH_EMPTY_NAME_MSG:
      'Please specify a longer name after <code>/watch</code> command\ne.g : <code>/watch</code> dragon ball',
    NO_FEEDBACKS: 'No feedbacks',
    TRY_AGAIN: 'Try again',
    NOT_YET_REGISTERED_MSG: 'You are not yet registered. /start',
    ARE_SURE_LEAVE: 'Are you sure you want to leave me? 😢',
    SEARCH_ERROR: 'Oops 🙁, please state the name of the anime. /help',
    ASTUTE: 'Astute : Use param for limit result number. /help',
    SYNOPSIS_MSG: (details) =>
      `<u>Title</u> : <b>${details.title}</b>\n<u>Synopsis</u> : <b>${details.synopsis}</b>`,
    FEEDBACKS_MSG: (weary, neuter, starStruck) => `😩: ${weary}%
😐: ${neuter}%
🤩: ${starStruck}%
          `,
    FORWARD_SAVED_MSG: (name) =>
      `"${name}" ajouter a la liste
Vous pouvais maintenant démarre le transfère  des anime provenant d'autre canal.

N'oublier pas d'envoyer #fin si vous avez fini
`,
  },
  callBackQueryType: {
    FEEDBACK_T: 'feedback',
    SHOW_MORE_T: 'showMore',
    SHOW_LESS_T: 'showLess',
    FAVORITE_T: 'favorite',
    RM_FAVORITE_T: 'deleteFavorite',
    CONFIRM_STOP_T: 'confirm',
    NO_SHOW_AGAIN_T: 'noShowAgain',
  },
  subType: {
    upComing: 'upcoming',
    airing: 'airing',
    movie: 'movie',
    tv: 'tv',
    ova: 'ova',
    special: 'special',
  },
  sticker: {
    quote: 'CAACAgUAAxkBAAITc2CeoEv9KYJBw4M8edJI5yBqrWk5AAJuAAPXxiUN8orn6c1IXKIfBA',
  },
};
