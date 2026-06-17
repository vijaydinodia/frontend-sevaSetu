import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../api'
import Navbar from './Navbar'
import Footer from './Footer'
import Card from './ui/Card'
import Button from './ui/Button'
import useTheme from '../custom_hook/UseTheme'
import { capitalize, capitalizeWords } from '../lib/utils'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded'
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'

const serviceDetailsData = {
  "hourly-booking": {
    dbSearch: "Hourly bookings",
    title: "Hourly Booking",
    tagline: "Flexible Professional Hands for Any House Chore",
    description: "Book our verified housekeeping helpers by the hour to assist with various household tasks, deep cleaning, organizing, or simple home upkeep.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9 (28.4k ratings)",
    baseStrikethrough: 199,
    includes: [
      "Dusting, wiping and sanitization of accessible surfaces",
      "Vacuuming, sweeping and mopping of bedroom and living spaces",
      "Organizing cluttered shelves, clothes, or toys",
      "Emptying trash and clearing basic dustbins"
    ],
    excludes: [
      "Heavy appliance deep chemical cleaning",
      "Scrubbing ceiling walls and high-access glass facades",
      "Removal of construction debris or severe chemical stains"
    ],
    steps: [
      { title: "Briefing & Planning", desc: "Brief the provider on arrival about task priorities and timelines.", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=120&q=80" },
      { title: "Execution & Oversight", desc: "The partner completes chores under your general direction.", img: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=120&q=80" },
      { title: "Verification & Wrap", desc: "Review the tasks before the partner signs off." }
    ]
  },
  "bathroom-cleaning": {
    dbSearch: "Bathroom Cleaning",
    title: "Bathroom Cleaning",
    tagline: "Deep Descaling & Sanitization for Spotless Bathrooms",
    description: "Thorough removal of hard water stains, yellow spots, dirt and soap scum from wall tiles, floors, shower fittings and toilet bowls.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    rating: "4.8 (34.2k ratings)",
    baseStrikethrough: 299,
    includes: [
      "Scrubbing and descaling wall tiles, floor grout, and doors",
      "Deep wash and sanitization of commodes, washbasins, and bathtubs",
      "Mirror polishing and removal of spots from chrome shower fittings",
      "Exhaust fan external wiping and drain grate cleaning"
    ],
    excludes: [
      "Cleaning inside ceiling exhaust fan motors",
      "Broken grout restoration or tile repair work",
      "Scrubbing bathroom ceiling paint"
    ],
    steps: [
      { title: "Chemical Application", desc: "Eco-friendly descaling agents are sprayed on tiles and fittings.", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=120&q=80" },
      { title: "Intense Scrubbing", desc: "Deep scrubbing of floors, toilet, basin, and tiles with brushes.", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=120&q=80" },
      { title: "Rinsing & Drying", desc: "Wiping water spots from mirrors and drying bathroom surfaces." }
    ]
  },
  "fridge-cleaning": {
    dbSearch: "Fridge Cleaning",
    title: "Fridge Cleaning",
    tagline: "Odour-free, Hygienic & Sparkling Fridge Interiors",
    description: "Comprehensive internal and external wipe-down of refrigerator shelves, compartments, and rubber door gaskets to ensure food safety.",
    image: "https://images.unsplash.com/photo-1571175432290-ef026cbe6822?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9 (18.1k ratings)",
    baseStrikethrough: 249,
    includes: [
      "Removal and separate scrubbing of all trays, drawers, and racks",
      "Internal walls wipe-down with non-toxic, food-safe sanitizers",
      "Detailed cleaning of the rubber door gasket to clear mold/dirt",
      "Exterior cleaning and dust removal from external handle/body"
    ],
    excludes: [
      "Internal compressor or electrical component repair",
      "Cleaning backend refrigeration motor coils",
      "Defrosting freezer blockages (must be defrosted beforehand)"
    ],
    steps: [
      { title: "Compartment Emptying", desc: "Removing all food items onto the kitchen counter carefully.", img: "https://images.unsplash.com/photo-1571175432290-ef026cbe6822?auto=format&fit=crop&w=120&q=80" },
      { title: "Trays Scrubbing", desc: "Washing trays in the sink with warm water and cleaning soap.", img: "https://images.unsplash.com/photo-1585007600263-71228e40c83e?auto=format&fit=crop&w=120&q=80" },
      { title: "Interior Sanitization", desc: "Wiping walls, seals, and reloading items in organized order." }
    ]
  },
  "packing-unpacking": {
    dbSearch: "Packing or Unpacking",
    title: "Packing & Unpacking",
    tagline: "Secure Wrapping and Stress-free Packing Support",
    description: "Professional wrapping, bubble packing, boxing, and systemic labeling of household belongings to prepare for a hassle-free move.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9 (15.5k ratings)",
    baseStrikethrough: 499,
    includes: [
      "Wrapping fragile items, glassware, and books in sheets/bubble wraps",
      "Packing and dunnage layout inside cardboard boxes",
      "Detailed labeling and taping of every box for categorization",
      "Help unpacking boxes on arrival at the target rooms"
    ],
    excludes: [
      "Providing cardboard boxes (boxes are billed extra if requested)",
      "Moving heavy furniture across city zones (transport not included)",
      "Packing high-value currency, jewelry, or documents"
    ],
    steps: [
      { title: "Sorting & Wrapping", desc: "Separating fragile goods and wrapping them in bubble sheets.", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=120&q=80" },
      { title: "Boxing & Sealing", desc: "Taping boxes securely and labeling contents on multiple sides.", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "kitchen-prep": {
    dbSearch: "Kitchen Prep",
    title: "Kitchen Prep",
    tagline: "Vegetable Chopping & Meal Pre-Preparation Support",
    description: "Save kitchen hours by having our assistant peel, wash, chop, and prepare cooking ingredients exactly how you want.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    rating: "4.8 (21.7k ratings)",
    baseStrikethrough: 149,
    includes: [
      "Washing, peeling, and cutting vegetables and herbs",
      "Peeling garlic, onions, ginger, and grinding pastes",
      "Washing rice, dal, and grains for ready cooking",
      "Arranging prepared items in bowls or plastic containers"
    ],
    excludes: [
      "Actual stove cooking or baking of dishes",
      "Washing large cooking pots or pans",
      "Buying grocery supplies from outside"
    ],
    steps: [
      { title: "Briefing Cut Sizes", desc: "Instruct the partner on fine dicing, cubes, or julienne cuts.", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=120&q=80" },
      { title: "Peeling & Chopping", desc: "Peeling greens, chopping veggies and organizing ingredients.", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "utensils": {
    dbSearch: "Utensils",
    title: "Utensils",
    tagline: "Sparkling Utensils Without The Scrubbing",
    description: "From daily dishes to piled-up utensils, our professionals help wash, clean and organize your kitchenware so your sink stays clear and your kitchen stays ready to use.",
    image: "https://images.unsplash.com/photo-1585007600263-71228e40c83e?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9 (31.6k ratings)",
    baseStrikethrough: 125,
    includes: [
      "Washing utensils with customer-provided supplies",
      "Drying and placing utensils in rack",
      "Cleaning the sink and surrounding area after completion"
    ],
    excludes: [
      "Cleaning other kitchen areas such as slabs or tiles",
      "Taking out kitchen garbage or waste disposal",
      "Deep cleaning of burnt or heavily stained utensils"
    ],
    steps: [
      { title: "Utensils washing", desc: "The dirty utensils are washed thoroughly with soap and scrubbers.", img: "https://images.unsplash.com/photo-1585007600263-71228e40c83e?auto=format&fit=crop&w=120&q=80" },
      { title: "Reracking", desc: "The washed utensils are dried and rearranged neatly in the kitchen racks.", img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=120&q=80" },
      { title: "Utensils sink", desc: "The utensils sink is cleaned after washing up of the utensils.", img: "https://images.unsplash.com/photo-1585007600263-71228e40c83e?auto=format&fit=crop&w=120&q=80" },
      { title: "Dishwashing area", desc: "The dishwashing area is cleaned and dried off at the end of the process.", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "dusting-wiping": {
    dbSearch: "Dusting & Wiping",
    title: "Dusting & Wiping",
    tagline: "Fine Dusting & Wiping for Dust-Free Surfaces",
    description: "Detailed dry dusting and wet microfiber wiping of tables, chairs, electronics, glass show-shelves and cabinet exteriors.",
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1200&q=80",
    rating: "4.8 (22.5k ratings)",
    baseStrikethrough: 149,
    includes: [
      "Dry dusting and wet wiping of all tables, desks, and countertops",
      "Cleaning exterior of wardrobes, TVs, speakers, and showpieces",
      "Wiping glass windows, mirrors, and glass frames",
      "Wiping doors, door handles, and switchboards"
    ],
    excludes: [
      "Cleaning inside wardrobes or closed cabinets",
      "Deep stain removal on fabric sofas/walls",
      "Wiping high external building window panes"
    ],
    steps: [
      { title: "Surface Clearing", desc: "Clearing small items off shelves to reach dusty spots.", img: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=120&q=80" },
      { title: "Microfiber Wiping", desc: "Wiping surfaces with specialized anti-static microfibers.", img: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "sweeping-mopping": {
    dbSearch: "Sweeping & Mopping",
    title: "Sweeping & Mopping",
    tagline: "Shining, Clean Floors Throughout Your Home",
    description: "Systemic sweeping with floor brooms followed by detailed wet mopping with standard disinfectants to clear floor dust and sticky spots.",
    image: "https://images.unsplash.com/photo-1581578732697-5f850ecdd68a?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9 (41.0k ratings)",
    baseStrikethrough: 169,
    includes: [
      "Complete sweeping of all rooms, balconies, and corridors",
      "Double wet-mopping with standard floor cleaners",
      "Moving light furniture (chairs, small carpets) to clean underneath",
      "Spot cleaning of light floor spill stains"
    ],
    excludes: [
      "Moving heavy beds, double wardrobes or massive sofas",
      "Polishing wooden or marble floors with machines",
      "Clearing sticky grease/cement spills from construction"
    ],
    steps: [
      { title: "Sweeping Floor", desc: "Gathering dust, hair and loose particles with fine brooms.", img: "https://images.unsplash.com/photo-1581578732697-5f850ecdd68a?auto=format&fit=crop&w=120&q=80" },
      { title: "Mopping Floor", desc: "Double wiping using damp mops and cleaning disinfectants.", img: "https://images.unsplash.com/photo-1581578732697-5f850ecdd68a?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "pre-party-clean": {
    dbSearch: "Pre-Party Express Clean",
    title: "Pre Party Clean",
    tagline: "Sparkling & Presentable Spaces Before Guests Arrive",
    description: "An express quick clean targeting drawing rooms, dining spaces and guest bathrooms. Ensure a spotless impression.",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9 (12.3k ratings)",
    baseStrikethrough: 299,
    includes: [
      "Tidying and vacuuming/sweeping main living areas",
      "Wiping center tables, dining tables, and bar counters",
      "Detailed quick cleaning and scenting of guest washrooms",
      "Arranging pillows, cushions, and trash clearing"
    ],
    excludes: [
      "Deep cleaning of bedroom wardrobes or kitchen ovens",
      "Cleaning outside balconies or staircases",
      "Ironing laundry clothes"
    ],
    steps: [
      { title: "Tidying Living Space", desc: "Putting clutter away, fluffing pillows, and dusting main tables.", img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=120&q=80" },
      { title: "Guest Bath Quick Wash", desc: "Cleaning washbasins, toilets and spraying ambient room scents.", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "wardrobe-cleaning": {
    dbSearch: "Complete Wardrobe Cleaning",
    title: "Wardrobe Cleaning",
    tagline: "Systemic Closet Organization & Decluttering",
    description: "Emptying your wardrobe shelves, detailed internal dust wiping, and folding and arranging clothes neatly by category.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
    rating: "4.8 (19.4k ratings)",
    baseStrikethrough: 249,
    includes: [
      "Emptying closet shelves and wiping down internal dust",
      "Neat folding and piling of shirts, pants, sarees, and dresses",
      "Arranging hangers and color-sorting clothes if requested",
      "Sorting clothes for laundry or dry clean separately"
    ],
    excludes: [
      "Ironing of wrinkled clothes (available as a separate task)",
      "Repairing broken wardrobe hinges or locks",
      "Deep chemical stain cleaning of antique wooden cabinets"
    ],
    steps: [
      { title: "Emptying Shelves", desc: "Taking out all clothes and categorizing them systematically.", img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=120&q=80" },
      { title: "Shelves Cleaning", desc: "Wiping cabinet shelves with damp cloth and dry wipes.", img: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=120&q=80" },
      { title: "Folding & Stacking", desc: "Folding garments precisely and stacking them back in folders." }
    ]
  },
  "after-party-clean": {
    dbSearch: "After-Party Express Clean",
    title: "After Party Clean",
    tagline: "Hassle-Free Cleaning After the Celebration",
    description: "Leave the post-celebration mess to us. We clean living rooms, wash plates, mop spills and throw away party garbage.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9 (16.7k ratings)",
    baseStrikethrough: 349,
    includes: [
      "Washing all drinking glasses, plates, bowls, and cutlery",
      "Clearing and boxing leftovers (into fridge or bins as per instructions)",
      "Sweeping and wet mopping floor spills and stains",
      "Bagging party waste and disposing of it in local waste bins"
    ],
    excludes: [
      "Cleaning outside building lawns or street frontages",
      "Deep dry-cleaning stained fabrics or carpet upholstery",
      "Restoration of broken glassware or furniture items"
    ],
    steps: [
      { title: "Garbage Bagging", desc: "Collecting bottles, cans, paper plates and clearing tables.", img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=120&q=80" },
      { title: "Utensils & Glass Wash", desc: "Washing large numbers of cocktail glasses and serving plates.", img: "https://images.unsplash.com/photo-1585007600263-71228e40c83e?auto=format&fit=crop&w=120&q=80" },
      { title: "Floor Mop & Scents", desc: "Mopping sticky floor spots and ventilating rooms." }
    ]
  },
  "ironing-folding": {
    dbSearch: "Ironing & Folding",
    title: "Ironing & Folding",
    tagline: "Crisp, Wrinkle-Free Clothes & Organized Laundry",
    description: "Professional steam or dry ironing of shirts, trousers, suits, and daily wear, followed by precise folding.",
    image: "https://images.unsplash.com/photo-1489008777659-ad1fc8e07097?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9 (24.9k ratings)",
    baseStrikethrough: 119,
    includes: [
      "Ironing clothes using client's iron box and board",
      "Folding and stacking shirts, pants, and linen neatly",
      "Hanging formal wear and suits in closet hangers"
    ],
    excludes: [
      "Washing or drying of wet clothes",
      "Removal of ink or grease stains from garments",
      "Starch application to heavy cotton sarees"
    ],
    steps: [
      { title: "Sorting Clothes", desc: "Grouping clothes by fabric type and iron temperature needs.", img: "https://images.unsplash.com/photo-1489008777659-ad1fc8e07097?auto=format&fit=crop&w=120&q=80" },
      { title: "Steam/Dry Ironing", desc: "Pressing cuffs, collars and creases cleanly.", img: "https://images.unsplash.com/photo-1489008777659-ad1fc8e07097?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "window-cleaning": {
    dbSearch: "Window Cleaning",
    title: "Window Cleaning",
    tagline: "Crystal Clear Glass & Spotless Window Frames",
    description: "Detailed wiping of window glass panes, clearing dirt from channel tracks, and washing mosquito mesh nets.",
    image: "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?auto=format&fit=crop&w=1200&q=80",
    rating: "4.8 (11.8k ratings)",
    baseStrikethrough: 199,
    includes: [
      "Wiping glass windows from inside and accessible outside surfaces",
      "Clearing dust and mud from window sliding tracks",
      "Washing mesh grids and mosquito nets",
      "Wiping window sill plates and frame channels"
    ],
    excludes: [
      "Cleaning window panes on high skyscraper outer walls",
      "Scraping hardened paint drops from construction work",
      "Repairing broken window handles or mesh nets"
    ],
    steps: [
      { title: "Mesh Net Washing", desc: "Removing nets and washing them down in bathrooms/balcony.", img: "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?auto=format&fit=crop&w=120&q=80" },
      { title: "Glass Squeegee Wash", desc: "Applying glass cleaners and cleaning with soft squeegees.", img: "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "laundry": {
    dbSearch: "Laundry",
    title: "Laundry",
    tagline: "Clean, Fresh & Hygienically Washed Garments",
    description: "Hassle-free washing of daily clothes in your washing machine, followed by drying line setups and basic folding.",
    image: "https://images.unsplash.com/photo-1545173168-9f19472ef7f4?auto=format&fit=crop&w=1200&q=80",
    rating: "4.8 (15.9k ratings)",
    baseStrikethrough: 149,
    includes: [
      "Separating whites and colored garments before wash",
      "Operating your washing machine with correct cycle settings",
      "Hanging washed clothes on dry lines/racks",
      "Basic folding of dried garments"
    ],
    excludes: [
      "Dry cleaning of silk sarees or woolens",
      "Hand washing heavy loads (only machine loads included)",
      "Providing laundry detergents or fabric softeners"
    ],
    steps: [
      { title: "Sorting Clothes", desc: "Splitting whites and colored shirts, loading wash drums.", img: "https://images.unsplash.com/photo-1545173168-9f19472ef7f4?auto=format&fit=crop&w=120&q=80" },
      { title: "Drying setup", desc: "Hanging wet garments on balconies or clothes dry stands.", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "kitchen-cleaning": {
    dbSearch: "Kitchen Cleaning",
    title: "Kitchen Cleaning",
    tagline: "Oil-Free & Sanitized Kitchen Countertops",
    description: "Scrubbing oil and grease from kitchen tiles, sink washing, countertop wiping, and trash bin sanitization.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    rating: "4.8 (26.3k ratings)",
    baseStrikethrough: 299,
    includes: [
      "De-greasing kitchen wall tiles and chimney filters",
      "Detailed scrubbing and sanitization of sink and countertops",
      "Cleaning exterior of microwave, fridge, and stove burners",
      "Washing floor areas and trash bin zone cleanup"
    ],
    excludes: [
      "Cleaning inside cabinets or closed drawers (available extra)",
      "Washing wall paints (can damage emulsions)",
      "Internal maintenance of ovens or chimneys"
    ],
    steps: [
      { title: "Degreasing Scrub", desc: "Applying oil-removing liquid on backsplashes and burners.", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=120&q=80" },
      { title: "Sink Sanitization", desc: "Scrubbing sink basins and clearing drain blockage.", img: "https://images.unsplash.com/photo-1585007600263-71228e40c83e?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "balcony-cleaning": {
    dbSearch: "Balcony Cleaning",
    title: "Balcony Cleaning",
    tagline: "Dirt & Mud Free Tidy Balconies",
    description: "Clearing dried leaves, sweeping balcony tiles, scrubbing flooring mud marks, and wiping railing frames.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    rating: "4.7 (10.4k ratings)",
    baseStrikethrough: 149,
    includes: [
      "Sweeping and gathering dry balcony leaves and dust",
      "Scrubbing tiles to remove outdoor mud and bird drops",
      "Wiping glass/steel railings and balcony frames",
      "Washing and arranging plant pots neatly"
    ],
    excludes: [
      "Deep scrub of external walls exposed to rain",
      "Trimming or repotting heavy garden soil trees",
      "Cleaning outer drain pipes of the building"
    ],
    steps: [
      { title: "Debris Clearing", desc: "Removing dried leaves and trash from channels.", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=120&q=80" },
      { title: "Tile Scrubbing", desc: "Washing floors with high pressure soap and water scrubbing.", img: "https://images.unsplash.com/photo-1581578732697-5f850ecdd68a?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "fan-cleaning": {
    dbSearch: "Fan Cleaning",
    title: "Fan Cleaning",
    tagline: "Dust-Free Ceiling Fans for Fresh Air Circulation",
    description: "Careful dry and wet wiping of ceiling fan blades, motor crowns, and downrods to ensure clean draft flow.",
    image: "https://images.unsplash.com/photo-1618944847828-82e943c3dba7?auto=format&fit=crop&w=1200&q=80",
    rating: "4.9 (18.6k ratings)",
    baseStrikethrough: 99,
    includes: [
      "Careful dry wiping of fan blades to collect loose dust",
      "Damp wiping with de-greasing cleaners to remove sticky soot",
      "Cleaning downrod tube, canopy and motor cup exteriors",
      "Clearing fallen dust from floor/bed underneath"
    ],
    excludes: [
      "Repairing fan regulators or wiring faults",
      "Fan motor rewinding or lubrication services",
      "Wiping extremely fragile fancy crystal chandeliers"
    ],
    steps: [
      { title: "Dry Dusting", desc: "Using sleeve cloths to wrap and pull thick blade dust.", img: "https://images.unsplash.com/photo-1618944847828-82e943c3dba7?auto=format&fit=crop&w=120&q=80" },
      { title: "Wet Polish Wiping", desc: "Wiping blades with damp cleaning agents for carbon soot removal.", img: "https://images.unsplash.com/photo-1618944847828-82e943c3dba7?auto=format&fit=crop&w=120&q=80" }
    ]
  },
  "kitchen-cabinet-cleaning": {
    dbSearch: "Kitchen Cabinet Cleaning",
    title: "Kitchen Cabinet Cleaning",
    tagline: "Grease-Free, Organized Kitchen Closets",
    description: "Emptying kitchen shelves, degreasing cabinet hinges, wiping internal storage bins, and organizing dry groceries.",
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
    rating: "4.8 (14.2k ratings)",
    baseStrikethrough: 249,
    includes: [
      "Emptying closets and wiping down internal shelves",
      "Wiping oil and stickiness from cabinet doors and handles",
      "Sorting and wiping jars, containers, and spice racks",
      "Arranging drawers and utensil layout dividers"
    ],
    excludes: [
      "Cleaning high cabinet outer roof spaces",
      "Repairing sliding channels or hydraulic pistons",
      "Pest control spray inside cabinets (billed separately)"
    ],
    steps: [
      { title: "Emptying Cabinets", desc: "Carefully placing kitchen canisters and spice bottles on counters.", img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=120&q=80" },
      { title: "Degreasing interiors", desc: "Wiping grease and dust, cleaning edges and drawer liners.", img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=120&q=80" },
      { title: "Canister Wiping & Reload", desc: "Wiping outer jar dust and returning them to drawers." }
    ]
  }
}

const faqData = [
  {
    question: "What is included in this service?",
    answer: "Every service page highlights the specific tasks included and excluded in the checklists above. Standard equipment and eco-friendly cleaning supplies (if applicable) are usually brought by the provider unless stated otherwise."
  },
  {
    question: "How do I choose or book a specific partner?",
    answer: "You can view the list of available verified providers under the 'Available Service Partners' section at the bottom of the page, check their experience and price, and click 'Book Partner' to schedule a time slot."
  },
  {
    question: "Can I reschedule or cancel my booking?",
    answer: "Yes, you can easily reschedule or cancel your booking through your user dashboard. However, cancellations must be done before the provider accepts or starts traveling to your location."
  },
  {
    question: "Is there any insurance or guarantee for damage?",
    answer: "SevaSetu ensures all service providers are background-checked and highly rated. In the rare event of accidental damage, please reach out to our 24/7 customer support immediately so we can assist with claim procedures."
  }
]

const ServiceDetails = () => {
  const { serviceKey } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [user, setUser] = useState(null)
  
  const [providersList, setProvidersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFaqIndex, setActiveFaqIndex] = useState(null)
  const [shareToast, setShareToast] = useState(false)

  // Booking states
  const [selectedService, setSelectedService] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    address: '', city: '', state: '', pincode: '', bookingDate: '', bookingTime: '', notes: ''
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingMessage, setBookingMessage] = useState('')

  const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM",
    "05:00 PM - 07:00 PM"
  ]

  const serviceData = serviceDetailsData[serviceKey] || null

  const bgTheme = theme === 'light' ? 'bg-white text-[#111827]' : 'bg-zinc-950 text-zinc-100'
  const textMuted = theme === 'light' ? 'text-[#6B7280]' : 'text-zinc-400'
  const cardTheme = theme === 'light' ? 'bg-white border-zinc-200 text-[#111827]' : 'bg-zinc-900 border-zinc-800 text-zinc-100'
  const headingTheme = theme === 'light' ? 'text-[#111827]' : 'text-white'

  useEffect(() => {
    window.scrollTo(0, 0)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (!serviceData) {
      setError("Service not found in our catalog.")
      setLoading(false)
      return
    }

    const fetchServiceProviders = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_URL}/user/services`)
        if (res.data?.success) {
          // Filter provider services matching the dbSearch string of this service
          const matched = (res.data.data || []).filter(
            ps => ps.service?.serviceName?.toLowerCase() === serviceData.dbSearch.toLowerCase()
          )
          setProvidersList(matched)
        }
      } catch (err) {
        console.error("Error fetching provider services:", err)
        setError("Failed to load providers offering this service.")
      } finally {
        setLoading(false)
      }
    }

    fetchServiceProviders()
  }, [serviceKey])

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href)
    setShareToast(true)
    setTimeout(() => setShareToast(false), 3000)
  }

  const handleBookClick = (provService) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert("Please log in first to book a service.")
      navigate('/login')
      return
    }

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
    setBookingForm({
      address: storedUser.address?.fullAddress || '',
      city: storedUser.address?.city || '',
      state: storedUser.address?.state || '',
      pincode: storedUser.address?.pincode || '',
      bookingDate: '',
      bookingTime: '',
      notes: ''
    })
    setSelectedService(provService)
    setBookingMessage('')
  }

  const handleQuickBook = () => {
    if (providersList.length === 0) {
      alert("No active providers are currently offering this service in your area.")
      return
    }
    // Pick the provider with the lowest price
    const cheapest = [...providersList].sort((a, b) => (a.price || 0) - (b.price || 0))[0]
    handleBookClick(cheapest)
  }

  const handleBookNowScroll = () => {
    const providersSec = document.getElementById('providers-section')
    if (providersSec) {
      providersSec.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getHeaders = () => {
    const token = localStorage.getItem('token')
    return { headers: { Authorization: `Bearer ${token}` } }
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setBookingLoading(true)
    setBookingMessage('')
    try {
      const payload = {
        providerServiceId: selectedService._id,
        address: bookingForm.address,
        city: bookingForm.city,
        state: bookingForm.state,
        pincode: bookingForm.pincode,
        bookingDate: bookingForm.bookingDate,
        bookingTime: bookingForm.bookingTime,
        notes: bookingForm.notes
      }

      const res = await axios.post(`${API_URL}/user/booking`, payload, getHeaders())
      if (res.data?.success) {
        alert("Service booked successfully! Redirecting to dashboard...")
        setSelectedService(null)
        navigate('/user-dashboard')
      }
    } catch (error) {
      setBookingMessage(error.response?.data?.message || error.message)
    } finally {
      setBookingLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  // Determine pricing display
  const prices = providersList.map(ps => ps.price || ps.service?.basePrice || 0)
  const startingPrice = prices.length > 0 ? Math.min(...prices) : (serviceData?.baseStrikethrough ? Math.round(serviceData.baseStrikethrough / 2.5) : 49)
  const strikethroughPrice = serviceData ? (serviceData.baseStrikethrough || Math.round(startingPrice * 2.5)) : 125

  if (!serviceData && !loading) {
    return (
      <main className={`min-h-screen flex flex-col ${bgTheme}`}>
        <Navbar user={user} onLogout={handleLogout} />
        <section className="flex-1 max-w-lg mx-auto px-6 py-20 text-center flex flex-col justify-center items-center">
          <h2 className="text-3xl font-extrabold text-[#111827] mb-4">Service Not Found</h2>
          <p className={`${textMuted} mb-8`}>The selected service does not exist in our catalog. Browse our homepage to explore standard housekeeping tasks.</p>
          <Button variant="gradient" className="bg-[#16A34A] text-white px-6" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className={`min-h-screen flex flex-col ${bgTheme} transition-colors duration-200`}>
      <Navbar user={user} onLogout={handleLogout} />

      {/* Header Banner */}
      <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden">
        {serviceData && (
          <img
            src={serviceData.image}
            alt={serviceData.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Overlay Navigation Buttons */}
        <div className="absolute top-6 left-6 md:left-10 z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md text-zinc-800 hover:bg-white transition cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowBackOutlinedIcon fontSize="small" />
          </button>
        </div>

        <div className="absolute top-6 right-6 md:right-10 z-20 flex gap-2">
          <button
            onClick={handleShareClick}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md text-zinc-800 hover:bg-white transition cursor-pointer"
            aria-label="Share"
          >
            <ShareOutlinedIcon fontSize="small" />
          </button>
        </div>

        {/* Share Toast */}
        {shareToast && (
          <div className="absolute top-20 right-6 md:right-10 z-30 bg-[#16A34A] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg animate-fade-up">
            Link copied to clipboard!
          </div>
        )}
      </div>

      {/* Main Service Details Section */}
      <section className="flex-1 pb-24 px-6 md:px-10">
        <div className={`mx-auto max-w-4xl -mt-20 relative z-10 ${cardTheme} border rounded-[32px] p-6 md:p-10 shadow-xl`}>
          {serviceData && (
            <>
              {/* Service Header Info */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-6 border-b border-zinc-150 dark:border-zinc-800">
                <div>
                  <h1 className={`text-3xl md:text-4xl font-extrabold ${headingTheme}`}>
                    {serviceData.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-amber-500 font-semibold text-sm mt-3">
                    <span className="flex items-center gap-0.5"><StarRateRoundedIcon fontSize="small" /> 4.9</span>
                    <span className={`${textMuted}`}>({serviceData.rating})</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between md:justify-end shrink-0">
                  <div>
                    <span className="text-3xl font-black text-[#16A34A]">₹{startingPrice}</span>
                    <span className="text-sm text-zinc-400 line-through ml-2">₹{strikethroughPrice}</span>
                  </div>
                  
                  <Button
                    onClick={providersList.length > 0 ? handleBookNowScroll : handleQuickBook}
                    className="h-12 px-6 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm tracking-wide rounded-[14px]"
                  >
                    BOOK
                  </Button>
                </div>
              </div>

              {/* Tagline & Description */}
              <div className="py-8">
                <h3 className={`text-lg md:text-xl font-bold mb-3 ${headingTheme}`}>
                  {serviceData.tagline}
                </h3>
                <p className={`text-sm md:text-[15px] leading-[1.8] ${textMuted}`}>
                  {serviceData.description}
                </p>
              </div>

              {/* Includes & Excludes checklists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-zinc-150 dark:border-zinc-800">
                {/* Includes */}
                <div>
                  <h4 className={`text-base font-extrabold mb-4 ${headingTheme}`}>Includes</h4>
                  <div className="space-y-3">
                    {serviceData.includes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-[#10B981] mt-0.5 shrink-0">
                          <CheckCircleOutlineOutlinedIcon fontSize="small" />
                        </span>
                        <span className={`text-sm leading-relaxed ${textMuted}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Does Not Include */}
                <div>
                  <h4 className={`text-base font-extrabold mb-4 ${headingTheme}`}>Does not include</h4>
                  <div className="space-y-3">
                    {serviceData.excludes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-red-500 mt-0.5 shrink-0">
                          <CancelOutlinedIcon fontSize="small" />
                        </span>
                        <span className={`text-sm leading-relaxed ${textMuted}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* How it's done */}
              <div className="py-8 border-t border-zinc-150 dark:border-zinc-800">
                <h4 className={`text-base font-extrabold mb-6 ${headingTheme}`}>How it's done?</h4>
                <div className="space-y-6">
                  {serviceData.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      {step.img ? (
                        <div className="h-16 w-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800 overflow-hidden shrink-0">
                          <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold text-lg shrink-0">
                          {idx + 1}
                        </div>
                      )}
                      <div>
                        <h5 className={`font-bold text-sm ${headingTheme}`}>{step.title}</h5>
                        <p className={`text-xs mt-1 leading-relaxed ${textMuted}`}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs Accordion */}
              <div className="py-8 border-t border-zinc-150 dark:border-zinc-800">
                <h4 className={`text-base font-extrabold mb-6 ${headingTheme}`}>FAQs</h4>
                <div className="space-y-4">
                  {faqData.map((faq, idx) => {
                    const isOpen = activeFaqIndex === idx
                    return (
                      <div
                        key={idx}
                        className="bg-[#F9FAFB] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[20px] overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                        >
                          <span className={`font-bold text-sm ${headingTheme}`}>
                            {faq.question}
                          </span>
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#16A34A]' : ''}`}>
                            <ExpandMoreOutlinedIcon fontSize="small" />
                          </span>
                        </button>

                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[200px] border-t border-zinc-100 dark:border-zinc-800' : 'max-h-0'}`}>
                          <p className="p-5 text-xs md:text-sm leading-relaxed text-[#6B7280] bg-white dark:bg-zinc-950">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Available Providers list for this specific service */}
              <div id="providers-section" className="py-8 border-t border-zinc-150 dark:border-zinc-800 scroll-mt-24">
                <h4 className={`text-base font-extrabold mb-3 ${headingTheme}`}>Available Service Partners</h4>
                <p className={`text-xs ${textMuted} mb-6`}>Select your preferred verified provider and schedule booking slots.</p>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#16A34A] border-t-transparent" />
                  </div>
                ) : providersList.length === 0 ? (
                  <div className="text-center p-8 bg-zinc-50 dark:bg-zinc-900/10 rounded-[24px] border border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-sm text-[#6B7280]">
                      No active service partners are registered for this service in your area. Contact Support for help.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {providersList.map(ps => (
                      <Card
                        key={ps._id}
                        className={`p-5 border ${cardTheme} rounded-[24px] flex flex-col justify-between hover:shadow-lg transition duration-200`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-zinc-100 overflow-hidden shrink-0">
                            {ps.provider?.user?.profileImage ? (
                              <img src={ps.provider.user.profileImage} alt="profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-white font-bold text-sm">
                                {(ps.provider?.businessName?.[0] || ps.provider?.user?.firstName?.[0] || 'P').toUpperCase()}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-[15px] truncate">
                              {ps.provider?.businessName ? capitalizeWords(ps.provider.businessName) : capitalizeWords(`${ps.provider?.user?.firstName} ${ps.provider?.user?.lastName}`)}
                            </h5>
                            <div className="flex items-center gap-3 text-xs text-[#6B7280] mt-1 flex-wrap">
                              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                                <StarRateRoundedIcon fontSize="inherit" />
                                {ps.provider?.averageRating || '0.0'}
                              </span>
                              <span>•</span>
                              <span>{ps.provider?.experience || 0} Yrs Experience</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                          <div>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Price</span>
                            <span className="text-xl font-black text-[#16A34A]">₹{ps.price || ps.service?.basePrice}</span>
                          </div>
                          <Button
                            onClick={() => handleBookClick(ps)}
                            variant="gradient"
                            className="bg-[#16A34A] hover:bg-[#15803D] text-white px-5 h-10 text-xs font-bold rounded-xl"
                          >
                            Book Partner
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up">
          <Card className={`w-full max-w-lg overflow-y-auto max-h-[90vh] p-6 shadow-2xl border ${cardTheme} rounded-[28px]`}>
            <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-4 mb-4">
              <div>
                <h3 className={`text-lg font-bold ${headingTheme}`}>
                  Confirm Booking details
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Service: {capitalizeWords(selectedService.service?.serviceName)}
                </p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-zinc-400 hover:text-zinc-650 cursor-pointer transition flex items-center gap-1 text-xs font-bold"
                title="Close"
              >
                <CloseOutlinedIcon fontSize="small" />
                Close
              </button>
            </div>

            {bookingMessage && (
              <p className="mb-4 text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-500/20">
                {bookingMessage}
              </p>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-500">Booking Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                    className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-500">Time Slot *</label>
                  <select
                    required
                    value={bookingForm.bookingTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingTime: e.target.value })}
                    className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="">Select a Slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-500">Full Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street address, building, apartment"
                  value={bookingForm.address}
                  onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                  className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-500">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={bookingForm.city}
                    onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
                    className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-500">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={bookingForm.state}
                    onChange={(e) => setBookingForm({ ...bookingForm, state: e.target.value })}
                    className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-zinc-500">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    value={bookingForm.pincode}
                    onChange={(e) => setBookingForm({ ...bookingForm, pincode: e.target.value })}
                    className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-500">Additional Notes</label>
                <textarea
                  rows="3"
                  placeholder="Any specific requests or instructions..."
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  className="w-full rounded-2xl border border-[#E5E7EB] dark:border-zinc-800 px-4 py-2.5 text-sm outline-none focus:border-[#16A34A] bg-white dark:bg-zinc-900 text-[#111827] dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
                <div>
                  <p className="text-xs text-zinc-400">Total Price</p>
                  <p className="text-xl font-black text-[#16A34A]">
                    ₹{selectedService.price || selectedService.service?.basePrice}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedService(null)}
                    title="Cancel"
                    className="border-zinc-200 text-[#111827] dark:text-zinc-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    disabled={bookingLoading}
                    title={bookingLoading ? 'Booking...' : 'Confirm & Book'}
                    className="bg-[#16A34A] hover:bg-[#15803D] text-white"
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm & Book'}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Footer />
    </main>
  )
}

export default ServiceDetails
