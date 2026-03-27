const homeOwnerNames = ["John Doe", "Jane Smith", "Michael Brown", "Emily Davis", "James Wilson", "Jessica Taylor", "Robert Anderson", "Amanda Harris"];
const orgNames = ["Sarah Green", "David White", "Emma Wilson", "Chris Johnson", "Rachel Clark", "Daniel Lewis"];
const locations = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Miami, FL"];
const nationalities = ["United States", "Canada", "Mexico", "United Kingdom", "Germany", "France", "Japan", "Australia"];
const genders = ["Male", "Female"];

export const CATEGORIES = [
  { id: "cat1", name: "Home & Lifestyle Organizers", parent: null, children: ["Lifestyle Decluttering & Sustainable Organizers", "Storage Solution Consultants"] },
  { id: "cat2", name: "Business & Professional Planning", parent: null, children: ["Office & Workspace Organizers", "Digital File Organizers (cloud & device storage)", "Project Planners (freelancers, small businesses)"] },
  { id: "cat3", name: "Event & Party Planning", parent: null, children: ["Event Planners (general)", "Wedding Planners", "Party Planners (birthday, anniversary, milestone events)"] },
  { id: "cat4", name: "Personal & Lifestyle Planning", parent: null, children: ["Daily Life Planners (time & task management)", "Travel Planners & Itinerary Designers", "Fitness & Wellness Planners"] },
  { id: "cat5", name: "Home Organization Services", parent: null, children: ["General Home Organizing (decluttering, space optimization)", "Closet & Wardrobe Organizing", "Kitchen & Pantry Organization"] },
  { id: "cat6", name: "Document & Paper Management", parent: null, children: ["Paperwork Sorting & Filing", "Home Office Document Organization", "Bills, Records, and Receipts Organizing"] },
  { id: "cat7", name: "Photo & Memory Organization", parent: null, children: ["Physical Photo Album Organization", "Digital Photo Library Organizing", "Scrapbooking & Memory Preservation"] },
  { id: "cat8", name: "Relocation & Life Transitions", parent: null, children: ["Packing & Unpacking Services", "Moving-In / Move-Out Setup", "Downsizing Support (for smaller homes, seniors)"] },
  { id: "cat9", name: "Inventory & Cataloging", parent: null, children: ["Personal Inventory Organizers (insurance documentation, estate planning)", "Household Item Cataloging", "Collections Organizing (books, antiques, hobby items)"] },
  { id: "cat10", name: "Eco-Friendly & Lifestyle Organizing", parent: null, children: ["Sustainable Decluttering Solutions", "Recycling & Donation Coordination", "Minimalist Living Support"] },
];

export const HOME_OWNERS = Array.from({ length: 25 }).map((_, i) => {
  const fullName = homeOwnerNames[i % homeOwnerNames.length];
  const [firstName, lastName = ""] = fullName.split(" ");
  const dobYear = 1985 + (i % 15);
  const dobMonth = String((i % 12) + 1).padStart(2, "0");
  const dobDay = String(((i * 3) % 28) + 1).padStart(2, "0");

  return {
    id: `homeowner-${i + 1}`,
    firstName,
    lastName,
    name: fullName,
    email: `homeowner${i + 1}@example.com`,
    phone: `+1 (${Math.floor(Math.random() * 800) + 200}) 555-${Math.floor(Math.random() * 9000) + 1000}`,
    dob: `${dobYear}-${dobMonth}-${dobDay}`,
    gender: genders[i % genders.length],
    location: locations[i % locations.length],
    totalBookings: Math.floor(Math.random() * 20) + 1,
    totalSpent: Math.floor(Math.random() * 5000) + 200,
    status: i % 10 === 0 ? "Suspended" : "Active",
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
  };
});

