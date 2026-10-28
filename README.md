# Sapphire Fitness Gym — Premium Business Website

A complete, high-converting, responsive website built from scratch for **Sapphire Fitness Gym** in India. This project was engineered both as an exceptional college project and as a ready-to-deploy digital asset for the actual gym owner.

---

## 🌟 Key Features

1. **Athletic Design System**:
   - Palette: Charcoal Black (`#0b0f15`), Dark Graphite (`#121822`), and Electric Sapphire Blue (`#0066ff` / `#00d2ff`).
   - Clean spacing, high contrast, glassmorphism cards, and smooth micro-animations.
   - 100% responsive across mobile phones, tablets, laptops, and ultra-wide screens.

2. **100% Authentic Gym Photography**:
   - Utilizes genuine photographs taken inside Sapphire Fitness Gym.
   - Showcases:
     - **Welcome Reception**: Front desk with 3D metallic chrome *"SAPPHIRE FITNESS"* wall branding.
     - **Branded Strength Station**: Commercial 45° plate-loaded Leg Press & Hack Squat with Sapphire shield crest.
     - **Cardio & Indoor Cycling**: Branded *"SAPPHIRE"* indoor spin bikes and machine hall.
     - **Olympic Barbell Press**: Olympic flat bench press station with calibrated plates and vertical cable rig.
     - **Free Weights Floor**: Dumbbell array, flat and incline benches, rubber impact flooring, and motivational wall murals.
     - **Private Changing Rooms**: Full-height private changing cubicles with wood flooring and linear lighting.
     - **Secure Member Lockers**: 12-door individual key-locked storage and shaker counter.

3. **Editable Membership Pricing with Unconfirmed Disclaimer**:
   - Pre-configured demonstration plans:
     - **Monthly Membership**: ₹999 / month
     - **Quarterly Membership**: ₹2,499 / 3 months
     - **Half-Yearly Membership**: ₹4,499 / 6 months *(Most Popular)*
     - **Annual Membership**: ₹7,999 / year *(Best Value)*
   - Single configuration file (`assets/js/config.js`) to edit prices, perks, and terms in seconds.
   - Prominent demonstration pricing notes identifying figures as unconfirmed until verified with gym management.
   - Prefilled *"Enquire Now"* triggers on every plan card.

4. **Polished Enquiry Form & Dual Persistence**:
   - Real-time Indian phone validation (`+91` 10-digit mobile check).
   - Anti-spam honeypot trap and duplicate submission prevention.
   - Dual-persistence engine:
     - **Mode A (REST API)**: Automatically persists leads to `data/enquiries.json` via local Python backend server (`server.py`).
     - **Mode B (Client-side Backup)**: Persists leads in browser `localStorage`.
     - **Instant WhatsApp Bridge**: Pre-composes a formatted WhatsApp lead message for direct chatting.

5. **Gym Owner Admin Portal (`admin.html`)**:
   - Real-time dashboard to view incoming customer leads.
   - Search by lead name, phone number, or selected membership plan.
   - Filter by status (*New* vs *Contacted*).
   - One-click *Call* and *WhatsApp* action buttons for direct follow-up.
   - One-click **Export to CSV** for offline spreadsheets.

---

## 📁 Project Directory Structure

