#ifndef USERS_H
#define USERS_H

#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include "../crow_all.h" 
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

    // Updated to match React field names: "fullName" instead of "name"
    crow::json::wvalue to_json() {
        crow::json::wvalue j;
        j["fullName"] = full_name;
        j["email"] = email;
        j["role"] = role;
        j["trips"] = packages_availed;
        return j;
    }
};

class user_manager {
private:
    user_node* head;
    user_node* current_user; 

public:
    user_manager() : head(nullptr), current_user(nullptr) {}
    user_node* get_all_users_head() { return head; }

    // --- FRONTEND LINKAGE: AUTHENTICATION ---

    crow::json::wvalue authenticate_json(string email, string pass) {
        // Hardcoded Admin logic to match LoginTemporary.jsx
        if (email == "admin@example.com" && pass == "admin123") {
            crow::json::wvalue res;
            res["status"] = "success";
            res["user"]["fullName"] = "System Admin";
            res["user"]["email"] = email;
            res["user"]["role"] = "admin";
            return res;
        }

        user_node* temp = head;
        while (temp) {
            if (temp->email == email && temp->password == pass) {
                current_user = temp;
                crow::json::wvalue res;
                res["status"] = "success";
                res["user"] = temp->to_json();
                return res;
            }
            temp = temp->next;
        }
        
        crow::json::wvalue error;
        error["status"] = "error";
        error["message"] = "Invalid email or password";
        return error;
    }

    crow::json::wvalue register_user_json(string n, string e, string p) {
        if (find_by_email(e)) {
            crow::json::wvalue error;
            error["status"] = "error";
            error["message"] = "Email already registered";
            return error;
        }
        
        // Default role is "user" to match navigate("/dashboard")
        register_user(n, e, p, "user");
        save_users();
        
        crow::json::wvalue res;
        res["status"] = "success";
        res["user"]["fullName"] = n;
        res["user"]["email"] = e;
        res["user"]["role"] = "user";
        return res;
    }

    // --- CORE LOGIC & PERSISTENCE (UNCHANGED) ---
    user_node* find_by_email(string e) {
        user_node* temp = head;
        while (temp) { if (temp->email == e) return temp; temp = temp->next; }
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
            size_t p[5]; p[0] = line.find('|');
            for(int i=1; i<4; i++) p[i] = line.find('|', p[i-1]+1);
            if (p[0] != string::npos) {
                string n = line.substr(0, p[0]);
                string e = line.substr(p[0]+1, p[1]-p[0]-1);
                string pw = line.substr(p[1]+1, p[2]-p[1]-1);
                string r = line.substr(p[2]+1, p[3]-p[2]-1);
                int count = stoi(line.substr(p[3]+1));
                register_user(n, e, pw, r);
                user_node* t = find_by_email(e);
                if (t) t->packages_availed = count;
            }
        }
    }

    crow::json::wvalue get_all_users_json() {
    vector<crow::json::wvalue> user_list;
    user_node* temp = head;
    
    while (temp) {
        // We only want to show actual users to the admin, not the admin themselves
        if (temp->role != "admin") {
            crow::json::wvalue u;
            u["name"] = temp->full_name;
            u["email"] = temp->email;
            u["trips"] = temp->packages_availed;
            user_list.push_back(std::move(u));
        }
        temp = temp->next;
    }
    return crow::json::wvalue(user_list);
}
};

#endif