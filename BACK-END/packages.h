#ifndef PACKAGES_H
#define PACKAGES_H

#include <iostream>
#include <string>

using namespace std;

struct package_node {
    int id;
    string category; 
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
        cout<<"[Admin] Package added. Category: "<<final_category<<"\n";
    }

    // FIX 1: Displaying Elite Features for Admin
    void display_all_admin() {
        if (!head) { cout<<"[System] No packages found.\n"; return; }
        package_node* temp = head;
        cout<<"\n--- ADMIN MASTER PACKAGE LIST ---\n";
        while (temp) {
            cout<<"ID: "<<temp->id<<" | "<<temp->title<<" ("<<temp->category<<")\n";
            cout<<"   City: "<<temp->city_target<<" | Price: "<<temp->current_price;
            if (temp->discount_percent > 0) cout<<" ("<<temp->discount_percent<<"% OFF)";
            
            // Show elite features in admin view if they exist
            if (temp->elite_features != "") {
                cout<<"\n   Elite Features: "<<temp->elite_features;
            }
            cout<<"\n----------------------------------\n";
            temp = temp->next;
        }
    }

    // FIX 2: Added 'new_discount' and 'new_elite' to edit function
    void edit_package(int search_id, string new_title, double new_price, double new_discount, string new_elite) {
        package_node* temp = head;
        while (temp && temp->id != search_id) temp = temp->next;

        if (!temp) {
            cout<<"[Error] ID "<<search_id<<" not found.\n";
            return;
        }

        temp->title = new_title;
        temp->original_price = new_price;
        temp->discount_percent = new_discount;
        temp->elite_features = new_elite;

        // Recalculate price and update category dynamically based on new discount
        if (new_discount > 0) {
            temp->category = "Special";
            temp->current_price = new_price - (new_price * (new_discount / 100));
        } else {
            // Revert category if discount is removed; Logic depends on original type
            // For now, we update price to original
            temp->current_price = new_price;
        }
        cout<<"[Success] Package "<<search_id<<" updated.\n";
    }

    void display_by_category(string cat) {
        bool found = false;
        package_node* temp = head;
        cout<<"\n--- "<<cat<<" PACKAGES ---\n";
        while (temp) {
            if (temp->category == cat) {
                cout<<"["<<temp->id<<"] "<<temp->title<<" ("<<temp->city_target<<")\n";
                cout<<"   Price: Rs. "<<temp->current_price;
                if (temp->discount_percent > 0) cout<<" (SAVING "<<temp->discount_percent<<"%)";
                cout<<"\n   Mode: "<<temp->travel_mode<<" | Duration: "<<temp->duration_days<<" Days\n";
                if (temp->elite_features != "") cout<<"   Elite: "<<temp->elite_features<<"\n";
                cout<<"--------------------------\n";
                found = true;
            }
            temp = temp->next;
        }
        if (!found) cout<<"[System] No packages in this tier.\n";
    }

    void delete_package(int id) {
        package_node* temp = head;
        while (temp && temp->id != id) temp = temp->next;
        if (!temp) return;
        if (temp->prev) temp->prev->next = temp->next;
        if (temp->next) temp->next->prev = temp->prev;
        if (temp == head) head = temp->next;
        delete temp;
        cout<<"[Admin] Package deleted.\n";
    }
};

#endif