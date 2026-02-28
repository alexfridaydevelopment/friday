import { useState, useEffect } from 'react';
import { transactions } from '../lib/api';

const CATEGORIES = [
  'FOOD', 'TRANSPORT', 'SHOPPING', 'ENTERTAINMENT', 'BILLS', 'HEALTH', 'EDUCATION', 'SMOKING', 'OTHER'
];

const SOURCES = ['SALARY', 'FREELANCE', 'INVESTMENT', 'GIFT', 'OTHER'];

export default function Transactions() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'expenses' | 'incomes'>('expenses');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [source, setSource] = useState('SALARY');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expRes, incRes] = await Promise.all([
        transactions.getExpenses(),
        transactions.getIncomes(),
      ]);
      setExpenses(expRes.data);
      setIncomes(incRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'expenses') {
        await transactions.createExpense({ amount: parseFloat(amount), category, description, date });
      } else {
        await transactions.createIncome({ amount: parseFloat(amount), source, description, date });
      }
      setShowForm(false);
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, type: 'expense' | 'income') => {
    if (!confirm('Are you sure?')) return;
    try {
      if (type === 'expense') {
        await transactions.deleteExpense(id);
      } else {
        await transactions.deleteIncome(id);
      }
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Add {activeTab === 'expenses' ? 'Expense' : 'Income'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (THB)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              {activeTab === 'expenses' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {SOURCES.map((src) => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-lg mr-2 ${activeTab === 'expenses' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}
        >
          Expenses ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('incomes')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'incomes' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
        >
          Incomes ({incomes.length})
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {activeTab === 'expenses' ? 'Category' : 'Source'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(activeTab === 'expenses' ? expenses : incomes).map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${activeTab === 'expenses' ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.category || item.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleDelete(item.id, activeTab === 'expenses' ? 'expense' : 'income')}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(activeTab === 'expenses' ? expenses : incomes).length === 0 && (
            <p className="text-center py-8 text-gray-500">No transactions yet</p>
          )}
        </div>
      )}
    </div>
  );
}
