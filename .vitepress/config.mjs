import { defineConfig } from 'vitepress'

const year = new Date().getFullYear()

export default defineConfig({
	title: "Duck Dev Docs",
	description: "Official documentation for Duck Dev",
	lastUpdated: true,
	cleanUrls: true,
	head: [
		[
			'link',
			{
				rel: 'icon',
				href: '/icon.png',
			},
		],
		[
			'script',
			{ async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-5SN0WR5ETP' }
		],
		[
			'script',
			{},
			`window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', 'G-5SN0WR5ETP');`
		]
	],
	themeConfig: {
		logo: '/icon.png',
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Support', link: 'https://duckdev.com/contact/' },
		],

		sidebar: [
			{
				text: 'General',
				items: [
					{ text: 'Getting Help', link: '/general/getting-help' },
					{ text: 'Installing a plugin', link: '/general/installing-plugin' },
					{ text: 'Updating a plugin', link: '/general/updating-plugin' }
				]
			},
			{
				text: 'Loggedin',
				items: [
					{ text: 'General Settings', link: '/loggedin/general-settings' },
					{ text: 'Manage Sessions', link: '/loggedin/manage-sessions' },
					{ text: 'Installing an Add-on', link: '/loggedin/installing-add-on' },
					{ text: 'Managing Licenses', link: '/loggedin/managing-licenses' },
					{ text: 'Developer Docs', link: '/loggedin/developer-docs' },
					{
						text: 'Addons',
						base: '/loggedin/addons',
						items: [
							{ text: 'Realtime Logout', link: '/realtime-logout' },
							{ text: 'Limit Per User', link: '/limit-per-user' },
							{ text: 'Limit Per Role', link: '/limit-per-role' },
						]
					}
				]
			},
			{
				text: '404 to 301',
				items: [
					{ text: 'Settings', link: '/404-to-301/settings' },
					{ text: 'Custom Options', link: '/404-to-301/custom-options' },
					{ text: 'Error Log Listing', link: '/404-to-301/error-log-listing' },
					{ text: 'Translation', link: '/404-to-301/translating' },
				]
			},
			{
				text: 'Lazy Load for Comments',
				items: [
					{ text: 'General Settings', link: '/lazy-load-for-comments/general' },
					{ text: 'Load Button', link: '/lazy-load-for-comments/load-button' },
					{ text: 'Cache Management', link: '/lazy-load-for-comments/cache' },
					{ text: 'Developer Docs', link: '/lazy-load-for-comments/developer-docs' },
				]
			},
			{
				text: 'About Us',
				link: '/about',
			},
		],

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/duckdev' },
			{ icon: 'twitter', link: 'https://x.com/duckdev' },
			{ icon: 'facebook', link: 'https://facebook.com/duckdev' },
		],

		editLink: {
			pattern: 'https://github.com/duckdev/duckdev.github.io/edit/main/:path',
			text: 'Edit this page on GitHub',
		},

		search: {
			provider: 'local',
		},

		footer: {
			copyright: `Copyright © ${year}, <a href="/about/">Duck Dev LLP</a>. All rights reserved.`,
		},
	}
})
