#define CROW_MAIN
#define ASIO_STANDALONE
#include "crow_all.h"
//#include "HEADERS/cities.h"
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
    //city_manager city_sys;
    package_manager pack_sys;
    announcement_manager ann_sys;
    testimonial_manager test_sys;
    user_manager user_sys;
    booking_manager book_sys;

    // --- 3. PERSISTENCE: LOAD DATA ---
    //city_sys.load_cities();
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

    // --- 9. USER MANAGEMENT & TESTIMONIALS ---
    CROW_ROUTE(app, "/api/history/<string>").methods("GET"_method)
    ([&](string email){ return book_sys.get_user_history_json(email, user_sys); });

    CROW_ROUTE(app, "/api/testimonials").methods("GET"_method)
    ([&](){ return test_sys.get_all_json(); });

    CROW_ROUTE(app, "/api/admin/users").methods("GET"_method)
    ([&user_sys](){
        return user_sys.get_all_users_json();
    });

    // // --- 10. CITY MANAGEMENT ROUTES ---
    // CROW_ROUTE(app, "/api/cities").methods("GET"_method)
    // ([&city_sys](){ return city_sys.get_all_cities_json(); });

    // CROW_ROUTE(app, "/api/admin/cities/add").methods("POST"_method)
    // ([&city_sys](const crow::request& req){
    //     auto x = crow::json::load(req.body);
    //     if (!x) return crow::response(400);

    //     string name = x["cityName"].s();
    //     city_sys.add_city(name, x["cityImage"].s());

    //     for (auto& spot : x["touristSpots"]) city_sys.add_spot_to_city(name, spot.s());
    //     for (auto& res : x["restaurants"]) city_sys.add_dining_to_city(name, res.s());

    //     city_sys.save_cities();
    //     return crow::response(200, "{\"status\":\"success\"}");
    // });

    // CROW_ROUTE(app, "/api/admin/cities/delete/<string>").methods("DELETE"_method)
    // ([&city_sys](string name){
    //     if (city_sys.delete_city(name)) {
    //         city_sys.save_cities();
    //         return crow::response(200, "{\"status\":\"deleted\"}");
    //     }
    //     return crow::response(404);
    // });

    // CROW_ROUTE(app, "/api/admin/cities/edit/<string>").methods("PUT"_method)
    // ([&city_sys](const crow::request& req, string old_name){
    //     auto x = crow::json::load(req.body);
    //     if (city_sys.edit_city(old_name, x["cityName"].s(), x["cityImage"].s())) {
    //         city_sys.save_cities();
    //         return crow::response(200, "{\"status\":\"updated\"}");
    //     }
    //     return crow::response(404);
    // });

    // --- 11. BOOKING ROUTE (Resolves 405 Error) ---
    CROW_ROUTE(app, "/api/book/detailed").methods("POST"_method)
([&book_sys, &user_sys](const crow::request& req){
    auto x = crow::json::load(req.body);
    if (!x) return crow::response(400, "Invalid JSON");

    string email = x["email"].s();
    string city = x["city"].s();
    string title = x["title"].s();
    double price = x["total"].d();
    string img = x["img"].s();
    string category = x["category"].s();
    
    // --- PERSISTENCE FIX: DATES ---
    string startDate = x["travelDate"].s();
    // For custom trips, we capture the endDate, otherwise default to "Stay Ends"
    string endDate = x.has("endDate") ? x["endDate"].s() : std::string("Stay Ends");

    // --- TRAVELER FIX: BREAKDOWN ---
    // Extract multi-traveler data if available (Custom Plan), else use 'members' (Standard)
    int a = x.has("members") ? x["members"].i() : 1;
    int k = x.has("kids") ? x["kids"].i() : 0;
    int i = x.has("infants") ? x["infants"].i() : 0;
    int c = x.has("couples") ? x["couples"].i() : 0;

    // --- INTERESTS/DETAILS FIX ---
    string details = x.has("diet") ? x["diet"].s() : std::string("No special requests.");

    // Call updated manager logic
    if (book_sys.add_booking_detailed(email, city, title, price, img, category, 
                                      startDate, endDate, a, k, i, c, details, user_sys)) {
        book_sys.save_bookings(user_sys); 
        user_sys.save_users();
        return crow::response(200, "{\"status\":\"success\"}");
    }

    return crow::response(404, "{\"status\":\"error\",\"message\":\"User not found\"}");
});

CROW_ROUTE(app, "/api/book/custom").methods("POST"_method)
([&book_sys, &user_sys](const crow::request& req){
    auto x = crow::json::load(req.body);
    if (!x) return crow::response(400, "Invalid JSON");

    // Standardize key extraction to match PlanTrip.jsx payload
    book_sys.create_booking(
        x["email"].s(), 
        x["city"].s(), 
        x["title"].s(), 
        x["total"].d(), 
        x["img"].s(), 
        x["category"].s(),
        x["adults"].i(), 
        x["kids"].i(), 
        x["infants"].i(), 
        x["couples"].i(),
        x["transport"].s(), 
        x["travelDate"].s(), 
        x["endDate"].s(), 
        x["diet"].s(), // This contains the joined Interests string
        user_sys
    );

    book_sys.save_bookings(user_sys); 
    return crow::response(200, "{\"status\":\"success\"}");
});

CROW_ROUTE(app, "/api/testimonials/add").methods("POST"_method)
([&test_sys, &user_sys](const crow::request& req){
    auto x = crow::json::load(req.body);
    if (!x) return crow::response(400);

    // Persist and Save
    test_sys.add_testimonial(x["user"].s(), x["text"].s(), x["rating"].i());
    test_sys.save_testimonials();
    
    return crow::response(200, "{\"status\":\"success\"}");
});

