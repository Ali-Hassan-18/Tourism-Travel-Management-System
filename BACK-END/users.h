#ifndef USERS_H
#define USERS_H

#include <iostream>
#include <string>

using namespace std;

// Forward Declaration: Tells compiler booking_node exists elsewhere
struct booking_node; 

struct user_node {
    string full_name;
    string email;
    string password;
    string role; 
    int packages_availed;
    
    // Pointer to history list
    booking_node* history_head; 

    user_node *next, *prev;

    user_node(string n, string e, string p, string r) 
        : full_name(n), email(e), password(p), role(r), 
          packages_availed(0), history_head(nullptr), next(nullptr), prev(nullptr) {}
};

class user_manager {
private:
    user_node* head;
    user_node* current_user;

public:
    user_manager() : head(nullptr), current_user(nullptr) {}

    // Needed by bookings.h to transfer data
    user_node* find_by_email(string e) {
        user_node* temp = head;
        while (temp) {
            if (temp->email == e) return temp;
            temp = temp->next;
        }
        return nullptr;
    }

    void register_user(string n, string e, string p, string r = "user") {
        user_node* new_node = new user_node(n, e, p, r);
        if (!head) head = new_node;
        else {
            user_node* temp = head;
            while (temp->next) temp = temp->next;
            temp->next = new_node;
            new_node->prev = temp;
        }
        cout<<"\n[Success] Account created for "<<n<<"\n";
    }

    bool login(string e, string p) {
        user_node* temp = head;
        while (temp) {
            if (temp->email == e && temp->password == p) {
                current_user = temp;
                cout<<"\n[Welcome] Logged in as "<<temp->full_name<<"\n";
                return true;
            }
            temp = temp->next;
        }
        cout<<"\n[Error] Invalid credentials.\n";
        return false;
    }

    user_node* get_logged_in_user() { return current_user; }
    void logout() { current_user = nullptr; cout<<"\n[System] Logged out.\n"; }

    void display_users() {
        user_node* temp = head;
        cout<<"\n--- REGISTERED USERS ---\n";
        while (temp) {
            cout<<"Name: "<<temp->full_name<<" | Email: "<<temp->email<<" | Trips: "<<temp->packages_availed<<"\n";
            temp = temp->next;
        }
    }
};

#endif