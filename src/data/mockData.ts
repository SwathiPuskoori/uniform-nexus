import { Group, Product, RetailCustomer, User, Order } from '@/types';
import scrubTopNavy from '@/assets/scrub-top-navy.jpg';
import scrubPantsNavy from '@/assets/scrub-pants-navy.jpg';
import labCoatWhite from '@/assets/lab-coat-white.jpg';
import carharttScrubNavy from '@/assets/carhartt-scrub-navy.jpg';

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'OhioHealth',
    code: 'OHH',
    description: 'OhioHealth Organization',
    logoCustomization: true,
    isActive: true
  },
  {
    id: '2',
    name: 'Mount Carmel Health',
    code: 'MCH',
    description: 'Mount Carmel Health System',
    logoCustomization: true,
    isActive: true
  },
  {
    id: '3',
    name: 'Nationwide Children\'s',
    code: 'NCH',
    description: 'Nationwide Children\'s Hospital',
    logoCustomization: false,
    isActive: true
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Barco One Scrub Top',
    code: 'BOT-001',
    brand: 'Barco',
    department: 'Scrubs',
    description: 'Professional medical scrub top with modern fit',
    image: scrubTopNavy,
    retailPrice: 32.99,
    contractPrice: 28.99,
    logoEligible: true,
    inStock: true,
    colors: [
      { name: 'Navy', hex: '#1e3a8a', available: true },
      { name: 'Royal Blue', hex: '#2563eb', available: true },
      { name: 'Ceil Blue', hex: '#7dd3fc', available: true },
      { name: 'Black', hex: '#000000', available: true },
      { name: 'White', hex: '#ffffff', available: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '2',
    name: 'Barco One Scrub Pants',
    code: 'BOP-001',
    brand: 'Barco',
    department: 'Scrubs',
    description: 'Comfortable medical scrub pants with multiple pockets',
    image: scrubPantsNavy,
    retailPrice: 29.99,
    contractPrice: 25.99,
    logoEligible: true,
    inStock: true,
    colors: [
      { name: 'Navy', hex: '#1e3a8a', available: true },
      { name: 'Royal Blue', hex: '#2563eb', available: true },
      { name: 'Ceil Blue', hex: '#7dd3fc', available: true },
      { name: 'Black', hex: '#000000', available: true },
      { name: 'White', hex: '#ffffff', available: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '3',
    name: 'Grey\'s Anatomy Lab Coat',
    code: 'GA-LC-001',
    brand: 'Grey\'s Anatomy',
    department: 'Lab Coats',
    description: 'Professional lab coat with embroidered logo',
    image: labCoatWhite,
    retailPrice: 49.99,
    contractPrice: 44.99,
    logoEligible: false,
    inStock: true,
    colors: [
      { name: 'White', hex: '#ffffff', available: true },
      { name: 'Navy', hex: '#1e3a8a', available: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '4',
    name: 'Carhartt Scrub Top',
    code: 'CH-ST-001',
    brand: 'Carhartt',
    department: 'Scrubs',
    description: 'Durable medical scrub top built to last',
    image: carharttScrubNavy,
    retailPrice: 24.99,
    contractPrice: 21.99,
    logoEligible: true,
    inStock: true,
    colors: [
      { name: 'Navy', hex: '#1e3a8a', available: true },
      { name: 'Black', hex: '#000000', available: true },
      { name: 'Wine', hex: '#7f1d1d', available: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }
];

export const mockRetailCustomers: RetailCustomer[] = [
  {
    accountNumber: 'R123456',
    phone: '6141234567',
    zipCode: '43215',
    firstName: 'Sarah',
    lastName: 'Johnson',
    orders: [
      {
        id: 'R1001',
        userId: '',
        items: [],
        subtotal: 75.98,
        tax: 6.08,
        total: 82.06,
        status: 'delivered',
        createdAt: '2024-01-15',
        source: 'retail'
      }
    ]
  },
  {
    accountNumber: 'R789012',
    phone: '6149876543',
    zipCode: '43201',
    firstName: 'Michael',
    lastName: 'Chen',
    orders: [
      {
        id: 'R1002',
        userId: '',
        items: [],
        subtotal: 124.97,
        tax: 9.98,
        total: 134.95,
        status: 'delivered',
        createdAt: '2024-02-03',
        source: 'retail'
      }
    ]
  }
];

export const brands = [
  'Barco', 'Grey\'s Anatomy', 'Carhartt', 'Red Kap', 'Dickies', 
  'WonderWink', 'Cherokee', 'Healing Hands', 'FIGS', 'Jaanuu'
];

export const departments = [
  'Scrubs', 'Lab Coats', 'Professional Wear', 'Jackets & Tees', 
  'Footwear', 'Accessories', 'Barco One', 'Grey\'s Anatomy Active'
];