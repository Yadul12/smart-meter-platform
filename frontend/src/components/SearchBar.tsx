import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length >= 2) {
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(val)}`);
        setResults(res.data.results || []);
        setIsOpen(true);
      } catch {
        setResults([]);
      }
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search meters, DCUs, serials..."
          value={query}
          onChange={handleSearch}
          className="w-full bg-slate-100 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
          {results.map((r, idx) => (
            <div
              key={idx}
              onClick={() => { setIsOpen(false); setQuery(''); navigate(r.link); }}
              className="p-3 hover:bg-slate-50 cursor-pointer flex flex-col transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-800">{r.title}</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">{r.type}</span>
              </div>
              <span className="text-xs text-slate-500 mt-0.5">{r.subtitle}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
