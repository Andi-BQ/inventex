import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Building2, Plus, Search, Pencil, Phone, Mail, Trash2, MapPin, MoreHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Proveedores({ proveedores }) {
    const [search, setSearch] = useState('')
    const [openDropdown, setOpenDropdown] = useState(null)
    const data = proveedores ?? []
    const filtered = search
        ? data.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.contacto?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase()))
        : data

    const handleDelete = (id, nombre) => {
        if (!confirm(`¿Eliminar al proveedor "${nombre}"?`)) return
        router.delete(`/proveedores/${id}`, {
            onSuccess: () => { setOpenDropdown(null) },
            onError: () => toast.error('Error al eliminar'),
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Proveedores" />

            <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Proveedores</h1>
                    <p className="text-xs text-hm-400 dark:text-gray-500">{data.length} proveedores</p>
                </div>
                <Link href="/proveedores/crear" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-semibold hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all">
                    <Plus className="w-3.5 h-3.5" /> Nuevo
                </Link>
            </div>

            <div className="relative max-w-xs mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hm-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar proveedores..."
                    className="w-full pl-9 pr-3 py-2 rounded-full bg-white/60 dark:bg-slate-800/30 border border-gray-200/60 dark:border-slate-700/50 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20 text-xs outline-none transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filtered.length > 0 ? filtered.map((prov) => (
                    <div key={prov.id} className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm hover:shadow-hm-md transition-all relative">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100">{prov.nombre}</h3>
                                    {prov.contacto && <p className="text-[9px] text-hm-400 dark:text-gray-500">{prov.contacto}</p>}
                                </div>
                            </div>
                            <div className="relative">
                                <button onClick={() => setOpenDropdown(openDropdown === prov.id ? null : prov.id)} className="p-1.5 rounded-full hover:bg-hm-100 dark:hover:bg-slate-800/40 transition-colors">
                                    <MoreHorizontal className="w-3.5 h-3.5 text-hm-400" />
                                </button>
                                {openDropdown === prov.id && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                                        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-hm-900 rounded-2xl shadow-hm-lg border border-gray-100 dark:border-white/5 p-1 z-20 animate-scale-in">
                                            <Link href={`/proveedores/${prov.id}/editar`} onClick={() => setOpenDropdown(null)} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[10px] text-hm-600 dark:text-gray-400 hover:bg-hm-50 dark:hover:bg-white/[0.03] transition-colors w-full">
                                                <Pencil className="w-3 h-3" /> Editar
                                            </Link>
                                            <button onClick={() => handleDelete(prov.id, prov.nombre)} className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[10px] text-red-600 dark:text-red-400 hover:bg-rose-subtle dark:hover:bg-red-900/10 transition-colors w-full">
                                                <Trash2 className="w-3 h-3" /> Eliminar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5 mb-3">
                            {prov.email && (
                                <div className="flex items-center gap-2 text-[10px] text-hm-500 dark:text-gray-400">
                                    <div className="w-6 h-6 rounded-lg bg-hm-100 dark:bg-slate-800/40 flex items-center justify-center"><Mail className="w-3 h-3" /></div>
                                    <a href={`mailto:${prov.email}`} className="hover:text-sky-500">{prov.email}</a>
                                </div>
                            )}
                            {prov.telefono && (
                                <div className="flex items-center gap-2 text-[10px] text-hm-500 dark:text-gray-400">
                                    <div className="w-6 h-6 rounded-lg bg-hm-100 dark:bg-slate-800/40 flex items-center justify-center"><Phone className="w-3 h-3" /></div>
                                    <span>{prov.telefono}</span>
                                </div>
                            )}
                            {prov.direccion && (
                                <div className="flex items-center gap-2 text-[10px] text-hm-500 dark:text-gray-400">
                                    <div className="w-6 h-6 rounded-lg bg-hm-100 dark:bg-slate-800/40 flex items-center justify-center"><MapPin className="w-3 h-3" /></div>
                                    <span className="truncate">{prov.direccion}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t border-gray-50 dark:border-white/5">
                            <span className="text-[9px] text-hm-400 dark:text-gray-500 font-medium">{prov.productos_count ?? 0} productos</span>
                            {!prov.activo && <span className="px-2 py-0.5 rounded-full text-[8px] font-semibold bg-rose-subtle dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30">Inactivo</span>}
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-10">
                        <Building2 className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                        <p className="text-xs text-hm-400 dark:text-gray-500">No se encontraron proveedores</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    )
}
