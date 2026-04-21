import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import productService from '../services/productService'
import customerService from '../services/customerService'
import orderService from '../services/orderService'

const GST = 0.18
const fmt = n => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

export default function NewBill() {
  const navigate = useNavigate()
  const [products, setProducts]   = useState([])
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [cart, setCart]           = useState([])
  const [discount, setDiscount]   = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [custSearch, setCustSearch] = useState('')
  const [prodSearch, setProdSearch] = useState('')
  const [placing, setPlacing]     = useState(false)
  const [loadingProds, setLoadingProds] = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    productService.getAll({ size: 50 })
      .then(res => setProducts(res?.content || []))
      .catch(() => {})
      .finally(() => setLoadingProds(false))

    customerService.getAll({ size: 50 })
      .then(res => setCustomers(res?.content || []))
      .catch(() => {})
  }, [])

  const filteredProds = products.filter(p =>
    p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(prodSearch.toLowerCase())
  )

  const filteredCusts = customers.filter(c =>
    c.name.toLowerCase().includes(custSearch.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(custSearch.toLowerCase())
  ).slice(0, 4)

  const addToCart = (p) => {
    if (p.stockQuantity === 0) return
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id)
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: Math.min(i.qty + 1, p.stockQuantity) } : i)
      return [...prev, { ...p, qty: 1 }]
    })
  }

  const updateQty = (id, delta) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0))

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const tax      = subtotal * GST
  const cgst     = tax / 2
  const sgst     = tax / 2
  const total    = subtotal + tax - discount

  const handlePlace = async () => {
    if (cart.length === 0) { setError('Add at least one product'); return }
    setPlacing(true); setError('')
    try {
      const order = await orderService.create({
        customerId:    selectedCustomer?.id || null,
        items:         cart.map(i => ({ productId: i.id, quantity: i.qty })),
        discount:      discount,
        paymentMethod: paymentMethod,
      })
      // Fetch invoice and navigate
      const invoice = await orderService.getInvoice(order.id)
      localStorage.setItem('current_invoice', JSON.stringify(invoice))
      navigate('/invoices')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally { setPlacing(false) }
  }

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Transaction Suite</span>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface mt-1">New Bill</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-outline font-medium">DATE</p>
            <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' })}</p>
          </div>
        </div>

        {error && <div className="p-4 bg-error-container rounded-lg text-on-error-container text-sm font-medium">{error}</div>}

        <div className="grid grid-cols-12 gap-6">
          {/* Left */}
          <div className="col-span-8 space-y-6">
            {/* Customer Selection */}
            <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-outline mb-4">Select Customer</h3>
              <div className="relative mb-4">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">person_search</span>
                <input type="text" value={custSearch} onChange={e => setCustSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low rounded-lg text-sm outline-none border-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Search customer..." />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setSelectedCustomer(null)}
                  className={`p-4 rounded-lg text-left border-2 transition-all ${!selectedCustomer ? 'border-primary bg-surface-container-low' : 'border-surface-container hover:border-primary/30'}`}>
                  <p className="text-sm font-bold">Walk-in Customer</p>
                  <p className="text-[11px] text-outline">No account needed</p>
                </button>
                {filteredCusts.map(c => (
                  <button key={c.id} onClick={() => setSelectedCustomer(c)}
                    className={`p-4 rounded-lg text-left border-2 transition-all ${selectedCustomer?.id === c.id ? 'border-primary bg-surface-container-low' : 'border-surface-container hover:border-primary/30'}`}>
                    <p className="text-sm font-bold truncate">{c.name}</p>
                    <p className="text-[11px] text-outline truncate">{c.email || c.phone}</p>
                  </button>
                ))}
              </div>
              {selectedCustomer && (
                <div className="mt-3 p-3 bg-primary-fixed/20 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span className="text-sm font-semibold text-primary">Selected: {selectedCustomer.name}</span>
                  <button onClick={() => setSelectedCustomer(null)} className="ml-auto"><span className="material-symbols-outlined text-sm text-outline">close</span></button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-outline">Products</h3>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
                  <input type="text" value={prodSearch} onChange={e => setProdSearch(e.target.value)}
                    placeholder="Search..." className="pl-9 pr-4 py-2 bg-surface-container-low rounded-full text-sm outline-none border-none" />
                </div>
              </div>
              {loadingProds ? (
                <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <div className="grid grid-cols-3 gap-4 max-h-[360px] overflow-y-auto pr-2">
                  {filteredProds.map(p => (
                    <button key={p.id} onClick={() => addToCart(p)} disabled={p.stockQuantity === 0}
                      className={`group relative rounded-lg p-4 text-left transition-all active:scale-95 ${p.stockQuantity === 0 ? 'bg-surface-container-low opacity-50 cursor-not-allowed' : 'bg-surface-container-low hover:bg-surface-container'}`}>
                      <div className="w-full h-16 mb-3 rounded-lg bg-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl">inventory_2</span>
                      </div>
                      <h4 className="text-xs font-bold text-on-surface leading-tight">{p.name}</h4>
                      <p className="text-primary font-bold text-sm mt-1">{fmt(p.price)}</p>
                      <p className="text-[10px] text-outline">{p.stockQuantity === 0 ? 'Out of stock' : `${p.stockQuantity} left`}</p>
                      {cart.find(i => i.id === p.id) && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full teal-gradient text-white text-[10px] font-bold flex items-center justify-center">
                          {cart.find(i => i.id === p.id)?.qty}
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-primary text-lg">add_circle</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="col-span-4 sticky top-24 h-fit">
            <div className="bg-surface-container-lowest rounded-lg shadow-xl overflow-hidden">
              <div className="teal-gradient p-6 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Current Bill</h3>
                  <span className="material-symbols-outlined">shopping_cart</span>
                </div>
                <p className="text-xs opacity-70 mt-1">GST included at 18%</p>
              </div>

              <div className="p-6 max-h-[320px] overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-outline">
                    <span className="material-symbols-outlined text-4xl mb-2">shopping_cart</span>
                    <p className="text-sm">Cart is empty</p>
                    <p className="text-xs">Click products to add</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{item.name}</p>
                          <p className="text-[11px] text-outline">{fmt(item.price)} each</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1">
                            <button onClick={() => updateQty(item.id, -1)}><span className="material-symbols-outlined text-xs">remove</span></button>
                            <span className="text-xs font-bold px-2">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)}><span className="material-symbols-outlined text-xs">add</span></button>
                          </div>
                          <p className="text-sm font-bold w-20 text-right">{fmt(item.price * item.qty)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-dashed border-outline-variant space-y-2">
                    <div className="flex justify-between text-xs text-outline"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                    <div className="flex justify-between text-xs text-outline"><span>CGST (9%)</span><span>{fmt(cgst)}</span></div>
                    <div className="flex justify-between text-xs text-outline"><span>SGST (9%)</span><span>{fmt(sgst)}</span></div>
                    <div className="flex justify-between text-xs text-outline items-center">
                      <span>Discount (₹)</span>
                      <input type="number" min="0" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                        className="w-20 text-xs text-right bg-surface-container-low rounded px-2 py-1 outline-none border-none focus:ring-1 focus:ring-primary/20" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-surface-container-low">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-outline">Grand Total</span>
                  <span className="text-2xl font-extrabold text-primary tracking-tighter">{fmt(Math.max(0, total))}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button onClick={() => setPaymentMethod('cash')}
                    className={`flex flex-col items-center py-3 rounded-lg border-2 transition-colors ${paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-surface-container bg-surface-container-lowest hover:bg-primary/5'}`}>
                    <span className="material-symbols-outlined text-primary">payments</span>
                    <span className="text-[10px] font-bold uppercase mt-1">Cash</span>
                  </button>
                  <button onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center py-3 rounded-lg border-2 transition-colors ${paymentMethod === 'card' ? 'border-primary teal-gradient text-white' : 'border-surface-container bg-surface-container-lowest'}`}>
                    <span className="material-symbols-outlined">credit_card</span>
                    <span className="text-[10px] font-bold uppercase mt-1">Card / UPI</span>
                  </button>
                </div>
                <button onClick={handlePlace} disabled={cart.length === 0 || placing}
                  className="w-full teal-gradient text-white font-bold py-4 rounded-full shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {placing ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Placing...</> : <><span>Generate Invoice</span><span className="material-symbols-outlined">arrow_forward</span></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
