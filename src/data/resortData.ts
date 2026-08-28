import { Room, ServiceItem, ReviewItem, AddOnOption } from '../types';

export const RESORT_ROOMS: Room[] = [
  {
    id: 'ocean-oasis-suite',
    title: 'Ocean Oasis Suite',
    category: 'Oceanfront',
    badge: 'Oceanfront',
    type: 'Suite',
    price: 540,
    rating: 4.95,
    reviewsCount: 128,
    mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6hmGULhIdpG7b3XkXsAu5ypio8Esv6z9jFQw5Xxx1VwV0Jf6f2EVyMFphyyGmGrnIEEVorRI9MPgLLo1pPNFNrcDQbMDz-PGq_PXwMm16Pd-_9tgbJm3itvXV64yTyWzoMIld6UMCodNC_rVPYH08snmnVTdE91n7av5rMdYGm5eRazlml9jehRBCVKveaP0lbtpv_8K7hkofdyNWXdSXeciDdEbrXegOG0S4iSKIAwiSYFhkNiAkqw',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6hmGULhIdpG7b3XkXsAu5ypio8Esv6z9jFQw5Xxx1VwV0Jf6f2EVyMFphyyGmGrnIEEVorRI9MPgLLo1pPNFNrcDQbMDz-PGq_PXwMm16Pd-_9tgbJm3itvXV64yTyWzoMIld6UMCodNC_rVPYH08snmnVTdE91n7av5rMdYGm5eRazlml9jehRBCVKveaP0lbtpv_8K7hkofdyNWXdSXeciDdEbrXegOG0S4iSKIAwiSYFhkNiAkqw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC7rRRNDMTuJHTL83Mx5mE3IrjLKetz_p43pzUYhewgNAynduGoBC8fIlhAzGXwiH4oApsVMiYKcaCAQ9fivlbCHYZDpEUm6JgiqMs8Ia5M5bC3v3_eyu3v0MHUfaedybdxFkiBIHNVcYYFhbCRYTIiGVf9mB6-Zci31YDZAR7tOnVzKERfoexf-NcD5NWlKP4Zel5Imzk1mAYvGc9eponhpzw5S1YvmHhPnxlzaAySUNFWjqaEvZD8LA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnHW6QPxs-P-zFdUQlTZFgmoO38U9roHXgW1WEgN4VYA-dUHcHacbL7cctJKCA4Iuosmphijw25_PPo-4ONxilv4BxRFUBAMVXvKE5ZmOmc9KOLuV3mMSHmhOF3Uleqrov2mks5WEQKDNgIPYYtc4mERllqcwp5lGxTn96XIlLHDit4RVZaGd-gFPrM2DdU8BLYYGH0fCMgZSdZ91e7_5WhGne2H6CYTPHB339tXaCfYmYFy3QmSANHQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5fjtbXkchaFikCsFWPbNx30q7Mj_ziZ1X7eaQXxFGw2fgh7ji57RQwyDtNFQCC9pP6wQEZ-Ll3TARCzWcRUoF-2gse0m4OgNLl4tZckLXeKPYJEs5R3N_1O0pe94dN4Wg-JvD491mV8TU94NDaVgp-Xf8ooqAMhvPxG_ACd4CjE4OnQO6dfuSXmTnKDbXJn_oXs9DQInjP9CHBWxmO0oFsJDa3uhs7ABRSF_wtqo5ES6dWeoGACr73g',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCLybys6b_-UAnkh_7QVzrH6PVBpV8ambA4-liXp_wK-H2oRH4Icvhimvv0IFTVOb_W-SMo3-LagMqLFRvxS3zy5kB0lV5zAqjvSayOTqW0YtA7jt2FcNF6lWLm-5_fD-zy8qTd1neilk-2hK_YKSFA2F3oZIzFhLaZPqSGKJsH9vXQBUj7N6GlpLD_AevdkdF-d0FQFGYwPS8oSoV_Dqq5DMUue7HVw1MMqwFs3oRsbQDVb0E1-4oCsq0g0wKeyQ6Q8c'
    ],
    description: 'Experience unparalleled luxury in our signature Ocean Oasis Suite. Designed with modern minimalism and inspired by the natural beauty of the shoreline, this expansive suite offers breathtaking panoramic views of the azure horizon. Soft beach cream tones and deep ocean blue accents create a serene retreat for relaxation and rejuvenation.',
    specs: {
      guests: 'Up to 4 Guests',
      beds: '1 King, 1 Sofa Bed',
      sqft: '850 sq ft',
      balcony: 'Private Balcony',
      view: 'Panoramic Azure Sea'
    },
    amenities: [
      { name: 'High-Speed Wi-Fi', icon: 'wifi' },
      { name: 'Air Conditioning', icon: 'ac_unit' },
      { name: 'Premium Minibar', icon: 'kitchen' },
      { name: 'Espresso Machine', icon: 'coffee_maker' },
      { name: 'Deep Soaking Tub', icon: 'bathtub' },
      { name: '65" Smart TV', icon: 'tv' },
      { name: '24/7 Room Service', icon: 'room_service' },
      { name: 'In-room Safe', icon: 'lock' }
    ],
    highlights: [
      'Expansive furnished oceanfront balcony with chaise lounges',
      'Spa bathroom with freestanding soak tub & rainfall marble shower',
      'Exclusive access to the Private Beach Pavilion & Sunset Lounge',
      'Personalized concierge & turndown aromatics service'
    ],
    featured: true
  },
  {
    id: 'tropical-retreat',
    title: 'Tropical Retreat',
    category: 'Garden View',
    badge: 'Garden View',
    type: 'Suite',
    price: 380,
    rating: 4.88,
    reviewsCount: 94,
    mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnNiYoWsq6Eh02Ypbxh5fqKPrLQx8bYge8Qz6XLimno45s1zqnJd6BD4Tkvako_QQq_eKTG1vM4S88BYPHSypbwxCISF3TIDA8IQt8A_h0nHatjryhNXFdPesKY1evlNMQylAaxIpxSmjzM7QOtoX-eHVjzzWQuPT2wo0axlqKCvRFyccq-dSo_Pj77nWYJfYfzbnHeIxp4HZhF5Jut4aRwZskF0Ar8txYhNkaFOVCixSkIO2phN0wiQ',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBnNiYoWsq6Eh02Ypbxh5fqKPrLQx8bYge8Qz6XLimno45s1zqnJd6BD4Tkvako_QQq_eKTG1vM4S88BYPHSypbwxCISF3TIDA8IQt8A_h0nHatjryhNXFdPesKY1evlNMQylAaxIpxSmjzM7QOtoX-eHVjzzWQuPT2wo0axlqKCvRFyccq-dSo_Pj77nWYJfYfzbnHeIxp4HZhF5Jut4aRwZskF0Ar8txYhNkaFOVCixSkIO2phN0wiQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC7rRRNDMTuJHTL83Mx5mE3IrjLKetz_p43pzUYhewgNAynduGoBC8fIlhAzGXwiH4oApsVMiYKcaCAQ9fivlbCHYZDpEUm6JgiqMs8Ia5M5bC3v3_eyu3v0MHUfaedybdxFkiBIHNVcYYFhbCRYTIiGVf9mB6-Zci31YDZAR7tOnVzKERfoexf-NcD5NWlKP4Zel5Imzk1mAYvGc9eponhpzw5S1YvmHhPnxlzaAySUNFWjqaEvZD8LA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5fjtbXkchaFikCsFWPbNx30q7Mj_ziZ1X7eaQXxFGw2fgh7ji57RQwyDtNFQCC9pP6wQEZ-Ll3TARCzWcRUoF-2gse0m4OgNLl4tZckLXeKPYJEs5R3N_1O0pe94dN4Wg-JvD491mV8TU94NDaVgp-Xf8ooqAMhvPxG_ACd4CjE4OnQO6dfuSXmTnKDbXJn_oXs9DQInjP9CHBWxmO0oFsJDa3uhs7ABRSF_wtqo5ES6dWeoGACr73g'
    ],
    description: 'Immerse yourself in lush greenery in this serene ground-floor suite with a private garden patio surrounded by exotic palms, tropical birds, and soothing water features.',
    specs: {
      guests: 'Up to 2 Guests',
      beds: '1 King Bed',
      sqft: '680 sq ft',
      balcony: 'Private Garden Patio',
      view: 'Botanical Palms & Garden'
    },
    amenities: [
      { name: 'High-Speed Wi-Fi', icon: 'wifi' },
      { name: 'Air Conditioning', icon: 'ac_unit' },
      { name: 'Espresso Machine', icon: 'coffee_maker' },
      { name: 'Rainfall Shower', icon: 'shower' },
      { name: '55" 4K Smart TV', icon: 'tv' },
      { name: 'In-room Safe', icon: 'lock' }
    ],
    highlights: [
      'Private outdoor sun deck surrounded by lush flora',
      'Botanical garden path directly to the beach',
      'Organic artisanal tea & coffee selection'
    ],
    featured: true
  },
  {
    id: 'azure-villa',
    title: 'Azure Villa',
    category: 'Overwater',
    badge: 'Overwater',
    type: 'Villa',
    price: 850,
    rating: 4.99,
    reviewsCount: 86,
    mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0r5gfT59Z3nltg3p_l9GvbLZuZUxCl0c67QVlq1Cy7nNVBp49CXZWCPExI6pfh4Fvn-fozSybot48DLbBg_VxakQoLMfDx_s1zGyfaz6EVc8H5gcVmZoVPwNyGf3QKlGN1u26TRbFS8i34Za_GqlNAZYIh7nDvkOQR0vKh3aj0Ndc-c-9B8OTDvZXxTWUpIghoHyPD-EtnQ8S960Bg2HWl2wESX6pbZqJrKUqzIqfu81kMDScuFjpcg',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA0r5gfT59Z3nltg3p_l9GvbLZuZUxCl0c67QVlq1Cy7nNVBp49CXZWCPExI6pfh4Fvn-fozSybot48DLbBg_VxakQoLMfDx_s1zGyfaz6EVc8H5gcVmZoVPwNyGf3QKlGN1u26TRbFS8i34Za_GqlNAZYIh7nDvkOQR0vKh3aj0Ndc-c-9B8OTDvZXxTWUpIghoHyPD-EtnQ8S960Bg2HWl2wESX6pbZqJrKUqzIqfu81kMDScuFjpcg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnHW6QPxs-P-zFdUQlTZFgmoO38U9roHXgW1WEgN4VYA-dUHcHacbL7cctJKCA4Iuosmphijw25_PPo-4ONxilv4BxRFUBAMVXvKE5ZmOmc9KOLuV3mMSHmhOF3Uleqrov2mks5WEQKDNgIPYYtc4mERllqcwp5lGxTn96XIlLHDit4RVZaGd-gFPrM2DdU8BLYYGH0fCMgZSdZ91e7_5WhGne2H6CYTPHB339tXaCfYmYFy3QmSANHQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5fjtbXkchaFikCsFWPbNx30q7Mj_ziZ1X7eaQXxFGw2fgh7ji57RQwyDtNFQCC9pP6wQEZ-Ll3TARCzWcRUoF-2gse0m4OgNLl4tZckLXeKPYJEs5R3N_1O0pe94dN4Wg-JvD491mV8TU94NDaVgp-Xf8ooqAMhvPxG_ACd4CjE4OnQO6dfuSXmTnKDbXJn_oXs9DQInjP9CHBWxmO0oFsJDa3uhs7ABRSF_wtqo5ES6dWeoGACr73g'
    ],
    description: 'Suspended directly over the crystal-clear turquoise lagoon, featuring an iconic glass-bottom floor panel, direct private ladder into the ocean, and infinity horizon sun deck.',
    specs: {
      guests: 'Up to 3 Guests',
      beds: '1 Super King Bed',
      sqft: '1,100 sq ft',
      balcony: 'Overwater Lagoon Deck',
      view: 'Unobstructed Open Sea'
    },
    amenities: [
      { name: 'Glass Floor Panel', icon: 'visibility' },
      { name: 'Private Lagoon Ladder', icon: 'pool' },
      { name: 'High-Speed Wi-Fi', icon: 'wifi' },
      { name: 'Air Conditioning', icon: 'ac_unit' },
      { name: 'Champagne Minibar', icon: 'kitchen' },
      { name: 'Freestanding Sea Tub', icon: 'bathtub' },
      { name: '24/7 Butler Service', icon: 'room_service' }
    ],
    highlights: [
      'Direct ocean swim ladder right off your wooden sundeck',
      'Illuminated nocturnal glass viewing floor for coral & marine life',
      'Complimentary sunset champagne basket delivered daily'
    ],
    featured: true
  },
  {
    id: 'horizon-family-suite',
    title: 'Horizon Family Suite',
    category: 'Family',
    badge: 'Family',
    type: 'Suite',
    price: 620,
    rating: 4.92,
    reviewsCount: 110,
    mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC45iY8ba0AY1xZ3ysL3T_v744F7Qn090IW2ZeI4p8poUxfTGtHgy7JVX7mIvyCpdeLAUWWZLBhMTOYUBmafkJsianH6KWaawF9-WGQW4Cz8HOfqHC_QL1p7EFcEbDnlOBYhLiWOlGqVcenVn4IDh1bGxtGsmXEQgr-lTBj1WmsDEeWZZtg_QZ3FV-imvdJ-LD4WZQWX2zMohWzQM49VYccc0M_0DAD2MyXK3B06cuGyQhO1uxRr_pfTw',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC45iY8ba0AY1xZ3ysL3T_v744F7Qn090IW2ZeI4p8poUxfTGtHgy7JVX7mIvyCpdeLAUWWZLBhMTOYUBmafkJsianH6KWaawF9-WGQW4Cz8HOfqHC_QL1p7EFcEbDnlOBYhLiWOlGqVcenVn4IDh1bGxtGsmXEQgr-lTBj1WmsDEeWZZtg_QZ3FV-imvdJ-LD4WZQWX2zMohWzQM49VYccc0M_0DAD2MyXK3B06cuGyQhO1uxRr_pfTw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6hmGULhIdpG7b3XkXsAu5ypio8Esv6z9jFQw5Xxx1VwV0Jf6f2EVyMFphyyGmGrnIEEVorRI9MPgLLo1pPNFNrcDQbMDz-PGq_PXwMm16Pd-_9tgbJm3itvXV64yTyWzoMIld6UMCodNC_rVPYH08snmnVTdE91n7av5rMdYGm5eRazlml9jehRBCVKveaP0lbtpv_8K7hkofdyNWXdSXeciDdEbrXegOG0S4iSKIAwiSYFhkNiAkqw',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5fjtbXkchaFikCsFWPbNx30q7Mj_ziZ1X7eaQXxFGw2fgh7ji57RQwyDtNFQCC9pP6wQEZ-Ll3TARCzWcRUoF-2gse0m4OgNLl4tZckLXeKPYJEs5R3N_1O0pe94dN4Wg-JvD491mV8TU94NDaVgp-Xf8ooqAMhvPxG_ACd4CjE4OnQO6dfuSXmTnKDbXJn_oXs9DQInjP9CHBWxmO0oFsJDa3uhs7ABRSF_wtqo5ES6dWeoGACr73g'
    ],
    description: 'Spacious accommodations thoughtfully designed for families, featuring two private bedrooms, expansive separate living and dining areas, and dual ocean-view terraces.',
    specs: {
      guests: 'Up to 6 Guests',
      beds: '1 King, 2 Queens',
      sqft: '1,250 sq ft',
      balcony: 'Dual Sun Balconies',
      view: 'Ocean & Resort Pools'
    },
    amenities: [
      { name: 'Dual Bathrooms', icon: 'bathtub' },
      { name: 'High-Speed Wi-Fi', icon: 'wifi' },
      { name: 'Family Kitchenette', icon: 'kitchen' },
      { name: 'Kids Entertainment Pack', icon: 'sports_esports' },
      { name: 'Two 65" Smart TVs', icon: 'tv' },
      { name: '24/7 Concierge', icon: 'support_agent' }
    ],
    highlights: [
      'Two separate master suites connected by luxury lounge',
      'Dedicated children pool amenities & beach toys provided',
      'Private in-suite breakfast buffet setup available upon request'
    ],
    featured: true
  }
];

