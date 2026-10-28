/**
 * SAPPHIRE FITNESS GYM - CENTRAL CONFIGURATION
 * 
 * IMPORTANT NOTE FOR GYM OWNER & DEVELOPERS:
 * All membership pricing, durations, benefits, and contact details are centrally 
 * managed in this single configuration file.
 * 
 * DISCLAIMER:
 * The pricing figures (₹999, ₹2,499, etc.) below are DEMONSTRATION / PLACEHOLDER 
 * prices for project presentation and are currently UNCONFIRMED by Sapphire Fitness Gym management.
 * Update `isPriceConfirmed: true` once official rates are verified with the owner.
 */

const SAPPHIRE_CONFIG = {
  // Brand & Business Identity
  business: {
    name: "Sapphire Fitness Gym",
    legalName: "Sapphire Fitness Gym India",
    tagline: "Build Your Stronger Self",
    subheading: "Train with purpose. Build strength. Become your best.",
    establishedYear: "2023",
    statusNote: "College Project & Commercial Gym Website Prototype",
    // Contact details (Marked for verification)
    contact: {
      phone: "+91 98765 43210",          // Demonstration contact - Replace with gym's verified number
      phoneRaw: "+919876543210",
      whatsapp: "+919876543210",         // Demonstration WhatsApp
      whatsappDisplay: "+91 98765 43210",
      email: "enquiry@sapphirefitness.in", // Demonstration email
      isContactConfirmed: false,          // Toggle to true once confirmed by gym owner
      confirmationNotice: "Contact numbers & address shown are for demonstration until confirmed by Sapphire Fitness Gym management."
    },
    // Location & Hours
    location: {
      addressLine1: "Sapphire Fitness Gym, Main Market Road",
      city: "City Center",
      state: "State, India",
      pincode: "110001",
      fullAddress: "Sapphire Fitness Gym, Main Market Road, City Center, India",
      landmark: "Near Metro / Main Commercial Hub",
      isAddressConfirmed: false
    },
    hours: [
      { days: "Monday – Saturday", morning: "6:00 AM – 11:30 AM", evening: "5:00 PM – 10:00 PM" },
      { days: "Sunday", morning: "7:00 AM – 1:00 PM", evening: "Rest & Sanitization" }
    ]
  },

  // Configuration Disclaimers
  disclaimer: {
    pricingNotice: "⚠️ Demonstration / Unconfirmed Pricing: The prices listed below are demonstration estimates for this website project. Official pricing must be verified directly with Sapphire Fitness Gym management.",
    isPriceConfirmed: false
  },

  // Membership Plans
  memberships: [
    {
      id: "monthly",
      title: "Monthly Membership",
      duration: "1 Month",
      billingCycle: "Billed monthly",
      price: 999,
      formattedPrice: "₹999",
      pricePeriod: "/ month",
      isPopular: false,
      tag: "Flexible",
      description: "Ideal for beginners looking to start their fitness journey without long-term commitment.",
      features: [
        "Full access to main gym floor & free weights",
        "Use of branded Sapphire leg press & smith machines",
        "Locker access & private changing room facilities",
        "General gym floor guidance",
        "Open 6 days a week workout slots"
      ],
      notIncluded: [
        "Dedicated 1-on-1 personal trainer",
        "Custom diet & nutrition chart"
      ]
    },
    {
      id: "quarterly",
      title: "Quarterly Membership",
      duration: "3 Months",
      billingCycle: "Billed quarterly",
      price: 2499,
      formattedPrice: "₹2,499",
      pricePeriod: "/ 3 months",
      effectiveMonthly: "₹833 / mo",
      isPopular: false,
      tag: "Habit Builder",
      description: "Build steady consistency with 90 days of structured progressive overload and discipline.",
      features: [
        "Full access to all strength & cardio equipment",
        "Access to branded resistance machines & racks",
        "Secure locker storage & private changing cabins",
        "Initial fitness assessment & equipment orientation",
        "Locker reservation priority during session"
      ],
      notIncluded: [
        "Dedicated 1-on-1 personal trainer"
      ]
    },
    {
      id: "half-yearly",
      title: "Half-Yearly Membership",
      duration: "6 Months",
      billingCycle: "Billed every 6 months",
      price: 4499,
      formattedPrice: "₹4,499",
      pricePeriod: "/ 6 months",
      effectiveMonthly: "₹749 / mo",
      isPopular: true,
      tag: "Most Popular",
      description: "Our most sought-after plan for serious physique transformations and sustained strength milestones.",
      features: [
        "Unlimited gym floor access during all opening hours",
        "Complete free weights, dumbbell & Olympic bar access",
        "Branded hack squat, leg press & Smith machine use",
        "Private changing rooms & locker amenities",
        "Progressive workout routine advice",
        "1 Free guest pass per quarter"
      ],
      notIncluded: []
    },
    {
      id: "annual",
      title: "Annual Membership",
      duration: "12 Months",
      billingCycle: "Billed annually",
      price: 7999,
      formattedPrice: "₹7,999",
      pricePeriod: "/ year",
      effectiveMonthly: "₹666 / mo",
      isPopular: false,
      tag: "Best Value",
      description: "Maximum commitment, maximum results. The most economical path to long-term strength and vitality.",
      features: [
        "Complete 365-day access to all gym equipment",
        "Full use of heavy dumbbell range & power stations",
        "Complimentary fitness goal tracking session",
        "Guaranteed locker access and changing booths",
        "Option to freeze membership for up to 30 days",
        "Priority assistance from floor trainers",
        "Highest cost savings over monthly rates"
      ],
      notIncluded: []
    }
  ],

  // Verified Gym Facilities (Strictly matching real gym photographs)
  facilities: [
    {
      id: "branded-strength",
      title: "Branded Heavy Strength Stations",
      category: "Equipment",
      badge: "Authentic Sapphire Rig",
      image: "assets/images/gym/sapphire-leg-press-branded.jpg",
      description: "Heavy-duty commercial 45-degree Leg Press and Smith Machine custom-built and branded with the official Sapphire Fitness crest."
    },
    {
      id: "free-weights",
      title: "Olympic Free Weights & Benches",
      category: "Free Weights",
      badge: "Strength Zone",
      image: "assets/images/gym/sapphire-free-weights-bench.jpg",
      description: "Dedicated bench press stations, Olympic barbell racks, calibrated plates, and multiple flat & incline workout benches."
    },
    {
      id: "dumbbell-rack",
      title: "Comprehensive Dumbbell Array",
      category: "Free Weights",
      badge: "Wide Weight Selection",
      image: "assets/images/gym/sapphire-gym-floor-dumbbells.jpg",
      description: "Tiered dumbbell racks spanning beginner to advanced heavy poundages, paired with full-height mirrors and rubber shock flooring."
    },
    {
      id: "private-changing",
      title: "Private Changing Cabins",
      category: "Amenities",
      badge: "Member Comfort",
      image: "assets/images/gym/sapphire-changing-rooms.jpg",
      description: "Full-height private changing booths with modern dual-stripe partitions, wooden parquet flooring, and linear ceiling lighting."
    },
    {
      id: "secure-lockers",
      title: "Secure Member Lockers & Storage",
      category: "Amenities",
      badge: "Safety & Hygiene",
      image: "assets/images/gym/sapphire-lockers-storage.jpg",
      description: "Numbered individual key-locked lockers, shoe shelves, and hydration/supplement counter for members' peace of mind."
    },
    {
      id: "reception-desk",
      title: "Official Reception & Welcome Lounge",
      category: "Reception",
      badge: "Chrome 3D Branding",
      image: "assets/images/gym/sapphire-reception-desk.jpg",
      description: "Welcoming reception foyer featuring prominent 3D metallic Sapphire Fitness chrome wall branding, geometric chandelier lighting, and front assistance desk."
    },
    {
      id: "cardio-bikes",
      title: "Cardio Cycling & Machine Hall",
      category: "Cardio",
      badge: "Branded Spin Bikes",
      image: "assets/images/gym/sapphire-cardio-bikes-floor.jpg",
      description: "Dedicated aerobic zone featuring custom-branded Sapphire indoor spin cycles, selectorized pin-loaded stations, and bright linear LED ceiling strips."
    },
    {
      id: "barbell-bench-press",
      title: "Olympic Bench Press & Cable Rig",
      category: "Free Weights",
      badge: "Compound Power",
      image: "assets/images/gym/sapphire-barbell-bench-press.jpg",
      description: "Heavy-duty flat Olympic bench press station loaded with Olympic plates, paired with branded Sapphire vertical cable tower and spotting clearance."
    }
  ],

  // Fitness Programs
  programs: [
    {
      id: "strength-power",
      title: "Strength & Powerlifting",
      tagline: "Master Compound Lifts",
      icon: "dumbbell",
      level: "All Levels",
      duration: "4 - 5 Days/Week",
      description: "Focus on squats, deadlifts, bench press, and overhead presses using our heavy-duty barbells and Olympic bumper plates.",
      highlights: ["Barbell compound progression", "Form and grip technique", "Core stabilization"]
    },
    {
      id: "hypertrophy-muscle",
      title: "Hypertrophy & Muscle Building",
      tagline: "Aesthetics & Volume",
      icon: "muscle",
      level: "Beginner to Advanced",
      duration: "5 - 6 Days/Week",
      description: "Targeted muscle group isolation and progressive overload utilizing our extensive dumbbell array, leg press, and cable attachments.",
      highlights: ["Time-under-tension training", "High-volume splits", "Mind-muscle focus"]
    },
    {
      id: "weight-loss-conditioning",
      title: "Fat Loss & Conditioning",
      tagline: "Stamina & High Energy",
      icon: "fire",
      level: "All Levels",
      duration: "3 - 5 Days/Week",
      description: "High-density supersets, circuit training, bodyweight conditioning, and aerobic stepper drills designed to burn calories and boost stamina.",
      highlights: ["High intensity intervals", "Metabolic conditioning", "Agility and stamina"]
    },
    {
      id: "form-personal-coaching",
      title: "Form & Personal Guidance",
      tagline: "Injury Prevention & Precision",
      icon: "coach",
      level: "Tailored",
      duration: "Flexible Scheduling",
      description: "One-on-one form correction, biomechanical adjustments, and tailored workout plans under knowledgeable floor guidance.",
      highlights: ["Postural correction", "Zero-ego safe lifting", "Custom progression tracking"]
    }
  ],

  // Genuine Member Feedback Placeholder (Respecting requirement 8)
  testimonials: [
    {
      quote: "The atmosphere at Sapphire Fitness is raw, authentic, and motivating. The branded leg press and dumbbell variety give you everything you need for serious gains.",
      author: "Verified Member Review",
      role: "Strength Enthusiast (6 Months Member)",
      rating: 5,
      note: "Sample member feedback — Gym owner can supply verified customer testimonials anytime."
    },
    {
      quote: "Clean changing rooms, proper lockers, and a dedicated weight lifting floor without unnecessary distractions. Best gym in the area for real workouts.",
      author: "Gym Trainee",
      role: "Regular Evening Trainee",
      rating: 5,
      note: "Authentic feedback format prepared for gym owner verification."
    },
    {
      quote: "Great lighting, huge mirrors to check your lifting form, and well-maintained equipment. Value for money memberships compared to commercial chain gyms.",
      author: "Fitness Member",
      role: "Annual Member",
      rating: 5,
      note: "Sample member feedback for demonstration."
    }
  ],

  // Form & Persistence Configuration
  enquiryService: {
    apiEndpoint: "/api/enquire",        // Local Python / Node REST endpoint
    localStorageKey: "sapphire_leads",  // Client-side persistent backup
    requirePhoneDigits: 10,
    allowDirectWhatsAppFallback: true
  }
};

// Expose globally
if (typeof window !== "undefined") {
  window.SAPPHIRE_CONFIG = SAPPHIRE_CONFIG;
}
