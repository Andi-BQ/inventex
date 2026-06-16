import { useState, useEffect, useRef } from 'react'
import { Head, usePage, useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Bell, Shield, Palette, Globe, UserCircle, Sun, Moon, Save, ArrowLeft, Camera } from 'lucide-react'
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
    // Agregamos fallbacks defensivos por si los props llegan como arrays vacíos o nulos de Laravel
    const { auth = {}, configs = {}, userPrefs = {} } = usePage().props || {}
    const [activeSection, setActiveSection] = useState(null)

    return (
        <AuthenticatedLayout>
            <Head title="Configuración" />

            <div className="mb-4">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Configuración</h1>
                <p className="text-xs text-hm-400 dark:text-gray-500">Ajustes generales del sistema</p>
            </div>

            {activeSection ? (
                <SectionPanel section={sections.find(s => s.key === activeSection)} auth={auth} configs={configs} userPrefs={userPrefs} onBack={() => setActiveSection(null)} />
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

function SectionPanel({ section, auth, configs, userPrefs, onBack }) {
    if (!section) return null;
    switch (section.key) {
        case 'perfil': return <PerfilSection auth={auth} onBack={onBack} />
        case 'notificaciones': return <NotificacionesSection userPrefs={userPrefs} onBack={onBack} />
        case 'seguridad': return <PasswordSection onBack={onBack} />
        case 'apariencia': return <AparienciaSection userPrefs={userPrefs} onBack={onBack} />
        case 'general': return <GeneralSection auth={auth} configs={configs} onBack={onBack} />
        default: return null
    }
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

function GeneralSection({ auth, configs, onBack }) {
    const isAdmin = auth?.user?.rol === 'administrador'

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        nombre_sistema: configs?.nombre_sistema || 'INVENTEX - ERP Inventario',
        moneda_simbolo: configs?.moneda_simbolo || 'S/',
        limite_stock_critico: configs?.limite_stock_critico || '10',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/configuracion/general', {
            preserveScroll: true,
            onSuccess: () => toast.success('Configuración general guardada'),
        })
    }

    return (
        <SectionWrapper title="General" desc="Configuración general del sistema" icon={Globe} gradient="from-rose-500 to-red-600" onBack={onBack}>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                <p className="text-[10px] text-hm-400 dark:text-gray-500 mb-4">Ajustes globales del sistema INVENTEX</p>

                <div className="space-y-4 max-w-lg">
                    <div>
                        <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Nombre del Sistema</label>
                        <input type="text" value={data.nombre_sistema} onChange={e => setData('nombre_sistema', e.target.value)}
                            disabled={!isAdmin}
                            className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs disabled:opacity-60 disabled:cursor-not-allowed" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Símbolo de Moneda</label>
                            <input type="text" value={data.moneda_simbolo} onChange={e => setData('moneda_simbolo', e.target.value)}
                                disabled={!isAdmin}
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Stock Crítico Mínimo</label>
                            <input type="number" min="0" value={data.limite_stock_critico} onChange={e => setData('limite_stock_critico', e.target.value)}
                                disabled={!isAdmin}
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                {isAdmin && (
                    <div className="mt-5 flex items-center gap-3">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-medium hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all disabled:opacity-50">
                            <Save className="w-3.5 h-3.5" /> {processing ? 'Guardando...' : 'Guardar Configuración'}
                        </button>
                        {recentlySuccessful && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">✓ Guardado</span>}
                    </div>
                )}

                {!isAdmin && (
                    <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-900/30">
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Solo administradores</p>
                        <p className="text-[9px] text-amber-600 dark:text-amber-500 mt-1">Los ajustes globales del sistema solo pueden ser modificados por administradores.</p>
                    </div>
                )}
            </form>
        </SectionWrapper>
    )
}

function PerfilSection({ auth, onBack }) {
    const user = auth?.user

    const { data, setData, post, processing, errors } = useForm({
        nombre_completo: user?.nombre_completo || '',
        email: user?.email || '',
        avatar: null,
    })

    const [preview, setPreview] = useState(null)
    const fileInputRef = useRef(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setData('avatar', file)
        const reader = new FileReader()
        reader.onload = (ev) => setPreview(ev.target.result)
        reader.readAsDataURL(file)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/configuracion/perfil', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Perfil actualizado correctamente')
                setPreview(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
            },
        })
    }

    const avatarSrc = preview || (user?.avatar_url ? `/storage/${user.avatar_url}` : null)

    return (
        <SectionWrapper title="Mi Perfil" desc="Información personal" icon={UserCircle} gradient="from-sky-500 to-indigo-600" onBack={onBack}>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm text-center">
                    <div className="relative mx-auto mb-3 w-20 h-20">
                        {avatarSrc ? (
                            <img src={avatarSrc} alt="Avatar" className="w-20 h-20 rounded-xl object-cover border-2 border-gray-100 dark:border-white/10" />
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mx-auto">
                                {user?.nombre_completo?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                        )}
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-hm-800 border border-gray-200 dark:border-gray-600 shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-hm-700 transition-colors">
                            <Camera className="w-3.5 h-3.5 text-hm-500" />
                        </button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/jpg,image/gif,image/webp" onChange={handleFileChange} className="hidden" />
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{user?.nombre_completo}</h2>
                    <p className="text-[10px] text-hm-400 dark:text-gray-400">{user?.email}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[8px] font-medium bg-sky-subtle dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 mt-2 capitalize">{user?.rol}</span>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                    <p className="text-[10px] text-hm-400 dark:text-gray-500 mb-4">Edita tu información personal</p>
                    <div className="space-y-3 max-w-sm">
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Nombre Completo</label>
                            <input type="text" value={data.nombre_completo} onChange={e => setData('nombre_completo', e.target.value)} required
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                            {errors.nombre_completo && <p className="mt-1 text-[10px] text-red-500">{errors.nombre_completo}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Correo Electrónico</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                            {errors.email && <p className="mt-1 text-[10px] text-red-500">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-medium hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all disabled:opacity-50">
                            <Save className="w-3.5 h-3.5" /> {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        {preview && <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Nuevo avatar seleccionado</span>}
                    </div>
                </div>
            </form>
        </SectionWrapper>
    )
}

function PasswordSection({ onBack }) {
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
        put('/configuracion/password', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Contraseña actualizada correctamente')
                reset()
            },
        })
    }

    return (
        <SectionWrapper title="Seguridad" desc="Cambia tu contraseña de acceso" icon={Shield} gradient="from-emerald-500 to-teal-600" onBack={onBack}>
            <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                <p className="text-[10px] text-hm-400 dark:text-gray-500 mb-4">Actualiza tu contraseña periódicamente para mantener tu cuenta segura</p>
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
                        <Save className="w-3.5 h-3.5" /> {processing ? 'Guardando...' : 'Actualizar Contraseña'}
                    </button>
                </form>
            </div>
        </SectionWrapper>
    )
}

