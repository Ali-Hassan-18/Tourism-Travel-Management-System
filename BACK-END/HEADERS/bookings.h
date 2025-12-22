#ifndef BOOKINGS_H
#define BOOKINGS_H

#include <iostream>
#include <string>
#include <fstream>
#include "users.h" 
#include "utilities.h" 

using namespace std;

// Structure for a single booking (Transaction Data)
struct booking_node {
    int booking_id;
    string user_email;
    string city_name;
    string package_title;
    
    int adults, kids, infants, couples;
    string travel_mode, start_date, end_date, interests;
    
    double total_bill;
    string status; // "Pending" or "Confirmed"

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

    // --- ANALYTICS LOGIC (MOVED FROM UTILITIES.H) ---
    // This function can now safely access temp->total_bill and other members
    void generate_report() {
        double total_revenue = 0;
        int total_bookings = 0;
        int adventure_count = 0;
        
        booking_node* temp = head; // Pending Queue
        while (temp) {
            total_revenue += temp->total_bill;
            total_bookings++;
            
            // Normalize interest string to lowercase for search
            string ints = tourista_utils::to_lower(temp->interests);
            if (ints.find("adventure") != string::npos) {
                adventure_count++;
            }
            temp = temp->next;
        }

        cout << "\n--- ADMIN ANALYTICS REPORT (LIVE QUEUE) ---\n";
        cout << "Current Queue Potential Revenue: Rs. " << total_revenue << "\n";
        cout << "Total Requests in Queue: " << total_bookings << "\n";
        if (total_bookings > 0) {
            double adv_perc = (double)adventure_count / total_bookings * 100;
            cout << "Adventure Interest Rate: " << adv_perc << "%\n";
        }
        cout << "------------------------------------------\n";
    }

    void create_booking(string email, string city, string title, double bill, int a, int k, int i, int c, string mode, string start, string end, string ints) {
        booking_node* new_node = new booking_node(id_counter++, email, city, title, bill);
        new_node->adults = a; new_node->kids = k; new_node->infants = i; new_node->couples = c;
        new_node->travel_mode = mode; new_node->start_date = start; 
        new_node->end_date = end; new_node->interests = ints;

        if (!head) {
            head = tail = new_node;
        } else { 
            tail->next = new_node; 
            new_node->prev = tail; 
            tail = new_node; 
        }
        cout << "[Success] Booking request sent to the Admin Queue!\n";
    }

    void display_admin_queue() {
        if (!head) { 
            cout << "[System] No pending booking requests.\n"; 
            return; 
        }
        booking_node* temp = head;
        cout << "\n--- PENDING BOOKING QUEUE ---\n";
        while (temp) {
            cout << "ID: " << temp->booking_id << " | User: " << temp->user_email << " | Status: " << temp->status << "\n";
            temp = temp->next;
        }
    }

    void confirm_booking(int id, user_manager& u_sys) {
        booking_node* temp = head;
        while (temp && temp->booking_id != id) temp = temp->next;

        if (!temp) { 
            cout << "[Error] Booking ID " << id << " not found.\n"; 
            return; 
        }

        user_node* u_node = u_sys.find_by_email(temp->user_email);
        if (u_node) {
            temp->status = "Confirmed";
            u_node->packages_availed++;

            if (temp->prev) temp->prev->next = temp->next;
            if (temp->next) temp->next->prev = temp->prev;
            if (temp == head) head = temp->next;
            if (temp == tail) tail = temp->prev;

            temp->next = nullptr;
            temp->prev = nullptr;

            temp->next = u_node->history_head;
            u_node->history_head = temp;

            cout << "[Admin] Booking " << id << " confirmed for " << u_node->full_name << ".\n";
        }
    }

    // --- PERSISTENCE LOGIC (Updated Paths) ---

