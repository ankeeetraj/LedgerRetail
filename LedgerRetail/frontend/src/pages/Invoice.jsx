import { useEffect, useState } from 'react'
import Layout from '../components/Layout'

const fmt = n => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

export default function Invoice() {
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('current_invoice')
    if (stored) {
      try { setInvoice(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  if (loading) return (
    <Layout><div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></Layout>
  )

  if (!invoice) return (
    <Layout>
      <div className="p-8 text-center text-secondary">
        <span className="material-symbols-outlined text-5xl mb-4 block text-outline">receipt_long</span>
        <p className="text-lg font-bold">No invoice loaded</p>
        <p className="text-sm mt-2">Generate a bill from the New Bill page to view an invoice here.</p>
      </div>
    </Layout>
  )

  const cgst = invoice.cgst ?? (invoice.totalGst ?? invoice.tax ?? 0) / 2
  const sgst = invoice.sgst ?? (invoice.totalGst ?? invoice.tax ?? 0) / 2

  return (
    <Layout>
      {/* Actions */}
      <div className="no-print px-8 pt-8 pb-0 flex justify-between items-end mb-4">
        <div>
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-secondary mb-2">
            <span>Invoices</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary font-bold">{invoice.invoiceNumber}</span>
          </nav>
          <h2 className="text-3xl font-extrabold tracking-tighter text-primary">Invoice Details</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.print()}
            className="flex items-center gap-2 bg-surface-container-highest text-primary px-5 py-2.5 rounded-full text-sm font-medium hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-lg">print</span>Print
          </button>
          <button className="flex items-center gap-2 teal-gradient text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-lg">download</span>Download PDF
          </button>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="max-w-5xl mx-auto bg-surface-container-lowest rounded-lg shadow-[0_12px_40px_rgba(29,32,35,0.06)] overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-primary-container p-12 text-white flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-lg">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Ledger Retail</h3>
                  <p className="text-sm text-primary-fixed/80">GST No: 29ABCDE1234F1Z5</p>
                </div>
              </div>
              <div className="pt-2 space-y-1 opacity-90 text-sm">
                <p>42, MG Road, Bengaluru, Karnataka 560001</p>
                <p>billing@ledgerretail.in | +91 80 4000 0000</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block bg-primary-fixed text-primary px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                {invoice.status || 'PAID'}
              </div>
              <h4 className="text-5xl font-black tracking-tighter mb-2">INVOICE</h4>
              <p className="text-primary-fixed font-medium">{invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-3 gap-12 p-12 bg-surface-container-low">
            <div>
              <p className="text-[10px] font-label uppercase tracking-widest text-secondary mb-3">Bill To</p>
              <h5 className="text-lg font-bold text-on-surface mb-1">{invoice.customer?.name || 'Walk-in Customer'}</h5>
              <div className="text-sm text-on-surface-variant space-y-1">
                {invoice.customer?.company && <p>{invoice.customer.company}</p>}
                {invoice.customer?.email   && <p>{invoice.customer.email}</p>}
                {invoice.customer?.phone   && <p>{invoice.customer.phone}</p>}
                {invoice.customer?.address && <p>{invoice.customer.address}</p>}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-label uppercase tracking-widest text-secondary mb-3">Invoice Dates</p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-on-surface-variant">Issue Date</p>
                  <p className="text-sm font-semibold">{invoice.issueDate || new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant">Due Date</p>
                  <p className="text-sm font-semibold">{invoice.dueDate || 'Net 14 Days'}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant">Payment Method</p>
                  <p className="text-sm font-semibold capitalize">{invoice.paymentMethod || '—'}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-label uppercase tracking-widest text-secondary mb-3">Total Amount</p>
              <p className="text-4xl font-bold text-primary tracking-tight">{fmt(invoice.total)}</p>
              <p className="text-xs text-secondary mt-2">Includes 18% GST</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="p-12">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-label uppercase tracking-[0.1em] text-secondary border-b border-surface-variant">
                  <th className="pb-6 font-semibold">Description</th>
                  <th className="pb-6 font-semibold text-center w-20">Qty</th>
                  <th className="pb-6 font-semibold text-right w-36">Unit Price</th>
                  <th className="pb-6 font-semibold text-right w-36">Total</th>
                </tr>
              </thead>
              <tbody>
                {(invoice.items || []).map((item, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-surface-container-low/30' : ''}>
                    <td className="py-5">
                      <p className="font-bold text-on-surface">{item.productName || item.name}</p>
                      <p className="text-xs text-on-surface-variant mt-1">SKU: {item.sku || '—'}</p>
                    </td>
                    <td className="py-5 text-center text-sm font-medium">{item.quantity || item.qty}</td>
                    <td className="py-5 text-right text-sm font-medium">{fmt(item.unitPrice || item.price)}</td>
                    <td className="py-5 text-right text-sm font-bold text-primary">{fmt(item.lineTotal || ((item.unitPrice || item.price) * (item.quantity || item.qty)))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* GST Summary */}
            <div className="mt-12 flex justify-end">
              <div className="w-full max-w-sm">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Subtotal (before GST)</span>
                    <span className="font-medium">{fmt(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>CGST @ 9%</span>
                    <span className="font-medium">{fmt(cgst)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>SGST @ 9%</span>
                    <span className="font-medium">{fmt(sgst)}</span>
                  </div>
                  {Number(invoice.discount) > 0 && (
                    <div className="flex justify-between text-sm text-on-surface-variant">
                      <span>Discount</span>
                      <span className="text-error font-medium">-{fmt(invoice.discount)}</span>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t-2 border-primary flex justify-between items-end">
                  <span className="text-sm font-bold text-on-surface uppercase tracking-wider">Total Amount</span>
                  <span className="text-3xl font-black text-primary tracking-tighter">{fmt(invoice.total)}</span>
                </div>
                <p className="text-[10px] text-outline mt-2 text-right">All amounts in Indian Rupees (INR)</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-10 border-t border-surface-variant grid grid-cols-2 gap-12">
              <div>
                <p className="text-[10px] font-label uppercase tracking-widest text-secondary mb-3">Notes</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {invoice.notes || 'Thank you for your business. Please quote invoice number on all payments. This is a computer-generated invoice and does not require a signature.'}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">verified</span>
                  <p className="text-[10px] text-secondary font-medium">Secured by LedgerPay • GST Compliant Invoice</p>
                </div>
              </div>
              <div className="flex flex-col justify-end items-end">
                <p className="italic text-secondary text-sm">Thank you for your business!</p>
                <div className="mt-6 w-32 h-12 bg-surface-container-low flex items-center justify-center rounded border border-dashed border-outline-variant">
                  <p className="text-[10px] text-outline uppercase font-bold tracking-widest">Authorised</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
