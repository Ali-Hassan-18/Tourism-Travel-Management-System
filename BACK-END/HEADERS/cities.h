#ifndef CITIES_H
#define CITIES_H

#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include "../crow_all.h" // Essential for crow::json types
#include "utilities.h" 

using namespace std;

// Node for Hotel/Stay options within a city
struct stay_node {
    string hotel_name;
    string price_per_night;
    stay_node* next;
    stay_node(string n, string p) : hotel_name(n), price_per_night(p), next(nullptr) {}
};

// Node for Restaurant/Dining options
struct dining_node {
    string restaurant_name;
    string price_for_two;
    dining_node* next;
    dining_node(string n, string p) : restaurant_name(n), price_for_two(p), next(nullptr) {}
};

// Main City Node (Parent of Stays and Dining)
struct city_node {
    string city_name;
    string overview_text;
    string image_path; 
    stay_node* stays_head;
    dining_node* dining_head; 
    city_node *next;

    city_node(string n, string o, string img = "default.jpg") 
        : city_name(n), overview_text(o), image_path(img), 
          stays_head(nullptr), dining_head(nullptr), next(nullptr) {}
};

class city_manager {
private:
    city_node* head;

public:
    city_manager() : head(nullptr) {}

    // --- FRONTEND LINKAGE: JSON SERIALIZATION ---

    // 1. Returns all cities in a simple list for the main "Explore" gallery
    crow::json::wvalue get_all_cities_json() {
        vector<crow::json::wvalue> city_list;
        city_node* temp = head;
        while (temp) {
            crow::json::wvalue c;
            c["name"] = temp->city_name;
            c["overview"] = temp->overview_text;
            c["image"] = temp->image_path;
            city_list.push_back(std::move(c));
            temp = temp->next;
        }
        return crow::json::wvalue(city_list);
    }

    // 2. Returns deep details for a single city, including its nested Linked List of Stays
    crow::json::wvalue get_city_details_json(string name) {
        city_node* target = search_city(name);
        if (!target) return crow::json::wvalue(); // Return empty if not found

        crow::json::wvalue res;
        res["name"] = target->city_name;
        res["overview"] = target->overview_text;
        res["image"] = target->image_path;

        // Convert nested stays (Linked List) into a JSON array
        vector<crow::json::wvalue> stay_list;
        stay_node* s = target->stays_head;
        while (s) {
            crow::json::wvalue stay;
            stay["hotel"] = s->hotel_name;
            stay["price"] = s->price_per_night;
            stay_list.push_back(std::move(stay));
            s = s->next;
        }
        res["stays"] = std::move(stay_list);
        
        // Convert nested dining (Linked List) into a JSON array
        vector<crow::json::wvalue> dining_list;
        dining_node* d = target->dining_head;
        while (d) {
            crow::json::wvalue din;
            din["restaurant"] = d->restaurant_name;
            din["price"] = d->price_for_two;
            dining_list.push_back(std::move(din));
            d = d->next;
        }
        res["dining"] = std::move(dining_list);

        return res;
    }

    // --- CORE LOGIC ---

    void add_city(string name, string info, string img = "default.jpg") {
        city_node* new_node = new city_node(name, info, img);
        if (!head) {
            head = new_node;
        } else {
            city_node* temp = head;
            while (temp->next) temp = temp->next;
            temp->next = new_node;
        }
    }

    city_node* search_city(string name) {
        city_node* temp = head;
        while (temp) {
            if (temp->city_name == name) return temp;
            temp = temp->next;
        }
        return nullptr;
    }

    void add_stay_to_city(string city_target, string h_name, string price) {
        city_node* target = search_city(city_target);
        if (!target) return;

        stay_node* new_stay = new stay_node(h_name, price);
        new_stay->next = target->stays_head;
        target->stays_head = new_stay;
    }

    // --- CONSOLE DISPLAY METHODS ---

    void display_city_details(string name) {
        city_node* target = search_city(name);
        if (!target) {
            cout << "\n[Error] City not found.\n";
            return;
        }
        cout << "\n--- EXPLORING " << target->city_name << " ---\n";
        cout << "Overview: " << target->overview_text << "\n";
        cout << "Top Stays:\n";
        stay_node* s = target->stays_head;
        while (s) {
            cout << "- " << s->hotel_name << " (Rs. " << s->price_per_night << ")\n";
            s = s->next;
        }
    }

    void display_all_cities() {
        if (!head) { cout << "[System] No cities in database.\n"; return; }
        city_node* temp = head;
        cout << "\n--- REGISTERED CITIES ---\n";
        while (temp) {
            cout << "- " << temp->city_name << " (Img: " << temp->image_path << ")\n";
            temp = temp->next;
        }
    }

    // --- PERSISTENCE LOGIC ---

    void save_cities() {
        string path = tourista_utils::get_path() + "cities.txt";
        ofstream out(path);
        if (!out) return;

        city_node* temp = head;
        while (temp) {
            out << "CITY|" << temp->city_name << "|" << temp->overview_text << "|" << temp->image_path << endl;
            stay_node* s = temp->stays_head;
            while (s) {
                out << "STAY|" << temp->city_name << "|" << s->hotel_name << "|" << s->price_per_night << endl;
                s = s->next;
            }
            temp = temp->next;
        }
        out.close();
    }

    void load_cities() {
        string path = tourista_utils::get_path() + "cities.txt";
        ifstream in(path);
        if (!in) return;
        
        string line;
        while (getline(in, line)) {
            size_t p1 = line.find('|');
            size_t p2 = line.find('|', p1 + 1);
            if (p1 == string::npos) continue;

            string type = line.substr(0, p1);
            if (type == "CITY") {
                size_t p3 = line.find('|', p2 + 1);
                string c_name = line.substr(p1 + 1, p2 - p1 - 1);
                string info = line.substr(p2 + 1, p3 - p2 - 1);
                string img = (p3 != string::npos) ? line.substr(p3 + 1) : "default.jpg";
                add_city(c_name, info, img);
            } 
            else if (type == "STAY") {
                size_t p3 = line.find('|', p2 + 1);
                string c_name = line.substr(p1 + 1, p2 - p1 - 1);
                string h_name = line.substr(p2 + 1, p3 - p2 - 1);
                string price = line.substr(p3 + 1);
                add_stay_to_city(c_name, h_name, price);
            }
        }
        in.close();
    }
};

#endif