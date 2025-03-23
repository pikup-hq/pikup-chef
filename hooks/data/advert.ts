import { Advertisement } from "@/components/AdvertismentBanner";

// User app advertisements
export const userAdvertisements: Advertisement[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=300&q=80',
    title: 'Special Offer',
    description: 'Get 20% off on your first order',
    linkType: 'screen',
    link: '/promotions',
    brandName: 'FoodDelivery'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=300&q=80',
    title: 'Premium Restaurants',
    description: 'Discover top-rated restaurants near you',
    linkType: 'screen',
    link: '/restaurants/premium',
    brandName: 'FoodDelivery'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=300&q=80',
    title: 'Visit Our Website',
    description: 'Learn more about our services',
    linkType: 'url',
    link: 'https://example.com',
    brandName: 'FoodDelivery'
  }
];

// Vendor app advertisements
export const vendorAdvertisements: Advertisement[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bda9f7f37446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=300&q=80',
    title: 'Boost Your Sales',
    description: 'Promote your restaurant for more visibility',
    linkType: 'screen',
    link: '/vendor/promotions',
    brandName: 'VendorPartner'
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=300&q=80',
    title: 'Vendor Training',
    description: 'Learn how to maximize your profits',
    linkType: 'screen',
    link: '/vendor/training',
    brandName: 'VendorPartner'
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=300&q=80',
    title: 'Partner Program',
    description: 'Join our exclusive partner program',
    linkType: 'url',
    link: 'https://example.com/partners',
    brandName: 'VendorPartner'
  }
];

// Example of how to create a new advertisement
export const createAdvertisement = (
  imageUrl: string,
  title: string,
  description: string,
  linkType: 'screen' | 'url',
  link: string,
  brandName?: string
): Advertisement => {
  return {
    id: Date.now().toString(), // Generate a unique ID
    imageUrl,
    title,
    description,
    linkType,
    link,
    brandName
  };
};