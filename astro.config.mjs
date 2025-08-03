// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenapi, { openAPISidebarGroups } from 'starlight-openapi';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'API Documentation',
			description: 'Comprehensive API documentation with interactive examples',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' },
				{ icon: 'mastodon', label: 'Mastodon', href: 'https://mastodon.social/@astro' }
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', link: '/' },
						{ label: 'Quick Start', link: '/guides/quick-start/' },
						{ label: 'Authentication', link: '/guides/authentication/' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'Overview', link: '/api/overview/' },
						{ label: 'Error Handling', link: '/api/errors/' },
						{ label: 'Rate Limiting', link: '/api/rate-limiting/' },
					],
				},
				...openAPISidebarGroups,
				{
					label: 'Guides & Examples',
					autogenerate: { directory: 'guides' },
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
			plugins: [
				starlightOpenapi([
					{
						base: 'api/petstore-api',
						label: 'Pet Store API',
						schema: './petstore-mcp-server/petstore-api.json',
						sidebar: {
							operations: {
								badges: true,
								labels: 'summary',
								sort: 'document',
							},
							tags: {
								sort: 'document',
							},
						},
					},
				]),
			],
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon.svg',
					},
				},
			],
			editLink: {
				baseUrl: 'https://github.com/your-org/your-repo/edit/main/website/',
			},
			lastUpdated: true,
			tableOfContents: {
				minHeadingLevel: 2,
				maxHeadingLevel: 3,
			},
		}),
	],
});