```
Sapphire fitness gym/
├── index.html                   # 10-Section Required Homepage
├── about.html                   # Gym Philosophy, Story & Standards
├── programs.html                # Strength, Hypertrophy, Cardio & Coaching Tracks
├── memberships.html             # Detailed Pricing Cards, Comparison Table & FAQs
├── gallery.html                 # Authentic Photo Gallery with Filters & Lightbox
├── contact.html                 # Contact Info, Stylized Map, & Enquiry Form
├── admin.html                   # Gym Owner Lead Management Dashboard
├── server.py                    # Local Python HTTP Server & JSON Lead API
├── data/
│   └── enquiries.json           # Real Persistent Storage for Inquiries
└── assets/
    ├── css/
    │   ├── style.css            # Design tokens, typography, nav, footer
    │   ├── components.css       # Cards, modals, buttons, forms, badges
    │   └── pages.css            # Hero, stats, comparison tables, admin UI
    ├── js/
    │   ├── config.js            # CENTRAL CONFIGURATION (Pricing, Contact, Hours)
    │   ├── main.js              # Nav drawer, scroll header, dynamic config
    │   ├── form.js              # Indian phone validation, honeypot, submission
    │   ├── gallery.js           # Category filter and full-screen lightbox
    │   └── admin.js             # Owner lead viewer, search, filter, CSV export
    └── images/
        ├── logo/
        │   ├── sapphire-logo.svg       # Official vector logo
        │   └── sapphire-favicon.svg    # Browser tab icon
        └── gym/
            ├── sapphire-reception-desk.jpg      # 3D Chrome wall branding & desk
            ├── sapphire-cardio-bikes-floor.jpg  # Branded spin bikes & machine aisle
            ├── sapphire-barbell-bench-press.jpg # Olympic barbell bench & cable rig
            ├── sapphire-leg-press-branded.jpg   # Branded 45° leg press & rack
            ├── sapphire-free-weights-bench.jpg  # Trainee dumbbell pressing
            ├── sapphire-gym-floor-dumbbells.jpg # Main floor, dumbbell racks, mirrors
            ├── sapphire-changing-rooms.jpg      # Private member changing booths
            └── sapphire-lockers-storage.jpg     # Numbered 12-door key lockers
```

---

## 🚀 How to Run Locally

### Option 1: Run with Python Server (Recommended — Enables REST API)

1. Open PowerShell or Terminal in the project directory:
   ```powershell
   cd "c:\Users\sharm\Sapphire fitness gym"
   ```
2. Start the local server:
   ```bash
   python server.py
   ```
3. Open your browser to:
   - **Main Website**: [http://localhost:8080/](http://localhost:8080/)
   - **Gym Owner Admin Portal**: [http://localhost:8080/admin.html](http://localhost:8080/admin.html)

### Option 2: Run Without Server (Static Mode)

You can double-click `index.html` to open it in any browser (Chrome, Edge, Firefox). The website will still function, validate forms, save leads into `localStorage`, and enable instant WhatsApp messaging.

---

## ⚙️ How the Gym Owner Can Update Pricing & Details

All business details, demonstration prices, and contact information are centrally maintained in:
👉 `assets/js/config.js`

To update official prices:
```javascript
// Open assets/js/config.js:
disclaimer: {
  isPriceConfirmed: true // Set to true once verified
},
memberships: [
  {
    id: "monthly",
    price: 1200,             // Change price here
    formattedPrice: "₹1,200", // Change label here
    ...
  }
]
```

To update official contact phone and address:
```javascript
contact: {
  phone: "+91 98XXX XXXXX",          // Real reception phone
  phoneRaw: "+9198XXXXXXXX",
  whatsapp: "+9198XXXXXXXX",         // Real WhatsApp number
  isContactConfirmed: true
},
location: {
  fullAddress: "Plot No. XX, Sector XX, City...",
  isAddressConfirmed: true
}
```

---

## 📋 Final Owner Verification Checklist Before Live Deployment

Before hosting this website on the gym's public domain, verify the following details with the gym owner:

- [ ] **Official Membership Rates**: Confirm admission fees, monthly rates, and multi-month discount packages.
- [ ] **Reception Phone Number**: Verify the primary phone number for member inquiries and click-to-call.
- [ ] **Official WhatsApp Number**: Provide the WhatsApp Business mobile number for instant chatting.
- [ ] **Exact Physical Address & Map Pin**: Verify the street address and Google Maps location URL.
- [ ] **Operating Timings**: Confirm morning and evening slot timings (especially Sunday hours).
- [ ] **Domain & Hosting**: Host on any standard platform (Vercel, Netlify, GitHub Pages, or a local Linux/Windows VPS running Python/Node).

---

## 🛡️ Security & Privacy
- Zero private API keys or secrets exposed in frontend code.
- Anti-spam honeypot trapping automated bot submissions.
- Input sanitization and phone validation protects backend persistence.
