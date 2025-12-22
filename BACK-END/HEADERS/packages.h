#ifndef PACKAGES_H
#define PACKAGES_H

#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include "../crow_all.h" // Go up one folder to find crow
#include "utilities.h" 

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

    // --- FRONTEND LINKAGE: JSON SERIALIZATION ---

    // Returns all packages or filtered by category if requested
    crow::json::wvalue get_packages_json(string filter_cat = "all") {
        vector<crow::json::wvalue> list;
        package_node* temp = head;

        while (temp) {
            // Check if we want all packages or a specific category
            if (filter_cat == "all" || tourista_utils::to_lower(temp->category) == tourista_utils::to_lower(filter_cat)) {
                crow::json::wvalue p;
                p["id"] = temp->id;
                p["category"] = temp->category;
                p["city"] = temp->city_target;
                p["title"] = temp->title;
                p["price"] = temp->current_price;
                p["original_price"] = temp->original_price;
                p["discount"] = temp->discount_percent;
                p["days"] = temp->duration_days;
                p["mode"] = temp->travel_mode;
                p["elite"] = temp->elite_features;
                
                list.push_back(std::move(p));
            }
            temp = temp->next;
        }
        return crow::json::wvalue(list);
    }

    // --- CORE LOGIC ---

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
    }

    void edit_package(int search_id, string new_title, double new_price, double new_discount, string new_elite) {
        package_node* temp = head;
        while (temp && temp->id != search_id) temp = temp->next;

        if (!temp) return;

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
    }

    void delete_package(int id) {
        package_node* temp = head;
        while (temp && temp->id != id) temp = temp->next;
        if (!temp) return;

        if (temp->prev) temp->prev->next = temp->next;
        if (temp->next) temp->next->prev = temp->prev;
        if (temp == head) head = temp->next;

        delete temp;
    }

    // --- PERSISTENCE LOGIC ---

    void save_packages() {
        string path = tourista_utils::get_path() + "packages.txt";
        ofstream out(path);
        if (!out) return;

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
            size_t p[9];
            p[0] = -1;
            for(int i=1; i<=8; i++) {
                p[i] = line.find('|', p[i-1]+1);
            }

            if (p[1] != string::npos) {
                int f_id = stoi(line.substr(0, p[1]));
                string f_cat = line.substr(p[1] + 1, p[2] - p[1] - 1);
                string f_city = line.substr(p[2] + 1, p[3] - p[2] - 1);
                string f_title = line.substr(p[3] + 1, p[4] - p[3] - 1);
                double f_op = stod(line.substr(p[4] + 1, p[5] - p[4] - 1));
                int f_days = stoi(line.substr(p[5] + 1, p[6] - p[5] - 1));
                string f_mode = line.substr(p[6] + 1, p[7] - p[6] - 1);
                double f_disc = stod(line.substr(p[7] + 1, p[8] - p[7] - 1));
                string f_elite = line.substr(p[8] + 1);

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