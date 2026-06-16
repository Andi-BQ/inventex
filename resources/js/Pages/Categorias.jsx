import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Tags, Plus, Search, Pencil, Trash2, Package, FolderOpen } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Categorias({ categorias }) {
    const [search, setSearch] = useState('')
    const data = categorias ?? []
    const filtered = search
        ? data.filter(c => c.nombre.toLowerCase().includes(search.toLowerCase()) || c.descripcion?.toLowerCase().includes(search.toLowerCase()))
        : data

    const handleDelete = (id, nombre) => {
        if (!confirm(`¿Eliminar la categoría "${nombre}"?`)) return
        router.delete(`/categorias/${id}`, {
            onSuccess: () => {},
            onError: (err) => toast.error(err?.response?.data?.error || 'Error al eliminar'),
        })
    }

    return (
        <AuthenticatedLayout>
            <Head title="Categorías" />

            <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Categorías</h1>
                    <p className="text-xs text-hm-400 dark:text-gray-500">{data.length} categorías</p>
                </div>
                <Link href="/categorias/crear" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-semibold hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all">
                    <Plus className="w-3.5 h-3.5" /> Nueva
                </Link>
            </div>

            <div className="relative max-w-xs mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hm-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar categorías..."
                    className="w-full pl-9 pr-3 py-2 rounded-full bg-white/60 dark:bg-slate-800/30 border border-gray-200/60 dark:border-slate-700/50 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20 text-xs outline-none transition-all" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.map((cat) => (
                    <div key={cat.id} className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm hover:shadow-hm-md transition-all group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: cat.color || '#2563eb' }}>
                                <Tags className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/categorias/${cat.id}/editar`} className="p-1.5 rounded-full hover:bg-hm-100 dark:hover:bg-slate-800/40 transition-colors">
                                    <Pencil className="w-3 h-3 text-hm-400" />
                                </Link>
                                <button onClick={() => handleDelete(cat.id, cat.nombre)} className="p-1.5 rounded-full hover:bg-rose-subtle dark:hover:bg-red-900/10 transition-colors">
                                    <Trash2 className="w-3 h-3 text-red-400" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100">{cat.nombre}</h3>
                        {cat.descripcion && <p className="text-[10px] text-hm-400 dark:text-gray-500 mt-0.5 line-clamp-2">{cat.descripcion}</p>}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-white/5">
                            <span className="flex items-center gap-1 text-[9px] text-hm-500 dark:text-gray-400">
                                <Package className="w-3 h-3" /> {cat.productos_count ?? 0} productos
                            </span>
                            {!cat.activo && (
                                <span className="px-2 py-0.5 rounded-full text-[8px] font-semibold bg-rose-subtle dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30">Inactiva</span>
                            )}
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full text-center py-10">
                        <FolderOpen className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                        <p className="text-xs text-hm-400 dark:text-gray-500">No se encontraron categorías</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    )
}
