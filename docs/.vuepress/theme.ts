import {hopeTheme} from "vuepress-theme-hope";

import navbar from "./navbar";

export default hopeTheme({
    hostname: "https://maijunxuan.cn",
    favicon: "/favicon.ico",
    author: {
        name: "maijunxuan",
        email: "maijunxuan0309@gmail.com"
    },
    docsDir: "docs",
    pure: false,
    breadcrumb: false,
    navbar,
    sidebar: false,
    displayFooter: true,

    pageInfo: ["Author", "Category", "Tag", "Original", "Word", "ReadingTime"],

    plugins: {
        blog: true,

        copyright: {
            author: "maijunxuan",
            license: "MIT",
            triggerLength: 100,
            maxLength: 700,
            canonical: "https://maijunxuan.cn/",
            global: true,
        },
        copyCode: {},

        feed: {
            atom: true,
            json: true,
            rss: true,
        },

        // mdEnhance: {
        //     align: true,
        //     codetabs: true,
        //     figure: true,
        //     gfm: true,
        //     hint: true,
        //     tasklist: true,
        // },

        search: {
            isSearchable: (page) => page.path !== "/",
            maxSuggestions: 10,
        },
    },
});