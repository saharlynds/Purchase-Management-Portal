import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Select from 'react-select'; 

function EditPurchaseModal({ purchase, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState(purchase);
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    if (isOpen && purchase) {
      api.get('/products/').then(res => setProducts(res.data));
      api.get('/companies/').then(res => setCompanies(res.data));
      setFormData({
        ...purchase,
        product_id: purchase.product.id,
        company_id: purchase.company.id,
      });
    }
  }, [isOpen, purchase]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen || !purchase) {
    return null;
  }
  
  const productOptions = products.map(p => ({ value: p.id, label: p.name }));
  const companyOptions = companies.map(c => ({ value: c.id, label: c.name }));
  const defaultProduct = productOptions.find(opt => opt.value === formData.product_id);
  const defaultCompany = companyOptions.find(opt => opt.value === formData.company_id);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '5px', width: '400px' }}>
        <form onSubmit={handleSubmit}>
          <h3>ویرایش خرید (ID: {purchase.id})</h3>
          <div>
            <label>تاریخ:</label>
            <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} required />
          </div>
          <div>
            <label>محصول:</label>
            <Select options={productOptions} value={defaultProduct} onChange={(opt) => setFormData({...formData, product_id: opt.value})} />
          </div>
          <div>
            <label>شرکت:</label>
            <Select options={companyOptions} value={defaultCompany} onChange={(opt) => setFormData({...formData, company_id: opt.value})} />
          </div>
          <div>
            <label>مبلغ:</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
          </div>
          <div>
            <label>تعداد:</label>
            <input type="number" name="count" value={formData.count} onChange={handleChange} required />
          </div>
          <button type="submit">ذخیره تغییرات</button>
          <button type="button" onClick={onClose}>انصراف</button>
        </form>
      </div>
    </div>
  );
}

export default EditPurchaseModal;