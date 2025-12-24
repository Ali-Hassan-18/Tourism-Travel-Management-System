#ifndef PACKAGES_H
#define PACKAGES_H

#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include "../crow_all.h" 
#include "utilities.h" 

using namespace std;

struct package_node {
    int id;
    string category, city_target, title;
    double original_price, current_price, discount_percent; 
    int duration_days;
    string travel_mode, elite_features; 
    string image_url; 
    
    package_node *next, *prev;

    package_node(int i, string cat, string city, string t, double op, double cp, int days, string mode, string img) 
        : id(i), category(cat), city_target(city), title(t), original_price(op), 
          current_price(cp), duration_days(days), travel_mode(mode),
          discount_percent(0), elite_features(""), image_url(img), next(nullptr), prev(nullptr) {}
};

class package_manager {
private:
    package_node* head;
    int id_counter;

public:
    package_manager() : head(nullptr), id_counter(500) {}

    crow::json::wvalue get_packages_json(string filter_cat = "all") {
        vector<crow::json::wvalue> list;
        package_node* temp = head;

        while (temp) {
            // FIX: Ensure case-insensitive matching so "Special" vs "special" both work
            if (filter_cat == "all" || tourista_utils::to_lower(temp->category) == tourista_utils::to_lower(filter_cat)) {
                crow::json::wvalue p;
                p["id"] = temp->id;
                p["category"] = temp->category;
                p["location"] = temp->city_target; 
                p["title"] = temp->title;
                p["basePrice"] = temp->current_price; 
                p["original_price"] = temp->original_price;
                p["discount"] = temp->discount_percent;
                p["days"] = temp->duration_days;
                p["mode"] = temp->travel_mode;
                p["img"] = temp->image_url;
                p["elite_features"] = temp->elite_features; 
                
                list.push_back(std::move(p));
            }
            temp = temp->next;
        }
        return crow::json::wvalue(list);
    }

    bool delete_package(int target_id) {
        package_node* temp = head;
        while (temp) {
            if (temp->id == target_id) {
                if (temp == head) {
                    head = temp->next;
                    if (head) head->prev = nullptr;
                } else {
                    if (temp->prev) temp->prev->next = temp->next;
                    if (temp->next) temp->next->prev = temp->prev;
                }
                delete temp;
                return true;
            }
            temp = temp->next;
        }
        return false;
    }

    bool edit_package(int id, string cat, string city, string title, double price, 
                      int days, string mode, string img, double disc, string stops) {
        package_node* temp = head;
        while (temp) {
            if (temp->id == id) {
                // FIX: If there is a discount, force category to "Special"
                if (disc > 0) {
                    temp->category = "Special";
                } else {
                    temp->category = cat; 
                }

                temp->city_target = city;
                temp->title = title;
                temp->original_price = price;
                temp->duration_days = days;
                temp->travel_mode = mode;
                temp->image_url = img;
                temp->discount_percent = disc;
                temp->elite_features = stops;
                temp->current_price = price - (price * (disc / 100));
                return true;
            }
            temp = temp->next;
        }
        return false;
    }

    void add_package(string cat, string city, string title, double price, int days, string mode, string img, double disc = 0, string elite = "") {
        string final_category = cat;
        if (disc > 0) final_category = "Special";

        double final_price = price - (price * (disc / 100));
        package_node* new_node = new package_node(id_counter++, final_category, city, title, price, final_price, days, mode, img);
        new_node->discount_percent = disc;
        new_node->elite_features = elite;

        if (!head) { head = new_node; } 
        else {
            package_node* temp = head;
            while (temp->next) temp = temp->next;
            temp->next = new_node;
            new_node->prev = temp;
        }
    }

    void save_packages() {
        string path = tourista_utils::get_path() + "packages.txt";
        ofstream out(path);
        if (!out) return;

        package_node* temp = head;
        while (temp) {
            out << temp->id << "|" << temp->category << "|" << temp->city_target << "|" 
                << temp->title << "|" << temp->original_price << "|" << temp->duration_days << "|" 
                << temp->travel_mode << "|" << temp->discount_percent << "|" << temp->elite_features 
                << "|" << temp->image_url << endl;
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
            if (line.empty()) continue;
            size_t p[10]; p[0] = -1;
            for(int i=1; i<=9; i++) p[i] = line.find('|', p[i-1]+1);

            if (p[9] != string::npos) {
                int f_id = stoi(line.substr(0, p[1]));
                string f_cat = line.substr(p[1] + 1, p[2] - p[1] - 1);
                string f_city = line.substr(p[2] + 1, p[3] - p[2] - 1);
                string f_title = line.substr(p[3] + 1, p[4] - p[3] - 1);
                double f_op = stod(line.substr(p[4] + 1, p[5] - p[4] - 1));
                int f_days = stoi(line.substr(p[5] + 1, p[6] - p[5] - 1));
                string f_mode = line.substr(p[6] + 1, p[7] - p[6] - 1);
                double f_disc = stod(line.substr(p[7] + 1, p[8] - p[7] - 1));
                string f_elite = line.substr(p[8] + 1, p[9] - p[8] - 1);
                string f_img = line.substr(p[9] + 1);

                // FIX: Sync category if discount exists during load
                if (f_disc > 0) f_cat = "Special";

                double f_cp = f_op - (f_op * (f_disc / 100));
                
                // FIXED: Removed the duplicate 'new_node' declaration here
                package_node* new_node = new package_node(f_id, f_cat, f_city, f_title, f_op, f_cp, f_days, f_mode, f_img);
                new_node->discount_percent = f_disc;
                new_node->elite_features = f_elite;

                if (!head) { head = new_node; } 
                else {
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