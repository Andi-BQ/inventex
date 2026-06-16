import { useEffect } from 'react'
import { Head, router, useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Key, Save } from 'lucide-react'
import PasswordInput from '@/Components/PasswordInput'
import toast from 'react-hot-toast'

export default function Perfil({ auth }) {
    const user = auth?.user

    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    })

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const msg = Object.values(errors).flat().join(', ')
            toast.error(msg)
        }
    }, [errors])

    const handleSubmit = (e) => {
        e.preventDefault()
        put('/perfil/password', {
            onSuccess: () => {
                toast.success('Contraseña actualizada')
                reset()
            },
            onError: () => {},
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Mi Perfil" />
            <div className="max-w-2xl">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Mi Perfil</h1>
                <p className="text-xs text-hm-400 dark:text-gray-400 mb-4">Información y configuración de tu cuenta</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm text-center">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold mx-auto mb-3">
                            {user?.nombre_completo?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{user?.nombre_completo}</h2>
                        <p className="text-[10px] text-hm-400 dark:text-gray-400">{user?.email}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[8px] font-medium bg-sky-subtle dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 mt-2 capitalize">{user?.rol}</span>
                    </div>

                    <div className="lg:col-span-2 bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-full bg-hm-100 dark:bg-slate-800/40 flex items-center justify-center"><Key className="w-3.5 h-3.5 text-hm-400" /></div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Cambiar Contraseña</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
                            <div>
                                <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Contraseña Actual</label>
                                <PasswordInput value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} required autoComplete="current-password"
                                    className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs pr-9" />
                                {errors.current_password && <p className="mt-1 text-[10px] text-red-500">{errors.current_password}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Nueva Contraseña</label>
                                <PasswordInput value={data.new_password} onChange={(e) => setData('new_password', e.target.value)} required minLength={8} autoComplete="new-password"
                                    className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs pr-9" />
                                {errors.new_password && <p className="mt-1 text-[10px] text-red-500">{errors.new_password}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Confirmar Nueva Contraseña</label>
                                <PasswordInput value={data.new_password_confirmation} onChange={(e) => setData('new_password_confirmation', e.target.value)} required minLength={8} autoComplete="new-password"
                                    className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs pr-9" />
                                {errors.new_password_confirmation && <p className="mt-1 text-[10px] text-red-500">{errors.new_password_confirmation}</p>}
                            </div>
                            <button type="submit" disabled={processing}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-medium hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all disabled:opacity-50">
                                <Save className="w-3.5 h-3.5" />
                                {processing ? 'Guardando...' : 'Actualizar Contraseña'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
