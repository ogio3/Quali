import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
			},
			manifest: {
				name: 'Quali-Lite',
				short_name: 'Quali-Lite',
				description: 'Browser-only qualitative coding tool. Your data never leaves your browser.',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				background_color: '#0d1117',
				theme_color: '#0d1117',
				icons: [
					{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
				]
			}
		})
	]
});
