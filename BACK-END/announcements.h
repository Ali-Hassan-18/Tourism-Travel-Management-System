#ifndef ANNOUNCEMENTS_H
#define ANNOUNCEMENTS_H

#include <iostream>
#include <string>
#include <fstream>

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
    announcement_node* head;
    int id_counter;

public:
    announcement_manager() : head(nullptr), id_counter(100) {}

    void add_announcement(string msg) {
        // Newest announcements go to the end of the list for this logic
        announcement_node* new_node = new announcement_node(id_counter++, msg, "8:11 PM");
        if (!head) {
            head = new_node;
        } else {
            announcement_node* temp = head;
            while (temp->next) temp = temp->next;
            temp->next = new_node;
            new_node->prev = temp;
        }
        cout<<"\n[System] Broadcast sent to all users.\n";
    }

    void display_all() {
        if (!head) {
            cout<<"\n[System] No active announcements.\n";
            return;
        }
        announcement_node* temp = head;
        cout<<"\n--- ACTIVE ANNOUNCEMENTS ---\n";
        while (temp) {
            cout<<"ID: "<<temp->id<<" | Msg: "<<temp->message<<" ("<<temp->timestamp<<")\n";
            temp = temp->next;
        }
    }

    // Needed for Admin 'Delete' button in your screenshot
    void delete_announcement(int search_id) {
        announcement_node* temp = head;
        while (temp && temp->id != search_id) temp = temp->next;

        if (!temp) {
            cout<<"\n[Error] Announcement ID not found.\n";
            return;
        }

        if (temp->prev) temp->prev->next = temp->next;
        if (temp->next) temp->next->prev = temp->prev;
        if (temp == head) head = temp->next;

        delete temp;
        cout<<"\n[System] Announcement removed.\n";
    }

    void edit_announcement(int search_id, string new_msg) {
        // FIX 1: Check if the list is empty first
        if (!head) {
            cout<<"[Error] No announcements exist to edit.\n";
            return;
        }      

        announcement_node* temp = head;
        while (temp && temp->id != search_id) {
            temp = temp->next;
        }

        // FIX 2: Check if the ID was actually found
        if (!temp) {
            cout<<"[Error] Announcement with ID "<<search_id<<" not found.\n";
            return;
        }

        // If both checks pass, update the message
        temp->message = new_msg;
        cout<<"[Success] Announcement "<<search_id<<" updated.\n";
    }
};

#endif