// Directory: society-docs-app/frontend

// App.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [house, setHouse] = useState('');
  const [docType, setDocType] = useState('Rent');
  const [file, setFile] = useState<File | null>(null);
  const [docs, setDocs] = useState<any>({});
  const [search, setSearch] = useState('');

  const uploadDoc = async () => {
    if (!file || !house) return;
    const form = new FormData();
    form.append('house', house);
    form.append('doc_type', docType);
    form.append('file', file);
    await axios.post('http://localhost:5000/upload', form);
    setHouse('');
    setFile(null);
    fetchDocs();
  };

  const fetchDocs = async () => {
    const res = await axios.get('http://localhost:5000/list');
    setDocs(res.data);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const filtered = Object.entries(docs).filter(([key]) => key.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Society Document Manager</h1>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 mb-6">
        <input type="text" value={house} onChange={e => setHouse(e.target.value)} placeholder="House No" className="border p-2 rounded w-full md:w-1/4" />
        <select onChange={e => setDocType(e.target.value)} className="border p-2 rounded">
          <option value="Rent">Rent</option>
          <option value="Own">Own</option>
        </select>
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="border p-2 rounded" />
        <button onClick={uploadDoc} className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </div>
      <input
        type="text"
        placeholder="Search by house number"
        onChange={e => setSearch(e.target.value)}
        className="mb-6 border p-2 rounded w-full"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filtered.map(([houseNo, entries]: any) => (
          <div key={houseNo} className="border rounded p-4 shadow">
            <h2 className="font-semibold text-lg mb-2">House: {houseNo}</h2>
            {entries.map((doc: any) => (
              <div key={doc.pdf} className="mb-2">
                <p className="text-sm">{doc.type}</p>
                <a
                  href={`http://localhost:5000/documents/${doc.pdf}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  View PDF
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
