import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MonthlyTrendChart from '../components/MonthlyTrendChart';
import ProductPieChart from '../components/ProductPieChart';
import TopCompaniesChart from '../components/TopCompaniesChart'

function TableView() {
  const [reportData, setReportData] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [month, setMonth] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get('/companies/').then(res => setCompanies(res.data));
  }, []);

  const handleMonthlyReport = async () => {
    if (!month) {
      setError("لطفاً ماه را وارد کنید.");
      return;
    }
    setIsLoading(true);
    setError('');
    const [year, mon] = month.split('-');
    try {
      const response = await api.get(`/reports/monthly?year=${year}&month=${mon}`);
      setReportData(response.data);
    } catch (err) {
      setError("خطا در دریافت گزارش ماهانه.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyReport = async () => {
    if (!selectedCompanyId) {
      setError("لطفاً یک شرکت را انتخاب کنید.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get(`/reports/company?company_id=${selectedCompanyId}`);
      setReportData(response.data);
    } catch (err) {
      setError("خطا در دریافت گزارش شرکتی.");
    } finally {
      setIsLoading(false);
    }
  };

  const companyOptions = companies.map(c => ({ value: c.id, label: c.name }));

  return (
    <div>
      {/* فرم‌های فیلتر */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '20px 0' }}>
        <div>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          <button onClick={handleMonthlyReport}>گزارش ماهانه</button>
        </div>
        <div>
          <select onChange={(e) => setSelectedCompanyId(e.target.value)} defaultValue="">
            <option value="" disabled>یک شرکت را انتخاب کنید</option>
            {companyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <button onClick={handleCompanyReport}>گزارش شرکتی</button>
        </div>
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading && <p>در حال بارگذاری گزارش...</p>}

      {/* جدول نتایج */}
      <table>
        <thead>
          <tr>
            <th>تاریخ</th><th>محصول</th><th>شرکت</th><th>مبلغ</th><th>تعداد</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map(p => (
            <tr key={p.id}>
              <td>{p.purchase_date}</td>
              <td>{p.product.name}</td>
              <td>{p.company.name}</td>
              <td>{p.amount}</td>
              <td>{p.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReportsPage() {
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' or 'table'
  const [summaryData, setSummaryData] = useState({ monthly: [], product: [], company: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (viewMode === 'dashboard') {
      setIsLoading(true);
      setError('');
      Promise.all([
        api.get('/reports/summary/monthly'),
        api.get('/reports/summary/by-product'),
        api.get('/reports/summary/by-company'),
      ]).then(([monthlyRes, productRes, companyRes]) => {
        setSummaryData({
          monthly: monthlyRes.data,
          product: productRes.data,
          company: companyRes.data,
        });
      }).catch(err => {
        console.error("Failed to fetch summary data", err);
        setError("خطا در دریافت داده‌های نمودار.");
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [viewMode]); 

  return (
    <div>
      <h2>صفحه گزارش‌ها</h2>
      <div>
        <button onClick={() => setViewMode('dashboard')} disabled={viewMode === 'dashboard'}>نمایش نموداری</button>
        <button onClick={() => setViewMode('table')} disabled={viewMode === 'table'}>نمایش جدولی</button>
      </div>
      <hr />

      {isLoading && <p>در حال بارگذاری...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!isLoading && !error && (
        viewMode === 'dashboard' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: '1 / -1' }}><MonthlyTrendChart data={summaryData.monthly} /></div>
            <div><ProductPieChart data={summaryData.product} /></div>
            <div><TopCompaniesChart data={summaryData.company} /></div>
          </div>
        ) : (
          <TableView />
        )
      )}
    </div>
  );
}

export default ReportsPage;
