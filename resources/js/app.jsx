import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { Toaster } from 'react-hot-toast'

createInertiaApp({
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx')
    ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <App {...props} />
                <Toaster position="bottom-right" />
            </>
        )
    },
    progress: {
        color: '#4B5563',
    },
})
