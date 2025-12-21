#ifndef BOOKINGS_H
#define BOOKINGS_H

#include <iostream>
#include <string>
#include "users.h" // Include users to use user_manager and user_node

using namespace std;

struct booking_node {
    int booking_id;
    string user_email;
    string city_name;
    string package_title;
    
    int adults, kids, infants, couples;
    string travel_mode, start_date, end_date, interests;
    
    double total_bill;
    string status;

    booking_node *next, *prev;

    booking_node(int id, string email, string city, string title, double bill)
        : booking_id(id), user_email(email), city_name(city), 
          package_title(title), total_bill(bill), status("Pending"),
          adults(0), kids(0), infants(0), couples(0),
          next(nullptr), prev(nullptr) {}
};

class booking_manager {
private:
    booking_node *head, *tail;
    int id_counter;

public:
    booking_manager() : head(nullptr), tail(nullptr), id_counter(9000) {}

    void create_booking(string email, string city, string title, double bill, int a, int k, int i, int c, string mode, string start, string end, string ints) {
        booking_node* new_node = new booking_node(id_counter++, email, city, title, bill);
        new_node->adults = a; new_node->kids = k; new_node->infants = i; new_node->couples = c;
        new_node->travel_mode = mode; new_node->start_date = start; new_node->end_date = end; new_node->interests = ints;

        if (!head) head = tail = new_node;
        else { tail->next = new_node; new_node->prev = tail; tail = new_node; }
        cout<<"[Success] Booking request sent!\n";
    }

    void display_admin_queue() {
        if (!head) { cout<<"[System] Queue empty.\n"; return; }
        booking_node* temp = head;
        while (temp) {
            cout<<"ID: "<<temp->booking_id<<" | User: "<<temp->user_email<<" | Status: "<<temp->status<<"\n";
            temp = temp->next;
        }
    }

    // FIX: Using user_manager to find the node and move data
    void confirm_booking(int id, user_manager& u_sys) {
        booking_node* temp = head;
        while (temp && temp->booking_id != id) temp = temp->next;

        if (!temp) { cout<<"[Error] ID not found.\n"; return; }

        user_node* u_node = u_sys.find_by_email(temp->user_email);
        if (u_node) {
            temp->status = "Confirmed";
            u_node->packages_availed++;

            // Remove from Queue
            if (temp->prev) temp->prev->next = temp->next;
            if (temp->next) temp->next->prev = temp->prev;
            if (temp == head) head = temp->next;
            if (temp == tail) tail = temp->prev;

            // Add to User History (Singly Linked List logic)
            temp->next = u_node->history_head;
            u_node->history_head = temp;

            cout<<"[Admin] Booking confirmed for "<<u_node->full_name<<"\n";
        }
    }

    void display_user_bookings(string email) {
        // This will now be handled by searching the user's history_head in users.h
        // But we can keep a backup search here if needed
    }
};

#endif