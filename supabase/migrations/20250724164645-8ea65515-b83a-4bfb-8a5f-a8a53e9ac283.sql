-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create groups table for contract organizations
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  logo_customization BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Groups are publicly viewable for login validation
CREATE POLICY "Groups are publicly viewable" 
ON public.groups 
FOR SELECT 
USING (true);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  department TEXT NOT NULL,
  retail_price DECIMAL(10,2) NOT NULL,
  contract_price DECIMAL(10,2) NOT NULL,
  colors JSONB NOT NULL DEFAULT '[]',
  sizes JSONB NOT NULL DEFAULT '[]',
  logo_eligible BOOLEAN DEFAULT false,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products are publicly viewable
CREATE POLICY "Products are publicly viewable" 
ON public.products 
FOR SELECT 
USING (true);

-- Create retail customers table for account linking
CREATE TABLE public.retail_customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_number TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  linked_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for retail customers
ALTER TABLE public.retail_customers ENABLE ROW LEVEL SECURITY;

-- Only linked users can view their retail customer data
CREATE POLICY "Users can view their linked retail customer data" 
ON public.retail_customers 
FOR SELECT 
USING (auth.uid() = linked_user_id);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  logo_customization BOOLEAN DEFAULT false,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for cart items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Users can manage their own cart items
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO public.groups (name, code, logo_customization) VALUES
('Ohio Health', 'OHH', true),
('Mount Carmel Health System', 'MCH', true),
('Riverside Methodist Hospital', 'RMH', false);

INSERT INTO public.retail_customers (account_number, phone, zip_code, first_name, last_name) VALUES
('RC001234', '6141234567', '43215', 'John', 'Smith'),
('RC005678', '6149876543', '43016', 'Sarah', 'Johnson'),
('RC009012', '6145551234', '43228', 'Michael', 'Brown');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();