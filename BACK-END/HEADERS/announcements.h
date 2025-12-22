#ifndef ANNOUNCEMENTS_H
#define ANNOUNCEMENTS_H

#include <iostream>
#include <string>
#include <fstream>
#include "utilities.h" // Essential for centralized path logic

using namespace std;

// Structure for a single Announcement node
struct announcement_node {
    int id;
    string message;
    string timestamp;
    announcement_node *next, *prev; // Pointers for Doubly Linked List

    announcement_node(int i, string m, string t) 
        : id(i), message(m), timestamp(t), next(nullptr), prev(nullptr) {}
};

class announcement_manager {
private:
    announcement_node* head;
    int id_counter; // Tracks the next unique ID to be assigned

public:
    announcement_manager() : head(nullptr), id_counter(100) {}

    // Adds a new announcement to the end of the Doubly Linked List
    void add_announcement(string msg) {
        announcement_node* new_node = new announcement_node(id_counter++, msg, "8:11 PM");
        
        if (!head) {
            head = new_node;
        } else {
            announcement_node* temp = head;
            while (temp->next) temp = temp->next;
            temp->next = new_node;
            new_node->prev = temp; // Link back to the previous node
        }
        cout << "\n[System] Broadcast sent to all users.\n";
    }

    // Traverses and prints all active announcements
    void display_all() {
        if (!head) {
            cout << "\n[System] No active announcements.\n";
            return;
        }
        announcement_node* temp = head;
        cout << "\n--- ACTIVE ANNOUNCEMENTS ---\n";
        while (temp) {
            cout << "ID: " << temp->id << " | Msg: " << temp->message << " (" << temp->timestamp << ")\n";
            temp = temp->next;
        }
    }

    // Searches for an ID and unhooks the node from the list
    void delete_announcement(int search_id) {
        if (!head) return;

        announcement_node* temp = head;
        while (temp && temp->id != search_id) temp = temp->next;

        if (!temp) {
            cout << "\n[Error] Announcement ID " << search_id << " not found.\n";
            return;
        }

        // Logic to re-link neighboring nodes before deletion
        if (temp->prev) temp->prev->next = temp->next;
        if (temp->next) temp->next->prev = temp->prev;
        if (temp == head) head = temp->next;

        delete temp; // Free memory
        cout << "\n[System] Announcement removed.\n";
    }

    // Modifies the message of an existing announcement node
    void edit_announcement(int search_id, string new_msg) {
        if (!head) {
            cout << "[Error] No announcements exist to edit.\n";
            return;
        }      

        announcement_node* temp = head;
        while (temp && temp->id != search_id) temp = temp->next;

        if (!temp) {
            cout << "[Error] Announcement ID " << search_id << " not found.\n";
            return;
        }

        temp->message = new_msg;
        cout << "[Success] Announcement " << search_id << " updated.\n";
    }

    // --- PERSISTENCE LOGIC (Updated for Centralized Path) ---

    // Writes list data to announcements.txt using pipe delimiter
    void save_to_file() {
        string path = tourista_utils::get_path() + "announcements.txt";
        ofstream out(path);
        
        if (!out) {
            cout << "[Error] Could not open path: " << path << ". Check if folder exists.\n";
            return;
        }

        announcement_node* temp = head;
        while (temp) {
            out << temp->id << "|" << temp->message << "|" << temp->timestamp << endl;
            temp = temp->next;
        }
        out.close();
    }

    // Reads file and reconstructs list while keeping original IDs
    void load_from_file() {
        string path = tourista_utils::get_path() + "announcements.txt";
        ifstream in(path);
        
        if (!in) return;
        
        string line;
        while (getline(in, line)) {
            size_t p1 = line.find('|');
            size_t p2 = line.find('|', p1 + 1);
            
            if (p1 != string::npos) {
                int f_id = stoi(line.substr(0, p1));
                string f_msg = line.substr(p1 + 1, p2 - p1 - 1);
                string f_time = (p2 != string::npos) ? line.substr(p2 + 1) : "8:11 PM";

                // Re-create node with original ID
                announcement_node* new_node = new announcement_node(f_id, f_msg, f_time);
                if (!head) {
                    head = new_node;
                } else {
                    announcement_node* temp = head;
                    while (temp->next) temp = temp->next;
                    temp->next = new_node;
                    new_node->prev = temp;
                }
                
                // Keep the counter updated so new announcements don't clash with loaded ones
                if (f_id >= id_counter) id_counter = f_id + 1;
            }
        }
        in.close();
    }
};

#endif