// --- ADD TO main_api.cpp ---
CROW_ROUTE(app, "/api/auth/sync-google").methods("POST"_method)
([&user_sys](const crow::request& req){
    auto x = crow::json::load(req.body);
    if (!x || !x.has("email") || !x.has("fullName")) 
        return crow::response(400, "Missing user data");

    string email = x["email"].s();
    string name = x["fullName"].s();

    // Synchronization logic using the updated user_manager
    user_sys.sync_external_user(name, email);
    
    return crow::response(200, "{\"status\":\"success\"}");
});

CROW_ROUTE(app, "/api/admin/all-bookings").methods("GET"_method)
([&user_sys]() {
    std::vector<crow::json::wvalue> all_history;
    
    // Traverse the User Doubly Linked List
    user_node* curr_user = user_sys.get_all_users_head(); 
    while (curr_user) {
        // Traverse each user's personal Booking Doubly Linked List
        booking_node* curr_book = curr_user->history_head;
        while (curr_book) {
            crow::json::wvalue b;
            b["id"] = curr_book->booking_id;
            b["email"] = curr_book->user_email;
            b["city"] = curr_book->city_name;
            b["title"] = curr_book->package_title;
            b["bill"] = curr_book->total_bill;
            b["status"] = curr_book->status;
            b["cat"] = curr_book->category;
            b["start_date"] = curr_book->start_date;
            
            // Critical breakdown for "Travelers Count" in UI
            b["adults"] = curr_book->adults;
            b["kids"] = curr_book->kids;
            b["infants"] = curr_book->infants;
            b["couples"] = curr_book->couples;
            b["interests"] = curr_book->interests;

            all_history.push_back(std::move(b));
            curr_book = curr_book->next;
        }
        curr_user = curr_user->next;
    }
    return crow::response(crow::json::wvalue(all_history));
});

// 2. Route to Update Status (Approve/Reject)
CROW_ROUTE(app, "/api/admin/update-booking").methods("POST"_method)
([&book_sys, &user_sys](const crow::request& req) {
    auto x = crow::json::load(req.body);
    if (!x || !x.has("bookingId") || !x.has("status")) 
        return crow::response(400, "Invalid Request");

    int b_id = x["bookingId"].i();
    string new_status = x["status"].s();

    if (book_sys.update_status(b_id, new_status, user_sys)) {
        return crow::response(200, "{\"status\":\"success\"}");
    }
    return crow::response(404, "Booking ID not found");
});

CROW_ROUTE(app, "/api/admin/bookings/process").methods("GET"_method)
([&book_sys, &user_sys](const crow::request& req) {
    
    string query = req.url_params.get("q") ? req.url_params.get("q") : "";
    string sort_type = req.url_params.get("sort") ? req.url_params.get("sort") : "none";

    vector<booking_node*> results = book_sys.search_bookings(query, user_sys);

    // 3. Apply the Corrected Date Sort Logic
    if (sort_type == "date_newest") {
        book_sys.sort_by_date(results, true); // true = newest first (Greater strings at front)
    } else if (sort_type == "date_oldest") {
        book_sys.sort_by_date(results, false); // false = oldest first (Smaller strings at front)
    }

    // 4. Map the memory nodes to a JSON array for React
    vector<crow::json::wvalue> json_list;
    for (auto* node : results) {
        crow::json::wvalue b;
        b["id"] = node->booking_id;
        b["email"] = node->user_email;
        b["city"] = node->city_name;      // Matches booking_node::city_name
        b["title"] = node->package_title;  // Matches booking_node::package_title
        b["bill"] = node->total_bill;
        b["status"] = node->status;        // Used for badge colors
        b["date"] = node->start_date;      // Used for sorting verification
        
        // Critical for the "Travelers Count" footer in the UI card
        b["adults"] = node->adults;
        b["kids"] = node->kids;
        
        json_list.push_back(std::move(b));
    }

    return crow::response(crow::json::wvalue(json_list));
});

CROW_ROUTE(app, "/api/admin/update-password").methods("POST"_method)
([&user_sys](const crow::request& req){
    auto x = crow::json::load(req.body);
    if (!x || !x.has("currentPassword") || !x.has("newPassword")) 
        return crow::response(400, "Invalid Request");

    string currentPass = x["currentPassword"].s();
    string newPass = x["newPassword"].s();

    if (user_sys.update_admin_credentials(currentPass, newPass)) {
        return crow::response(200, "{\"status\":\"success\", \"message\":\"Password updated\"}");
    } else {
        return crow::response(401, "{\"status\":\"error\", \"message\":\"Incorrect current password\"}");
    }
});

CROW_ROUTE(app, "/api/admin/user-reviews/<string>")
([&test_sys, &user_sys](string email) {
    // 1. Map email to name
    user_node* user = user_sys.find_by_email(email);
    if (!user) return crow::response(404, "User not found");

    string target_name = user->full_name;
    vector<crow::json::wvalue> reviews_list;

    // 2. Search the Testimonial List
    testimonials_node* curr = test_sys.get_head();
    while (curr) {
        if (curr->user_name == target_name) {
            crow::json::wvalue r;
            r["text"] = curr->review_text; // Matches rev.text in JSX
            r["rating"] = curr->rating;
            r["date"] = curr->date;
            r["city"] = "Testimonial";     // Formatting for the modal card
            r["title"] = "Feedback";
            r["status"] = "confirmed";
            reviews_list.push_back(std::move(r));
        }
        curr = curr->next;
    }

    return crow::response(crow::json::wvalue(reviews_list));
});
    cout << "============================================" << endl;
    cout << "    TOURISTA BACKEND FULLY RESTORED         " << endl;
    cout << "    Listening on Port 18080                 " << endl;
    cout << "============================================" << endl;

    app.port(18080).multithreaded().run();
}