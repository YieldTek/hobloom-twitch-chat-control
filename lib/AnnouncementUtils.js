var RNGUtils = require('./RNGUtils');

class AnnouncementUtils {
    static getAnnouncement () {
        var rng = RNGUtils.getRandom(1, 6);
        switch (rng) {
            case 1:
                return 'TwitchRPG CHECK US OUT ON PATREON TO SUPPORT MORE OPEN SOURCE AUTOMATION SOFTWARE! http://patreon.com/hightek TwitchRPG';
            case 2:
                return 'TwitchRPG JOIN THE DANK GROW MOB DISCORD! https://discord.gg/xgmGyE6 TwitchRPG';
            case 3:
                return 'TwitchRPG CHECK OUT OUR UPDATED SITE AT http://hightekco.com TwitchRPG';
            case 4:
                return 'TwitchRPG CHECK OUT OUR BLOG AT http://ttcubicle.blogspot.com/ TwitchRPG';
            case 5:
                return 'TwitchRPG Subscribe to our subreddit at https://www.reddit.com/r/hightek/ TwitchRPG';
            case 6:
                return 'TwitchRPG Follow us out on twitter at https://twitter.com/HighTekGrow for live updates! TwitchRPG';
        }
    }
}

module.exports = AnnouncementUtils;