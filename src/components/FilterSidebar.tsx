import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { brands, departments } from '@/data/mockData';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  keyword: string;
  priceRange: [number, number];
  brands: string[];
  departments: string[];
  colors: string[];
}

const colors = [
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Ceil Blue', hex: '#7dd3fc' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Wine', hex: '#7f1d1d' },
];

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    priceRange: [0, 100],
    brands: [],
    departments: [],
    colors: []
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearAll = () => {
    const cleared: FilterState = {
      keyword: '',
      priceRange: [0, 100],
      brands: [],
      departments: [],
      colors: []
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked 
      ? [...filters.brands, brand]
      : filters.brands.filter(b => b !== brand);
    updateFilters({ brands: newBrands });
  };

  const handleDepartmentChange = (department: string, checked: boolean) => {
    const newDepartments = checked 
      ? [...filters.departments, department]
      : filters.departments.filter(d => d !== department);
    updateFilters({ departments: newDepartments });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked 
      ? [...filters.colors, color]
      : filters.colors.filter(c => c !== color);
    updateFilters({ colors: newColors });
  };

  return (
    <div className="w-64 space-y-6">
      {/* Clear All Button */}
      <Button variant="outline" onClick={clearAll} className="w-full">
        Clear All
      </Button>

      {/* Keyword Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Keyword Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            placeholder="Search products..."
            value={filters.keyword}
            onChange={(e) => updateFilters({ keyword: e.target.value })}
          />
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span className="font-medium text-green-600">${filters.priceRange[0]}.00</span>
              <span className="font-medium text-green-600">${filters.priceRange[1]}.00</span>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Showing prices {filters.priceRange[0] === filters.priceRange[1] ? `at $${filters.priceRange[0]}` : `from $${filters.priceRange[0]} to $${filters.priceRange[1]}`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Picker */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color) => (
              <div key={color.name} className="flex flex-col items-center">
                <div 
                  className="w-8 h-8 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform"
                  style={{ 
                    backgroundColor: color.hex,
                    borderColor: filters.colors.includes(color.name) ? '#0f172a' : '#e2e8f0'
                  }}
                  onClick={() => handleColorChange(color.name, !filters.colors.includes(color.name))}
                />
                <span className="text-xs mt-1">{color.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox 
                  id={brand}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                />
                <Label htmlFor={brand} className="text-sm cursor-pointer">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Departments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Department/Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {departments.map((department) => (
              <div key={department} className="flex items-center space-x-2">
                <Checkbox 
                  id={department}
                  checked={filters.departments.includes(department)}
                  onCheckedChange={(checked) => handleDepartmentChange(department, checked as boolean)}
                />
                <Label htmlFor={department} className="text-sm cursor-pointer">
                  {department}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}