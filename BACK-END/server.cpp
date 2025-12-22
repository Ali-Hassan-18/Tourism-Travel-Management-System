// //#include "crow_all.h" // The web framework
// #include "./HEADERS/packages.h"

// int main() {
//     crow::SimpleApp app;
//     package_manager pack_sys;
//     pack_sys.load_packages();

//     // ROUTE 1: Get all packages (For the React 'Browse' page)
//     CROW_ROUTE(app, "/api/packages/<string>")
//     ([&pack_sys](string category){
//         // We'll call a new function that returns a JSON string
//         return pack_sys.get_packages_json(category); 
//     });

//     // ROUTE 2: Add a package (For your 'Admin Form' in React)
//     CROW_ROUTE(app, "/api/add-package").methods(crow::HTTPMethod::POST)
//     ([&pack_sys](const crow::request& req){
//         auto x = crow::json::load(req.body);
//         if (!x) return crow::response(400);
        
//         // Extract data from the Frontend JSON
//         pack_sys.add_package(x["cat"].s(), x["city"].s(), x["title"].s(), x["price"].d(), 5, "Road");
//         pack_sys.save_packages();
        
//         return crow::response(200, "Package Added Successfully");
//     });

//     app.port(18080).multithreaded().run();
// }