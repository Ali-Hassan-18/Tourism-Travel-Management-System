#ifndef BOOKINGS_H
#define BOOKINGS_H

#include <iostream>
#include <string>
#include <fstream>
#include "users.h" 
#include "utilities.h" 

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

    void generate_report() {
        double total_revenue = 0;
        int total_bookings = 0;
        booking_node* temp = head;
        while (temp) {
            total_revenue += temp->total_bill;
            total_bookings++;
            temp = temp->next;
        }
        cout << "\n--- ADMIN ANALYTICS ---\n";
        cout << "Pending Revenue: Rs. " << total_revenue << "\n";
        cout << "Queue Size     : " << total_bookings << "\n";
        cout << "-----------------------\n";
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
    }

    void display_admin_queue() {
        if (!head) { 
            cout << "\n[System] The pending booking queue is empty.\n"; 
            return; 
        }
        booking_node* temp = head;
        cout << "\n--- PENDING ADMIN QUEUE ---\n";
        int count = 0;
        while (temp) {
            if (temp->status == "Pending") {
                cout << "[" << ++count << "] ID: " << temp->booking_id << " | User: " << temp->user_email << " | Dest: " << temp->city_name << "\n";
            }
            temp = temp->next;
        }
    }

    void confirm_booking(int id, user_manager& u_sys) {
        booking_node* temp = head;
        while (temp && temp->booking_id != id) temp = temp->next;

        if (!temp) { 
            cout << "[Error] ID " << id << " not found.\n"; 
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

            temp->prev = nullptr;
            temp->next = u_node->history_head;
            u_node->history_head = temp;

            cout << "[Admin] Booking " << id << " confirmed.\n";
        }
    }

    void save_all_bookings(user_manager& u_sys) {
        string path = tourista_utils::get_path() + "bookings_data.txt";
        ofstream out(path); 
        if (!out) return;

        // Save Pending
        booking_node* temp = head;
        while (temp) {
            write_to_file(out, temp);
            temp = temp->next;
        }
        
        // Save Confirmed from Users
        user_node* current_u = u_sys.get_all_users_head(); 
        while (current_u) {
            booking_node* h = current_u->history_head;
            while (h) {
                write_to_file(out, h);
                h = h->next;
            }
            current_u = current_u->next;
        }
        out.close();
    }

    void load_bookings(user_manager& u_sys) {
        // Wipe local memory before loading to prevent repeating queue
        booking_node* current = head;
        while (current) {
            booking_node* next = current->next;
            delete current;
            current = next;
        }
        head = tail = nullptr;

        string path = tourista_utils::get_path() + "bookings_data.txt";
        ifstream in(path);
        if (!in) return;
        
        string line;
        while (getline(in, line)) {
            if (line.empty()) continue;
            
            size_t p[15];
            p[0] = -1;
            for(int i=1; i<=13; i++) {
                p[i] = line.find('|', p[i-1]+1);
            }

            if (p[13] != string::npos) {
                string email = line.substr(0, p[1]);
                string city  = line.substr(p[1] + 1, p[2] - p[1] - 1);
                string title = line.substr(p[2] + 1, p[3] - p[2] - 1);
                double bill  = stod(line.substr(p[3] + 1, p[4] - p[3] - 1));
                int a = stoi(line.substr(p[4] + 1, p[5] - p[4] - 1));
                int k = stoi(line.substr(p[5] + 1, p[6] - p[5] - 1));
                int i = stoi(line.substr(p[6] + 1, p[7] - p[6] - 1));
                int c = stoi(line.substr(p[7] + 1, p[8] - p[7] - 1));
                string mode = line.substr(p[8] + 1, p[9] - p[8] - 1);
                string s_date = line.substr(p[9] + 1, p[10] - p[9] - 1); // FIXED: p10 became p[10]
                string e_date = line.substr(p[10] + 1, p[11] - p[10] - 1);
                string ints = line.substr(p[11] + 1, p[12] - p[11] - 1);
                string stat = line.substr(p[12] + 1, p[13] - p[12] - 1);
                int f_id = stoi(line.substr(p[13] + 1));

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
                    if (!head) { head = tail = new_node; } 
                    else { tail->next = new_node; new_node->prev = tail; tail = new_node; }
                }
            }
        }
        in.close();
    }

private:
    void write_to_file(ofstream& out, booking_node* node) {
        out << node->user_email << "|" << node->city_name << "|" << node->package_title << "|" 
            << node->total_bill << "|" << node->adults << "|" << node->kids << "|" 
            << node->infants << "|" << node->couples << "|" << node->travel_mode << "|" 
            << node->start_date << "|" << node->end_date << "|" << node->interests << "|" 
            << node->status << "|" << node->booking_id << endl;
    }
};

#endif