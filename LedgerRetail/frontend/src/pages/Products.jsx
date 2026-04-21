import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import productService from '../services/productService'

const emptyForm = { name: '', category: '', categoryName: '', price: '', stockQuantity: '', sku: '', description: '' }

function StatusBadge({ status }) {
  if (status === 'In Stock')    return <span className="flex items-center gap-2 text-xs font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />In Stock</span>
  if (status === 'Critical')    return <span className="flex items-center gap-2 text-xs font-semibold text-error"><span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />Critical</span>
  return <span className="flex items-center gap-2 text-xs font-semibold text-secondary"><span className="w-1.5 h-1.5 rounded-full bg-outline" />Out of Stock</span>
}

export default function Products() {
  const [products, setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [page, setPage]           = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm]           = useState(emptyForm)
  const [search, setSearch]       = useState('')
  const [saving, setSaving]       = useState(false)
  const [lowStockCount, setLowStockCount] = useState(0)
  const [error, setError]         = useState('')

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await productService.getAll({ search, page, size: 10 })
      setProducts(res?.content || [])
      setTotalPages(res?.totalPages || 1)
      setTotalItems(res?.totalElements || 0)
    } catch { setError('Failed to load products. Is the backend running?') }
    finally { setLoading(false) }
  }, [search, page])

  useEffect(() => { loadProducts() }, [loadProducts])

  useEffect(() => {
    productService.getCategories().then(cats => setCategories(cats || [])).catch(() => {})
    productService.getLowStock().then(ls => setLowStockCount(ls?.length || 0)).catch(() => {})
  }, [])

  const openAdd  = () => { setEditProduct(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (p) => {
    setEditProduct(p)
    setForm({ name: p.name, category: p.category || '', categoryName: p.category || '', price: p.price, stockQuantity: p.stockQuantity, sku: p.sku || '', description: p.description || '' })
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditProduct(null); setForm(emptyForm) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { name: form.name, description: form.description, price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity), sku: form.sku, categoryName: form.categoryName || form.category }
      if (editProduct) await productService.update(editProduct.id, payload)
      else             await productService.create(payload)
      closeModal()
      loadProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try { await productService.delete(id); loadProducts() }
    catch (err) { alert(err.response?.data?.message || 'Delete failed') }
  }

  return (
    <Layout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">Inventory Management</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-secondary-fixed">Products Catalogue</h2>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2.5 rounded-full bg-surface-container-highest text-primary font-semibold text-sm hover:bg-surface-container-high transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">file_download</span>Export
            </button>
            <button onClick={openAdd} className="px-8 py-2.5 rounded-full teal-gradient text-on-primary font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-base">add_circle</span>Add Product
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1 p-6 rounded-lg bg-surface-container-lowest ghost-border flex flex-col justify-between h-40">
            <span className="material-symbols-outlined text-primary-container">inventory</span>
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Total SKUs</p>
              <h3 className="text-3xl font-extrabold text-on-surface">{totalItems}</h3></div>
          </div>
          <div className="col-span-1 p-6 rounded-lg bg-surface-container-lowest ghost-border flex flex-col justify-between h-40">
            <span className="material-symbols-outlined text-error">warning</span>
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Low Stock</p>
              <h3 className="text-3xl font-extrabold text-on-surface">{lowStockCount}</h3></div>
          </div>
          <div className="col-span-2 p-6 rounded-lg teal-gradient text-on-primary flex flex-col justify-between h-40 relative overflow-hidden">
            <span className="material-symbols-outlined text-primary-fixed">trending_up</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed opacity-80 mb-1">All prices in</p>
              <h3 className="text-3xl font-extrabold">₹ Indian Rupees</h3>
            </div>
          </div>
        </div>

        {error && <div className="p-4 bg-error-container rounded-lg text-on-error-container text-sm font-medium">{error}</div>}

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-lg ghost-border overflow-hidden">
          <div className="px-8 py-6 flex items-center justify-between bg-surface-container-low/50">
            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />Active Inventory
            </h4>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
                placeholder="Search products..." className="pl-9 pr-4 py-2 bg-surface-container rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20 border-none" />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-[10px] font-bold uppercase tracking-[0.1em] text-secondary">
                    {['Product Name','Category','Price (₹)','Stock Level','Status','Actions'].map(h => (
                      <th key={h} className="px-8 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-secondary">No products found</td></tr>
                  ) : products.map(p => {
                    const pct = Math.min(100, Math.round((p.stockQuantity / 200) * 100))
                    return (
                      <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors group border-t border-surface-container/50">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                              <span className="material-symbols-outlined text-primary text-sm">inventory_2</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{p.name}</p>
                              <p className="text-[10px] text-outline font-medium">SKU: {p.sku || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-[10px] font-bold uppercase">{p.category || '—'}</span>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-on-surface">₹{Number(p.price).toLocaleString('en-IN')}</p>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1.5 w-32">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span>{p.stockQuantity} units</span>
                              <span className={p.stockQuantity === 0 ? 'text-error font-extrabold' : p.stockQuantity < 10 ? 'text-error' : 'text-secondary'}>
                                {p.stockQuantity === 0 ? 'Out' : `${pct}%`}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${p.stockQuantity === 0 ? 'bg-outline-variant/30' : p.stockQuantity < 10 ? 'bg-error' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5"><StatusBadge status={p.status} /></td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(p)} className="p-2 rounded-full hover:bg-surface-container text-primary transition-colors">
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 rounded-full hover:bg-error-container text-error transition-colors">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-8 py-6 flex items-center justify-between bg-surface-container-low/20">
            <p className="text-xs font-semibold text-secondary">Showing {products.length} of {totalItems} entries</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container hover:bg-surface-container-high disabled:opacity-30">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium ${i === page ? 'bg-primary text-white font-bold' : 'hover:bg-surface-container'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-container hover:bg-surface-container-high disabled:opacity-30">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-lg shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-surface-container flex items-center justify-between">
              <h3 className="text-lg font-bold text-on-surface">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={closeModal}><span className="material-symbols-outlined text-outline">close</span></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="micro-label text-on-surface-variant block mb-1.5">Product Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30"
                    placeholder="e.g. iPhone 15" />
                </div>
                <div>
                  <label className="micro-label text-on-surface-variant block mb-1.5">Category</label>
                  <input value={form.categoryName} onChange={e => setForm({...form, categoryName: e.target.value})}
                    list="cat-list"
                    className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent"
                    placeholder="Electronics" />
                  <datalist id="cat-list">
                    {categories.map(c => <option key={c.id} value={c.name} />)}
                  </datalist>
                </div>
                <div>
                  <label className="micro-label text-on-surface-variant block mb-1.5">SKU</label>
                  <input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent"
                    placeholder="e.g. APL-IP15-128" />
                </div>
                <div>
                  <label className="micro-label text-on-surface-variant block mb-1.5">Price (₹) *</label>
                  <input required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent"
                    placeholder="0.00" />
                </div>
                <div>
                  <label className="micro-label text-on-surface-variant block mb-1.5">Stock Qty *</label>
                  <input required type="number" min="0" value={form.stockQuantity} onChange={e => setForm({...form, stockQuantity: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent"
                    placeholder="0" />
                </div>
                <div className="col-span-2">
                  <label className="micro-label text-on-surface-variant block mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    rows={3} className="w-full px-4 py-3 bg-surface-container-low rounded-DEFAULT text-sm outline-none focus:ring-2 focus:ring-primary/20 border border-transparent resize-none"
                    placeholder="Product description..." />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-full bg-surface-container text-secondary font-semibold text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-full teal-gradient text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-70">
                  {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</> : (editProduct ? 'Update' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