export const ORGANIZERS = Array.from({ length: 22 }).map((_, i) => {
  const ownerName = orgNames[i % orgNames.length];
  const tradeSlug = ownerName.split(" ")[0].toLowerCase();
  const city = locations[i % locations.length].split(",")[0];
  return {
    id: `org-${i + 1}`,
    ownerName,
    businessName: `${ownerName.split(" ")[0]} Organizing Studio`,
    tradeName: `${ownerName.split(" ")[0]} Organizing & Planning LLC`,
    name: ownerName,
    fullAddress: `${100 + i} ${['Main St', 'Oak Ave', 'Broadway', 'Sunset Blvd'][i % 4]}, Suite ${i + 1}, ${locations[i % locations.length]}, USA`,
    businessTimings: [
      "Mon–Fri 9:00 AM – 6:00 PM • Sat 10:00 AM – 2:00 PM • Sun closed",
      "Daily 8:00 AM – 8:00 PM",
      "Mon–Thu 10:00 AM – 7:00 PM • Fri 10:00 AM – 5:00 PM • Sat–Sun closed",
    ][i % 3],
    website: `https://www.${tradeSlug}-organizing.com`,
    description: [
      "Full-service home and office organizing. We handle decluttering, storage planning, and sustainable disposal with a dedicated project lead for every client.",
      "Corporate and residential organizing with certified consultants. Notes: preferred contact via email for quotes; rush jobs subject to availability.",
      "Specializing in eco-friendly organizing and moving support. Additional services include digital file audits and seasonal wardrobe rotation.",
    ][i % 3],
    companyBannerUrl: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=360&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=360&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&h=360&fit=crop",
    ][i % 3],
    businessLicenseDocument: "Business_License_2024.pdf",
    tradeRegistrationDocument: "Trade_Name_Certificate.pdf",
    businessLicenseFileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tradeRegistrationFileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    serviceAreas: [
      [`${city} — Downtown`, `${city} — Midtown`, `${city} — West Side`],
      [`${city} — Central Park`, `${city} — Financial District`],
      [`${city} — North Shore`, `${city} — South Beach`],
    ][i % 3],
    email: `org${i + 1}@example.com`,
    nationality: nationalities[i % nationalities.length],
    phone: `+1 (${Math.floor(Math.random() * 800) + 200}) 555-${Math.floor(Math.random() * 9000) + 1000}`,
    documents: [
      "Business License.pdf",
      "ID Verification.pdf",
      "Address Proof.pdf",
    ].slice(0, (i % 3) + 1),
    location: locations[i % locations.length],
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
    category: CATEGORIES[i % CATEGORIES.length].name,
    status: i % 15 === 0 ? "Suspended" : i % 12 === 0 ? "Pending" : "Active",
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
  };
});

export type OrganizerTransaction = {
  id: string;
  organizerId: string;
  date: string;
  reference: string;
  type: 'Booking payment' | 'Refund' | 'Subscription' | 'Payout adjustment';
  description: string;
  grossAmount: number;
  platformFee: number;
  netToOrganizer: number;
  status: 'Completed' | 'Pending';
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
};

export const ORGANIZER_TRANSACTIONS: OrganizerTransaction[] = ORGANIZERS.flatMap((org, i) => {
  const count = 6 + (i % 7);
  return Array.from({ length: count }, (_, j) => {
    const typeRoll = (i * 7 + j * 5) % 10;
    let type: OrganizerTransaction['type'];
    let gross: number;
    let platformFee: number;
    const descBooking = [
      `Home organizing — ${org.services[0] ?? 'Service'}`,
      `Closet audit — ${org.businessName}`,
      `Office session — ${org.services[1] ?? 'Service'}`,
      `Kitchen deep clean package`,
    ];
    if (typeRoll <= 5) {
      type = 'Booking payment';
      gross = 220 + ((i * 31 + j * 17) % 980);
      platformFee = Math.round(gross * 0.12 * 100) / 100;
    } else if (typeRoll <= 7) {
      type = 'Refund';
      gross = -(60 + ((i + j * 3) % 320));
      platformFee = Math.round(gross * 0.12 * 100) / 100;
    } else if (typeRoll === 8) {
      type = 'Subscription';
      gross = 49 + (i % 4) * 25;
      platformFee = Math.round(gross * 0.15 * 100) / 100;
    } else {
      type = 'Payout adjustment';
      gross = ((i + j) % 2 === 0 ? 1 : -1) * (15 + ((i * j) % 40));
      platformFee = 0;
    }
    const netToOrganizer = Math.round((gross - platformFee) * 100) / 100;
    const day = ((i * 3 + j * 2) % 27) + 1;
    const month = String(((j + i) % 12) + 1).padStart(2, '0');
    
    const customer = HOME_OWNERS[(i + j) % HOME_OWNERS.length];
    const serviceName = type === 'Booking payment' || type === 'Refund' 
      ? (org.services[j % org.services.length] || 'Home Organizing') 
      : undefined;

    const description =
      type === 'Booking payment'
        ? `${serviceName} — ${customer.name}`
        : type === 'Refund'
          ? `Refund: ${serviceName}`
          : type === 'Subscription'
            ? `${org.subscriptionPlan} plan — monthly platform fee`
            : 'Manual balance adjustment';

    return {
      id: `txn-${org.id}-${j}`,
      organizerId: org.id,
      date: `2024-${month}-${String(day).padStart(2, '0')}`,
      reference: `REF-${String(10000 + i * 100 + j)}`,
      type,
      description,
      grossAmount: gross,
      platformFee,
      netToOrganizer,
      status: j % 10 === 0 ? 'Pending' : 'Completed',
      customerName: type === 'Booking payment' || type === 'Refund' ? customer.name : undefined,
      customerEmail: type === 'Booking payment' || type === 'Refund' ? customer.email : undefined,
      serviceName,
    };
  });
});

