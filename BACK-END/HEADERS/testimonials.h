#ifndef TESTIMONIALS_H
#define TESTIMONIALS_H

#include <string>
#include <iostream>
#include <fstream>
#include <ctime>
#include <vector>
#include "../crow_all.h"
#include "utilities.h"

using namespace std;

struct testimonials_node {
    string user_name;
    string review_text;
    int rating;
    string date;
    testimonials_node* next;

    testimonials_node(string n, string t, int r, string d)
        : user_name(n), review_text(t), rating(r), date(d), next(nullptr) {}

    crow::json::wvalue to_json() {
        crow::json::wvalue j;
        j["user"] = user_name;
        j["text"] = review_text;
        j["rating"] = rating;
        j["date"] = date;
        return j;
    }
};

class testimonial_manager {
private:
    testimonials_node* head;

    string get_current_date() {
        time_t now = time(0);
        tm* t = localtime(&now);
        return to_string(t->tm_mday) + "-" + to_string(t->tm_mon + 1) + "-" + to_string(t->tm_year + 1900);
    }

public:
    testimonial_manager() : head(nullptr) {}
    testimonials_node* get_head() { return head; }

    void add_testimonial(string user, string review, int rating) {
        string date = get_current_date();
        testimonials_node* newNode = new testimonials_node(user, review, rating, date);
        newNode->next = head;
        head = newNode;
    }

    // bool edit_testimonial(string user, string new_review, int new_rating) {
    //     testimonials_node* temp = head;
    //     while (temp) {
    //         if (temp->user_name == user) {
    //             temp->review_text = new_review;
    //             temp->rating = new_rating;
    //             temp->date = get_current_date();
    //             return true;
    //         }
    //         temp = temp->next;
    //     }
    //     return false;
    // }

    // bool delete_testimonial(string user) {
    //     testimonials_node *curr = head, *prev = nullptr;
    //     while (curr) {
    //         if (curr->user_name == user) {
    //             if (!prev) head = curr->next;
    //             else prev->next = curr->next;
    //             delete curr;
    //             return true;
    //         }
    //         prev = curr;
    //         curr = curr->next;
    //     }
    //     return false;
    // }

    crow::json::wvalue get_all_json() {
        vector<crow::json::wvalue> list;
        testimonials_node* temp = head;
        while (temp) {
            list.push_back(temp->to_json());
            temp = temp->next;
        }
        return crow::json::wvalue(list);
    }

    void save_testimonials() {
        string path = tourista_utils::get_path() + "testimonials.txt";
        ofstream out(path);
        if (!out) return;
        testimonials_node* temp = head;
        while (temp) {
            out << temp->user_name << "|" << temp->review_text << "|" << temp->rating << "|" << temp->date << endl;
            temp = temp->next;
        }
        out.close();
    }
    
void load_testimonials() {
        string path = tourista_utils::get_path() + "testimonials.txt";
        ifstream in(path);
        if (!in) return;

        // FIX: Clear existing memory to prevent DUPLICATION
        while (head) {
            testimonials_node* temp = head;
            head = head->next;
            delete temp;
        }

        string line;
        while (getline(in, line)) {
            if (line.empty() || line.find_first_not_of(" \t\n\r") == string::npos) continue;

            size_t p1 = line.find('|');
            size_t p2 = line.find('|', p1 + 1);
            size_t p3 = line.find('|', p2 + 1);

            if (p1 != string::npos && p2 != string::npos && p3 != string::npos) {
                string name = line.substr(0, p1);
                string review = line.substr(p1 + 1, p2 - p1 - 1);
                int rate = stoi(line.substr(p2 + 1, p3 - p2 - 1));
                string date = line.substr(p3 + 1);

                // Add to memory list
                testimonials_node* newNode = new testimonials_node(name, review, rate, date);
                newNode->next = head;
                head = newNode;
            }
        }
        in.close();
    }
};
#endif