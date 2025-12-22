// #include <iostream>
// #include <string>
// #include <fstream>
// #include <cstdlib> 
// #include <iomanip>
// #include <limits> 
// #include "HEADERS/users.h"
// #include "HEADERS/announcements.h"
// #include "HEADERS/cities.h"
// #include "HEADERS/packages.h"
// #include "HEADERS/bookings.h"
// #include "HEADERS/testimonials.h"
// #include "HEADERS/utilities.h"
// #include "HEADERS/chatbot.h"

// using namespace std;

// // --- Helper: UI Clear Screen ---
// void clear() {
// #ifdef _WIN32
//     system("cls");
// #else
//     system("clear");
// #endif
// }

// // --- Helper: The "One-Enter" Pause ---
// void pause() {
//     cout << "\n[System] Press Enter to return to menu...";
//     // Since we flush the buffer after every 'cin >>', 
//     // this will now always wait for exactly one Enter.
//     cin.get(); 
// }

// // --- Global Sync Helper ---
// void save_all_data(user_manager& u, city_manager& c, package_manager& p, announcement_manager& a, booking_manager& b, testimonial_manager& t) {
//     u.save_users();
//     c.save_cities();
//     p.save_packages();
//     a.save_to_file();
//     b.save_all_bookings(u);
//     t.save_testimonials();
//     cout << "\n[System] Database synchronized successfully.\n";
// }

// int main() {
//     // --- System Initializations ---
//     user_manager user_sys;
//     announcement_manager ann_sys;
//     city_manager city_sys;
//     package_manager pack_sys;
//     booking_manager book_sys;
//     testimonial_manager test_sys;
//     tourista_bot bot;

//     // --- Startup Sync ---
//     clear();
//     cout << "==========================================\n";
//     cout << "   TOURISTA: CONNECTING TO DATABASE...    \n";
//     cout << "==========================================\n";
//     user_sys.load_users();
//     ann_sys.load_from_file();
//     city_sys.load_cities();
//     pack_sys.load_packages();
//     book_sys.load_bookings(user_sys);
//     test_sys.load_testimonials();

//     // Default Admin Creation
//     if (user_sys.find_by_email("admin@tourista.com") == nullptr) {
//         user_sys.register_user("Admin", "admin@tourista.com", "admin123", "admin");
//     }

//     int choice;
//     string name, email, pass, input_text, city_name, elite_input, img_path;
//     int id_to_modify;

//     while (true) {
//         if (user_sys.get_logged_in_user() == nullptr) {
//             clear();
//             cout << "==========================================\n";
//             cout << "        WELCOME TO TOURISTA 2025         \n";
//             cout << "==========================================\n";
//             cout << "1. Login\n2. Signup\n3. View Traveler Stories\n0. Exit & Save\nSelection: ";
            
//             if(!(cin >> choice)) {
//                 cin.clear();
//                 cin.ignore(numeric_limits<streamsize>::max(), '\n');
//                 continue;
//             }
//             cin.ignore(numeric_limits<streamsize>::max(), '\n'); // FLUSH BUFFER

//             if (choice == 1) {
//                 cout << "Email: "; getline(cin, email);
//                 cout << "Password: "; getline(cin, pass);
//                 if (user_sys.login(email, pass)) pause(); else pause();
//             } else if (choice == 2) {
//                 cout << "Full Name: "; getline(cin, name);
//                 cout << "Email: "; getline(cin, email);
//                 if (tourista_utils::is_valid_email(email)) {
//                     cout << "Password: "; getline(cin, pass);
//                     user_sys.register_user(name, email, pass);
//                     user_sys.save_users();
//                 } else cout << "[Error] Invalid Email format.\n";
//                 pause();
//             } else if (choice == 3) {
//                 test_sys.display_landing_page_reviews();
//                 pause();
//             } else if (choice == 0) {
//                 save_all_data(user_sys, city_sys, pack_sys, ann_sys, book_sys, test_sys);
//                 break;
//             }
//         } 
//         else {
//             user_node* user = user_sys.get_logged_in_user();
//             clear();
//             cout << "==========================================\n";
//             cout << "   TOURISTA " << (user->role == "admin" ? "ADMIN PANEL" : "USER DASHBOARD") << "\n";
//             cout << "   Logged in as: " << user->full_name << "\n";
//             cout << "==========================================\n";