export const RESORT_SERVICES: ServiceItem[] = [
  {
    id: 'relax',
    name: 'RELAX',
    iconName: 'beach_access',
    shortDesc: 'Pristine private sun loungers, luxury cabanas, and tranquil seaside shade.',
    fullDesc: 'Unwind along Baku’s finest private golden shore. Enjoy dedicated beach butler service, plush shaded cabanas, scented cool towels, and undisturbed serenity by the azure coastline.',
    category: 'Beach & Comfort',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCLybys6b_-UAnkh_7QVzrH6PVBpV8ambA4-liXp_wK-H2oRH4Icvhimvv0IFTVOb_W-SMo3-LagMqLFRvxS3zy5kB0lV5zAqjvSayOTqW0YtA7jt2FcNF6lWLm-5_fD-zy8qTd1neilk-2hK_YKSFA2F3oZIzFhLaZPqSGKJsH9vXQBUj7N6GlpLD_AevdkdF-d0FQFGYwPS8oSoV_Dqq5DMUue7HVw1MMqwFs3oRsbQDVb0E1-4oCsq0g0wKeyQ6Q8c',
    features: ['Private Beach Cabanas', 'Cool Towel Service', 'Ergonomic Sunbeds', 'Infinity Pool Access'],
    operatingHours: '07:00 AM - 08:00 PM'
  },
  {
    id: 'save',
    name: 'SAVE',
    iconName: 'support',
    shortDesc: 'Certified international lifeguards and first-tier water safety assurance.',
    fullDesc: 'Your peace of mind is paramount. Our beachfront is protected by certified marine lifeguards, dedicated first-aid stations, child-safe swimming coves, and round-the-clock safety supervision.',
    category: 'Safety & Wellness',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACqWFcttmHbbOba6mepMsgCof1MywUHwXbQkoo0T5byjgJoRt-CazQ3_qknlpobHGZeswXcEIX7i78rEpa90TacJod5DI8bYI_skgU_Qtl0RQ4x7EnYuGBmbmAEMN2l1h6AbYSBujGFP2rufjGXoWXYPyUwXEST-XonD2DNDXZiDJXNzoKIwG8wZci9fL3jIP1SoC0PEy6H1qLJm31gjlsNlhxW1udc5cF0b1iNRI7A2moUyiNIcvtnw',
    features: ['24/7 Beachfront Lifeguards', 'Emergency Response Point', 'Secure Child Coves', 'Marine Life Monitoring'],
    operatingHours: '24 Hours On-Call'
  },
  {
    id: 'drink',
    name: 'DRINK',
    iconName: 'local_bar',
    shortDesc: 'Craft tropical cocktails, fresh coconuts, and seaside sunset mixology.',
    fullDesc: 'Sip artisanal beverages crafted by world-class mixologists. From chilled organic juices and fresh coconuts at noon to vintage champagne and sunset signature cocktails.',
    category: 'Dining & Lounge',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5fjtbXkchaFikCsFWPbNx30q7Mj_ziZ1X7eaQXxFGw2fgh7ji57RQwyDtNFQCC9pP6wQEZ-Ll3TARCzWcRUoF-2gse0m4OgNLl4tZckLXeKPYJEs5R3N_1O0pe94dN4Wg-JvD491mV8TU94NDaVgp-Xf8ooqAMhvPxG_ACd4CjE4OnQO6dfuSXmTnKDbXJn_oXs9DQInjP9CHBWxmO0oFsJDa3uhs7ABRSF_wtqo5ES6dWeoGACr73g',
    features: ['Sunset Mixology Bar', 'Fresh Pressed Juices', 'Swim-Up Pool Bar', 'Curated Wine Cellar'],
    operatingHours: '10:00 AM - 01:00 AM'
  },
  {
    id: 'game',
    name: 'GAME',
    iconName: 'sports_volleyball',
    shortDesc: 'Beach volleyball, coastal water sports, jet skis, and tennis courts.',
    fullDesc: 'Elevate your vacation energy with beach volleyball tournaments, stand-up paddleboarding, parasailing, catamaran sailing, and state-of-the-art tennis courts with private coaches.',
    category: 'Recreation & Sports',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyz6GRWIi9wXVQ5rN_jekGApOlAfOUtIBlGtJiZK1vTIEMxwM1NK3wHhCmU1njX9As2hNCbTAgtrqngYbaqKXTiAMSUU9CPKEUJNT_6RwY6YiP6QuOFLYhbc8rBaH3CpmHbSdzvmGVLz37BrwmEZ43V-A32YDz_PwrYhkPyLJwQmM0HP0pu-I109MT49PXyqBewuWZTYP7xg4ykD5vi1NvEyby4vpnIdTVhlcrq0cf4N1zOcbX5jlkmA',
    features: ['Tournament Beach Volleyball', 'Jet Ski & Water Safari', 'Lagoon Paddleboarding', 'Floodlit Tennis Courts'],
    operatingHours: '08:00 AM - 07:00 PM'
  }
];

