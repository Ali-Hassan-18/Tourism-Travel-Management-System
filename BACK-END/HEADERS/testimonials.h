#ifndef TESTIMONIALS_H
#define TESTIMONIALS_H

#include <iostream>
#include <string>
#include <fstream>
#include "utilities.h" // Essential for centralized path logic

using namespace std;

// Node for a single user testimonial
struct testimonial_node {
    string user_name;
    string review_text;
    int rating; // 1 to 5 stars
    testimonial_node* next;

    testimonial_node(string n, string r, int rt) 
        : user_name(n), review_text(r), rating(rt), next(nullptr) {}
};

class testimonial_manager {
private:
    testimonial_node* head;

public:
    testimonial_manager() : head(nullptr) {}

    // Adds a new review (Singly Linked List: Insertion at Head for Latest-First)
    void add_testimonial(string name, string review, int rating) {
        testimonial_node* new_node = new testimonial_node(name, review, rating);
        new_node->next = head; 
        head = new_node;
    }

    // Displays reviews for the landing page simulation
    void display_landing_page_reviews() {
        if (!head) {
            cout << "\n[System] No reviews yet. Be the first to share your experience!\n";
            return;
        }
        testimonial_node* temp = head;
        cout << "\n--- WHAT OUR TRAVELERS SAY ---\n";
        while (temp) {
            cout << "\"" << temp->review_text << "\"\n";
            cout << "- " << temp->user_name << " (" << temp->rating << "/5 Stars)\n";
            cout << "------------------------------\n";
            temp = temp->next;
        }
    }

    // --- PERSISTENCE LOGIC (Updated for Centralized Path) ---

    void save_testimonials() {
        string path = tourista_utils::get_path() + "testimonials.txt";
        ofstream out(path);
        
        if (!out) {
            cout << "[Error] Could not save testimonials. Path: " << path << " not found.\n";
            return;
        }

        testimonial_node* temp = head;
        while (temp) {
            out << temp->user_name << "|" << temp->review_text << "|" << temp->rating << endl;
            temp = temp->next;
        }
        out.close();
    }

    void load_testimonials() {
        string path = tourista_utils::get_path() + "testimonials.txt";
        ifstream in(path);
        
        if (!in) return; // Silent return if no reviews exist yet
        
        string line;
        while (getline(in, line)) {
            size_t p1 = line.find('|');
            size_t p2 = line.find('|', p1 + 1);
            
            if (p1 != string::npos && p2 != string::npos) {
                string n = line.substr(0, p1);
                string r = line.substr(p1 + 1, p2 - p1 - 1);
                int rt = stoi(line.substr(p2 + 1));
                
                // Add to list without re-saving to file
                testimonial_node* new_node = new testimonial_node(n, r, rt);
                new_node->next = head;
                head = new_node;
            }
        }
        in.close();
    }
};

#endif