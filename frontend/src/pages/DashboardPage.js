import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PurchaseForm from '../components/PurchaseForm';
import EditPurchaseModal from '../components/EditPurchaseModal';

function DashboardPage() {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchPurchases = useCallback(() => {
    if (user && user.role === 'user1') {
      setIsLoading(true);
      setError('');
      api.get('/purchases/')
        .then(res => {
          setPurchases(res.data);
        })
        .catch(err => {
          console.error("خطا در واکشی لیست خریدها:", err);
          setError("خطا در دریافت لیست خریدها از سرور.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setPurchases([]);
    }
  }, [user]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handlePurchaseCreated = (newPurchase) => {
    if (user && user.role === 'user1') {
        setPurchases(prevPurchases => [newPurchase, ...prevPurchases]);
    }
  };

  const handleEditClick = (purchase) => {
    setEditingPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPurchase(null);
  };

  const handleSavePurchase = async (updatedData) => {
    try {
      const payload = {
        purchase_date: updatedData.purchase_date,
        product_id: updatedData.product_id,
        company_id: updatedData.company_id,
        amount: parseFloat(updatedData.amount),
        count: parseInt(updatedData.count)
      };
      const response = await api.put(`/purchases/${editingPurchase.id}`, payload);
      setPurchases(purchases.map(p => p.id === editingPurchase.id ? response.data : p));
      handleCloseModal();
      alert("ویرایش با موفقیت انجام شد!");
    } catch (err) {
      alert("خطا در ویرایش!");
    }
  };
  
  if (!user) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div>
      <h2>داشبورد</h2>
      
      {(user.role === 'user1' || user.role === 'user2') && (
        <PurchaseForm onPurchaseCreated={handlePurchaseCreated} />
      )}

      <hr />

      <h3>لیست خریدها</h3>
      
      {user.role === 'user1' ? (
        <>
          {isLoading && <p>در حال بارگذاری لیست خریدها...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <table>
            <thead>
              <tr>
                <th>تاریخ</th><th>محصول</th><th>شرکت</th><th>مبلغ</th><th>تعداد</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(p => (
                <tr key={p.id}>
                  <td>{p.purchase_date}</td>
                  <td>{p.product.name}</td>
                  <td>{p.company.name}</td>
                  <td>{p.amount}</td>
                  <td>{p.count}</td>
                  <td>
                    <button onClick={() => handleEditClick(p)}>ویرایش</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>شما دسترسی به مشاهده و ویرایش لیست خریدها ندارید.</p>
      )}
      
      {editingPurchase && (
        <EditPurchaseModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSavePurchase}
          purchase={editingPurchase}
        />
      )}
    </div>
  );
}

export default DashboardPage;