export const TESTIMONIALS: ReviewItem[] = [
  {
    id: 't-1',
    name: 'Sarah & James',
    location: 'Guest from London',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlRs2br66evTNEPHX5oWRd4cKOvCL3ibzlwmXZBG82WYdQ0qT-3ONub8Tl6FyGXhOYgOUSMHbEhYJH1Gyy3pfmM-xY6EBxWktMg2PWb3dnacIfrB5LgzXBmAz54hhNJ3ZqvawpoGpAhFiBpkJo6aFhHTRRjlrVFr1mp86o_40xHtGWruaaru59W66XfJuk3mIGIGEyHmFB7TvOOFfHep8S9atNEW7_maKuaSQGM9EvCjr206pyaV7ptQ',
    rating: 5,
    comment: 'An absolute paradise. The attention to detail, from the pristine beaches to the incredible service, made our stay unforgettable. We will definitely be returning to this oasis.',
    roomName: 'Ocean Oasis Suite',
    date: 'October 2024'
  },
  {
    id: 't-2',
    name: 'Maximilian Sterling',
    location: 'Guest from Zurich',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The architectural beauty and serene sea horizon were exactly what I needed. Waking up to panoramic blue waters and world-class culinary care was pure perfection.',
    roomName: 'Azure Villa',
    date: 'November 2024'
  },
  {
    id: 't-3',
    name: 'Elena Rostova',
    location: 'Guest from Milan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Impeccable hospitality and tranquil beaches right in Baku. The sunset drinks at the ocean pavilion and the luxury suite amenities exceeded all our expectations.',
    roomName: 'Horizon Family Suite',
    date: 'September 2024'
  }
];

