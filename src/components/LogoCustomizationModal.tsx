import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface LogoCustomizationModalProps {
  groupName: string;
  productName: string;
  onSelect: (hasLogo: boolean) => void;
  onClose: () => void;
}

export function LogoCustomizationModal({ 
  groupName, 
  productName, 
  onSelect, 
  onClose 
}: LogoCustomizationModalProps) {
  const [logoChoice, setLogoChoice] = useState<string>('');

  const handleUpdateCart = () => {
    if (logoChoice) {
      onSelect(logoChoice === 'yes');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{groupName} Logo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Would you like to add the {groupName} logo to your {productName}?
          </p>

          <div>
            <Label htmlFor="logo-choice">Logo Options</Label>
            <Select value={logoChoice} onValueChange={setLogoChoice}>
              <SelectTrigger id="logo-choice" className="mt-2">
                <SelectValue placeholder="Select logo option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes - Add {groupName} Logo</SelectItem>
                <SelectItem value="no">No - No Logo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="cart" 
              onClick={handleUpdateCart}
              disabled={!logoChoice}
              className="flex-1"
            >
              Update Cart
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}