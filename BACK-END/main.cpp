#include <iostream>
#include <string>
#include "users.h"
#include "announcements.h"
#include "cities.h"
#include "packages.h"

using namespace std;

int main() {
    // --- System Initializations ---
    user_manager user_sys;
    announcement_manager ann_sys;
    city_manager city_sys;
    package_manager pack_sys;

    // --- Default Admin Account for Testing ---
    user_sys.register_user("Admin", "admin@tourista.com", "admin123", "admin");

    int choice;
    string name, email, pass, input_text, city_name, elite_input;
    int id_to_modify;

    while (true) {
        // --- AUTHENTICATION LAYER ---
        if (user_sys.get_logged_in_user() == nullptr) {
            cout<<"\n==============================\n";
            cout<<"      TOURISTA MANAGEMENT     \n";
            cout<<"==============================\n";
            cout<<"1. Login\n2. Signup\n0. Exit\nSelection: ";
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
            // --- LOGGED IN SESSION ---
            user_node* session_user = user_sys.get_logged_in_user();
            cout<<"\n--- DASHBOARD ("<<session_user->full_name<<" | "<<session_user->role<<") ---\n";

            if (session_user->role == "admin") {
                // ==========================
                //      ADMIN INTERFACE
                // ==========================
                cout<<"1. Announcements (CRUD)\n";
                cout<<"2. City Management (Add Cities/Stays)\n";
                cout<<"3. Package Management (Full CRUD)\n";
                cout<<"4. View Registered Users\n";
                cout<<"0. Logout\nSelection: ";
                cin>>choice; cin.ignore();

                switch (choice) {
                    case 1: // Announcements CRUD
                        cout<<"\n-- ANNOUNCEMENT MGMT --\n1. Broadcast New\n2. Edit Message\n3. Delete Message\n4. View All\nSelection: ";
                        int ann_choice; cin>>ann_choice; cin.ignore();
                        if (ann_choice == 1) {
                            cout<<"Message: "; getline(cin, input_text);
                            ann_sys.add_announcement(input_text);
                        } else if (ann_choice == 2) {
                            cout<<"ID to Edit: "; cin>>id_to_modify; cin.ignore();
                            cout<<"New Message: "; getline(cin, input_text);
                            ann_sys.edit_announcement(id_to_modify, input_text);
                        } else if (ann_choice == 3) {
                            cout<<"ID to Delete: "; cin>>id_to_modify;
                            ann_sys.delete_announcement(id_to_modify);
                        } else if (ann_choice == 4) ann_sys.display_all();
                        break;

                    case 2: // City Management
                        cout<<"\n-- CITY MGMT --\n1. Add New City\n2. Add Stay to City\n3. View City Details\nSelection: ";
                        int city_choice; cin>>city_choice; cin.ignore();
                        if (city_choice == 1) {
                            cout<<"City Name: "; getline(cin, city_name);
                            cout<<"Overview: "; getline(cin, input_text);
                            city_sys.add_city(city_name, input_text);
                        } else if (city_choice == 2) {
                            cout<<"Target City: "; getline(cin, city_name);
                            cout<<"Hotel Name: "; getline(cin, name);
                            cout<<"Price: "; getline(cin, input_text);
                            city_sys.add_stay_to_city(city_name, name, input_text);
                        } else if (city_choice == 3) {
                            cout<<"Enter City: "; getline(cin, city_name);
                            city_sys.display_city_details(city_name);
                        }
                        break;

                    case 3: // Package Management (Advanced Admin View)
                        cout<<"\n-- PACKAGE MGMT --\n1. Create Package (Eco/Premium)\n2. View All Packages (with Elite Features)\n3. Edit Package (Discount/Elite Update)\n4. Delete Package\nSelection: ";
                        int pc; cin>>pc; cin.ignore();
                        if (pc == 1) {
                            cout<<"Base Category (Economical/Premium): "; getline(cin, input_text);
                            cout<<"City Name: "; getline(cin, city_name);
                            if (!city_sys.search_city(city_name)) {
                                cout<<"[Error] City not found.\n";
                            } else {
                                cout<<"Title: "; getline(cin, name);
                                double p; cout<<"Original Price: "; cin>>p;
                                double d; cout<<"Discount % (0 if none): "; cin>>d;
                                int days; cout<<"Duration (Days): "; cin>>days; cin.ignore();
                                cout<<"Mode of Travel: "; getline(cin, pass);
                                elite_input = "";
                                if (input_text == "Premium") {
                                    cout<<"Elite Features: "; getline(cin, elite_input);
                                }
                                // add_package automatically routes to "Special" if d > 0
                                pack_sys.add_package(input_text, city_name, name, p, days, pass, d, elite_input);
                            }
                        } else if (pc == 2) {
                            pack_sys.display_all_admin();
                        } else if (pc == 3) {
                            cout<<"Enter ID to Edit: "; cin>>id_to_modify; cin.ignore();
                            cout<<"New Title: "; getline(cin, name);
                            double np; cout<<"New Original Price: "; cin>>np;
                            double nd; cout<<"New Discount %: "; cin>>nd;
                            cout<<"Update Elite Features: "; getline(cin, elite_input);
                            pack_sys.edit_package(id_to_modify, name, np, nd, elite_input);
                        } else if (pc == 4) {
                            cout<<"Enter ID to Delete: "; cin>>id_to_modify;
                            pack_sys.delete_package(id_to_modify);
                        }
                        break;

                    case 4:
                        user_sys.display_users();
                        break;

                    case 0:
                        user_sys.logout();
                        break;
                }
            } 
            else {
                // ==========================
                //      USER INTERFACE
                // ==========================
                cout<<"1. Search & Explore Cities\n";
                cout<<"2. Browse Packages (Special/Eco/Premium)\n";
                cout<<"3. Notifications\n";
                cout<<"0. Logout\nSelection: ";
                cin>>choice; cin.ignore();

                if (choice == 1) {
                    cout<<"Enter City: "; getline(cin, city_name);
                    city_sys.display_city_details(city_name);
                } else if (choice == 2) {
                    cout<<"Category: "; getline(cin, input_text);
                    pack_sys.display_by_category(input_text);
                } else if (choice == 3) {
                    ann_sys.display_all();
                } else if (choice == 0) {
                    user_sys.logout();
                }
            }
        }
    }
}