export const SERVICES = [
  // Home & Lifestyle Organizers
  { id: "s1", name: "Lifestyle Decluttering & Sustainable Organizers", category: "Home & Lifestyle Organizers", tags: ["lifestyle", "decluttering", "sustainable"] },
  { id: "s2", name: "Storage Solution Consultants", category: "Home & Lifestyle Organizers", tags: ["storage", "home", "consulting"] },

  // Business & Professional Planning
  { id: "s3", name: "Office & Workspace Organizers", category: "Business & Professional Planning", tags: ["office", "workspace", "organization"] },
  { id: "s4", name: "Digital File Organizers (cloud & device storage)", category: "Business & Professional Planning", tags: ["digital", "files", "cloud"] },
  { id: "s5", name: "Project Planners (freelancers, small businesses)", category: "Business & Professional Planning", tags: ["project", "planning", "business"] },
  { id: "s6", name: "Corporate Admin Support (document workflows, scheduling)", category: "Business & Professional Planning", tags: ["admin", "scheduling", "corporate"] },
  { id: "s7", name: "HR & Compliance File Organizers", category: "Business & Professional Planning", tags: ["hr", "compliance", "files"] },
  { id: "s8", name: "Financial Organizers (personal budgeting & business planning)", category: "Business & Professional Planning", tags: ["finance", "budgeting", "planning"] },
  { id: "s9", name: "Productivity Coaches (workflow optimization)", category: "Business & Professional Planning", tags: ["productivity", "workflow", "coaching"] },
  { id: "s10", name: "Virtual Assistants (remote planning & task management)", category: "Business & Professional Planning", tags: ["virtual-assistant", "tasks", "remote"] },
  { id: "s11", name: "Trade Show & Expo Planners", category: "Business & Professional Planning", tags: ["expo", "trade-show", "events"] },
  { id: "s12", name: "Startup Launch & Pitch Planners", category: "Business & Professional Planning", tags: ["startup", "launch", "pitch"] },

  // Event & Party Planning
  { id: "s13", name: "Event Planners (general)", category: "Event & Party Planning", tags: ["event", "planning", "general"] },
  { id: "s14", name: "Wedding Planners", category: "Event & Party Planning", tags: ["wedding", "event", "planning"] },
  { id: "s15", name: "Party Planners (birthday, anniversary, milestone events)", category: "Event & Party Planning", tags: ["party", "birthday", "anniversary"] },
  { id: "s16", name: "Corporate Event Planners", category: "Event & Party Planning", tags: ["corporate", "event", "planning"] },
  { id: "s17", name: "Conference & Meeting Planners", category: "Event & Party Planning", tags: ["conference", "meeting", "planning"] },
  { id: "s18", name: "Festival & Community Event Planners", category: "Event & Party Planning", tags: ["festival", "community", "event"] },
  { id: "s19", name: "Seasonal/Holiday Event Planners (Christmas, Halloween, etc.)", category: "Event & Party Planning", tags: ["holiday", "seasonal", "event"] },
  { id: "s20", name: "Destination Wedding & Travel Event Planners", category: "Event & Party Planning", tags: ["destination", "wedding", "travel"] },

  // Personal & Lifestyle Planning
  { id: "s21", name: "Daily Life Planners (time & task management)", category: "Personal & Lifestyle Planning", tags: ["daily-life", "time", "tasks"] },
  { id: "s22", name: "Study/Academic Planners (student-focused)", category: "Personal & Lifestyle Planning", tags: ["study", "academic", "students"] },
  { id: "s23", name: "Travel Planners & Itinerary Designers", category: "Personal & Lifestyle Planning", tags: ["travel", "itinerary", "planning"] },
  { id: "s24", name: "Family & Parenting Planners (kids' schedules, family activities)", category: "Personal & Lifestyle Planning", tags: ["family", "parenting", "schedules"] },
  { id: "s25", name: "Senior Care Planners (appointments, routines)", category: "Personal & Lifestyle Planning", tags: ["senior-care", "appointments", "routines"] },
  { id: "s26", name: "Concierge & Personal Assistant Services", category: "Personal & Lifestyle Planning", tags: ["concierge", "assistant", "personal"] },
  { id: "s27", name: "Meal Planners & Nutrition Organizers", category: "Personal & Lifestyle Planning", tags: ["meal", "nutrition", "planning"] },
  { id: "s28", name: "Fitness & Wellness Planners", category: "Personal & Lifestyle Planning", tags: ["fitness", "wellness", "planning"] },

  // Home Organization Services
  { id: "s29", name: "General Home Organizing (decluttering, space optimization)", category: "Home Organization Services", tags: ["home", "decluttering", "space"] },
  { id: "s30", name: "Closet & Wardrobe Organizing", category: "Home Organization Services", tags: ["closet", "wardrobe", "home"] },
  { id: "s31", name: "Kitchen & Pantry Organization", category: "Home Organization Services", tags: ["kitchen", "pantry", "organization"] },
  { id: "s32", name: "Garage & Basement Organization", category: "Home Organization Services", tags: ["garage", "basement", "storage"] },
  { id: "s33", name: "Attic & Storage Room Organization", category: "Home Organization Services", tags: ["attic", "storage", "home"] },
  { id: "s34", name: "Kids' Room & Playroom Organization", category: "Home Organization Services", tags: ["kids", "playroom", "organization"] },

  // Document & Paper Management
  { id: "s35", name: "Paperwork Sorting & Filing", category: "Document & Paper Management", tags: ["paperwork", "filing", "documents"] },
  { id: "s36", name: "Home Office Document Organization", category: "Document & Paper Management", tags: ["home-office", "documents", "organization"] },
  { id: "s37", name: "Bills, Records, and Receipts Organizing", category: "Document & Paper Management", tags: ["bills", "receipts", "records"] },

  // Photo & Memory Organization
  { id: "s38", name: "Physical Photo Album Organization", category: "Photo & Memory Organization", tags: ["photo", "album", "memory"] },
  { id: "s39", name: "Digital Photo Library Organizing", category: "Photo & Memory Organization", tags: ["digital", "photo", "library"] },
  { id: "s40", name: "Scrapbooking & Memory Preservation", category: "Photo & Memory Organization", tags: ["scrapbooking", "memory", "preservation"] },

  // Relocation & Life Transitions
  { id: "s41", name: "Packing & Unpacking Services", category: "Relocation & Life Transitions", tags: ["packing", "unpacking", "moving"] },
  { id: "s42", name: "Moving-In / Move-Out Setup", category: "Relocation & Life Transitions", tags: ["move-in", "move-out", "setup"] },
  { id: "s43", name: "Downsizing Support (for smaller homes, seniors)", category: "Relocation & Life Transitions", tags: ["downsizing", "senior", "support"] },
  { id: "s44", name: "Estate Clean-Out & Organization", category: "Relocation & Life Transitions", tags: ["estate", "clean-out", "organization"] },

  // Inventory & Cataloging
  { id: "s45", name: "Personal Inventory Organizers (insurance documentation, estate planning)", category: "Inventory & Cataloging", tags: ["inventory", "insurance", "estate"] },
  { id: "s46", name: "Household Item Cataloging", category: "Inventory & Cataloging", tags: ["household", "cataloging", "items"] },
  { id: "s47", name: "Collections Organizing (books, antiques, hobby items)", category: "Inventory & Cataloging", tags: ["collections", "antiques", "hobby"] },

  // Eco-Friendly & Lifestyle Organizing
  { id: "s48", name: "Sustainable Decluttering Solutions", category: "Eco-Friendly & Lifestyle Organizing", tags: ["sustainable", "decluttering", "eco-friendly"] },
  { id: "s49", name: "Recycling & Donation Coordination", category: "Eco-Friendly & Lifestyle Organizing", tags: ["recycling", "donation", "coordination"] },
  { id: "s50", name: "Minimalist Living Support", category: "Eco-Friendly & Lifestyle Organizing", tags: ["minimalist", "lifestyle", "support"] },
];


