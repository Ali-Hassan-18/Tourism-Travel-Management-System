#include <iostream>
#include <string>
#include "users.h"
#include "announcements.h"
#include "cities.h"
#include "packages.h"
#include "bookings.h"

using namespace std;

int main() {
    user_manager user_sys;
    announcement_manager ann_sys;
    city_manager city_sys;
    package_manager pack_sys;
    booking_manager book_sys;

    user_sys.register_user("Admin", "admin@tourista.com", "admin123", "admin");

    int choice;
    string name, email, pass, input_text, city_name, elite_input;
    int id_to_modify;

    while (true) {
        if (user_sys.get_logged_in_user() == nullptr) {
            cout<<"\n--- TOURISTA WELCOME ---\n1. Login\n2. Signup\n0. Exit\nSelection: ";
            cin>>choice; cin.ignore();
            if (choice == 1) {
                cout<<"Email: "; getline(cin, email);
                cout<<"Password: "; getline(cin, pass);
                user_sys.login(email, pass);
            } else if (choice == 2) {
                cout<<"Full Name: "; getline(cin, name);
                cout<<"Email: "; getline(cin, email);
                cout<<"Password: "; getline(cin, pass);
                user_sys.register_user(name, email, pass);
            } else if (choice == 0) return 0;
        } 
        else {
            user_node* session_user = user_sys.get_logged_in_user();
            cout<<"\n--- DASHBOARD ("<<session_user->full_name<<" | "<<session_user->role<<") ---\n";

            if (session_user->role == "admin") {
                cout<<"1. Announcements\n2. Cities\n3. Packages\n4. View Queue\n5. Confirm Booking\n0. Logout\nSelection: ";
                cin>>choice; cin.ignore();

                switch (choice) {
                    case 1: // Announcements
                        cout<<"\n1. Broadcast\n2. Edit\n3. Delete\n4. View\nSelection: ";
                        int ac; cin>>ac; cin.ignore();
                        if (ac == 1) { cout<<"Msg: "; getline(cin, input_text); ann_sys.add_announcement(input_text); }
                        else if (ac == 2) { 
                            cout<<"ID: "; cin>>id_to_modify; cin.ignore();
                            cout<<"New Msg: "; getline(cin, input_text); ann_sys.edit_announcement(id_to_modify, input_text);
                        }
                        else if (ac == 3) { cout<<"ID: "; cin>>id_to_modify; ann_sys.delete_announcement(id_to_modify); }
                        else if (ac == 4) ann_sys.display_all();
                        break;

                    case 2: // Cities
                        cout<<"\n1. Add City\n2. Add Stay\n3. View Details\nSelection: ";
                        int cc; cin>>cc; cin.ignore();
                        if (cc == 1) { cout<<"Name: "; getline(cin, city_name); cout<<"Info: "; getline(cin, input_text); city_sys.add_city(city_name, input_text); }
                        else if (cc == 2) { 
                            cout<<"City: "; getline(cin, city_name);
                            cout<<"Hotel: "; getline(cin, name);
                            cout<<"Price: "; getline(cin, input_text);
                            city_sys.add_stay_to_city(city_name, name, input_text);
                        }
                        else if (cc == 3) { cout<<"City: "; getline(cin, city_name); city_sys.display_city_details(city_name); }
                        break;

                    case 3: // Packages
                        cout<<"\n1. Create\n2. View All\n3. Edit\n4. Delete\nSelection: ";
                        int pc; cin>>pc; cin.ignore();
                        if (pc == 1) {
                            cout<<"Base Category (Eco/Premium): "; getline(cin, input_text);
                            cout<<"City: "; getline(cin, city_name);
                            if (!city_sys.search_city(city_name)) { cout<<"[Error] City not found.\n"; }
                            else {
                                cout<<"Title: "; getline(cin, name);
                                double p; cout<<"Price: "; cin>>p;
                                double d; cout<<"Discount %: "; cin>>d;
                                int dys; cout<<"Days: "; cin>>dys; cin.ignore();
                                cout<<"Mode: "; getline(cin, pass);
                                elite_input = "";
                                if (input_text == "Premium") { cout<<"Elite: "; getline(cin, elite_input); }
                                pack_sys.add_package(input_text, city_name, name, p, dys, pass, d, elite_input);
                            }
                        } else if (pc == 2) pack_sys.display_all_admin();
                        else if (pc == 3) {
                            cout<<"ID: "; cin>>id_to_modify; cin.ignore();
                            cout<<"Title: "; getline(cin, name);
                            double np, nd; cout<<"Price: "; cin>>np; cout<<"Disc %: "; cin>>nd; cin.ignore();
                            cout<<"Elite: "; getline(cin, elite_input);
                            pack_sys.edit_package(id_to_modify, name, np, nd, elite_input);
                        } else if (pc == 4) { cout<<"ID: "; cin>>id_to_modify; pack_sys.delete_package(id_to_modify); }
                        break;

                    case 4: book_sys.display_admin_queue(); break;
                    case 5: 
                        cout<<"ID to Confirm: "; cin>>id_to_modify; 
                        book_sys.confirm_booking(id_to_modify, user_sys); 
                        break;
                    case 0: user_sys.logout(); break;
                }
            } 
            else {
                // User Interface
                cout<<"1. Explore\n2. Packages\n3. Plan Trip\n4. Notifications\n0. Logout\nSelection: ";
                cin>>choice; cin.ignore();
                if (choice == 1) { cout<<"City: "; getline(cin, city_name); city_sys.display_city_details(city_name); }
                else if (choice == 2) { cout<<"Tier: "; getline(cin, input_text); pack_sys.display_by_category(input_text); }
                else if (choice == 3) {
                    int a, k, i, c; string m, s, e, ints;
                    cout<<"Adults: "; cin>>a; cout<<"Kids: "; cin>>k; cout<<"Infants: "; cin>>i; cout<<"Couples: "; cin>>c; cin.ignore();
                    cout<<"City: "; getline(cin, city_name); cout<<"Mode: "; getline(cin, m); cout<<"Start: "; getline(cin, s); cout<<"End: "; getline(cin, e);
                    cout<<"Interests: "; getline(cin, ints);
                    book_sys.create_booking(session_user->email, city_name, "Custom Plan", 0, a, k, i, c, m, s, e, ints);
                }
                else if (choice == 4) ann_sys.display_all();
                else if (choice == 0) user_sys.logout();
            }
        }
    }
}