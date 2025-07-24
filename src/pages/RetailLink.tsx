import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function RetailLink() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    if (!phone || !zipCode || !accountNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to lookup your account.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Remove formatting from phone number for comparison
      const cleanPhone = phone.replace(/\D/g, '');
      
      const { data, error } = await supabase
        .from('retail_customers')
        .select('*')
        .eq('phone', cleanPhone)
        .eq('zip_code', zipCode)
        .eq('account_number', accountNumber)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        toast({
          title: "Account Not Found",
          description: "Please check your information and try again, or contact us directly at (614) 793-0469.",
          variant: "destructive"
        });
        return;
      }

      // Store the found customer info for step 2
      localStorage.setItem('foundCustomer', JSON.stringify(data));
      toast({
        title: "Account Found!",
        description: `Found account for ${data.first_name} ${data.last_name}`,
      });
      navigate('/retail-link-step2');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An error occurred while looking up your account.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
                  <p><strong>Phone:</strong> 6141234567 | <strong>Zip:</strong> 43215 | <strong>Account:</strong> RC001234</p>
                  <p><strong>Phone:</strong> 6149876543 | <strong>Zip:</strong> 43016 | <strong>Account:</strong> RC005678</p>
                  <p><strong>Phone:</strong> 6145551234 | <strong>Zip:</strong> 43228 | <strong>Account:</strong> RC009012</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleLookup}
                  disabled={!phone || !zipCode || !accountNumber || loading}
                  className="flex-1"
                >
                  {loading ? 'Looking up...' : 'Lookup'}
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