export const SUBSCRIPTION_PLANS = [
  { 
    id: "std", 
    name: "Standard", 
    price: 19, 
    features: ["Basic Listing", "1 city coverage", "Contact Info", "Photo gallery"] 
  },
  { 
    id: "prem", 
    name: "Premium", 
    price: 49, 
    features: ["Service Listing", "Multiple cities coverage", "Contact Info", "Photo gallery", "Video gallery", "Profile badge", "Analytics", "Ability to create discounts offers"] 
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

export const TRANSACTIONS = Array.from({ length: 45 }).map((_, i) => {
  const isRefund = i % 15 === 14;
  const isSub = i % 7 === 6;
  const isBoost = i % 4 === 3;
  const isSpotlight = i % 11 === 10;
  
  let type = "Platform Fee";
  let category = SERVICES[i % SERVICES.length].name;
  let amount = Math.floor(Math.random() * 80) + 15;
  let platformFee = (amount * 0.1).toFixed(2);
  
  if (isRefund) {
    type = "Refund";
    category = "Cancelled " + category.toLowerCase() + " booking";
    amount = -(Math.floor(Math.random() * 300) + 100); 
    platformFee = Math.abs(amount * 0.1).toFixed(2);
  } else if (isSub) {
    type = i % 2 === 0 ? "Premium Subscriptions" : "Standard Subscriptions";
    category = i % 2 === 0 ? "Premium plan renewal" : "Standard plan renewal";
    amount = i % 2 === 0 ? 49 : 19;
    platformFee = (amount * 0.1).toFixed(2);
  } else if (isBoost) {
    type = "Highlighted Listing";
    category = "Highlighted Listing Upgrade";
    amount = 15;
    platformFee = "1.50";
  } else if (isSpotlight) {
    type = "Homepage Spotlight";
    category = "Homepage Spotlight Feature";
    amount = 75;
    platformFee = "7.50";
  }

  const name = HOME_OWNERS[i % HOME_OWNERS.length].name;
  const email = HOME_OWNERS[i % HOME_OWNERS.length].email;
  const methods = ["Stripe", "Visa +4242", "Mastercard +9012", "Amex +3456"];

  return {
    id: `tr-${i + 1}`,
    name,
    email,
    category,
    type,
    amount,
    platformFee,
    date: `2026-02-${String(24 - (i % 24)).padStart(2, '0')}`,
    method: methods[i % methods.length],
  };
});

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
  service: SERVICES[Math.floor(Math.random() * SERVICES.length)].name,
  rating: Math.floor(Math.random() * 2) + 4,
  comment: "Great experience working with this professional. Highly recommended!",
  date: "2024-03-10",
}));

