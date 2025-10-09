import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { useAuth } from '../context/AuthContext';

function PurchaseForm({ onPurchaseCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    purchase_date: new Date().toISOString().split('T')[0],
    product_id: null,
    company_id: null,
    amount: '',
    count: ''
  });
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get('/products/').then(res => setProducts(res.data));
    api.get('/companies/').then(res => setCompanies(res.data));
  }, []);

  const handleDeleteCompany = async (companyId, companyName) => {
    if (window.confirm(`آیا از حذف شرکت "${companyName}" اطمینان دارید؟`)) {
      try {
        await api.delete(`/companies/${companyId}`);
        setCompanies(prevCompanies => prevCompanies.filter(c => c.id !== companyId));
        alert("شرکت با موفقیت حذف شد.");
      } catch (error) {
        alert(`خطا در حذف شرکت: ${error.response?.data?.detail || 'خطای ناشناخته'}`);
      }
    }
  };

  const CustomOption = (props) => {
    const { innerProps, label, data, isFocused } = props;
    const style = {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      cursor: 'pointer',
      backgroundColor: isFocused ? '#DEEBFF' : 'white',
      color: 'black',
    };
    return (
      <div {...innerProps} style={style}>
        <span>{label}</span>
        {user && user.role === 'user1' && (
          <span 
            onClick={(event) => { 
              event.stopPropagation(); 
              handleDeleteCompany(data.value, data.label); 
            }}
            style={{ color: 'red', padding: '0 5px', fontWeight: 'bold' }}
            title="حذف این شرکت"
          >
            X
          </span>
        )}
      </div>
    );
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCompany = async (inputValue) => {
    setIsLoading(true);
    const newCompanyData = { name: inputValue, company_type: "General", company_size: "Unknown", region: "N/A" };
    try {
      const response = await api.post('/companies/', newCompanyData);
      const newCompany = response.data;
      setCompanies(prevCompanies => [...prevCompanies, newCompany]);
      setFormData({ ...formData, company_id: newCompany.id });
      alert(`شرکت "${newCompany.name}" با موفقیت ایجاد شد.`);
    } catch (error) {
      alert("خطا در ایجاد شرکت. آیا نام تکراری است یا دسترسی ندارید؟");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.product_id || !formData.company_id) {
        setError("لطفاً محصول و شرکت را انتخاب کنید.");
        return;
    }
    try {
      const response = await api.post('/purchases/', { ...formData, amount: parseFloat(formData.amount), count: parseInt(formData.count) });
      alert('خرید با موفقیت ثبت شد!');
      onPurchaseCreated(response.data);
    } catch (err) {
      setError('خطا در ثبت خرید.');
    }
  };

  const productOptions = products.map(p => ({ value: p.id, label: p.name }));
  const companyOptions = companies.map(c => ({ value: c.id, label: c.name }));

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', margin: '20px' }}>
      <h3>ثبت خرید جدید</h3>
      <div>
        <label>تاریخ:</label>
        <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} required />
      </div>
      <div>
        <label>محصول:</label>
        <Select options={productOptions} onChange={(opt) => setFormData({...formData, product_id: opt ? opt.value : null})} placeholder="انتخاب محصول..."  />
      </div>
      <div>
        <label>شرکت:</label>
        <CreatableSelect 
          // isClearable
          isDisabled={isLoading}
          isLoading={isLoading}
          options={companyOptions}
          onChange={(opt) => setFormData({...formData, company_id: opt ? opt.value : null})}
          onCreateOption={handleCreateCompany}
          placeholder="انتخاب یا تایپ برای ایجاد شرکت جدید..."
          components={{ Option: CustomOption }}
        />
      </div>
      <div>
        <label>مبلغ:</label>
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
      </div>
      <div>
        <label>تعداد:</label>
        <input type="number" name="count" value={formData.count} onChange={handleChange} required />
      </div>
      <button type="submit">ثبت</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default PurchaseForm;