#ifndef CITIES_H
#define CITIES_H

#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include "../crow_all.h" 
#include "utilities.h" 

using namespace std;

// Node for Tourist Spots
struct spot_node {
    string name;
    spot_node* next;
    spot_node(string n) : name(n), next(nullptr) {}
};

// Node for Restaurants
struct dining_node {
    string restaurant_name;
    dining_node* next;
    dining_node(string n) : restaurant_name(n), next(nullptr) {}
};

// --- FIX: Added 'prev' pointer to city_node for Doubly Linked List support ---
struct city_node {
    string city_name;
    string image_path; 
    spot_node* spots_head;
    dining_node* dining_head; 
    city_node *next, *prev; // Added *prev

    city_node(string n, string img = "default.jpg") 
        : city_name(n), image_path(img), 
          spots_head(nullptr), dining_head(nullptr), 
          next(nullptr), prev(nullptr) {} // Initialize both pointers
};

class city_manager {
private:
    city_node* head;

public:
    city_manager() : head(nullptr) {}

    // --- API LOGIC ---

    crow::json::wvalue get_all_cities_json() {
        vector<crow::json::wvalue> list;
        city_node* temp = head;
        while (temp) {
            crow::json::wvalue c;
            c["cityName"] = temp->city_name;
            c["image"] = temp->image_path;
            
            vector<string> s_list;
            spot_node* s = temp->spots_head;
            while(s) { s_list.push_back(s->name); s = s->next; }
            c["touristSpots"] = s_list;

            vector<string> d_list;
            dining_node* d = temp->dining_head;
            while(d) { d_list.push_back(d->restaurant_name); d = d->next; }
            c["restaurants"] = d_list;

            list.push_back(std::move(c));
            temp = temp->next;
        }
        return crow::json::wvalue(list);
    }

    // --- CORE LOGIC: DOUBLY LINKED LIST ---

    void add_city(string name, string img) {
        city_node* new_node = new city_node(name, img);
        if (!head) {
            head = new_node;
        } else {
            city_node* temp = head;
            while (temp->next) temp = temp->next;
            temp->next = new_node;
            new_node->prev = temp; // Set the previous pointer
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

    // --- FIX: delete_city now has access to temp->prev ---
    bool delete_city(string target_name) {
        city_node* temp = head;
        while (temp) {
            if (temp->city_name == target_name) {
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

    bool edit_city(string old_name, string new_name, string img) {
        city_node* target = search_city(old_name);
        if (!target) return false;
        target->city_name = new_name;
        target->image_path = img;
        return true;
    }

    void add_spot_to_city(string city_n, string s_name) {
        city_node* target = search_city(city_n);
        if (!target) return;
        spot_node* new_s = new spot_node(s_name);
        new_s->next = target->spots_head;
        target->spots_head = new_s;
    }

    void add_dining_to_city(string city_n, string d_name) {
        city_node* target = search_city(city_n);
        if (!target) return;
        dining_node* new_d = new dining_node(d_name);
        new_d->next = target->dining_head;
        target->dining_head = new_d;
    }

    // --- PERSISTENCE ---

    void save_cities() {
        string path = tourista_utils::get_path() + "cities.txt";
        ofstream out(path);
        city_node* temp = head;
        while (temp) {
            out << "CITY|" << temp->city_name << "|" << temp->image_path << endl;
            spot_node* s = temp->spots_head;
            while (s) { out << "SPOT|" << temp->city_name << "|" << s->name << endl; s = s->next; }
            dining_node* d = temp->dining_head;
            while (d) { out << "DINING|" << temp->city_name << "|" << d->restaurant_name << endl; d = d->next; }
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
            if (line.empty()) continue;
            size_t p1 = line.find('|');
            size_t p2 = line.find('|', p1 + 1);
            if (p1 == string::npos) continue;

            string type = line.substr(0, p1);
            if (type == "CITY") {
                string c_name = line.substr(p1 + 1, p2 - p1 - 1);
                string img = line.substr(p2 + 1);
                add_city(c_name, img);
            } else if (type == "SPOT") {
                string c_name = line.substr(p1 + 1, p2 - p1 - 1);
                string s_name = line.substr(p2 + 1);
                add_spot_to_city(c_name, s_name);
            } else if (type == "DINING") {
                string c_name = line.substr(p1 + 1, p2 - p1 - 1);
                string d_name = line.substr(p2 + 1);
                add_dining_to_city(c_name, d_name);
            }
        }
        in.close();
    }
};
#endif