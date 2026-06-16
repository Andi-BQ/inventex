import { useForm } from '@inertiajs/react'
import { Head, Link } from '@inertiajs/react'
import GuestLayout from '@/Layouts/GuestLayout'
import PasswordInput from '@/Components/PasswordInput'

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false })
    const submit = (e) => { e.preventDefault(); post('/login', { onSuccess: () => reset('password') }) }

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />
            <form onSubmit={submit} className="space-y-4">
                <div className="text-center mb-2">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Iniciar Sesión</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ingresa tus credenciales</p>
                </div>
                {errors.error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 text-xs text-red-600">{errors.error}</div>}
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Correo electrónico</label>
                    <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                        placeholder="admin@inventex.com" autoComplete="email" />
                    {errors.email && <p className="mt-1 text-[10px] text-red-500">{errors.email}</p>}
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                    <PasswordInput value={data.password} onChange={(e) => setData('password', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm pr-9"
                        placeholder="••••••••" autoComplete="current-password" />
                    {errors.password && <p className="mt-1 text-[10px] text-red-500">{errors.password}</p>}
                </div>
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Recordar sesión</span>
                    </label>
                </div>
                <button type="submit" disabled={processing}
                    className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium text-sm hover:from-sky-600 hover:to-indigo-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all disabled:opacity-50">
                    {processing ? 'Ingresando...' : 'Ingresar'}
                </button>
                <div className="text-center text-[10px] text-gray-400 dark:text-gray-500 pt-1">
                    <p>Demo: admin@inventex.com / Admin123!</p>
                    <p>Empleado: maria@inventex.com / Empleado123!</p>
                </div>
            </form>
        </GuestLayout>
    )
}