//             if (user->role == "admin") {
//                 cout << "1. Manage Announcements\n2. Manage Cities & Stays\n3. Manage Packages\n4. View Booking Queue\n5. Confirm Booking\n6. Analytics Report\n7. Manage Travelers\n0. Logout\nSelection: ";
//                 cin >> choice;
//                 cin.ignore(numeric_limits<streamsize>::max(), '\n'); // FLUSH BUFFER

//                 switch (choice) {
//                     case 1: 
//                         clear();
//                         cout << "1. New Broadcast\n2. Edit\n3. Delete\n4. View All\nChoice: ";
//                         int ac; cin >> ac; cin.ignore(numeric_limits<streamsize>::max(), '\n');
//                         if (ac == 1) { cout << "Msg: "; getline(cin, input_text); ann_sys.add_announcement(input_text); }
//                         else if (ac == 2) { cout << "ID: "; cin >> id_to_modify; cin.ignore(numeric_limits<streamsize>::max(), '\n'); cout << "New Msg: "; getline(cin, input_text); ann_sys.edit_announcement(id_to_modify, input_text); }
//                         else if (ac == 3) { cout << "ID: "; cin >> id_to_modify; cin.ignore(numeric_limits<streamsize>::max(), '\n'); ann_sys.delete_announcement(id_to_modify); }
//                         else if (ac == 4) ann_sys.display_all();
//                         ann_sys.save_to_file();
//                         pause(); break;

//                     case 2:
//                         clear();
//                         cout << "1. Add City\n2. Add Stay to City\n3. List Cities\nChoice: ";
//                         int cc; cin >> cc; cin.ignore(numeric_limits<streamsize>::max(), '\n');
//                         if (cc == 1) { cout << "City: "; getline(cin, city_name); cout << "Info: "; getline(cin, input_text); cout << "Img Path: "; getline(cin, img_path); city_sys.add_city(city_name, input_text, img_path); }
//                         else if (cc == 2) { cout << "Target City: "; getline(cin, city_name); cout << "Hotel: "; getline(cin, name); cout << "Price: "; getline(cin, input_text); city_sys.add_stay_to_city(city_name, name, input_text); }
//                         else if (cc == 3) city_sys.display_all_cities();
//                         city_sys.save_cities();
//                         pause(); break;

//                     case 3:
//                         clear();
//                         pack_sys.display_all_admin();
//                         cout << "\n1. New Package\n2. Edit Package\n3. Delete Package\nChoice: ";
//                         int pc; cin >> pc; cin.ignore(numeric_limits<streamsize>::max(), '\n');
//                         if (pc == 1) {
//                             cout << "Type (Eco/Premium): "; getline(cin, input_text);
//                             cout << "City: "; getline(cin, city_name);
//                             if (city_sys.search_city(city_name)) {
//                                 cout << "Title: "; getline(cin, name);
//                                 double p, d; cout << "Price: "; cin >> p; cout << "Disc%: "; cin >> d; 
//                                 cin.ignore(numeric_limits<streamsize>::max(), '\n');
//                                 cout << "Transport: "; getline(cin, pass);
//                                 elite_input = (input_text == "Premium") ? (cout << "Elite Perks: ", getline(cin, elite_input), elite_input) : "";
//                                 pack_sys.add_package(input_text, city_name, name, p, 5, pass, d, elite_input);
//                             } else cout << "City not found!\n";
//                         } else if (pc == 2) {
//                             cout << "ID: "; cin >> id_to_modify; cin.ignore(numeric_limits<streamsize>::max(), '\n');
//                             cout << "New Title: "; getline(cin, name);
//                             double np, nd; cout << "New Price: "; cin >> np; cout << "New Disc: "; cin >> nd; 
//                             cin.ignore(numeric_limits<streamsize>::max(), '\n');
//                             cout << "New Elite: "; getline(cin, elite_input);
//                             pack_sys.edit_package(id_to_modify, name, np, nd, elite_input);
//                         } else if (pc == 3) { cout << "ID: "; cin >> id_to_modify; cin.ignore(numeric_limits<streamsize>::max(), '\n'); pack_sys.delete_package(id_to_modify); }
//                         pack_sys.save_packages();
//                         pause(); break;

