import { usePage, Link } from '@inertiajs/react'

export default function GuestLayout({ children }) {
    const { props } = usePage()
    const { appName = 'INVENTEX' } = props

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-hm-50 via-white to-indigo-50 dark:from-hm-950 dark:via-hm-900 dark:to-hm-950 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-premium mb-4 animate-float">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {appName}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Sistema de Gestión de Inventario
                    </p>
                </div>

                <div className="bg-white dark:bg-hm-800/80 backdrop-blur-xl rounded-[32px] shadow-hm-lg dark:shadow-premium-dark p-8 border border-gray-100 dark:border-gray-700/50">
                    {children}
                </div>

                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
                    &copy; {new Date().getFullYear()} {appName}. Todos los derechos reservados.
                </p>
            </div>
        </div>
    )
}
