#ifndef USERS_H
#define USERS_H

#include <iostream>
#include <string>
#include <fstream>

using namespace std;

struct user_node {
    string full_name;
    string email;
    string password;
    string role; // "admin" or "user"
    int packages_availed;
    user_node *next, *prev;

    user_node(string n, string e, string p, string r) 
        : full_name(n), email(e), password(p), role(r), 
          packages_availed(0), next(nullptr), prev(nullptr) {}
};

class user_manager {
private:
    user_node* head;
    user_node* current_user; // Tracks who is currently logged in

public:
    user_manager() : head(nullptr), current_user(nullptr) {}

    void register_user(string n, string e, string p, string r = "user") {
        user_node* new_node = new user_node(n, e, p, r);
        if (!head) {
            head = new_node;
        } else {
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
                cout<<"\n[Welcome] Logged in as "<<temp->full_name<<" ("<<temp->role<<")\n";
                return true;
            }
            temp = temp->next;
        }
        cout<<"\n[Error] Invalid email or password.\n";
        return false;
    }

    user_node* get_logged_in_user() {
        return current_user;
    }

    void logout() {
        current_user = nullptr;
        cout<<"\n[System] Logged out successfully.\n";
    }

    // Admin view: Displays users and their activity (Admin Image 12)
    void display_users() {
        if (!head) {
            cout<<"\n[System] No registered users.\n";
            return;
        }
        user_node* temp = head;
        cout<<"\n--- REGISTERED USERS ---\n";
        while (temp) {
            cout<<"Name: "<<temp->full_name<<" | Email: "<<temp->email;
            cout<<" | Role: "<<temp->role<<" | Trips: "<<temp->packages_availed<<"\n";
            temp = temp->next;
        }
    }
};

#endif