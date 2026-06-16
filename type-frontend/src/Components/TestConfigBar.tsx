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
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category.replace('_', ' ')}</option>
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
          {availableSubCategories.map(subCategory => (
            <option key={subCategory} value={subCategory}>{subCategory.replace('_', ' ')}</option>
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
