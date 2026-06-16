import { Head, Link } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import { Home } from 'lucide-react'

export default function NotFound() {
    return (
        <GuestLayout>
            <Head title="404" />
            <div className="text-center">
                <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600 mb-2">404</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Página no encontrada</p>
                <Link href="/" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-medium hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all">
                    <Home className="w-4 h-4" />
                    Volver al inicio
                </Link>
            </div>
        </GuestLayout>
    )
}