export const ADS = Array.from({ length: 12 }).map((_, i) => ({
  id: `ad-${i + 1}`,
  organizer: orgNames[i % orgNames.length],
  budget: Math.floor(Math.random() * 450) + 50,
  targeting: ["Home Owners, USA", "Businesses, USA", "New Homeowners, USA", "Real Estate Market, USA"][i % 4],
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
  { name: 'New York, NY', value: 850 },
  { name: 'Los Angeles, CA', value: 620 },
  { name: 'Chicago, IL', value: 480 },
  { name: 'Houston, TX', value: 390 },
  { name: 'Miami, FL', value: 250 },
];

export const ORGANIZER_PACKAGES = Array.from({ length: 44 }).map((_, i) => ({
  id: `pkg-${i + 1}`,
  organizerId: `org-${(i % 22) + 1}`,
  name: ["Home Harmony Bundle", "Office Zen Special", "Quick Refresh Deal", "Kitchen & Pantry Combo", "Digital Life Reboot"][i % 5],
  description: "A comprehensive organization package designed to maximize space and efficiency. Includes consultation and hands-on session.",
  price: 299 + (i * 25) % 500,
  originalPrice: 400 + (i * 30) % 650,
  discount: Math.floor(Math.random() * 15) + 15,
  active: i % 10 !== 0,
}));

export const ORGANIZER_PROMOTIONS = Array.from({ length: 25 }).map((_, i) => ({
  id: `pro-${i + 1}`,
  organizerId: `org-${(i % 22) + 1}`,
  name: i % 2 === 0 ? "Homepage Spotlight" : "Highlight Listing",
  status: i % 5 === 0 ? "Ended" : i % 8 === 0 ? "Pending" : "Active",
  startDate: "2024-03-01",
  endDate: "2024-03-31",
  impressions: Math.floor(Math.random() * 5000) + 1000,
  clicks: Math.floor(Math.random() * 400) + 50,
  cost: i % 2 === 0 ? 59.99 : 24.99,
}));
