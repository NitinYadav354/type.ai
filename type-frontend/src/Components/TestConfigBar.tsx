import React from 'react'

interface TestConfigBarProps {
  category: string;
  setCategory: (category: string) => void;
  subCategory: string;
  setSubCategory: (subCategory: string) => void;
  length: string;
  setLength: (length: string) => void;
  uniqueCategories: string[];
  availableSubCategories: string[];
}

export const TestConfigBar = ({
  category, setCategory ,
  subCategory, setSubCategory,
  length, setLength,
  uniqueCategories, availableSubCategories
}: TestConfigBarProps) => {

  const formatLabel = (s: string) => {
    if (!s) return s
    return s.replace(/_/g, ' ').toLowerCase().replace(/^./, c => c.toUpperCase())
  }
  return (
    <div className="test-config-bar">
      
      <label>
        Type
        <select 
          value={category} 
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory('all');
          }}
        >
          <option value="all">All Types</option>
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{formatLabel(cat)}</option>
          ))}
        </select>
      </label>

      <label>
        Subtype
        <select 
          value={subCategory} 
          onChange={(e) => setSubCategory(e.target.value)}
          disabled={category  === 'all'}
        >
          <option value="all">All Subtypes</option>
          {availableSubCategories.map(sub => (
            <option key={sub} value={sub}>{formatLabel(sub)}</option>
          ))}
        </select>
      </label>

      <label>
        Length
        <select value={length} onChange={(e) => setLength(e.target.value)}>
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </label>
    </div>
  );
};
