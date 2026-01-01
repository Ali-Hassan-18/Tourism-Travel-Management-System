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
    string category; 
    int adults, kids, infants, couples;
    string travel_mode, start_date, end_date, interests;
    double total_bill;
    string status; 
    string image_url;
    booking_node *next, *prev;

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

    bool add_booking_detailed(string email, string city, string title, double bill, string img, string cat, string start, string end, int a, int k, int i, int c, string ints, user_manager& u_sys) {
        user_node* user = u_sys.find_by_email(email);
        if (!user) return false;

        booking_node* new_node = new booking_node(id_counter++, email, city, title, bill, img, cat);
        new_node->status = "Confirmed";
        
        new_node->adults = a; 
        new_node->kids = k; 
        new_node->infants = i; 
        new_node->couples = c;
        
        new_node->start_date = start; 
        new_node->end_date = end; 
        new_node->interests = ints;

        user->packages_availed++;
        new_node->next = user->history_head;
        if (user->history_head) user->history_head->prev = new_node;
        user->history_head = new_node;

        return true;
    }

    // UPDATED: Search Logic utilizing members of booking_node correctly
    vector<booking_node*> search_bookings(string query, user_manager& u_sys) {
        vector<booking_node*> results;
        string lower_query = tourista_utils::to_lower(query);
        
        user_node* u = u_sys.get_all_users_head();
        while (u) {
            booking_node* b = u->history_head;
            while (b) {
                if (query == "" || 
                    tourista_utils::to_lower(b->user_email).find(lower_query) != string::npos ||
                    tourista_utils::to_lower(b->city_name).find(lower_query) != string::npos ||
                    tourista_utils::to_lower(b->package_title).find(lower_query) != string::npos) {
                    results.push_back(b);
                }
                b = b->next;
            }
            u = u->next;
        }
        return results;
    }

    // NEW: FIFO Queue Retrieval (Backend Implementation)
    vector<booking_node*> get_bookings_queue(user_manager& u_sys) {
        vector<booking_node*> queue;
        user_node* u = u_sys.get_all_users_head();
        while (u) {
            booking_node* b = u->history_head;
            while (b) {
                queue.push_back(b);
                b = b->next;
            }
            u = u->next;
        }
        return queue; 
    }

    // UPDATED: Corrected Date Sorting Logic
    void sort_by_date(vector<booking_node*>& list, bool newest_first = true) {
        int n = list.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                bool condition;
                if (newest_first) {
                    condition = (list[j]->start_date < list[j+1]->start_date);
                } else {
                    condition = (list[j]->start_date > list[j+1]->start_date);
                }

                if (condition) {
                    swap(list[j], list[j+1]);
                }
            }
        }
    }

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
        return crow::json::wvalue(history);
    }

    bool update_status(int id, string new_status, user_manager& u_sys) {
    // 1. Traverse all users to find the specific booking by ID
    user_node* u = u_sys.get_all_users_head();
    while (u) {
        booking_node* b = u->history_head;
        while (b) {
            // 2. Check for the specific booking ID
            if (b->booking_id == id) {
                b->status = new_status; // Update the memory node
                
                // 3. Immediately save the entire list to file to persist changes
                save_bookings(u_sys);
                return true; 
            }
            b = b->next;
        }
        u = u->next;
    }
    return false; // ID not found
}
    void create_booking(string email, string city, string title, double bill, string img, string cat, int a, int k, int i, int c, string mode, string start, string end, string ints, user_manager& u_sys) {
        booking_node* new_node = new booking_node(id_counter++, email, city, title, bill, img, cat);
        
        if (cat == "Planned") {
            new_node->status = "Pending";
        } else {
            new_node->status = "Confirmed";
        }

        new_node->adults = a; 
        new_node->kids = k; 
        new_node->infants = i; 
        new_node->couples = c;
        new_node->travel_mode = mode; 
        new_node->start_date = start; 
        new_node->end_date = end; 
        new_node->interests = ints;

        user_node* user = u_sys.find_by_email(email);
        if (user) {
            new_node->next = user->history_head;
            if (user->history_head) user->history_head->prev = new_node;
            user->history_head = new_node;
            user->packages_availed++;
        }
    }

    void save_bookings(user_manager& u_sys) {
        string path = tourista_utils::get_path() + "bookings_data.txt";
        ofstream out(path); 
        if (!out) return;

        user_node* u_temp = u_sys.get_all_users_head();
        while (u_temp) {
            booking_node* b_temp = u_temp->history_head;
            while (b_temp) {
                write_to_file(out, b_temp);
                b_temp = b_temp->next;
            }
            u_temp = u_temp->next;
        }
        out.close();
    }

    void load_bookings(user_manager& u_sys) {
        string path = tourista_utils::get_path() + "bookings_data.txt";
        ifstream in(path);
        if (!in) return;
        
        string line;
        while (getline(in, line)) {
            if (line.empty() || line.find_first_not_of(" \t\n\r") == string::npos) continue;

            vector<size_t> p;
            size_t pos = line.find('|');
            while (pos != string::npos) {
                p.push_back(pos);
                pos = line.find('|', pos + 1);
            }

            if (p.size() >= 15) {
                string email = line.substr(0, p[0]);
                string city = line.substr(p[0] + 1, p[1] - p[0] - 1);
                string title = line.substr(p[1] + 1, p[2] - p[1] - 1);
                
                double bill = 0;
                try { bill = stod(line.substr(p[2] + 1, p[3] - p[2] - 1)); } catch (...) { bill = 0; }

                booking_node* new_node = new booking_node(9000, email, city, title, bill, "", "");
                
                new_node->adults      = tourista_utils::safe_stoi(line.substr(p[3] + 1, p[4] - p[3] - 1));
                new_node->kids        = tourista_utils::safe_stoi(line.substr(p[4] + 1, p[5] - p[4] - 1));
                new_node->infants     = tourista_utils::safe_stoi(line.substr(p[5] + 1, p[6] - p[5] - 1));
                new_node->couples     = tourista_utils::safe_stoi(line.substr(p[6] + 1, p[7] - p[6] - 1));
                new_node->travel_mode = line.substr(p[7] + 1, p[8] - p[7] - 1);
                new_node->start_date  = line.substr(p[8] + 1, p[9] - p[8] - 1);
                new_node->end_date    = line.substr(p[9] + 1, p[10] - p[9] - 1);
                new_node->interests   = line.substr(p[10] + 1, p[11] - p[10] - 1);
                new_node->status      = line.substr(p[11] + 1, p[12] - p[11] - 1);
                new_node->booking_id  = tourista_utils::safe_stoi(line.substr(p[12] + 1, p[13] - p[12] - 1));
                new_node->image_url   = line.substr(p[13] + 1, p[14] - p[13] - 1);
                new_node->category    = line.substr(p[14] + 1); 

                user_node* target = u_sys.find_by_email(email);
                if (target) {
                    new_node->next = target->history_head;
                    if (target->history_head) target->history_head->prev = new_node;
                    target->history_head = new_node;
                } else {
                    delete new_node; 
                }

                if (new_node->booking_id >= id_counter) id_counter = new_node->booking_id + 1;
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