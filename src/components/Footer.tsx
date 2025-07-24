import { brands, departments } from '@/data/mockData';

export function Footer() {
  return (
    <footer className="bg-muted mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brands Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">Brands</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {brands.map((brand) => (
                <div key={brand} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                  {brand}
                </div>
              ))}
            </div>
          </div>

          {/* Departments Section */}
          <div>
            <h3 className="font-bold text-lg mb-4">Departments</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {departments.map((department) => (
                <div key={department} className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                  {department}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 The Uniform Store. All rights reserved. | Professional medical uniforms and healthcare apparel.
          </p>
        </div>
      </div>
    </footer>
  );
}