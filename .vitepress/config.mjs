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
						]
					}
				]
			},
			{
				text: '404 to 301',
				items: [
					{ text: 'Settings', link: '/404-to-301/settings' },
					{ text: 'Translation', link: '/404-to-301/translating' },
				]
			},
			{
				text: 'Lazy Load for Comments',
				items: [
					{ text: 'Settings', link: '/lazy-load-for-comments/settings' },
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
			pattern: 'https://github.com/duckdev/docs/edit/docs/docs/:path',
			text: 'Edit this page on GitHub',
		},

		search: {
			provider: 'local',
		},

		footer: {
			copyright: `Copyright © ${year}, <a href="/about/">Duck Dev LLP</a>.`,
		},
	}
})
