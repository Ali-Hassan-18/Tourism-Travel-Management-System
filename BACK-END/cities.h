#ifndef CITIES_H
#define CITIES_H
#include <iostream>
#include <string>

using namespace std;

// Internal nodes for the City "Explore" details
struct stay_node {
    string hotel_name;
    string price_per_night;
    stay_node* next;
    stay_node(string n, string p) : hotel_name(n), price_per_night(p), next(nullptr) {}
};

struct dining_node {
    string restaurant_name;
    string price_for_two;
    dining_node* next;
    dining_node(string n, string p) : restaurant_name(n), price_for_two(p), next(nullptr) {}
};

// The main City node
struct city_node {
    string city_name;
    string overview_text;
    
    // Pointers to internal multi-level lists
    stay_node* stays_head;
    dining_node* dining_head;

    city_node *next, *prev;

    city_node(string name, string overview) 
        : city_name(name), overview_text(overview), 
          stays_head(nullptr), dining_head(nullptr), 
          next(nullptr), prev(nullptr) {}
};

class city_manager {
private:
    city_node* head;

public:
    city_manager() : head(nullptr) {}

    void add_city(string name, string overview) {
            city_node* new_node = new city_node(name, overview);
            if (!head) {
                head = new_node;
            } else {
                city_node* temp = head;
                while (temp->next) temp = temp->next;
                temp->next = new_node;
                new_node->prev = temp;
            }
            cout<<"\n[Admin] City "<<name<<" added to database.\n";
        }

        // Adding internal stays (Multi-level logic)
        void add_stay_to_city(string city_target, string h_name, string price) {
        city_node* target = search_city(city_target);

        // FIX: Check if city exists first
        if (!target) {
            cout<<"[Error] Cannot add stay. City '"<<city_target<<"' does not exist in the database.\n";
            return;
        }

        // Only if target exists, we create the new stay node
        stay_node* new_stay = new stay_node(h_name, price);
        new_stay->next = target->stays_head;
        target->stays_head = new_stay;
        cout<<"[Success] Stay '"<<h_name<<"' added to "<<city_target<<".\n";
    }

    void display_city_details(string name) {
        city_node* temp = head;
        while (temp && temp->city_name != name) temp = temp->next;

        if (!temp) {
            cout<<"\n[Error] City not found.\n";
            return;
        }

        cout<<"\n--- EXPLORING "<<temp->city_name<<" ---\n";
        cout<<"Overview: "<<temp->overview_text<<"\n";
        
        cout<<"\nTop Stays:\n";
        stay_node* s = temp->stays_head;
        while (s) {
            cout<<"- "<<s->hotel_name<<" ("<<s->price_per_night<<")\n";
            s = s->next;
        }
    }

    // Needed for the "Search for a city..." bar
    city_node* search_city(string name) {
        city_node* temp = head;
        while (temp) {
            if (temp->city_name == name) return temp;
            temp = temp->next;
        }
        return nullptr;
    }
};

#endif