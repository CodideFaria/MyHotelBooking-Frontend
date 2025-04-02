import { useState } from 'react';
import { networkAdapter } from 'services/NetworkAdapter';

/* PaymentMethodsPanel
 * Renders a list of payment methods with the ability to edit, and now add, new payment methods.
 * @param {Array} userPaymentMethodsData - An object containing payment methods data.
 * @param {Function} setUserPaymentMethodsData - A function to update the payment methods.
 * @returns {JSX.Element} - The PaymentMethodsPanel component.
 */
const PaymentMethodsPanel = ({
  userPaymentMethodsData,
  setUserPaymentMethodsData,
}) => {
  const [editIndex, setEditIndex] = useState(-1); // -1 means no edit is active
  const [currentEdit, setCurrentEdit] = useState({});

  // States for adding a new payment method
  const [isAdding, setIsAdding] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    card_number: '',
    expiry_date: '',
    cvv: '',
    card_type: '',
  });

  // Handlers for editing existing payment methods
  const handleEdit = (index) => {
    setEditIndex(index);
    setCurrentEdit({ ...userPaymentMethodsData.data[index] });
  };

  const handleCancel = () => {
    setEditIndex(-1);
  };

  const handleSave = () => {
    const updatedPaymentMethods = [...userPaymentMethodsData.data];
    updatedPaymentMethods[editIndex] = currentEdit;
    setUserPaymentMethodsData({ data: updatedPaymentMethods });
    setEditIndex(-1);
  };

  const handleChange = (e, field) => {
    setCurrentEdit({ ...currentEdit, [field]: e.target.value });
  };

  // Handlers for adding a new payment method
  const handleNewPaymentChange = (e, field) => {
    setNewPaymentMethod({ ...newPaymentMethod, [field]: e.target.value });
  };

  const handleAddPayment = async () => {
    // Make the API call to save the new payment method
    const response = await networkAdapter.post(
      '/api/payment-details',
      newPaymentMethod
    );
    if (response && response.status === 'success') {
      // Update the payment methods data with the new method
      const updatedPaymentMethods = [
        ...userPaymentMethodsData.data,
        newPaymentMethod,
      ];
      setUserPaymentMethodsData({ data: updatedPaymentMethods });
      setIsAdding(false);
      // Clear the new payment method form
      setNewPaymentMethod({
        card_number: '',
        expiry_date: '',
        cvv: '',
        card_type: '',
      });
    } else {
      // Handle error (e.g., display a toast message)
      console.error('Failed to add payment method');
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {userPaymentMethodsData.data?.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          You have no saved payment methods.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {userPaymentMethodsData.data.map((method, index) => (
            <li
              key={index}
              className="px-4 py-4 flex items-center justify-between sm:px-6"
            >
              {editIndex === index ? (
                // Editable Fields for an existing method
                <div className="flex-grow">
                  <input
                    type="text"
                    value={currentEdit.card_type || ''}
                    onChange={(e) => handleChange(e, 'card_type')}
                    placeholder="Card Type"
                    className="text-lg border px-2 py-1 my-2 font-medium text-gray-900 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={currentEdit.card_number || ''}
                    onChange={(e) => handleChange(e, 'card_number')}
                    placeholder="Card Number"
                    className="text-sm border px-2 py-1 my-2 text-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={currentEdit.expiry_date || ''}
                    onChange={(e) => handleChange(e, 'expiry_date')}
                    placeholder="Expiry Date"
                    className="text-sm border px-2 py-1 my-2 text-gray-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              ) : (
                // Display Fields for an existing method
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900">
                    {method.card_type}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ending in {method.card_number}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires {method.expiry_date}
                  </p>
                </div>
              )}

              <div className="ml-4 flex-shrink-0">
                {editIndex === index ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(index)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                  >
                    Edit
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Section for adding a new payment method */}
      {isAdding ? (
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="mb-2">
            <input
              type="text"
              placeholder="Card Type"
              value={newPaymentMethod.card_type}
              onChange={(e) => handleNewPaymentChange(e, 'card_type')}
              className="border px-2 py-1 mr-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Card Number"
              value={newPaymentMethod.card_number}
              onChange={(e) => handleNewPaymentChange(e, 'card_number')}
              className="border px-2 py-1 mr-2 rounded-md"
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Expiry Date"
              value={newPaymentMethod.expiry_date}
              onChange={(e) => handleNewPaymentChange(e, 'expiry_date')}
              className="border px-2 py-1 mr-2 rounded-md"
            />
            <input
              type="text"
              placeholder="CVV"
              value={newPaymentMethod.cvv}
              onChange={(e) => handleNewPaymentChange(e, 'cvv')}
              className="border px-2 py-1 mr-2 rounded-md"
            />
          </div>
          <div>
            <button
              onClick={handleAddPayment}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-4 border-t border-gray-200">
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
          >
            Add Payment Method
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsPanel;
