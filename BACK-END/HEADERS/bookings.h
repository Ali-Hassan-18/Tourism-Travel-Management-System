#ifndef BOOKINGS_H
#define BOOKINGS_H

#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include "../crow_all.h"
#include "users.h" 
#include "utilities.h" 

using namespace std;

struct booking_node {
    int booking_id;
    string user_email;
    string city_name;
    string package_title;
    string category; // NEW: Stores "Economical", "Premium", or "Special"
    int adults, kids, infants, couples;
    string travel_mode, start_date, end_date, interests;
    double total_bill;
    string status; 
    string image_url;
    booking_node *next, *prev;

    // Updated Constructor
    booking_node(int id, string email, string city, string title, double bill, string img, string cat)
        : booking_id(id), user_email(email), city_name(city), 
          package_title(title), total_bill(bill), image_url(img), 
          category(cat), status("Pending"),
          adults(0), kids(0), infants(0), couples(0),
          next(nullptr), prev(nullptr) {}
    
      crow::json::wvalue to_json() {
        crow::json::wvalue j;
        j["id"] = booking_id;
        j["city"] = city_name;
        j["package"] = package_title;
        j["category"] = category;
        j["bill"] = total_bill;
        j["status"] = status; 
        j["dates"] = start_date + " to " + end_date;
        
        string traveler_info = to_string(adults) + " Adults";
        if (kids > 0) traveler_info += ", " + to_string(kids) + " Kids";
        if (infants > 0) traveler_info += ", " + to_string(infants) + " Infants";
        if (couples > 0) traveler_info += ", " + to_string(couples) + " Couples";
        
        j["travelers"] = traveler_info;
        j["details"] = interests; 
        j["img"] = image_url;
        return j;
    }
};

class booking_manager {
private:
    booking_node *head, *tail; 
    int id_counter;

public:
    booking_manager() : head(nullptr), tail(nullptr), id_counter(9000) {}

    crow::json::wvalue get_user_history_json(string email, user_manager& u_sys) {
        vector<crow::json::wvalue> history;
        user_node* user = u_sys.find_by_email(email);
        
        if (user) {
            booking_node* h_temp = user->history_head;
            while (h_temp) {
                history.push_back(h_temp->to_json());
                h_temp = h_temp->next;
            }
        }

        booking_node* q_temp = head;
        while (q_temp) {
            if (q_temp->user_email == email) {
                history.push_back(q_temp->to_json());
            }
            q_temp = q_temp->next;
        }
        return crow::json::wvalue(history);
    }

    // Updated with 'cat' parameter
    void create_booking(string email, string city, string title, double bill, string img, string cat, int a, int k, int i, int c, string mode, string start, string end, string ints) {
        booking_node* new_node = new booking_node(id_counter++, email, city, title, bill, img, cat);
        new_node->adults = a; new_node->kids = k; new_node->infants = i; new_node->couples = c;
        new_node->travel_mode = mode; new_node->start_date = start; 
        new_node->end_date = end; new_node->interests = ints;

        if (!head) { head = tail = new_node; } 
        else { tail->next = new_node; new_node->prev = tail; tail = new_node; }
    }

    void save_all_bookings(user_manager& u_sys) {
        string path = tourista_utils::get_path() + "bookings_data.txt";
        ofstream out(path); 
        if (!out) return;

        booking_node* temp = head;
        while (temp) { write_to_file(out, temp); temp = temp->next; }
        
        user_node* curr_u = u_sys.get_all_users_head(); 
        while (curr_u) {
            booking_node* h = curr_u->history_head;
            while (h) { write_to_file(out, h); h = h->next; }
            curr_u = curr_u->next;
        }
        out.close();
    }

    void load_bookings(user_manager& u_sys) {
        while (head) { booking_node* n = head->next; delete head; head = n; }
        head = tail = nullptr;

        string path = tourista_utils::get_path() + "bookings_data.txt";
        ifstream in(path);
        if (!in) return;
        
        string line;
        while (getline(in, line)) {
            // CRITICAL FIX: Skip empty lines to prevent stoi/stod crashes
            if (line.empty() || line.length() < 10) continue;

            size_t p[16]; p[0] = -1;
            for(int i=1; i<=15; i++) p[i] = line.find('|', p[i-1]+1);

            if (p[15] != string::npos) {
                string email = line.substr(0, p[1]);
                string city  = line.substr(p[1] + 1, p[2] - p[1] - 1);
                string title = line.substr(p[2] + 1, p[3] - p[2] - 1);
                
                // Use safe parsing for all numeric fields
                string bill_str = line.substr(p[3] + 1, p[4] - p[3] - 1);
                double bill = bill_str.empty() ? 0.0 : stod(bill_str); 

                int a = tourista_utils::safe_stoi(line.substr(p[4] + 1, p[5] - p[4] - 1));
                int k = tourista_utils::safe_stoi(line.substr(p[5] + 1, p[6] - p[5] - 1));
                int i = tourista_utils::safe_stoi(line.substr(p[6] + 1, p[7] - p[6] - 1));
                int c = tourista_utils::safe_stoi(line.substr(p[7] + 1, p[8] - p[7] - 1));
                
                string mode = line.substr(p[8] + 1, p[9] - p[8] - 1);
                string s_date = line.substr(p[9] + 1, p[10] - p[9] - 1);
                string e_date = line.substr(p[10] + 1, p[11] - p[10] - 1);
                string ints = line.substr(p[11] + 1, p[12] - p[11] - 1);
                string stat = line.substr(p[12] + 1, p[13] - p[12] - 1);
                
                int f_id = tourista_utils::safe_stoi(line.substr(p[13] + 1, p[14] - p[13] - 1));
                string f_img = line.substr(p[14] + 1, p[15] - p[14] - 1);
                string f_cat = line.substr(p[15] + 1);

                booking_node* new_node = new booking_node(f_id, email, city, title, bill, f_img, f_cat);
                new_node->adults = a; new_node->kids = k; new_node->infants = i; new_node->couples = c;
                new_node->travel_mode = mode; new_node->start_date = s_date; 
                new_node->end_date = e_date; new_node->interests = ints; new_node->status = stat;

                if (f_id >= id_counter) id_counter = f_id + 1;

                if (stat == "Confirmed") {
                    user_node* target = u_sys.find_by_email(email);
                    if (target) { new_node->next = target->history_head; target->history_head = new_node; }
                    else delete new_node;
                } else {
                    if (!head) { head = tail = new_node; } 
                    else { tail->next = new_node; new_node->prev = tail; tail = new_node; }
                }
            }
        }
        in.close();
    }

private:
    void write_to_file(ofstream& out, booking_node* n) {
        out << n->user_email << "|" << n->city_name << "|" << n->package_title << "|" 
            << n->total_bill << "|" << n->adults << "|" << n->kids << "|" 
            << n->infants << "|" << n->couples << "|" << n->travel_mode << "|" 
            << n->start_date << "|" << n->end_date << "|" << n->interests << "|" 
            << n->status << "|" << n->booking_id << "|" << n->image_url << "|" << n->category << endl; 
    }
};
#endif