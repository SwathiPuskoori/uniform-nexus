import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { mockRetailCustomers } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function RetailLink() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check against mock retail customers
    const customer = mockRetailCustomers.find(c => 
      c.phone === phone.replace(/\D/g, '') && 
      c.zipCode === zipCode &&
      c.accountNumber === accountNumber
    );

    if (customer) {
      toast({
        title: "Account Found!",
        description: `Found account for ${customer.firstName} ${customer.lastName}`,
      });
      // In real app, proceed to Step 2 - create online credentials
      localStorage.setItem('linkingCustomer', JSON.stringify(customer));
      navigate('/retail-link-step2');
    } else {
      toast({
        title: "Account Not Found",
        description: "Please verify your information or contact our store at (614) 793-0469",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleCancel = () => {
    navigate('/login');
  };

  const formatPhone = (value: string) => {
    const number = value.replace(/\D/g, '');
    if (number.length <= 3) return number;
    if (number.length <= 6) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
    return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Link to My Existing Account - Step 1 - Locate Your Account</CardTitle>
              <CardDescription>
                Please provide the following information to locate your existing retail account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-2">
                  If you already have an account with our company, you can create an on-line account that is linked to your existing account. Linking to your existing account is ideal because it provides access to your previous transactions.
                </p>
                <p className="text-sm text-blue-800">
                  For your protection, existing accounts with certain privileges can only be linked by contacting us directly.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number (include area code)</Label>
                  <Input 
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="(614) 123-4567"
                    maxLength={14}
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">Zip or Postal Code</Label>
                  <Input 
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="43215"
                    maxLength={10}
                  />
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number (please check a receipt for this number)</Label>
                  <Input 
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="R123456"
                  />
                </div>
              </div>

              {/* Demo data hint */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Demo Account Data:</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Phone:</strong> (614) 123-4567 | <strong>Zip:</strong> 43215 | <strong>Account:</strong> R123456</p>
                  <p><strong>Phone:</strong> (614) 987-6543 | <strong>Zip:</strong> 43201 | <strong>Account:</strong> R789012</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleLookup}
                  disabled={!phone || !zipCode || !accountNumber || isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Looking up...' : 'Lookup'}
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}