const homeOwnerNames = ["John Doe", "Jane Smith", "Michael Brown", "Sara Ali", "Khalid Mansoor", "Fatima Noor", "Omar Hassan", "Layla Ahmed"];
const orgNames = ["Sarah Green", "David White", "Emma Wilson", "Ali Kazmi", "Nadia Rashid", "Carlos Mendez"];
const locations = ["Dubai, UAE", "Abu Dhabi, UAE", "Sharjah, UAE", "Ajman, UAE", "Riyadh, KSA"];

export const HOME_OWNERS = Array.from({ length: 25 }).map((_, i) => ({
  id: `homeowner-${i + 1}`,
  name: homeOwnerNames[i % homeOwnerNames.length],
  email: `homeowner${i + 1}@example.com`,
  phone: `+971 5${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
  location: locations[i % locations.length],
  totalBookings: Math.floor(Math.random() * 20) + 1,
  totalSpent: Math.floor(Math.random() * 5000) + 200,
  status: i % 10 === 0 ? "Blocked" : i % 13 === 0 ? "Suspended" : "Active",
  joinedDate: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  reviewsGiven: Math.floor(Math.random() * 15),
  favorites: Math.floor(Math.random() * 8),
  lastActive: i % 3 === 0 ? "Today" : i % 3 === 1 ? "Yesterday" : `${Math.floor(Math.random() * 7) + 2} days ago`,
  bookingHistory: Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, j) => ({
    id: `BK-${1000 + i * 10 + j}`,
    service: ["Home Organizing", "Closet Audit", "Kitchen Detox", "Event Planning", "Office Declutter"][j % 5],
    organizer: orgNames[j % orgNames.length],
    date: `2024-0${(j % 9) + 1}-${String((j % 28) + 1).padStart(2, '0')}`,
    amount: Math.floor(Math.random() * 400) + 80,
    status: j % 3 === 0 ? "Completed" : j % 3 === 1 ? "Pending" : "Cancelled",
  })),
}));

export const ORGANIZERS = Array.from({ length: 22 }).map((_, i) => ({
  id: `org-${i + 1}`,
  name: orgNames[i % orgNames.length],
  email: `org${i + 1}@example.com`,
  phone: `+971 5${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
  services: [
    ["Home Organizing", "Closet Audit", "Kitchen Detox"],
    ["Event Planning", "Office Declutter", "Moving Support"],
    ["Kitchen Detox", "Garage Cleanup", "Digital Organizing"],
  ][i % 3],
  certifications: [
    ["CPO Certified", "KonMari™ Consultant"],
    ["NAPO Member", "Licensed Organizer"],
    ["Eco-Org Certified", "NAPO Member", "CPO Certified"],
  ][i % 3],
  subscriptionPlan: i % 4 === 0 ? "Premium" : "Standard",
  subscriptionExpiry: `2024-12-${String((i % 28) + 1).padStart(2, '0')}`,
  autoRenew: i % 2 === 0,
  rating: (4 + Math.random()).toFixed(1),
  totalReviews: Math.floor(Math.random() * 80) + 10,
  completedJobs: Math.floor(Math.random() * 150) + 20,
  earnings: Math.floor(Math.random() * 25000) + 3000,
  responseRate: Math.floor(Math.random() * 20) + 80,
  onTimeRate: Math.floor(Math.random() * 15) + 85,
  status: i % 15 === 0 ? "Rejected" : i % 12 === 0 ? "Pending" : i % 18 === 0 ? "Deactivated" : "Active",
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=org${i}`,
  portfolio: [
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  ],
  bio: [
    "Professional organizer with 5 years of experience in decluttering and space optimization.",
    "Certified event planner and seasoned home consultant with a passion for creating serene environments.",
    "Eco-friendly organizing specialist focusing on sustainable and minimalist solutions for modern homes.",
  ][i % 3],
  joinedDate: `2023-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  lastActive: i % 2 === 0 ? "Online Now" : `${Math.floor(Math.random() * 24) + 1}h ago`,
}));

export const SERVICES = [
  { id: "s1", name: "Home Organizing", category: "Home Organization", tags: ["eco-friendly", "minimalism", "essential"] },
  { id: "s2", name: "Closet Audit", category: "Home Organization", tags: ["fashion", "women-owned", "personal"] },
  { id: "s3", name: "Wedding Planning", category: "Event Planning", tags: ["luxury", "women-owned", "design"] },
  { id: "s4", name: "Corporate Event", category: "Event Planning", tags: ["corporate", "strategic"] },
  { id: "s5", name: "Business Model Design", category: "Business Planning", tags: ["efficiency", "core"] },
  { id: "s6", name: "Lifestyle Design", category: "Lifestyle Planning", tags: ["health", "eco-friendly"] },
  { id: "s7", name: "Kitchen Detox", category: "Home Organization", tags: ["sustainable", "health"] },
  { id: "s8", name: "Office Declutter", category: "Business Planning", tags: ["productivity", "workspace"] },
];

export const CATEGORIES = [
  { id: "cat1", name: "Home Organization", parent: null, children: ["Closet organizing", "Kitchen detox", "Garage cleanup"] },
  { id: "cat2", name: "Event Planning", parent: null, children: ["Wedding planning", "Corporate events", "Launch parties"] },
  { id: "cat3", name: "Business Planning", parent: null, children: ["Business model", "Operational strategy", "Financial planning"] },
  { id: "cat4", name: "Lifestyle Planning", parent: null, children: ["Wellness routines", "Travel planning", "Personal habits"] },
];

export const SUBSCRIPTION_PLANS = [
  { 
    id: "std", 
    name: "Standard", 
    price: 19, 
    features: ["Basic Analytics", "3 Featured Slots", "Community Access", "Standard Visibility"] 
  },
  { 
    id: "prem", 
    name: "Premium", 
    price: 49, 
    features: ["Advanced Analytics", "Unlimited Promotions", "Visibility Boost (Top tier)", "Zero Commission", "Priority Support"] 
  },
];

export const BOOKINGS = Array.from({ length: 55 }).map((_, i) => ({
  id: `book-${i + 1}`,
  homeOwner: HOME_OWNERS[Math.floor(Math.random() * HOME_OWNERS.length)],
  organizer: ORGANIZERS[Math.floor(Math.random() * ORGANIZERS.length)],
  service: SERVICES[Math.floor(Math.random() * SERVICES.length)].name,
  date: `2024-03-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  status: i % 8 === 0 ? "Cancelled" : i % 5 === 0 ? "Pending" : "Completed",
  amount: Math.floor(Math.random() * 500) + 50,
}));

export const TRANSACTIONS = BOOKINGS.map((b, i) => ({
  id: `tr-${i + 1}`,
  user: b.homeOwner.name,
  organizer: b.organizer.name,
  amount: b.amount,
  fee: (b.amount * 0.15).toFixed(2),
  earnings: (b.amount * 0.85).toFixed(2),
  status: i % 15 === 0 ? "Failed" : i % 20 === 0 ? "Refunded" : "Paid",
  date: b.date,
}));

export const WITHDRAWAL_REQUESTS = Array.from({ length: 8 }).map((_, i) => ({
  id: `wd-${i + 1}`,
  organizer: orgNames[i % orgNames.length],
  amount: Math.floor(Math.random() * 2000) + 500,
  method: ["Bank Transfer", "PayPal", "Stripe"][i % 3],
  status: i % 3 === 0 ? "Pending" : "Approved",
  date: "2024-03-15",
}));

export const REVENUE_REPORTS = {
  daily: [
    { name: 'Mon', revenue: 1200, commission: 180 },
    { name: 'Tue', revenue: 1900, commission: 285 },
    { name: 'Wed', revenue: 1500, commission: 225 },
    { name: 'Thu', revenue: 2200, commission: 330 },
    { name: 'Fri', revenue: 3000, commission: 450 },
    { name: 'Sat', revenue: 4500, commission: 675 },
    { name: 'Sun', revenue: 4000, commission: 600 },
  ],
  monthly: [
    { name: 'Jan', revenue: 45000, commission: 6750 },
    { name: 'Feb', revenue: 52000, commission: 7800 },
    { name: 'Mar', revenue: 48000, commission: 7200 },
  ]
};

export const REVIEWS = Array.from({ length: 35 }).map((_, i) => ({
  id: `rev-${i + 1}`,
  homeOwner: HOME_OWNERS[Math.floor(Math.random() * HOME_OWNERS.length)].name,
  organizer: ORGANIZERS[Math.floor(Math.random() * ORGANIZERS.length)].name,
  rating: Math.floor(Math.random() * 2) + 4,
  comment: "Great experience working with this professional. Highly recommended!",
  date: "2024-03-10",
}));

export const ADS = Array.from({ length: 12 }).map((_, i) => ({
  id: `ad-${i + 1}`,
  organizer: orgNames[i % orgNames.length],
  budget: Math.floor(Math.random() * 450) + 50,
  targeting: ["Home Owners, UAE", "Corporate HR, KSA", "Events Sector, UAE", "Luxury Market, Qatar"][i % 4],
  duration: `${Math.floor(Math.random() * 20) + 10} Days`,
  status: i % 4 === 0 ? "Pending" : i % 5 === 0 ? "Ended" : i % 10 === 0 ? "Paused" : "Active",
  stats: { clicks: Math.floor(Math.random() * 500) + 100, impressions: Math.floor(Math.random() * 10000) + 2000 },
  revenue: Math.floor(Math.random() * 1000) + 200,
  startDate: "2024-03-01",
}));

export const FEATURE_REQUESTS = Array.from({ length: 8 }).map((_, i) => ({
  id: `feat-${i + 1}`,
  organizer: orgNames[i % orgNames.length],
  type: i % 2 === 0 ? "Homepage Spotlight" : "Highlight Listing",
  price: i % 2 === 0 ? 25 : 15,
  duration: "1 Week",
  status: i % 3 === 0 ? "Pending" : "Active",
  placementDate: "2024-03-20",
  performance: { clicks: Math.floor(Math.random() * 200), impressions: Math.floor(Math.random() * 2000) },
}));

export const REVENUE_DATA = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

export const BOOKING_STATS = [
  { name: 'Mon', value: 12 },
  { name: 'Tue', value: 19 },
  { name: 'Wed', value: 15 },
  { name: 'Thu', value: 22 },
  { name: 'Fri', value: 30 },
  { name: 'Sat', value: 45 },
  { name: 'Sun', value: 40 },
];

export const TOP_SERVICES = [
  { name: 'Home Organizing', value: 400 },
  { name: 'Event Planning', value: 300 },
  { name: 'Closet Audit', value: 300 },
  { name: 'Office Declutter', value: 200 },
];

export const ANALYTICS_DATA = [
  { name: 'Jan', revenue: 4200, users: 320 },
  { name: 'Feb', revenue: 5100, users: 410 },
  { name: 'Mar', revenue: 4800, users: 390 },
  { name: 'Apr', revenue: 6200, users: 520 },
  { name: 'May', revenue: 5800, users: 480 },
  { name: 'Jun', revenue: 7100, users: 610 },
  { name: 'Jul', revenue: 8400, users: 720 },
];

export const GROWTH_STATS = [
  { name: 'Q1', newUsers: 1200, retention: 85, revenue: 18500 },
  { name: 'Q2', newUsers: 1800, retention: 88, revenue: 24300 },
  { name: 'Q3', newUsers: 2400, retention: 91, revenue: 32100 },
  { name: 'Q4', newUsers: 3100, retention: 93, revenue: 41500 },
];

export const RATING_TRENDS = [
  { month: 'Oct', rating: 4.2 },
  { month: 'Nov', rating: 4.5 },
  { month: 'Dec', rating: 4.3 },
  { month: 'Jan', rating: 4.7 },
  { month: 'Feb', rating: 4.8 },
  { month: 'Mar', rating: 4.9 },
];

export const TOP_LOCATIONS = [
  { name: 'Dubai, UAE', value: 850 },
  { name: 'Abu Dhabi, UAE', value: 620 },
  { name: 'Riyadh, KSA', value: 480 },
  { name: 'Sharjah, UAE', value: 390 },
  { name: 'Doha, Qatar', value: 250 },
];