export const ADD_ON_OPTIONS: AddOnOption[] = [
  {
    id: 'airport-transfer',
    name: 'VIP Private Airport Transfer',
    description: 'Chauffeured Mercedes S-Class direct from Baku International Airport (15 mins)',
    price: 85
  },
  {
    id: 'champagne-fruit',
    name: 'Sunset Champagne & Tropical Platter',
    description: 'Chilled Moët & Chandon with fresh artisanal fruit and imported chocolates',
    price: 120
  },
  {
    id: 'daily-spa',
    name: 'Daily Couple Wellness & Spa Package',
    description: '60-minute deep relaxation coastal massage & ocean steam bath access',
    price: 160,
    perNight: true
  },
  {
    id: 'gourmet-breakfast',
    name: 'All-Inclusive Balcony Gourmet Breakfast',
    description: 'Fresh organic pastries, smoothies, custom omelets served directly on your private terrace',
    price: 45,
    perNight: true
  }
];

export const GALLERY_ITEMS = [
  {
    id: 'g-1',
    title: 'Pristine Beach & Sunbeds',
    category: 'Beach & Pool',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCLybys6b_-UAnkh_7QVzrH6PVBpV8ambA4-liXp_wK-H2oRH4Icvhimvv0IFTVOb_W-SMo3-LagMqLFRvxS3zy5kB0lV5zAqjvSayOTqW0YtA7jt2FcNF6lWLm-5_fD-zy8qTd1neilk-2hK_YKSFA2F3oZIzFhLaZPqSGKJsH9vXQBUj7N6GlpLD_AevdkdF-d0FQFGYwPS8oSoV_Dqq5DMUue7HVw1MMqwFs3oRsbQDVb0E1-4oCsq0g0wKeyQ6Q8c',
    desc: 'Soft golden sand meets the crystal-clear azure waters of Baku.'
  },
  {
    id: 'g-2',
    title: 'Ocean Oasis Suite Living',
    category: 'Suites',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6hmGULhIdpG7b3XkXsAu5ypio8Esv6z9jFQw5Xxx1VwV0Jf6f2EVyMFphyyGmGrnIEEVorRI9MPgLLo1pPNFNrcDQbMDz-PGq_PXwMm16Pd-_9tgbJm3itvXV64yTyWzoMIld6UMCodNC_rVPYH08snmnVTdE91n7av5rMdYGm5eRazlml9jehRBCVKveaP0lbtpv_8K7hkofdyNWXdSXeciDdEbrXegOG0S4iSKIAwiSYFhkNiAkqw',
    desc: 'Modern minimalism framing uninterrupted sea horizons.'
  },
  {
    id: 'g-3',
    title: 'Signature King Sanctuary',
    category: 'Suites',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7rRRNDMTuJHTL83Mx5mE3IrjLKetz_p43pzUYhewgNAynduGoBC8fIlhAzGXwiH4oApsVMiYKcaCAQ9fivlbCHYZDpEUm6JgiqMs8Ia5M5bC3v3_eyu3v0MHUfaedybdxFkiBIHNVcYYFhbCRYTIiGVf9mB6-Zci31YDZAR7tOnVzKERfoexf-NcD5NWlKP4Zel5Imzk1mAYvGc9eponhpzw5S1YvmHhPnxlzaAySUNFWjqaEvZD8LA',
    desc: 'Crisp Egyptian cotton linens and gentle natural sunlight.'
  },
  {
    id: 'g-4',
    title: 'Spa Marble Soaking Tub',
    category: 'Suites',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnHW6QPxs-P-zFdUQlTZFgmoO38U9roHXgW1WEgN4VYA-dUHcHacbL7cctJKCA4Iuosmphijw25_PPo-4ONxilv4BxRFUBAMVXvKE5ZmOmc9KOLuV3mMSHmhOF3Uleqrov2mks5WEQKDNgIPYYtc4mERllqcwp5lGxTn96XIlLHDit4RVZaGd-gFPrM2DdU8BLYYGH0fCMgZSdZ91e7_5WhGne2H6CYTPHB339tXaCfYmYFy3QmSANHQ',
    desc: 'Freestanding soaking tub overlooking private coastal terraces.'
  },
  {
    id: 'g-5',
    title: 'Private Ocean Balcony',
    category: 'Suites',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5fjtbXkchaFikCsFWPbNx30q7Mj_ziZ1X7eaQXxFGw2fgh7ji57RQwyDtNFQCC9pP6wQEZ-Ll3TARCzWcRUoF-2gse0m4OgNLl4tZckLXeKPYJEs5R3N_1O0pe94dN4Wg-JvD491mV8TU94NDaVgp-Xf8ooqAMhvPxG_ACd4CjE4OnQO6dfuSXmTnKDbXJn_oXs9DQInjP9CHBWxmO0oFsJDa3uhs7ABRSF_wtqo5ES6dWeoGACr73g',
    desc: 'Panoramic terrace equipped with sun loungers and dining table.'
  },
  {
    id: 'g-6',
    title: 'Overwater Azure Lagoon Villa',
    category: 'Suites',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0r5gfT59Z3nltg3p_l9GvbLZuZUxCl0c67QVlq1Cy7nNVBp49CXZWCPExI6pfh4Fvn-fozSybot48DLbBg_VxakQoLMfDx_s1zGyfaz6EVc8H5gcVmZoVPwNyGf3QKlGN1u26TRbFS8i34Za_GqlNAZYIh7nDvkOQR0vKh3aj0Ndc-c-9B8OTDvZXxTWUpIghoHyPD-EtnQ8S960Bg2HWl2wESX6pbZqJrKUqzIqfu81kMDScuFjpcg',
    desc: 'Direct aquatic access and illuminated glass bottom viewing floor.'
  },
  {
    id: 'g-7',
    title: 'Tropical Botanical Retreat',
    category: 'Beach & Pool',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnNiYoWsq6Eh02Ypbxh5fqKPrLQx8bYge8Qz6XLimno45s1zqnJd6BD4Tkvako_QQq_eKTG1vM4S88BYPHSypbwxCISF3TIDA8IQt8A_h0nHatjryhNXFdPesKY1evlNMQylAaxIpxSmjzM7QOtoX-eHVjzzWQuPT2wo0axlqKCvRFyccq-dSo_Pj77nWYJfYfzbnHeIxp4HZhF5Jut4aRwZskF0Ar8txYhNkaFOVCixSkIO2phN0wiQ',
    desc: 'Lush exotic flora surrounding private ground-floor garden lounges.'
  },
  {
    id: 'g-8',
    title: 'Sunset Panorama & Overwater Villas',
    category: 'Sunset & Views',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACqWFcttmHbbOba6mepMsgCof1MywUHwXbQkoo0T5byjgJoRt-CazQ3_qknlpobHGZeswXcEIX7i78rEpa90TacJod5DI8bYI_skgU_Qtl0RQ4x7EnYuGBmbmAEMN2l1h6AbYSBujGFP2rufjGXoWXYPyUwXEST-XonD2DNDXZiDJXNzoKIwG8wZci9fL3jIP1SoC0PEy6H1qLJm31gjlsNlhxW1udc5cF0b1iNRI7A2moUyiNIcvtnw',
    desc: 'Warm evening glow cascading over the secluded resort shoreline.'
  }
];
