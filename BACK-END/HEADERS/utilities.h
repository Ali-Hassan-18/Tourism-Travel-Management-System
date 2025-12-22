#ifndef UTILITIES_H
#define UTILITIES_H

#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

class tourista_utils {
public:
    // 1. FILE SYSTEM: Centralized Path Management
    static string get_path() {
        return "DATA/"; 
    }

    // 2. SECURITY: Email Validation
    static bool is_valid_email(string email) {
        size_t at_pos = email.find('@');
        size_t dot_pos = email.find(".com");
        return (at_pos != string::npos && dot_pos != string::npos && dot_pos > at_pos);
    }

    // 3. UTILITY: Case-Insensitive String Conversion
    static string to_lower(string data) {
        string lower_data = data;
        transform(lower_data.begin(), lower_data.end(), lower_data.begin(), ::tolower);
        return lower_data;
    }
};

#endif