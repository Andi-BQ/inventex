import { useState, useEffect } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Settings, Bell, Shield, Palette, Globe, UserCircle, Sun, Moon, Save, ArrowLeft, Key } from 'lucide-react'
import PasswordInput from '@/Components/PasswordInput'
import toast from 'react-hot-toast'

const sections = [
    { key: 'perfil', icon: UserCircle, label: 'Mi Perfil', desc: 'Información personal y contraseña', gradient: 'from-sky-500 to-indigo-600' },
    { key: 'notificaciones', icon: Bell, label: 'Notificaciones', desc: 'Preferencias de notificaciones', gradient: 'from-amber-500 to-orange-600' },
    { key: 'seguridad', icon: Shield, label: 'Seguridad', desc: 'Autenticación y permisos', gradient: 'from-emerald-500 to-teal-600' },
    { key: 'apariencia', icon: Palette, label: 'Apariencia', desc: 'Tema claro/oscuro y personalización', gradient: 'from-purple-500 to-pink-600' },
    { key: 'general', icon: Globe, label: 'General', desc: 'Configuración del sistema', gradient: 'from-rose-500 to-red-600' },
]

export default function Configuracion() {
    const { auth } = usePage().props
    const [activeSection, setActiveSection] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Configuración" />

            <div className="mb-4">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Configuración</h1>
                <p className="text-xs text-hm-400 dark:text-gray-500">Ajustes generales del sistema</p>
            </div>

            {activeSection ? (
                <SectionPanel section={sections.find(s => s.key === activeSection)} auth={auth} onBack={() => setActiveSection(null)} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sections.map((s) => (
                        <button key={s.key} onClick={() => setActiveSection(s.key)}
                            className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm hover:shadow-hm-md transition-all group text-left w-full">
                            <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                                    <s.icon className="w-4.5 h-4.5 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100">{s.label}</h3>
                                    <p className="text-[10px] text-hm-400 dark:text-gray-500 mt-0.5">{s.desc}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </AuthenticatedLayout>
    )
}

function SectionPanel({ section, auth, onBack }) {
    switch (section.key) {
        case 'perfil': return <PerfilSection auth={auth} onBack={onBack} />
        case 'notificaciones': return <NotificacionesSection onBack={onBack} />
        case 'seguridad': return <SeguridadSection auth={auth} onBack={onBack} />
        case 'apariencia': return <AparienciaSection onBack={onBack} />
        case 'general': return <GeneralSection auth={auth} onBack={onBack} />
        default: return null
    }
}

function PerfilSection({ auth, onBack }) {
    const user = auth?.user
    return (
        <SectionWrapper title="Mi Perfil" desc="Información personal y contraseña" icon={UserCircle} gradient="from-sky-500 to-indigo-600" onBack={onBack}>
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
                    <PasswordChangeForm />
                </div>
            </div>
        </SectionWrapper>
    )
}

function PasswordChangeForm() {
    const { data, setData, put, processing, errors, reset } = usePasswordForm()

    useEffect(() => {
        if (Object.keys(errors).length > 0) toast.error(Object.values(errors).flat().join(', '))
    }, [errors])

    const handleSubmit = (e) => {
        e.preventDefault()
        put('/perfil/password', {
            onSuccess: () => { toast.success('Contraseña actualizada'); reset() },
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
            <div>
                <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Contraseña Actual</label>
                <PasswordInput value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} required autoComplete="current-password"
                    className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs pr-9" />
            </div>
            <div>
                <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Nueva Contraseña</label>
                <PasswordInput value={data.new_password} onChange={(e) => setData('new_password', e.target.value)} required minLength={8} autoComplete="new-password"
                    className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs pr-9" />
            </div>
            <div>
                <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Confirmar Nueva Contraseña</label>
                <PasswordInput value={data.new_password_confirmation} onChange={(e) => setData('new_password_confirmation', e.target.value)} required minLength={8} autoComplete="new-password"
                    className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs pr-9" />
            </div>
            <button type="submit" disabled={processing}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-medium hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all disabled:opacity-50">
                <Save className="w-3.5 h-3.5" /> {processing ? 'Guardando...' : 'Actualizar Contraseña'}
            </button>
        </form>
    )
}

function NotificacionesSection({ onBack }) {
    const [prefs, setPrefs] = useState({
        stock_bajo: true, movimientos: true, sistema: true, email: false,
    })

    const togglePref = (key) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
        toast.success('Preferencia actualizada')
    }

    return (
        <SectionWrapper title="Notificaciones" desc="Configura qué notificaciones deseas recibir" icon={Bell} gradient="from-amber-500 to-orange-600" onBack={onBack}>
            <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                <p className="text-[10px] text-hm-400 dark:text-gray-500 mb-4">Gestiona las notificaciones del sistema</p>
                <div className="space-y-3">
                    {[
                        { key: 'stock_bajo', label: 'Alertas de stock bajo', desc: 'Cuando un producto esté por debajo del stock mínimo' },
                        { key: 'movimientos', label: 'Movimientos de inventario', desc: 'Entradas y salidas registradas en el sistema' },
                        { key: 'sistema', label: 'Notificaciones del sistema', desc: 'Inicios de sesión y eventos importantes' },
                        { key: 'email', label: 'Notificaciones por email', desc: 'Recibir resumen de notificaciones por correo' },
                    ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-hm-50/50 dark:bg-white/[0.02] border border-gray-50 dark:border-white/5">
                            <div>
                                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{label}</p>
                                <p className="text-[9px] text-hm-400 dark:text-gray-500">{desc}</p>
                            </div>
                            <button onClick={() => togglePref(key)}
                                className={`relative w-10 h-5 rounded-full transition-all ${prefs[key] ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${prefs[key] ? 'left-5' : 'left-0.5'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    )
}

function SeguridadSection({ auth, onBack }) {
    const user = auth?.user
    return (
        <SectionWrapper title="Seguridad" desc="Autenticación y permisos de tu cuenta" icon={Shield} gradient="from-emerald-500 to-teal-600" onBack={onBack}>
            <div className="space-y-3">
                <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3">Información de la cuenta</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { label: 'Rol', value: user?.rol === 'administrador' ? 'Administrador' : 'Empleado' },
                            { label: 'Email', value: user?.email },
                            { label: 'Miembro desde', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('es-PE') : '-' },
                            { label: 'Último acceso', value: user?.ultimo_login ? new Date(user.ultimo_login).toLocaleString('es-PE') : 'Nunca' },
                        ].map(({ label, value }) => (
                            <div key={label} className="p-3 rounded-xl bg-hm-50/50 dark:bg-white/[0.02] border border-gray-50 dark:border-white/5">
                                <p className="text-[9px] text-hm-400 dark:text-gray-500 font-medium uppercase tracking-wider">{label}</p>
                                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3">Cambiar Contraseña</h3>
                    <PasswordChangeForm />
                </div>
            </div>
        </SectionWrapper>
    )
}

function AparienciaSection({ onBack }) {
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')

    useEffect(() => {
        const root = document.documentElement
        root.classList.toggle('dark', darkMode)
        localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    }, [darkMode])

    return (
        <SectionWrapper title="Apariencia" desc="Tema claro/oscuro y personalización visual" icon={Palette} gradient="from-purple-500 to-pink-600" onBack={onBack}>
            <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                <p className="text-[10px] text-hm-400 dark:text-gray-500 mb-4">Personaliza la apariencia del sistema</p>
                <div className="flex gap-3">
                    {[
                        { mode: false, label: 'Claro', icon: Sun, gradient: 'from-amber-400 to-yellow-500', desc: 'Tema claro predeterminado' },
                        { mode: true, label: 'Oscuro', icon: Moon, gradient: 'from-indigo-500 to-purple-600', desc: 'Tema oscuro para poca luz' },
                    ].map(({ mode, label, icon: Icon, gradient, desc }) => (
                        <button key={label} onClick={() => setDarkMode(mode)}
                            className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left ${
                                darkMode === mode
                                    ? 'border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-sky-900/10 shadow-premium'
                                    : 'border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'
                            }`}>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                            <p className="text-[9px] text-hm-400 dark:text-gray-500 mt-1">{desc}</p>
                            {darkMode === mode && (
                                <div className="mt-2 flex items-center gap-1 text-[9px] text-sky-600 dark:text-sky-400 font-medium">
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Activo
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    )
}

function GeneralSection({ auth, onBack }) {
    const user = auth?.user
    const isAdmin = user?.rol === 'administrador'

    return (
        <SectionWrapper title="General" desc="Configuración general del sistema" icon={Globe} gradient="from-rose-500 to-red-600" onBack={onBack}>
            <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                <p className="text-[10px] text-hm-400 dark:text-gray-500 mb-4">Información del sistema INVENTEX</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { label: 'Versión', value: '1.0.0' },
                        { label: 'Entorno', value: import.meta.env.VITE_APP_ENV || 'Producción' },
                        { label: 'Nombre del sistema', value: 'INVENTEX - ERP Inventario' },
                        { label: 'Tu rol', value: isAdmin ? 'Administrador' : 'Empleado' },
                    ].map(({ label, value }) => (
                        <div key={label} className="p-3 rounded-xl bg-hm-50/50 dark:bg-white/[0.02] border border-gray-50 dark:border-white/5">
                            <p className="text-[9px] text-hm-400 dark:text-gray-500 font-medium uppercase tracking-wider">{label}</p>
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{value}</p>
                        </div>
                    ))}
                </div>
                {isAdmin && (
                    <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-900/30">
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Configuración avanzada próximamente</p>
                        <p className="text-[9px] text-amber-600 dark:text-amber-500 mt-1">Los ajustes globales del sistema estarán disponibles en futuras actualizaciones.</p>
                    </div>
                )}
            </div>
        </SectionWrapper>
    )
}

function SectionWrapper({ title, desc, icon: Icon, gradient, children, onBack }) {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
                <button onClick={onBack} className="p-1.5 rounded-full hover:bg-hm-100 dark:hover:bg-gray-700/50 transition-colors">
                    <ArrowLeft className="w-4 h-4 text-hm-400" />
                </button>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h2>
                    <p className="text-[10px] text-hm-400 dark:text-gray-500">{desc}</p>
                </div>
            </div>
            {children}
        </div>
    )
}

function usePasswordForm() {
    const [data, setData] = useState({ current_password: '', new_password: '', new_password_confirmation: '' })
    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState({})
    const reset = () => setData({ current_password: '', new_password: '', new_password_confirmation: '' })

    const put = (url, { onSuccess, onError } = {}) => {
        setProcessing(true)
        setErrors({})
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(data),
        })
            .then(async (res) => {
                if (res.ok) { onSuccess?.(); return }
                const body = await res.json()
                if (body.errors) { setErrors(body.errors); onError?.() }
                else if (body.error) { toast.error(body.error); onError?.() }
                else { setErrors({ error: 'Error al actualizar' }); onError?.() }
            })
            .catch(() => { toast.error('Error de conexión') })
            .finally(() => setProcessing(false))
    }

    return { data, setData, put, processing, errors, reset }
}