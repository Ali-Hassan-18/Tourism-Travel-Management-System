#define CROW_MAIN
#define ASIO_STANDALONE
#include "crow_all.h"
#include "HEADERS/cities.h"
#include "HEADERS/packages.h"
#include "HEADERS/announcements.h"
#include <iostream>

using namespace std;

int main() {
    crow::SimpleApp app;

    // --- 1. SYSTEM INITIALIZATIONS ---
    city_manager city_sys;
    package_manager pack_sys;
    announcement_manager ann_sys;

    // --- 2. DATA LOADING (Persistence) ---
    cout << "[System] Synchronizing with local database..." << endl;
    city_sys.load_cities();
    pack_sys.load_packages();
    ann_sys.load_from_file();
    cout << "[System] All Linked Structures populated." << endl;

    // --- 3. CITIES ROUTES (Linked List) ---
    
    // Get all cities for the Explore Gallery
    CROW_ROUTE(app, "/api/cities")
    ([&city_sys](){
        return city_sys.get_all_cities_json();
    });

    // Get deep details (nested stays/hotels) for a specific city
    CROW_ROUTE(app, "/api/cities/<string>")
    ([&city_sys](string name){
        auto details = city_sys.get_city_details_json(name);
        if (details.size() == 0) return crow::response(404, "City Not Found");
        return crow::response(details);
    });

    // --- 4. PACKAGES ROUTES (Doubly Linked List) ---

    // Get all packages (Eco, Premium, Special)
    CROW_ROUTE(app, "/api/packages")
    ([&pack_sys](){
        return pack_sys.get_packages_json("all");
    });

    // Get packages filtered by tier (e.g., /api/packages/tier/Special)
    CROW_ROUTE(app, "/api/packages/tier/<string>")
    ([&pack_sys](string tier){
        return pack_sys.get_packages_json(tier);
    });

    // --- 5. ANNOUNCEMENTS ROUTE (Linked Stack - LIFO) ---

    // Returns latest announcements at the top
    CROW_ROUTE(app, "/api/announcements")
    ([&ann_sys](){
        return ann_sys.get_announcements_json();
    });

    // --- 6. GLOBAL CORS & STATUS ---
    // This allows React to reach the C++ Backend
    CROW_ROUTE(app, "/api/status")
    ([](const crow::request& req, crow::response& res){
        res.set_header("Access-Control-Allow-Origin", "*");
        res.write("Tourista Backend is reachable by Frontend");
        res.end();
    });

    // --- 7. SERVER STARTUP ---
    cout << "============================================" << endl;
    cout << "      TOURISTA WEB SERVER CORE ONLINE       " << endl;
    cout << "   Port: 18080 | Threads: Multi-threaded    " << endl;
    cout << "   C++ Data Structures Active:              " << endl;
    cout << "   - Cities (Singly Linked List)            " << endl;
    cout << "   - Packages (Doubly Linked List)          " << endl;
    cout << "   - Announcements (Linked Stack)           " << endl;
    cout << "============================================" << endl;

    app.port(18080).multithreaded().run();
}