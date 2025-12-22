🌍 Tourista: AI-Powered Travel Management SystemTourista is a high-performance C++ CLI backend designed to manage a modern travel agency. It leverages classic Data Structures for efficient record management and integrates Llama 3 via a RAG architecture to provide a conversational AI assistant for travelers.
🚀 Core Features
👤 User & Auth SystemRole-Based Access: Distinct interfaces for Admins (Inventory/Queue management) and Users (Booking/Exploring).Session Tracking: Persistent login states using a global session pointer.Security: Built-in email validation and password-protected Admin panels.
🗺️ Smart ExplorationCity Database: Explore cities with detailed overviews, image path linkage (React-ready), and nested stay/dining options.Tiered Packages: Inventory divided into Economical, Premium, and Special Deals.Dynamic Routing: Packages with active discounts are automatically moved to the "Special Deals" section.
🤖 AI Chatbot (RAG Architecture)Local LLM Integration: Uses Llama 3 (via Ollama) to answer user queries.Retrieval-Augmented Generation (RAG): The bot reads the current cities.txt and packages.txt to provide contextually accurate advice without hallucinations.Safe-Input Logic: Sanitized PowerShell-to-C++ bridge to handle complex user queries.
📅 Booking EngineFCFS Queue: Admin manages a "First-Come, First-Served" queue for pending requests.History Mapping: Upon confirmation, booking nodes are "unhooked" from the Admin queue and "re-hooked" to the specific user's personal history list.🛠️ Data Structures UsedStructurePurposeWhy We Used ItDoubly Linked ListUsers, Packages, BookingsAllows efficient $O(1)$ deletion and bidirectional traversal.Singly Linked ListStays, Dining, TestimonialsPerfect for nested data and "Latest-First" review displays.RAG (File-to-LLM)AI Chatbot KnowledgeConnects traditional file persistence with modern generative AI.File I/O (Persistence)Database SimulationUses pipe-delimited (|) text files to ensure data survives app restarts.
📁 File StructurePlaintext/TOURISTA
│
├── main.cpp                 # Main Entry Point (UI & Loop)
├── /DATA                    # Flat-file Database Storage
│   ├── users.txt
│   ├── packages.txt
│   └── bookings_data.txt
└── /HEADERS                 # Modular Logic
    ├── users.h              # DLL for User Profiles
    ├── packages.h           # DLL for Travel Inventory
    ├── bookings.h           # Admin Queue & History Logic
    ├── chatbot.h            # Llama 3 RAG Bridge
    └── utilities.h          # Analytics & Validation
🔧 Setup & Installation1. PrerequisitesCompiler: GCC/G++ (MinGW for Windows).AI Server: Install Ollama and run:Bashollama run llama3
2. CompilationNavigate to the source folder and run:Bashg++ main.cpp -o tourista
3. ExecutionEnsure a folder named DATA exists.Run the executable:Bash./tourista
📊 Admin AnalyticsThe system provides real-time business insights, including:Revenue Projection: Calculated live from the pending queue.Market Interests: Percentage-based tracking of user interests (e.g., Adventure vs. Luxury).Inventory Distribution: Auto-tracking of trip tiers.Tourista — Bridging Data Structures with Artificial Intelligence.