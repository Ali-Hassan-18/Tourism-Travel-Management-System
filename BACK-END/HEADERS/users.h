#ifndef USERS_H
#define USERS_H

#include <iostream>
#include <string>
#include <fstream>
#include <iomanip>
#include "utilities.h"

using namespace std;

struct booking_node; 

struct user_node {
    string full_name;
    string email;
    string password;
    string role; 
    int packages_availed;
    
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

    user_node* get_all_users_head() { return head; }

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
        if (!head) {
            head = new_node;
        } else {
            user_node* temp = head;
            while (temp->next) temp = temp->next;
            temp->next = new_node;
            new_node->prev = temp;
        }
        if (current_user != nullptr || head == new_node) {
             cout << "\n[Success] Account created for " << n << "\n";
        }
    }

    bool login(string e, string p) {
        user_node* temp = head;
        while (temp) {
            if (temp->email == e && temp->password == p) {
                current_user = temp;
                cout << "\n[Welcome] Logged in as " << temp->full_name << " (" << temp->role << ")\n";
                return true;
            }
            temp = temp->next;
        }
        cout << "\n[Error] Invalid email or password.\n";
        return false;
    }

    user_node* get_logged_in_user() { return current_user; }
    void logout() { current_user = nullptr; cout << "\n[System] Logged out.\n"; }

    void display_users() {
        if (!head) { cout << "[System] No users registered.\n"; return; }
        user_node* temp = head;
        cout << "\n" << string(60, '=') << "\n";
        cout << left << setw(20) << "NAME" << setw(25) << "EMAIL" << setw(10) << "TRIPS" << "\n";
        cout << string(60, '-') << "\n";
        while (temp) {
            cout << left << setw(20) << temp->full_name 
                 << setw(25) << temp->email 
                 << setw(10) << temp->packages_availed << "\n";
            temp = temp->next;
        }
        cout << string(60, '=') << "\n";
    }

    // SEARCH LOGIC: Profiles individual users for the Admin
    void search_and_display_user(string email_to_find) {
        user_node* target = find_by_email(email_to_find);
        if (!target) {
            cout << "\n[Error] Traveler not found with email: " << email_to_find << "\n";
            return;
        }
        cout << "\n" << string(45, '=') << "\n";
        cout << "          TRAVELER PROFILE CARD          \n";
        cout << string(45, '=') << "\n";
        cout << "Full Name   : " << target->full_name << "\n";
        cout << "Email       : " << target->email << "\n";
        cout << "Account Type: " << target->role << "\n";
        cout << "Trips Taken : " << target->packages_availed << "\n";
        cout << string(45, '-') << "\n";
        cout << "Status: " << (target->role == "admin" ? "Staff" : "Customer") << "\n";
        cout << string(45, '=') << "\n";
    }

    void save_users() {
        string path = tourista_utils::get_path() + "users.txt";
        ofstream out(path);
        if (!out) return;
        user_node* temp = head;
        while (temp) {
            out << temp->full_name << "|" << temp->email << "|" << temp->password << "|" 
                << temp->role << "|" << temp->packages_availed << endl;
            temp = temp->next;
        }
        out.close();
    }

    void load_users() {
        string path = tourista_utils::get_path() + "users.txt";
        ifstream in(path);
        if (!in) return; 
        string line;
        while (getline(in, line)) {
            if (line.empty()) continue; 
            size_t p1 = line.find('|');
            size_t p2 = line.find('|', p1 + 1);
            size_t p3 = line.find('|', p2 + 1);
            size_t p4 = line.find('|', p3 + 1);

            if (p1 != string::npos && p4 != string::npos) {
                string n = line.substr(0, p1);
                string e = line.substr(p1 + 1, p2 - p1 - 1);
                string p = line.substr(p2 + 1, p3 - p2 - 1);
                string r = line.substr(p3 + 1, p4 - p3 - 1);
                int count = stoi(line.substr(p4 + 1));

                user_node* new_node = new user_node(n, e, p, r);
                new_node->packages_availed = count;
                
                if (!head) head = new_node;
                else {
                    user_node* temp = head;
                    while (temp->next) temp = temp->next;
                    temp->next = new_node;
                    new_node->prev = temp;
                }
            }
        }
        in.close();
    }
};

#endif