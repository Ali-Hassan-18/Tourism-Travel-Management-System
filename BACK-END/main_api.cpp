#define CROW_MAIN
#define ASIO_STANDALONE
#include "crow_all.h"
#include "HEADERS/cities.h"
#include "HEADERS/packages.h"
#include "HEADERS/announcements.h"
#include "HEADERS/testimonials.h"
#include "HEADERS/users.h"
#include "HEADERS/bookings.h"
#include "HEADERS/chatbot.h"
#include <iostream>

using namespace std;

// --- 1. ENHANCED CORS MIDDLEWARE ---
// Explicitly allows all methods required for Admin (PUT/DELETE) and User (GET/POST) actions
struct CORSMiddleware {
    struct context {};
    void before_handle(crow::request& req, crow::response& res, context& ctx) {}
    void after_handle(crow::request& req, crow::response& res, context& ctx) {
        res.add_header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.add_header("Access-Control-Allow-Credentials", "true");
    }
};

int main() {
    crow::App<CORSMiddleware> app;
    tourista_bot ai_bot;

    // --- 2. INITIALIZE MANAGERS ---
    city_manager city_sys;
    package_manager pack_sys;
    announcement_manager ann_sys;
    testimonial_manager test_sys;
    user_manager user_sys;
    booking_manager book_sys;

    // --- 3. PERSISTENCE: LOAD DATA ---
    city_sys.load_cities();
    pack_sys.load_packages();
    ann_sys.load_from_file();
    test_sys.load_testimonials();
    user_sys.load_users();
    book_sys.load_bookings(user_sys);

    // --- 4. PREFLIGHT HANDLER ---
    // Handles browser security checks before actual requests
    CROW_ROUTE(app, "/api/<path>").methods("OPTIONS"_method)
    ([&](string path){ return crow::response(204); });

    // --- 5. AUTHENTICATION ROUTES ---
    CROW_ROUTE(app, "/api/login").methods("POST"_method)
    ([&](const crow::request& req){
        auto x = crow::json::load(req.body);
        if (!x) return crow::response(400);
        return crow::response(user_sys.authenticate_json(x["email"].s(), x["password"].s()));
    });

    CROW_ROUTE(app, "/api/signup").methods("POST"_method)
    ([&](const crow::request& req){
        auto x = crow::json::load(req.body);
        if (!x) return crow::response(400);
        return crow::response(user_sys.register_user_json(x["fullName"].s(), x["email"].s(), x["password"].s()));
    });

    // --- 6. ANNOUNCEMENT ROUTES (LIFO STACK) ---
    CROW_ROUTE(app, "/api/announcements").methods("GET"_method)
    ([&](){ return ann_sys.get_announcements_json(); });

    CROW_ROUTE(app, "/api/admin/announce").methods("POST"_method)
    ([&](const crow::request& req){
        auto x = crow::json::load(req.body);
        if (!x || !x.has("message")) return crow::response(400);
        ann_sys.add_announcement(x["message"].s());
        ann_sys.save_to_file();
        return crow::response(200, "{\"status\":\"success\"}");
    });

    CROW_ROUTE(app, "/api/admin/announce/delete/<int>").methods("DELETE"_method)
    ([&](int id){
        if (ann_sys.delete_announcement(id)) {
            ann_sys.save_to_file();
            return crow::response(200, "{\"status\":\"deleted\"}");
        }
        return crow::response(404);
    });

    CROW_ROUTE(app, "/api/admin/announce/edit/<int>").methods("PUT"_method)
    ([&](const crow::request& req, int id){
        auto x = crow::json::load(req.body);
        if (!x || !x.has("message")) return crow::response(400);
        if (ann_sys.edit_announcement(id, x["message"].s())) {
            ann_sys.save_to_file();
            return crow::response(200, "{\"status\":\"updated\"}");
        }
        return crow::response(404);
    });

    // --- 7. CHATBOT ROUTE ---
    CROW_ROUTE(app, "/api/chat").methods("POST"_method)
    ([&ai_bot](const crow::request& req){
        auto x = crow::json::load(req.body);
        if (!x) return crow::response(400, "Invalid JSON");
        string reply = ai_bot.get_ai_response(x["message"].s());
        crow::json::wvalue res_json;
        res_json["reply"] = reply;
        return crow::response(200, res_json); 
    });

    // --- 8. PACKAGE MANAGEMENT ROUTES ---
    CROW_ROUTE(app, "/api/packages").methods("GET"_method)
    ([&](){ return pack_sys.get_packages_json("all"); });

    CROW_ROUTE(app, "/api/packages/<string>").methods("GET"_method)
    ([&](string tier){ return pack_sys.get_packages_json(tier); });

    CROW_ROUTE(app, "/api/admin/packages/add").methods("POST"_method)
    ([&pack_sys](const crow::request& req){
        auto x = crow::json::load(req.body);
        if (!x) return crow::response(400);
        
        // Maps UI fields to C++ add_package (Category, City, Title, Price, Days, Mode, Img, Discount, Stops)
        pack_sys.add_package(
            x["type"].s(), x["city"].s(), x["title"].s(), 
            x["price"].d(), x["days"].i(), x["travelMode"].s(), 
            x["img"].s(), x["discount"].d(), x["stops"].s()
        );
        pack_sys.save_packages();
        return crow::response(200, "{\"status\":\"success\"}");
    });

    CROW_ROUTE(app, "/api/admin/packages/edit/<int>").methods("PUT"_method)
    ([&pack_sys](const crow::request& req, int id){
        auto x = crow::json::load(req.body);
        if (!x) return crow::response(400);

        if (pack_sys.edit_package(id, x["type"].s(), x["city"].s(), x["title"].s(), 
                                    x["price"].d(), x["days"].i(), x["travelMode"].s(), 
                                    x["img"].s(), x["discount"].d(), x["stops"].s())) {
            pack_sys.save_packages();
            return crow::response(200, "{\"status\":\"updated\"}");
        }
        return crow::response(404);
    });

    CROW_ROUTE(app, "/api/admin/packages/delete/<int>").methods("DELETE"_method)
    ([&pack_sys](int id){
        if (pack_sys.delete_package(id)) {
            pack_sys.save_packages();
            return crow::response(200, "{\"status\":\"deleted\"}");
        }
        return crow::response(404);
    });

    // --- 9. USER HISTORY & TESTIMONIALS ---
    CROW_ROUTE(app, "/api/history/<string>").methods("GET"_method)
    ([&](string email){ return book_sys.get_user_history_json(email, user_sys); });

    CROW_ROUTE(app, "/api/testimonials").methods("GET"_method)
    ([&](){ return test_sys.get_all_json(); });

    CROW_ROUTE(app, "/api/admin/users").methods("GET"_method)
([&user_sys](){
    return user_sys.get_all_users_json();
});

// Admin: Add New City
CROW_ROUTE(app, "/api/admin/cities/add").methods("POST"_method)
([&city_sys](const crow::request& req){
    auto x = crow::json::load(req.body);
    if (!x) return crow::response(400);

    string name = x["cityName"].s();
    city_sys.add_city(name, x["cityImage"].s());

    // Add Spots and Restaurants to the Linked List
    for (auto& spot : x["touristSpots"]) city_sys.add_spot_to_city(name, spot.s());
    for (auto& res : x["restaurants"]) city_sys.add_dining_to_city(name, res.s());

    city_sys.save_cities();
    return crow::response(200, "{\"status\":\"success\"}");
});

// --- Inside main_api.cpp ---

// Delete City Route
CROW_ROUTE(app, "/api/admin/cities/delete/<string>").methods("DELETE"_method)
([&city_sys](string name){
    if (city_sys.delete_city(name)) {
        city_sys.save_cities();
        return crow::response(200, "{\"status\":\"deleted\"}");
    }
    return crow::response(404);
});

// Edit City Route
CROW_ROUTE(app, "/api/admin/cities/edit/<string>").methods("PUT"_method)
([&city_sys](const crow::request& req, string old_name){
    auto x = crow::json::load(req.body);
    if (city_sys.edit_city(old_name, x["cityName"].s(), x["cityImage"].s())) {
        city_sys.save_cities();
        return crow::response(200, "{\"status\":\"updated\"}");
    }
    return crow::response(404);
});

    cout << "============================================" << endl;
    cout << "    TOURISTA BACKEND FULLY RESTORED         " << endl;
    cout << "    Listening on Port 18080                 " << endl;
    cout << "============================================" << endl;

    app.port(18080).multithreaded().run();
}