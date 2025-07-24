import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus } from 'lucide-react';

interface ProductModalProps {
  product: Product;
  isGroupUser?: boolean;
  groupName?: string;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size: string, quantity: number) => void;
}

export function ProductModal({ 
  product, 
  isGroupUser = false, 
  groupName,
  onClose, 
  onAddToCart 
}: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const price = isGroupUser ? product.contractPrice : product.retailPrice;
  const selectedColorObj = product.colors.find(c => c.name === selectedColor);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      setError('Please select both color and size');
      return;
    }

    if (!selectedColorObj?.available) {
      setError('This size cannot be ordered. Please select another size or color.');
      return;
    }

    setError('');
    onAddToCart(product, selectedColor, selectedSize, quantity);
    onClose();
  };

  const adjustQuantity = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="mt-2 text-center">
              <Button variant="link" className="text-sm">
                [+] Larger image
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand and Product Info */}
            <div>
              <Badge variant="outline" className="mb-2">
                {product.brand}
              </Badge>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-muted-foreground">Code: {product.code}</p>
              
              {/* Price */}
              <div className="mt-4">
                <span className="text-2xl font-bold text-success">
                  Your Price ${price.toFixed(2)}
                </span>
                {isGroupUser && (
                  <div className="text-sm text-muted-foreground line-through">
                    Retail: ${product.retailPrice.toFixed(2)}
                  </div>
                )}
                {groupName && (
                  <div className="text-sm text-muted-foreground">
                    Group: {groupName}
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-step Selection */}
            <div className="space-y-4">
              {/* Step 1: Color */}
              <div>
                <Label className="text-base font-semibold">Step 1: Color selection</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem key={color.name} value={color.name}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Color Swatches */}
                <div className="flex gap-2 mt-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color.name ? 'border-primary scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Step 2: Size */}
              <div>
                <Label className="text-base font-semibold">Step 2: Size selection</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Step 3: Quantity */}
              <div>
                <Label className="text-base font-semibold">Step 3: Quantity</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => adjustQuantity(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min="1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => adjustQuantity(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Add to Cart Button */}
            <Button 
              variant="cart" 
              className="w-full text-lg py-6"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to cart' : 'Out of Stock'}
            </Button>

            {/* Logo Eligible Badge */}
            {product.logoEligible && isGroupUser && (
              <Badge variant="secondary" className="w-full justify-center py-2">
                Logo Customization Available
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}