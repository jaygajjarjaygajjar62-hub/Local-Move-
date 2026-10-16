import React, { useState } from 'react'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import {
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Save,
} from 'lucide-react'

interface FAQItem {
  id: string
  category: 'customer' | 'driver' | 'safety'
  question: string
  answer: string
}

interface ProhibitedItem {
  id: string
  name: string
  category: string
  fineAmount: number
  riskLevel: 'critical' | 'high' | 'medium'
}

export const AdminContentPage: React.FC = () => {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'prohibited' | 'faqs' | 'terms'>('prohibited')

  // Prohibited Items state
  const [prohibitedItems, setProhibitedItems] = useState<ProhibitedItem[]>([
    { id: 'p-1', name: 'Explosives, Fireworks & Gunpowder', category: 'Hazardous', fineAmount: 10000, riskLevel: 'critical' },
    { id: 'p-2', name: 'Loose Flammable Solvents & Fuel', category: 'Flammable', fineAmount: 5000, riskLevel: 'critical' },
    { id: 'p-3', name: 'Physical Cash Currency (> ₹50,000)', category: 'Financial', fineAmount: 2000, riskLevel: 'high' },
    { id: 'p-4', name: 'Illegal Narcotics & Contraband', category: 'Legal', fineAmount: 15000, riskLevel: 'critical' },
    { id: 'p-5', name: 'Live Animals or Livestock', category: 'Biological', fineAmount: 2500, riskLevel: 'medium' },
    { id: 'p-6', name: 'Unpackaged Corrosive Acids', category: 'Chemical', fineAmount: 7500, riskLevel: 'critical' },
  ])

  const [newItemModalOpen, setNewItemModalOpen] = useState(false)
  const [newProhibitedName, setNewProhibitedName] = useState('')
  const [newProhibitedCategory, setNewProhibitedCategory] = useState('')
  const [newProhibitedFine, setNewProhibitedFine] = useState(2500)
  const [newProhibitedRisk, setNewProhibitedRisk] = useState<'critical' | 'high' | 'medium'>('high')

  // FAQ state
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: 'faq-1',
      category: 'customer',
      question: 'How do I know my goods are safe with Local Move?',
      answer: 'Every trip requires photo verification before loading and at drop-off. Delivery partners are background-checked with verified Aadhaar and driving license. Live GPS tracking is provided throughout the trip.',
    },
    {
      id: 'faq-2',
      category: 'customer',
      question: 'Can the receiver track the delivery without installing the app?',
      answer: 'Yes! When you book, a secure SMS/WhatsApp tracking link is generated for the recipient. They can open it directly in any mobile browser to watch the delivery live.',
    },
    {
      id: 'faq-3',
      category: 'driver',
      question: 'When do I receive my daily earnings payout?',
      answer: 'Online trips are settled automatically to your verified bank account daily at midnight. Cash collected can be retained, with only company commission (20%) settled through your partner wallet.',
    },
    {
      id: 'faq-4',
      category: 'safety',
      question: 'What is the compensation protocol if goods are damaged?',
      answer: 'If item protection was selected during booking, damage claims are resolved within 24 to 48 hours using side-by-side photographic evidence from pickup and drop inspections.',
    },
  ])

  const [editFaqModal, setEditFaqModal] = useState<FAQItem | null>(null)

  // Policy text
  const [cancellationPolicy, setCancellationPolicy] = useState(
    `1. Free Cancellation: Customers can cancel free of charge before a delivery partner is dispatched.
2. Dispatched Cancellation: If cancelled after a partner has driven toward pickup, a nominal dispatch fee (₹30 for two-wheelers, ₹60 for trucks) is charged to compensate the driver for fuel.
3. Arrived Cancellation: If cancelled after partner arrives at pickup, standard base fare applies.
4. Waiting Policy: 10 minutes free wait at pickup/drop. Thereafter ₹3/minute waiting charge is applied.`
  )

  const handleAddProhibitedItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProhibitedName.trim()) return

    const newItem: ProhibitedItem = {
      id: `p-${Date.now()}`,
      name: newProhibitedName,
      category: newProhibitedCategory || 'Restricted',
      fineAmount: Number(newProhibitedFine),
      riskLevel: newProhibitedRisk,
    }
    setProhibitedItems([...prohibitedItems, newItem])
    setNewItemModalOpen(false)
    setNewProhibitedName('')
    setNewProhibitedCategory('')
    showToast({
      title: 'Prohibited List Updated',
      message: `${newItem.name} added to prohibited manifest.`,
      type: 'success',
    })
  }

  const handleDeleteProhibited = (id: string) => {
    setProhibitedItems(prohibitedItems.filter((i) => i.id !== id))
    showToast({
      title: 'Item Removed',
      message: 'Item removed from prohibited manifest.',
      type: 'info',
    })
  }

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editFaqModal) return

    setFaqs(faqs.map((f) => (f.id === editFaqModal.id ? editFaqModal : f)))
    setEditFaqModal(null)
    showToast({
      title: 'FAQ Updated',
      message: 'Question updated in public knowledgebase.',
      type: 'success',
    })
  }

  const handleSaveTerms = () => {
    showToast({
      title: 'Cancellation Policy Published',
      message: 'Updated terms live on customer and receiver portals.',
      type: 'success',
    })
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Policies & Content CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage prohibited item manifests, customer FAQs, and operating terms published across Aera apps.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-200/80 p-1 rounded-lg text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('prohibited')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'prohibited' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prohibited Manifest
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'faqs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Help FAQs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'terms' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancellation Policy
          </button>
        </div>
      </div>

      {/* Tab: Prohibited Goods */}
      {activeTab === 'prohibited' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Items flagged here trigger automated booking warnings and driver rejection authorization.
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setNewItemModalOpen(true)}
            >
              Add Prohibited Good
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Item / Material</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Risk Severity</th>
                  <th className="px-4 py-3">Violation Penalty</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prohibitedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.category}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          item.riskLevel === 'critical'
                            ? 'danger'
                            : item.riskLevel === 'high'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {item.riskLevel.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                      ₹{item.fineAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteProhibited(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Live FAQs rendered on public landing page and in-app support drawer.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 relative flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="default">
                      {faq.category.toUpperCase()}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => setEditFaqModal(faq)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Terms & Cancellation */}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Cancellation & Waiting Policy Statement
            </h3>
            <p className="text-xs text-slate-500">
              This text is displayed when a customer initiates a booking cancellation or reviews terms.
            </p>
          </div>

          <Textarea
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value)}
            rows={8}
            className="font-mono text-xs leading-relaxed"
          />

          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSaveTerms}
            >
              Publish Updated Policy
            </Button>
          </div>
        </div>
      )}

      {/* Add Prohibited Item Modal */}
      <Modal
        isOpen={newItemModalOpen}
        onClose={() => setNewItemModalOpen(false)}
        title="Add Prohibited Item"
        description="Register a high-risk cargo item to the platform prohibited list."
      >
        <form onSubmit={handleAddProhibitedItem} className="space-y-3 text-left">
          <Input
            label="Item Description"
            placeholder="e.g. Unlicensed fireworks, acid cans"
            value={newProhibitedName}
            onChange={(e) => setNewProhibitedName(e.target.value)}
            required
          />
          <Input
            label="Category"
            placeholder="e.g. Flammable, Explosive, Contraband"
            value={newProhibitedCategory}
            onChange={(e) => setNewProhibitedCategory(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Penalty Amount (₹)"
              type="number"
              value={newProhibitedFine}
              onChange={(e) => setNewProhibitedFine(Number(e.target.value))}
              required
            />
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Risk Level
              </label>
              <select
                value={newProhibitedRisk}
                onChange={(e) => setNewProhibitedRisk(e.target.value as any)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="critical">Critical (Zero Tolerance)</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
              </select>
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setNewItemModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit FAQ Modal */}
      {editFaqModal && (
        <Modal
          isOpen={!!editFaqModal}
          onClose={() => setEditFaqModal(null)}
          title="Edit FAQ Entry"
          description="Update public knowledgebase answer."
        >
          <form onSubmit={handleSaveFaq} className="space-y-3 text-left">
            <Input
              label="Question"
              value={editFaqModal.question}
              onChange={(e) => setEditFaqModal({ ...editFaqModal, question: e.target.value })}
              required
            />
            <Textarea
              label="Answer"
              value={editFaqModal.answer}
              onChange={(e) => setEditFaqModal({ ...editFaqModal, answer: e.target.value })}
              rows={4}
              required
            />
            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditFaqModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save FAQ
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
