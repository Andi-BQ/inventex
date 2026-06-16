import { Head, useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Save, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CrearCategoria({ categoria }) {
    const isEditing = !!categoria
    const { data, setData, post, put, processing, errors } = useForm({
        nombre: categoria?.nombre || '',
        descripcion: categoria?.descripcion || '',
        color: categoria?.color || '#2563eb',
        activo: categoria?.activo ?? true,
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const options = {
            onSuccess: () => toast.success(isEditing ? 'Categoría actualizada' : 'Categoría creada'),
            onError: () => {},
        }
        isEditing ? put(`/categorias/${categoria.id}`, options) : post('/categorias', options)
    }

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? 'Editar Categoría' : 'Nueva Categoría'} />
            <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-4">
                    <a href="/categorias" className="p-1.5 rounded-full hover:bg-hm-100 dark:hover:bg-gray-700/50 transition-colors">
                        <ArrowLeft className="w-4 h-4 text-hm-400" />
                    </a>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h1>
                </div>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-hm-800/30 rounded-2xl border border-gray-100/60 dark:border-white/5 p-5 shadow-hm">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Nombre *</label>
                            <input type="text" name="nombre" value={data.nombre} onChange={e => setData('nombre', e.target.value)} required
                                className="w-full px-3 py-2 rounded-full bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                            {errors.nombre && <p className="text-xs text-rose-500 mt-1">{errors.nombre}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Descripción</label>
                            <textarea name="descripcion" value={data.descripcion} onChange={e => setData('descripcion', e.target.value)} rows={2}
                                className="w-full px-3 py-2 rounded-xl bg-hm-100/60 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-hm-600 dark:text-gray-400 mb-1">Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" name="color" value={data.color} onChange={e => setData('color', e.target.value)} className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer" />
                                <span className="text-[10px] text-hm-400">{data.color}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="activo" checked={data.activo} onChange={e => setData('activo', e.target.checked)} id="activo"
                                className="rounded border-gray-300 dark:border-gray-600 text-sky-500 focus:ring-sky-500" />
                            <label htmlFor="activo" className="text-[10px] font-medium text-hm-600 dark:text-gray-400">Activa</label>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
                        <button type="submit" disabled={processing}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-xs font-medium hover:from-sky-600 hover:to-indigo-700 shadow-premium transition-all disabled:opacity-50">
                            <Save className="w-3.5 h-3.5" />
                            {processing ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
                        </button>
                        <a href="/categorias" className="px-4 py-2 rounded-full bg-hm-100 dark:bg-gray-700/50 text-hm-600 dark:text-gray-400 text-xs font-medium hover:bg-hm-200 dark:hover:bg-gray-700 transition-colors">Cancelar</a>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    )
}