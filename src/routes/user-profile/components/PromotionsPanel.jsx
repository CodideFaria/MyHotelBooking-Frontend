import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPen, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

/* -------------------------------------------------------------------------- */
/*                          ⤵️  Static seed data here                         */
/* -------------------------------------------------------------------------- */

const initialPromotions = [
  {
    id: uuidv4(),
    hotel_id: 'HTL‑001',
    title: 'Spring Sale',
    description: 'Save 20% on Deluxe rooms during May.',
    discount_percentage: 20,
    start_date: '2025-05-01',
    end_date: '2025-05-31',
    is_active: true,
  },
  {
    id: uuidv4(),
    hotel_id: 'HTL‑002',
    title: 'Summer Early‑Bird',
    description: 'Book now for July & receive 15% off + free breakfast.',
    discount_percentage: 15,
    start_date: '2025-06-01',
    end_date: '2025-06-30',
    is_active: false,
  },
];

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

const blankForm = {
  hotelId: '',
  title: '',
  description: '',
  discountPercentage: '',
  startDate: '',
  endDate: '',
  isActive: true,
};

const PromotionsPanel = () => {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  /* -------------------------------- Helpers -------------------------------- */
  const resetForm = () => {
    setForm(blankForm);
    setEditingId(null);
  };

  /* -------------------------------- Handlers -------------------------------- */
  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (promo) => {
    setForm({
      hotelId: promo.hotel_id,
      title: promo.title,
      description: promo.description,
      discountPercentage: promo.discount_percentage,
      startDate: promo.start_date,
      endDate: promo.end_date,
      isActive: promo.is_active,
    });
    setEditingId(promo.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      // Update existing
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                hotel_id: form.hotelId,
                title: form.title,
                description: form.description,
                discount_percentage: parseFloat(form.discountPercentage),
                start_date: form.startDate,
                end_date: form.endDate,
                is_active: form.isActive,
              }
            : p
        )
      );
    } else {
      // Add new
      const newPromo = {
        id: uuidv4(),
        hotel_id: form.hotelId,
        title: form.title,
        description: form.description,
        discount_percentage: parseFloat(form.discountPercentage),
        start_date: form.startDate,
        end_date: form.endDate,
        is_active: form.isActive,
      };
      setPromotions((prev) => [...prev, newPromo]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const toggleActive = (id) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    );
  };

  const handleDelete = () => {
    setPromotions((prev) => prev.filter((p) => p.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  /* -------------------------------- Render -------------------------------- */
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-brand">Promotions</h2>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-3 py-2 bg-brand text-white rounded hover:bg-brand-dark transition">
          <FontAwesomeIcon icon={faPlus} /> Add Promotion
        </button>
      </div>

      {/* List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {promotions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No promotions yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            <AnimatePresence>
              {promotions.map((promo) => (
                <motion.li
                  key={promo.id}
                  className="bg-white hover:bg-gray-50"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
                  layout>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-brand truncate">
                          {promo.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Discount: {promo.discount_percentage}% | {promo.start_date} → {promo.end_date}
                        </p>
                        {promo.description && (
                          <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                            {promo.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-3">
                        <button
                          onClick={() => toggleActive(promo.id)}
                          className="text-brand hover:text-brand-dark"
                          title={promo.is_active ? 'Deactivate' : 'Activate'}>
                          <FontAwesomeIcon
                            icon={promo.is_active ? faToggleOn : faToggleOff}
                            size="lg"
                          />
                        </button>
                        <button
                          onClick={() => openEditModal(promo)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Edit">
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(promo.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? 'Edit Promotion' : 'Add Promotion'}
            </h3>
            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              <input
                type="text"
                placeholder="Hotel ID"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={form.hotelId}
                onChange={(e) => setForm({ ...form, hotelId: e.target.value })}
              />
              <input
                type="text"
                placeholder="Title"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <textarea
                placeholder="Description (optional)"
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <input
                type="number"
                placeholder="Discount %"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={form.discountPercentage}
                onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
                <input
                  type="date"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
              <label className="inline-flex items-center gap-2 mt-1 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4 text-brand rounded"
                />
                Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.hotelId || !form.title || !form.discountPercentage || !form.startDate || !form.endDate}
                className="px-4 py-2 bg-brand text-white rounded disabled:opacity-40">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h2 className="text-lg font-bold mb-4">Delete Promotion</h2>
            <p className="mb-6">Are you sure you want to delete this promotion?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionsPanel;
