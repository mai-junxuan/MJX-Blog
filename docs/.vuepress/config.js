const themeConfig = require('./themeConfig')
module.exports = {
    base: '/MJX-Blog/',
    title: "maijunxuan's blog",
    description: '',
    markdown: {
        lineNumbers: true,
        externalLinks: {
            target: '_blank', rel: 'noopener noreferrer'
        }
    },
    locales: {
        "/": {
            lang: "zh-CN",
            title: "麦俊轩的博客",
        }
    },
    head: [
        // ico
        ["link", {rel: "icon", href: `/favicon.ico`}],
        // meta
        ["meta", {name: "robots", content: "all"}],
        ["meta", {name: "author", content: "pdai"}],
        ["meta", {
            name: "keywords",
            content: "Java 全栈知识体系, java体系, java知识体系, java框架,java详解,java学习路线,java spring, java面试, 知识体系, java技术体系, java编程, java编程指南,java开发体系, java开发,java教程,java,java数据结构, 算法, 开发基础"
        }],
        ["meta", {name: "apple-mobile-web-app-capable", content: "yes"}]
    ],
    plugins: [
        ['@vuepress/search', {
            searchMaxSuggestions: 10
        }],
        ['@vuepress/back-to-top', true],
        ['@vuepress/medium-zoom', {
            selector: 'img',
            options: {
                margin: 16
            }
        }]
    ],
    themeConfig
}
