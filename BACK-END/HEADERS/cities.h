#ifndef CITIES_H
#define CITIES_H

#include <iostream>
#include <string>
#include <fstream>
#include "utilities.h" // Essential for centralized path logic

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

    // Adds a new city node to the end of the list
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

    // Helper: Finds a city by name to link internal stays/dining
    city_node* search_city(string name) {
        city_node* temp = head;
        while (temp) {
            if (temp->city_name == name) return temp;
            temp = temp->next;
        }
        return nullptr;
    }

    // Adds a stay to a specific city's nested list
    void add_stay_to_city(string city_target, string h_name, string price) {
        city_node* target = search_city(city_target);

        if (!target) {
            cout << "[Error] Cannot add stay. City '" << city_target << "' not found.\n";
            return;
        }

        stay_node* new_stay = new stay_node(h_name, price);
        new_stay->next = target->stays_head;
        target->stays_head = new_stay;
        cout << "[Success] Stay '" << h_name << "' added to " << city_target << ".\n";
    }

    // Displays full detailed info for the "Explore" page
    void display_city_details(string name) {
        city_node* target = search_city(name);

        if (!target) {
            cout << "\n[Error] City not found.\n";
            return;
        }

        cout << "\n--- EXPLORING " << target->city_name << " ---\n";
        cout << "Overview: " << target->overview_text << "\n";
        cout << "Image Path: " << target->image_path << "\n";
        
        cout << "\nTop Stays:\n";
        stay_node* s = target->stays_head;
        if (!s) cout << "   No stays added yet.\n";
        while (s) {
            cout << "- " << s->hotel_name << " (Rs. " << s->price_per_night << ")\n";
            s = s->next;
        }
    }

    // Admin view for quick city database check
    void display_all_cities() {
        if (!head) { cout << "[System] No cities in database.\n"; return; }
        city_node* temp = head;
        cout << "\n--- REGISTERED CITIES ---\n";
        while (temp) {
            cout << "- " << temp->city_name << " (Img: " << temp->image_path << ")\n";
            temp = temp->next;
        }
    }

    // --- PERSISTENCE LOGIC (Updated for Centralized Path) ---

    void save_cities() {
        string path = tourista_utils::get_path() + "cities.txt";
        ofstream out(path);
        
        if (!out) {
            cout << "[Error] Could not open path: " << path << ". Check if folder exists.\n";
            return;
        }

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