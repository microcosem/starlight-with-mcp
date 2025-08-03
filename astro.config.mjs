// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenapi, { openAPISidebarGroups } from 'starlight-openapi';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				...openAPISidebarGroups,
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
		}),
	],
});