function NotificacionesSection({ userPrefs, onBack }) {
    // Protección defensiva para que si 'preferencias_notificaciones' es nulo o un string corrupto, use un objeto limpio
    const defaults = (userPrefs && typeof userPrefs.preferencias_notificaciones === 'object' && userPrefs.preferencias_notificaciones !== null) 
        ? userPrefs.preferencias_notificaciones 
        : {};

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        stock_bajo: defaults.stock_bajo ?? true,
        movimientos: defaults.movimientos ?? true,
        sistema: defaults.sistema ?? true,
        email: defaults.email ?? false,
    })

    const handleSave = () => {
        put('/configuracion/preferencias', {
            preserveScroll: true,
            onSuccess: () => toast.success('Preferencias de notificación actualizadas'),
        })
    }

    const togglePref = (key) => {
        setData(key, !data[key])
    }

    const items = [
        { key: 'stock_bajo', label: 'Alertas de stock bajo', desc: 'Cuando un producto esté por debajo del stock mínimo' },
        { key: 'movimientos', label: 'Movimientos de inventario', desc: 'Entradas y salidas registradas en el sistema' },
        { key: 'sistema', label: 'Notificaciones del sistema', desc: 'Inicios de sesión y eventos importantes' },
        { key: 'email', label: 'Notificaciones por email', desc: 'Recibir resumen de notificaciones por correo' },
    ]

    return (
        <SectionWrapper title="Notificaciones" desc="Configura qué notificaciones deseas recibir" icon={Bell} gradient="from-amber-500 to-orange-600" onBack={onBack}>
            <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                <p className="text-[10px] text-hm-400 dark:text-gray-500 mb-4">Gestiona las notificaciones del sistema</p>
                <div className="space-y-3">
                    {items.map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-hm-50/50 dark:bg-white/[0.02] border border-gray-50 dark:border-white/5">
                            <div>
                                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{label}</p>
                                <p className="text-[9px] text-hm-400 dark:text-gray-500">{desc}</p>
                            </div>
                            <button type="button" onClick={() => togglePref(key)}
                                className={`relative w-10 h-5 rounded-full transition-all ${data[key] ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${data[key] ? 'left-5' : 'left-0.5'}`} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mt-5 flex items-center gap-3">
                    <button type="button" onClick={handleSave} disabled={processing}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-medium hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all disabled:opacity-50">
                        <Save className="w-3.5 h-3.5" /> {processing ? 'Guardando...' : 'Guardar Preferencias'}
                    </button>
                    {recentlySuccessful && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">✓ Guardado</span>}
                </div>
            </div>
        </SectionWrapper>
    )
}

function AparienciaSection({ userPrefs, onBack }) {
    const { data, setData, put, processing } = useForm({
        tema: userPrefs?.tema || 'light',
    })

    const selectTheme = (theme) => {
        setData('tema', theme)
        put('/configuracion/tema', {
            preserveScroll: true,
            onSuccess: () => {
                const root = document.documentElement
                root.classList.toggle('dark', theme === 'dark')
                localStorage.setItem('theme', theme)
                toast.success(`Tema ${theme === 'dark' ? 'oscuro' : 'claro'} activado`)
            },
        })
    }

    return (
        <SectionWrapper title="Apariencia" desc="Tema claro/oscuro y personalización visual" icon={Palette} gradient="from-purple-500 to-pink-600" onBack={onBack}>
            <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                <p className="text-[10px] text-hm-400 dark:text-gray-500 mb-4">Personaliza la apariencia del sistema</p>
                <div className="flex gap-3">
                    {[
                        { theme: 'light', label: 'Claro', icon: Sun, gradient: 'from-amber-400 to-yellow-500', desc: 'Tema claro predeterminado' },
                        { theme: 'dark', label: 'Oscuro', icon: Moon, gradient: 'from-indigo-500 to-purple-600', desc: 'Tema oscuro para poca luz' },
                    ].map(({ theme, label, icon: Icon, gradient, desc }) => (
                        <button key={theme} type="button" onClick={() => !processing && selectTheme(theme)} disabled={processing}
                            className={`flex-1 p-4 rounded-2xl border-2 transition-all text-left ${
                                data.tema === theme
                                    ? 'border-sky-500 dark:border-sky-400 bg-sky-50 dark:bg-sky-900/10 shadow-premium'
                                    : 'border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'
                            } disabled:opacity-70`}>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                            <p className="text-[9px] text-hm-400 dark:text-gray-500 mt-1">{desc}</p>
                            {data.tema === theme && (
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