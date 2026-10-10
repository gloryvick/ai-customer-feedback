export const siteConfig = {
  name: 'AutoCare Plus',
  tagline: 'Precision Auto Care & Repair',
  description:
    'Reliable car care without the guesswork. Bring your vehicle in for dependable maintenance, routine servicing, computerized diagnostics, and certified mechanical repairs across our 4 modern service branches in Lagos.',
  email: 'support@autocareplus.example',
  phone: '+234 (0) 1 234 5678',
  hotline: '+234 (0) 1 234 9999',
  whatsapp: '2348012345678',
  whatsappDisplay: '+234 801 234 5678',
  hours: 'Mon – Sat: 8:00 AM – 6:00 PM',
  hoursFull: 'Monday through Saturday (Closed Sundays) 8:00 AM – 6:00 PM',
  locationCount: '4 Certified Centers Across Lagos',
};

export const services = [
  { id: 'oil', name: 'Oil & Filter Change', icon: 'Wrench', category: 'Preventive Care', description: 'Full synthetic and premium oil service with OEM oil filter replacement and a multi-point inspection.', duration: '35 - 50 mins', features: ['Full synthetic oil', 'OEM filter replacement', 'Multi-point inspection', 'Fluid level check'] },
  { id: 'brake', name: 'Brake Service & Pad Replacement', icon: 'CircleDot', category: 'Safety Systems', description: 'Complete disc & drum brake inspection, ceramic pad replacement, and rotor resurfacing.', duration: '1.5 - 2.5 hours', features: ['Disc & drum inspection', 'Ceramic pad replacement', 'Rotor resurfacing', 'Brake fluid flush'] },
  { id: 'battery', name: 'Battery Service & Electrical Testing', icon: 'Zap', category: 'Electrical Systems', description: 'Digital CCA conductance testing, terminal anti-corrosion cleaning, and certified battery replacement.', duration: '30 - 45 mins', features: ['CCA conductance testing', 'Terminal cleaning', 'Battery replacement', 'Charging system check'] },
  { id: 'ac', name: 'AC Service & Climate Control', icon: 'Wind', category: 'Comfort Systems', description: 'Refrigerant recovery & recharge, vacuum leak detection, compressor testing, and cabin air sanitization.', duration: '1 - 2 hours', features: ['Refrigerant recharge', 'Leak detection', 'Compressor testing', 'Cabin air sanitization'] },
  { id: 'wheel', name: 'Wheel Alignment & Balancing', icon: 'CircleDot', category: 'Safety Systems', description: 'Computerized 3D wheel alignment, road force balancing, and steering angle calibration.', duration: '45 - 75 mins', features: ['3D alignment', 'Road force balancing', 'Steering calibration', 'Tire wear analysis'] },
  { id: 'diagnostic', name: 'Computerized Diagnostics', icon: 'ScanLine', category: 'Electrical Systems', description: 'Full OBD-II scan, electronic module health check, and detailed diagnostic report with recommended actions.', duration: '30 - 60 mins', features: ['OBD-II scan', 'Module health check', 'Live data analysis', 'Detailed report'] },
  { id: 'suspension', name: 'Suspension & Steering Repair', icon: 'Cog', category: 'Safety Systems', description: 'Shock absorber replacement, bushing overhaul, ball joint service, and full steering geometry correction.', duration: '2 - 4 hours', features: ['Shock replacement', 'Bushing overhaul', 'Ball joint service', 'Geometry correction'] },
  { id: 'tuneup', name: 'Engine Tune-Up & Performance', icon: 'Cog', category: 'Preventive Care', description: 'Spark plug replacement, ignition coil testing, throttle body cleaning, and ECU remap for optimal performance.', duration: '1 - 3 hours', features: ['Spark plug replacement', 'Ignition coil testing', 'Throttle body clean', 'ECU remap'] },
];

export const stats = [
  { label: 'Lagos Branches', value: '4' },
  { label: 'Certified Mechanics', value: '18' },
  { label: 'Vehicles Serviced', value: '12K+' },
  { label: 'Service Bays', value: '30' },
];

export const standardOfService = [
  { title: 'Diagnostic First Policy', desc: 'Every vehicle gets a computerized scan and multi-point inspection before any repair recommendation.' },
  { title: 'Transparent Pre-Work Estimates', desc: 'No surprise invoices. Every repair is estimated and explained before technicians begin.' },
  { title: 'Digital Health Scorecards', desc: 'Receive detailed inspection notes directly to your mobile phone.' },
  { title: 'Warranty Across All 4 Locations', desc: 'Work done in Ikeja is backed at our Lekki, Surulere, and Victoria Island branches.' },
];

export const processSteps = [
  { num: '01', title: 'Schedule or Walk In', desc: 'Pick your preferred branch and time online, or drop in at any of our workshop bays.' },
  { num: '02', title: 'Diagnostic Inspection', desc: 'Technicians hook up computerized scanners and conduct an empirical multi-point safety check.' },
  { num: '03', title: 'Itemized Estimate', desc: 'Review an exact breakdown of needed parts and labor. You approve work before any wrenches turn.' },
  { num: '04', title: 'Quality Testing & Return', desc: 'Master mechanics test-drive and certify all repairs, backed by our multi-branch guarantee.' },
];

export const branchManagers: Record<string, string> = {
  'Lekki Phase 1 Center': 'Chinedu Okafor',
  'Ikeja Commercial Hub Center': 'Babajide Adeleke',
  'Surulere Central Workshop': 'Amina Bello',
  'Victoria Island Express Center': 'Emeka Nwosu',
};

export const images = {
  hero: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  heroAlt: 'Mechanic checking a car engine in a garage',
  about: 'https://images.pexels.com/photos/8985457/pexels-photo-8985457.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  aboutAlt: 'Smiling mechanic inspecting a car engine',
  showroom: 'https://images.pexels.com/photos/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  showroomAlt: 'Modern automotive dealership',
  repair: 'https://images.pexels.com/photos/4116221/pexels-photo-4116221.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  repairAlt: 'Mechanic repairing a car engine',
  tire: 'https://images.pexels.com/photos/6870331/pexels-photo-6870331.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  tireAlt: 'Mechanic replacing a tire',
  ev: 'https://images.pexels.com/photos/4678065/pexels-photo-4678065.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  evAlt: 'Electric vehicle charging station',
  bayarea: 'https://images.pexels.com/photos/196642/pexels-photo-196642.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  bayareaAlt: 'San Francisco skyline and bay at dusk',
  diagnostic: 'https://images.pexels.com/photos/8478261/pexels-photo-8478261.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  diagnosticAlt: 'Automotive mechanic performing engine maintenance',
};