    void save_all_bookings(user_manager& u_sys) {
        string path = tourista_utils::get_path() + "bookings_data.txt";
        ofstream out(path);
        if (!out) return;

        // Pass 1: Save Pending Queue
        booking_node* temp = head;
        while (temp) {
            out << temp->user_email << "|" << temp->city_name << "|" << temp->package_title << "|" 
                << temp->total_bill << "|" << temp->adults << "|" << temp->kids << "|" 
                << temp->infants << "|" << temp->couples << "|" << temp->travel_mode << "|" 
                << temp->start_date << "|" << temp->end_date << "|" << temp->interests << "|" 
                << temp->status << "|" << temp->booking_id << endl;
            temp = temp->next;
        }
        
        // Pass 2: Save Confirmed History
        user_node* current_u = u_sys.get_all_users_head(); 
        while (current_u) {
            booking_node* history_temp = current_u->history_head;
            while (history_temp) {
                out << history_temp->user_email << "|" << history_temp->city_name << "|" << history_temp->package_title << "|" 
                    << history_temp->total_bill << "|" << history_temp->adults << "|" << history_temp->kids << "|" 
                    << history_temp->infants << "|" << history_temp->couples << "|" << history_temp->travel_mode << "|" 
                    << history_temp->start_date << "|" << history_temp->end_date << "|" << history_temp->interests << "|" 
                    << history_temp->status << "|" << history_temp->booking_id << endl;
                history_temp = history_temp->next;
            }
            current_u = current_u->next;
        }
        out.close();
    }

    void load_bookings(user_manager& u_sys) {
        string path = tourista_utils::get_path() + "bookings_data.txt";
        ifstream in(path);
        if (!in) return;

        string line;
        while (getline(in, line)) {
            size_t p1 = line.find('|');
            size_t p2 = line.find('|', p1 + 1);
            size_t p3 = line.find('|', p2 + 1);
            size_t p4 = line.find('|', p3 + 1);
            size_t p5 = line.find('|', p4 + 1);
            size_t p6 = line.find('|', p5 + 1);
            size_t p7 = line.find('|', p6 + 1);
            size_t p8 = line.find('|', p7 + 1);
            size_t p9 = line.find('|', p8 + 1);
            size_t p10 = line.find('|', p9 + 1);
            size_t p11 = line.find('|', p10 + 1);
            size_t p12 = line.find('|', p11 + 1);
            size_t p13 = line.find('|', p12 + 1);

            if (p13 != string::npos) {
                string email = line.substr(0, p1);
                string city  = line.substr(p1 + 1, p2 - p1 - 1);
                string title = line.substr(p2 + 1, p3 - p2 - 1);
                double bill  = stod(line.substr(p3 + 1, p4 - p3 - 1));
                int a = stoi(line.substr(p4 + 1, p5 - p4 - 1));
                int k = stoi(line.substr(p5 + 1, p6 - p5 - 1));
                int i = stoi(line.substr(p6 + 1, p7 - p6 - 1));
                int c = stoi(line.substr(p7 + 1, p8 - p7 - 1));
                string mode = line.substr(p8 + 1, p9 - p8 - 1);
                string s_date = line.substr(p9 + 1, p10 - p9 - 1);
                string e_date = line.substr(p10 + 1, p11 - p10 - 1);
                string ints = line.substr(p11 + 1, p12 - p11 - 1);
                string stat = line.substr(p12 + 1, p13 - p12 - 1);
                int f_id = stoi(line.substr(p13 + 1));

                booking_node* new_node = new booking_node(f_id, email, city, title, bill);
                new_node->adults = a; new_node->kids = k; new_node->infants = i; new_node->couples = c;
                new_node->travel_mode = mode; new_node->start_date = s_date; 
                new_node->end_date = e_date; new_node->interests = ints;
                new_node->status = stat;

                if (f_id >= id_counter) id_counter = f_id + 1;

                if (stat == "Confirmed") {
                    user_node* target = u_sys.find_by_email(email);
                    if (target) {
                        new_node->next = target->history_head;
                        target->history_head = new_node;
                    } else delete new_node; 
                } else {
                    if (!head) {
                        head = tail = new_node;
                    } else {
                        tail->next = new_node;
                        new_node->prev = tail;
                        tail = new_node;
                    }
                }
            }
        }
        in.close();
    }
};

#endif