import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Users, Plus, Pencil, Shield, User, Search, Clock, MoreHorizontal, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Usuarios({ usuarios }) {
    const [search, setSearch] = useState('')
    const [openDropdown, setOpenDropdown] = useState(null)
    const data = usuarios ?? []
    const filtered = search
        ? data.filter(u => u.nombre_completo?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
        : data

    const handleToggleActivo = (u) => {
        router.put(`/usuarios/${u.id}`, { activo: !u.activo }, {
            onSuccess: () => { toast.success(u.activo ? 'Usuario desactivado' : 'Usuario activado'); setOpenDropdown(null) },
            onError: (errs) => toast.error(Object.values(errs).flat().join(', ')),
        })
    }

    const handleDelete = (id, nombre) => {
        if (!confirm(`¿Eliminar al usuario "${nombre}" permanentemente?`)) return
        router.delete(`/usuarios/${id}`, {
            onSuccess: () => { setOpenDropdown(null) },
            onError: (errs) => toast.error(Object.values(errs).flat().join(', ')),
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Usuarios" />

            <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Usuarios</h1>
                    <p className="text-xs text-hm-400 dark:text-gray-500">{data.length} usuarios</p>
                </div>
                <Link href="/usuarios/crear" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-semibold hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all">
                    <Plus className="w-3.5 h-3.5" /> Nuevo
                </Link>
            </div>

            <div className="relative max-w-xs mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hm-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar usuarios..."
                    className="w-full pl-9 pr-3 py-2 rounded-full bg-white/60 dark:bg-slate-800/30 border border-gray-200/60 dark:border-slate-700/50 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20 text-xs outline-none transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.length > 0 ? filtered.map((u) => (
                    <div key={u.id} className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm hover:shadow-hm-md transition-all relative">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm ${
                                    u.rol === 'administrador' ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-gradient-to-br from-sky-500 to-indigo-600'
                                }`}>
                                    {u.nombre_completo?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100">{u.nombre_completo}</h3>
                                    <p className="text-[9px] text-hm-400 dark:text-gray-500">{u.email}</p>
                                </div>
                            </div>
                            <div className="relative">
                                <button onClick={() => setOpenDropdown(openDropdown === u.id ? null : u.id)} className="p-1.5 rounded-full hover:bg-hm-100 dark:hover:bg-slate-800/40 transition-colors">
                                    <MoreHorizontal className="w-3.5 h-3.5 text-hm-400" />
                                </button>
                                {openDropdown === u.id && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-hm-900 rounded-2xl shadow-hm-lg border border-gray-100 dark:border-white/5 p-1 z-20 animate-scale-in">
                                            <Link href={`/usuarios/${u.id}/editar`} onClick={() => setOpenDropdown(null)} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[10px] text-hm-600 dark:text-gray-400 hover:bg-hm-50 dark:hover:bg-white/[0.03] transition-colors w-full">
                                                <Pencil className="w-3 h-3" /> Editar
                                            </Link>
                                            {u.id !== 1 && (
                                                <button onClick={() => handleToggleActivo(u)} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[10px] text-hm-600 dark:text-gray-400 hover:bg-hm-50 dark:hover:bg-white/[0.03] transition-colors w-full">
                                                    {u.activo ? <ToggleLeft className="w-3 h-3" /> : <ToggleRight className="w-3 h-3" />}
                                                    {u.activo ? 'Desactivar' : 'Activar'}
                                                </button>
                                            )}
                                            {u.id !== 1 && (
                                                <button onClick={() => handleDelete(u.id, u.nombre_completo)} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[10px] text-red-600 dark:text-red-400 hover:bg-rose-subtle dark:hover:bg-red-900/10 transition-colors w-full">
                                                    <Trash2 className="w-3 h-3" /> Eliminar
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 mb-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8px] font-bold border ${
                                u.rol === 'administrador'
                                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/30'
                                    : 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/30'
                            }`}>
                                {u.rol === 'administrador' ? <Shield className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                                {u.rol === 'administrador' ? 'Admin' : 'Empleado'}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8px] font-bold border ${
                                u.activo ? 'bg-emerald-subtle dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50' : 'bg-rose-subtle dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200/50'
                            }`}>
                                {u.activo ? <ToggleRight className="w-2.5 h-2.5" /> : <ToggleLeft className="w-2.5 h-2.5" />}
                                {u.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>

                        {u.ultimo_login && (
                            <div className="flex items-center gap-1.5 text-[8px] text-hm-400 dark:text-gray-500 pt-3 border-t border-gray-50 dark:border-white/5">
                                <Clock className="w-2.5 h-2.5" />
                                <span>Último acceso: {new Date(u.ultimo_login).toLocaleString('es-PE')}</span>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="col-span-full text-center py-10">
                        <Users className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                        <p className="text-xs text-hm-400 dark:text-gray-500">No se encontraron usuarios</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    )
}