//                     case 4: clear(); book_sys.display_admin_queue(); pause(); break;
//                     case 5: 
//                         cout << "Enter Booking ID to Confirm: "; cin >> id_to_modify;
//                         cin.ignore(numeric_limits<streamsize>::max(), '\n');
//                         book_sys.confirm_booking(id_to_modify, user_sys);
//                         book_sys.save_all_bookings(user_sys);
//                         user_sys.save_users();
//                         pause(); break;
//                     case 6: clear(); book_sys.generate_report(); pause(); break;
                    
//                     case 7: 
//                         clear(); 
//                         cout << "--- TRAVELER DATABASE ---\n";
//                         cout << "1. View All Users\n2. Search by Email\nSelection: ";
//                         int uc; cin >> uc; cin.ignore(numeric_limits<streamsize>::max(), '\n');
//                         if (uc == 1) user_sys.display_users();
//                         else if (uc == 2) { cout << "Email: "; getline(cin, email); user_sys.search_and_display_user(email); }
//                         pause(); break;

//                     case 0: user_sys.logout(); break;
//                 }
//             } else {
//                 // --- USER DASHBOARD ---
//                 cout << "1. Explore Cities\n2. Browse Packages\n3. Ask Tourista AI Bot\n4. Plan Custom Trip\n5. My Trip History\n6. Write a Review\n7. Notifications\n0. Logout\nChoice: ";
//                 cin >> choice; cin.ignore(numeric_limits<streamsize>::max(), '\n');

//                 if (choice == 1) { 
//                     clear(); cout << "Enter City to Explore: "; getline(cin, city_name); 
//                     city_sys.display_city_details(city_name); pause(); 
//                 }
//                 else if (choice == 2) { 
//                     clear(); cout << "Tier (Premium/Economical/Special): "; getline(cin, input_text); 
//                     pack_sys.display_by_category(input_text); pause(); 
//                 }
//                 else if (choice == 3) { clear(); bot.chat(); pause(); }
//                 else if (choice == 4) {
//                     int a, k; string m, s, ints;
//                     cout << "Number of Adults: "; cin >> a; cout << "Number of Kids: "; cin >> k;
//                     cin.ignore(numeric_limits<streamsize>::max(), '\n');
//                     cout << "Target City: "; getline(cin, city_name);
//                     cout << "Travel Mode (Flight/Car): "; getline(cin, m);
//                     cout << "Preferred Dates: "; getline(cin, s);
//                     cout << "Special Interests (Adventure/Relaxing): "; getline(cin, ints);
//                     book_sys.create_booking(user->email, city_name, "Custom Adventure", 0, a, k, 0, 0, m, s, s, ints);
//                     book_sys.save_all_bookings(user_sys);
//                     pause();
//                 }
//                 else if (choice == 5) {
//                     clear(); cout << "--- MY TRAVEL HISTORY ---\n";
//                     booking_node* h = user->history_head;
//                     if (!h) cout << "No confirmed trips yet.\n";
//                     while(h) { cout << "[" << h->booking_id << "] " << h->package_title << " in " << h->city_name << " (" << h->status << ")\n"; h = h->next; }
//                     pause();
//                 }
//                 else if (choice == 6) {
//                     string rev; int rt;
//                     cout << "Your Story: "; getline(cin, rev);
//                     cout << "Rating (1-5): "; cin >> rt; cin.ignore(numeric_limits<streamsize>::max(), '\n');
//                     test_sys.add_testimonial(user->full_name, rev, rt);
//                     test_sys.save_testimonials();
//                     pause();
//                 }
//                 else if (choice == 7) { clear(); ann_sys.display_all(); pause(); }
//                 else if (choice == 0) user_sys.logout();
//             }
//         }
//     }
//     return 0;
// }