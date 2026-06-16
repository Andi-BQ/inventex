import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Plus, Search, Package, Pencil, Grid3X3, List, AlertCircle, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Productos({ productos, categorias }) {
    const [search, setSearch] = useState('')
    const [stateFilter, setStateFilter] = useState('todos')
    const [viewMode, setViewMode] = useState('list')

    const data = productos?.data ?? []
    const pagination = productos?.pagination ?? {}

    const searchProducts = () => {
        router.get('/productos', { search, estado_stock: stateFilter }, { preserveState: true, preserveScroll: true })
    }

    const handleDelete = (id, nombre) => {
        if (!confirm(`¿Eliminar el producto "${nombre}" permanentemente?`)) return
        router.delete(`/productos/${id}`, {
            onSuccess: () => {},
            onError: (errs) => toast.error(Object.values(errs).flat().join(', ') || 'Error al eliminar'),
        })
    }

    const StockBadge = ({ actual, minimo }) => {
        if (Number(actual) === 0) return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-subtle dark:bg-red-900/20 text-[8px] font-semibold text-red-700 dark:text-red-400 border border-red-200/50 dark:border-red-900/30"><XCircle className="w-2.5 h-2.5" />Agotado</span>
        if (Number(actual) <= Number(minimo)) return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-subtle dark:bg-amber-900/20 text-[8px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30"><AlertCircle className="w-2.5 h-2.5" />Stock Bajo</span>
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-subtle dark:bg-emerald-900/20 text-[8px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30"><CheckCircle className="w-2.5 h-2.5" />En Stock</span>
    }

    return (
        <AuthenticatedLayout>
            <Head title="Productos" />

            <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Productos</h1>
                    <p className="text-xs text-hm-400 dark:text-gray-500">{pagination.total ?? data.length} artículos</p>
                </div>
                <Link href="/productos/crear" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-semibold hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all">
                    <Plus className="w-3.5 h-3.5" /> Nuevo
                </Link>
            </div>

            <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-3 mb-3 shadow-hm">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-hm-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchProducts()}
                            placeholder="Buscar por nombre o código..."
                            className="w-full pl-9 pr-3 py-2 rounded-full bg-hm-100/60 dark:bg-slate-800/30 border border-gray-200/60 dark:border-slate-700/50 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20 text-xs outline-none transition-all" />
                    </div>
                    <select value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); router.get('/productos', { estado_stock: e.target.value, search }, { preserveState: true }) }}
                        className="px-3 py-2 rounded-full bg-hm-100/60 dark:bg-slate-800/30 border border-gray-200/60 dark:border-slate-700/50 text-xs focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/20 outline-none transition-all">
                        <option value="todos">Todos</option>
                        <option value="bajo">Stock Bajo</option>
                        <option value="sin_stock">Sin Stock</option>
                    </select>
                    <div className="flex items-center gap-1 p-0.5 rounded-full bg-hm-100/50 dark:bg-slate-800/30">
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-white/50'}`}>
                            <List className="w-3.5 h-3.5 text-hm-500" />
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-white/50'}`}>
                            <Grid3X3 className="w-3.5 h-3.5 text-hm-500" />
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'list' && (
                <div className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 overflow-hidden shadow-hm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5">
                                    <th className="text-left px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Producto</th>
                                    <th className="text-left px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Categoría</th>
                                    <th className="text-right px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Stock</th>
                                    <th className="text-right px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Precio</th>
                                    <th className="text-center px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Estado</th>
                                    <th className="text-right px-4 py-3 text-[9px] font-semibold text-hm-400 uppercase tracking-widest">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.02]">
                                {data.length > 0 ? data.map((p) => (
                                    <tr key={p.id} className="group hover:bg-hm-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{p.nombre}</p>
                                                    <p className="text-[9px] text-hm-400 dark:text-gray-600 font-mono">{p.codigo}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.categoria_nombre ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-hm-100 dark:bg-slate-800/50 text-[9px] font-medium text-hm-600 dark:text-gray-300 border border-gray-100 dark:border-slate-700/50">
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.categoria_color || '#94a3b8' }} />
                                                    {p.categoria_nombre}
                                                </span>
                                            ) : <span className="text-[9px] text-hm-400">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`text-xs font-bold ${Number(p.stock_actual) === 0 ? 'text-red-500' : Number(p.stock_actual) <= Number(p.stock_minimo) ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                {p.stock_actual}
                                            </span>
                                            <span className="text-[9px] text-hm-400 ml-0.5">{p.unidad_medida}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs font-semibold text-gray-900 dark:text-gray-100">
                                            ${Number(p.precio_venta).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <StockBadge actual={p.stock_actual} minimo={p.stock_minimo} />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <Link href={`/productos/${p.id}/editar`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-hm-100 dark:bg-slate-800/40 text-[9px] font-medium text-hm-500 dark:text-gray-400 hover:bg-hm-200 dark:hover:bg-slate-700/40 transition-all">
                                                    <Pencil className="w-2.5 h-2.5" /> Editar
                                                </Link>
                                                <button onClick={() => handleDelete(p.id, p.nombre)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-subtle dark:bg-red-900/10 text-[9px] font-medium text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all">
                                                    <Trash2 className="w-2.5 h-2.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="px-4 py-10 text-center">
                                        <Package className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                                        <p className="text-xs text-hm-400 dark:text-gray-500 mb-2">No se encontraron productos</p>
                                        <Link href="/productos/crear" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-semibold">
                                            <Plus className="w-3 h-3" /> Crear primer producto
                                        </Link>
                                    </td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {pagination?.totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/5">
                            <p className="text-[9px] text-hm-400">Mostrando {data.length} de {pagination.total}</p>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                    <Link key={page} href={`/productos?page=${page}`}
                                        className={`w-7 h-7 flex items-center justify-center rounded-full text-[9px] font-semibold transition-all ${
                                            page === pagination.page ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-premium' : 'text-hm-500 dark:text-gray-400 hover:bg-hm-100 dark:hover:bg-slate-800/40'
                                        }`}>{page}</Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {data.length > 0 ? data.map((p) => (
                        <div key={p.id} className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-4 shadow-hm hover:shadow-hm-md transition-all group">
                            <div className="flex items-start justify-between mb-3">
                                <Link href={`/productos/${p.id}/editar`} className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                                    <Package className="w-4.5 h-4.5 text-sky-600 dark:text-sky-400" />
                                </Link>
                                <div className="flex items-center gap-1">
                                    <StockBadge actual={p.stock_actual} minimo={p.stock_minimo} />
                                    <button onClick={() => handleDelete(p.id, p.nombre)} className="p-1.5 rounded-full hover:bg-rose-subtle dark:hover:bg-red-900/10 transition-colors opacity-0 group-hover:opacity-100" title="Eliminar">
                                        <Trash2 className="w-3 h-3 text-red-400" />
                                    </button>
                                </div>
                            </div>
                            <Link href={`/productos/${p.id}/editar`}>
                                <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{p.nombre}</h3>
                                <p className="text-[9px] text-hm-400 dark:text-gray-600 font-mono">{p.codigo}</p>
                            </Link>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-white/5">
                                <div>
                                    <p className="text-[9px] text-hm-400">Stock</p>
                                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{p.stock_actual} <span className="text-[9px] font-normal text-hm-400">{p.unidad_medida}</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-hm-400">Precio</p>
                                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">${Number(p.precio_venta).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-10">
                            <Package className="w-6 h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                            <p className="text-xs text-hm-400 dark:text-gray-500">No se encontraron productos</p>
                        </div>
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    )
}
