#ifndef PACKAGES_H
#define PACKAGES_H

#include <iostream>
#include <string>
#include <fstream>
#include "utilities.h" // Essential for centralized path logic

using namespace std;

// Structure for a travel package node
struct package_node {
    int id;
    string category; // Special, Premium, or Economical
    string city_target;
    string title;
    double original_price;
    double current_price;
    double discount_percent; 
    int duration_days;
    string travel_mode;
    string elite_features; 
    
    package_node *next, *prev;

    package_node(int i, string cat, string city, string t, double op, double cp, int days, string mode)
        : id(i), category(cat), city_target(city), title(t), original_price(op), 
          current_price(cp), duration_days(days), travel_mode(mode),
          discount_percent(0), elite_features(""), next(nullptr), prev(nullptr) {}
};

class package_manager {
private:
    package_node* head;
    int id_counter;

public:
    package_manager() : head(nullptr), id_counter(500) {}

    // Adds a package and automatically assigns category "Special" if a discount exists
    void add_package(string cat, string city, string title, double price, int days, string mode, double disc = 0, string elite = "") {
        string final_category = cat;
        double final_price = price;

        if (disc > 0) {
            final_category = "Special";
            final_price = price - (price * (disc / 100));
        }

        package_node* new_node = new package_node(id_counter++, final_category, city, title, price, final_price, days, mode);
        new_node->discount_percent = disc;
        new_node->elite_features = elite;

        if (!head) {
            head = new_node;
        } else {
            package_node* temp = head;
            while (temp->next) temp = temp->next;
            temp->next = new_node;
            new_node->prev = temp;
        }
        cout << "[Admin] Package added. Routed to Category: " << final_category << "\n";
    }

    void display_all_admin() {
        if (!head) { cout << "[System] No packages found.\n"; return; }
        package_node* temp = head;
        cout << "\n--- ADMIN MASTER PACKAGE LIST ---\n";
        while (temp) {
            cout << "ID: " << temp->id << " | " << temp->title << " (" << temp->category << ")\n";
            cout << "   City: " << temp->city_target << " | Current Price: Rs. " << temp->current_price;
            if (temp->discount_percent > 0) cout << " (" << temp->discount_percent << "% OFF)";
            
            if (temp->elite_features != "") {
                cout << "\n   Elite Features: " << temp->elite_features;
            }
            cout << "\n----------------------------------\n";
            temp = temp->next;
        }
    }

    void edit_package(int search_id, string new_title, double new_price, double new_discount, string new_elite) {
        package_node* temp = head;
        while (temp && temp->id != search_id) temp = temp->next;

        if (!temp) {
            cout << "[Error] Package ID " << search_id << " not found.\n";
            return;
        }

        temp->title = new_title;
        temp->original_price = new_price;
        temp->discount_percent = new_discount;
        temp->elite_features = new_elite;

        if (new_discount > 0) {
            temp->category = "Special";
            temp->current_price = new_price - (new_price * (new_discount / 100));
        } else {
            temp->current_price = new_price;
        }
        cout << "[Success] Package " << search_id << " synchronized.\n";
    }

    void display_by_category(string cat) {
        bool found = false;
        package_node* temp = head;
        cout << "\n--- " << cat << " PACKAGES ---\n";
        while (temp) {
            if (temp->category == cat) {
                cout << "[" << temp->id << "] " << temp->title << " (" << temp->city_target << ")\n";
                cout << "   Price: Rs. " << temp->current_price;
                if (temp->discount_percent > 0) cout << " (SALE: " << temp->discount_percent << "% OFF)";
                cout << "\n   Travel: " << temp->travel_mode << " | Duration: " << temp->duration_days << " Days\n";
                if (temp->elite_features != "") cout << "   Elite: " << temp->elite_features << "\n";
                cout << "--------------------------\n";
                found = true;
            }
            temp = temp->next;
        }
        if (!found) cout << "[System] No packages found in the " << cat << " tier.\n";
    }

    void delete_package(int id) {
        package_node* temp = head;
        while (temp && temp->id != id) temp = temp->next;
        if (!temp) return;

        if (temp->prev) temp->prev->next = temp->next;
        if (temp->next) temp->next->prev = temp->prev;
        if (temp == head) head = temp->next;

        delete temp;
        cout << "[Admin] Package " << id << " removed from inventory.\n";
    }

    // --- PERSISTENCE LOGIC (Updated for Centralized Path) ---

    void save_packages() {
        string path = tourista_utils::get_path() + "packages.txt";
        ofstream out(path);
        
        if (!out) {
            cout << "[Error] Could not open path: " << path << ". Check if folder exists.\n";
            return;
        }

        package_node* temp = head;
        while (temp) {
            out << temp->id << "|" << temp->category << "|" << temp->city_target << "|" 
                << temp->title << "|" << temp->original_price << "|" << temp->duration_days << "|" 
                << temp->travel_mode << "|" << temp->discount_percent << "|" << temp->elite_features << endl;
            temp = temp->next;
        }
        out.close();
    }

    void load_packages() {
        string path = tourista_utils::get_path() + "packages.txt";
        ifstream in(path);
        if (!in) return;
        
        string line;
        while (getline(in, line)) {
            size_t p1 = line.find('|');
            size_t p2 = line.find('|', p1 + 1);
            size_t p3 = line.find('|', p2 + 1);
            size_t p4 = line.find('|', p3 + 1);
            size_t p5 = line.find('|', p4 + 1);
            size_t p6 = line.find('|', p5 + 1);
            size_t p7 = line.find('|', p6 + 1);
            size_t p8 = line.find('|', p7 + 1);

            if (p1 != string::npos) {
                int f_id = stoi(line.substr(0, p1));
                string f_cat = line.substr(p1 + 1, p2 - p1 - 1);
                string f_city = line.substr(p2 + 1, p3 - p2 - 1);
                string f_title = line.substr(p3 + 1, p4 - p3 - 1);
                double f_op = stod(line.substr(p4 + 1, p5 - p4 - 1));
                int f_days = stoi(line.substr(p5 + 1, p6 - p5 - 1));
                string f_mode = line.substr(p6 + 1, p7 - p6 - 1);
                double f_disc = stod(line.substr(p7 + 1, p8 - p7 - 1));
                string f_elite = line.substr(p8 + 1);

                double f_cp = f_op - (f_op * (f_disc / 100));

                package_node* new_node = new package_node(f_id, f_cat, f_city, f_title, f_op, f_cp, f_days, f_mode);
                new_node->discount_percent = f_disc;
                new_node->elite_features = f_elite;

                if (!head) {
                    head = new_node;
                } else {
                    package_node* temp = head;
                    while (temp->next) temp = temp->next;
                    temp->next = new_node;
                    new_node->prev = temp;
                }

                if (f_id >= id_counter) id_counter = f_id + 1;
            }
        }
        in.close();
    }
};

#endif