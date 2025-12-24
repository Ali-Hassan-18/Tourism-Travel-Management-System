#ifndef ANNOUNCEMENTS_H
#define ANNOUNCEMENTS_H

#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include "../crow_all.h" 
#include "utilities.h" 

using namespace std;

struct announcement_node {
    int id;
    string message;
    string timestamp;
    announcement_node *next, *prev;

    announcement_node(int i, string m, string t) 
        : id(i), message(m), timestamp(t), next(nullptr), prev(nullptr) {}
};

class announcement_manager {
private:
    announcement_node* head; // Head is the TOP of our Stack
    int id_counter;

public:
    announcement_manager() : head(nullptr), id_counter(100) {}

    // --- STACK OPERATION: PUSH (Insert at Head) ---
    void add_announcement(string msg) {
        announcement_node* new_node = new announcement_node(id_counter++, msg, "8:11 PM");
        
        if (!head) {
            head = new_node;
        } else {
            // The new node points to the current head
            new_node->next = head;
            // The current head points back to the new node
            head->prev = new_node;
            // The new node becomes the NEW head (Top of Stack)
            head = new_node;
        }
        cout << "[Stack] Latest announcement pushed to Head (Top).\n";
    }

    // --- Inside announcement_manager class in announcements.h ---

    // 1. DELETE: Remove announcement by ID
    bool delete_announcement(int target_id) {
        announcement_node* temp = head;
        while (temp) {
            if (temp->id == target_id) {
                // If it's the head (Top of Stack)
                if (temp == head) {
                    head = temp->next;
                    if (head) head->prev = nullptr;
                } else {
                    // Bridge the gap between prev and next
                    if (temp->prev) temp->prev->next = temp->next;
                    if (temp->next) temp->next->prev = temp->prev;
                }
                delete temp;
                cout << "[Stack] Announcement " << target_id << " deleted.\n";
                return true;
            }
            temp = temp->next;
        }
        return false;
    }

    // 2. EDIT: Update announcement message by ID
    // --- Inside announcements.h ---
bool edit_announcement(int target_id, string new_msg) {
    announcement_node* temp = head;
    while (temp) {
        if (temp->id == target_id) {
            temp->message = new_msg;
            return true; // SUCCESS
        }
        temp = temp->next;
    }
    return false; // NOT FOUND
}
    // --- JSON SERIALIZATION (Starts from Head/Top) ---
    crow::json::wvalue get_announcements_json() {
        vector<crow::json::wvalue> list;
        announcement_node* temp = head; // Start at the Top

        while (temp) {
            crow::json::wvalue a;
            a["id"] = temp->id;
            a["message"] = temp->message;
            a["time"] = temp->timestamp;
            list.push_back(std::move(a));
            temp = temp->next;
        }
        return crow::json::wvalue(list);
    }

    // --- PERSISTENCE ---

    void save_to_file() {
        string path = tourista_utils::get_path() + "announcements.txt";
        ofstream out(path);
        if (!out) return;

        announcement_node* temp = head;
        while (temp) {
            out << temp->id << "|" << temp->message << "|" << temp->timestamp << endl;
            temp = temp->next;
        }
        out.close();
    }

    void load_from_file() {
        string path = tourista_utils::get_path() + "announcements.txt";
        ifstream in(path);
        if (!in) return;
        
        // Memory cleanup
        while(head) {
            announcement_node* t = head;
            head = head->next;
            delete t;
        }

        string line;
        while (getline(in, line)) {
            size_t p1 = line.find('|');
            size_t p2 = line.find('|', p1 + 1);
            
            if (p1 != string::npos) {
                int f_id = stoi(line.substr(0, p1));
                string f_msg = line.substr(p1 + 1, p2 - p1 - 1);
                string f_time = (p2 != string::npos) ? line.substr(p2 + 1) : "8:11 PM";

                announcement_node* new_node = new announcement_node(f_id, f_msg, f_time);
                
                // When loading from a file that was saved Head-to-Tail,
                // we use Append logic to maintain that exact order.
                if (!head) {
                    head = new_node;
                } else {
                    announcement_node* temp = head;
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