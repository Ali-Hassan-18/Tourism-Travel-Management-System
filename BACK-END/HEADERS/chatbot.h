#ifndef CHATBOT_H
#define CHATBOT_H

#include <iostream>
#include <string>
#include <fstream>
#include <cstdlib>
#include <algorithm>
#include <cstdio>
#include "utilities.h"

using namespace std;

class tourista_bot {
private:
    // Aggressive cleaning to ensure no shell-reserved characters remain
    string super_sanitize(string str) {
        string result = "";
        for (char c : str) {
            if (c == '\'') result += " ";   // Remove single quotes entirely to be safe
            else if (c == '\"') result += " "; // Remove double quotes
            else if (c == '&') result += " and "; // Replace ampersands
            else if (c == '(' || c == ')') result += " "; // Remove parentheses
            else if (c == '\n' || c == '\r' || c == '|') result += " "; 
            else result += c;
        }
        return result;
    }

    string get_file_context() {
        string context = "";
        string path = tourista_utils::get_path();
        
        ifstream in(path + "packages.txt");
        if (in) {
            string line;
            while (getline(in, line)) {
                if (line.empty() || line.length() < 10) continue;

                // We need 6 pipes to safely reach the price field
                size_t p[7]; p[0] = -1;
                for(int i = 1; i <= 6; i++) p[i] = line.find('|', p[i-1] + 1);
                
                // Alignment based on packages.h: id|cat|city|title|price|days
                if (p[5] != string::npos) {
                    // city is Field 2 (between pipe 2 and 3)
                    string city  = line.substr(p[2] + 1, p[3] - p[2] - 1);
                    // title is Field 3 (between pipe 3 and 4)
                    string title = line.substr(p[3] + 1, p[4] - p[3] - 1);
                    // price is Field 4 (between pipe 4 and 5)
                    string price = line.substr(p[4] + 1, p[5] - p[4] - 1);
                    
                    context += "Trip: " + title + " in " + city + " is $" + price + ". ";
                }
            }
            in.close();
        }
        return super_sanitize(context);
    }

    string exec(const char* cmd) {
        char buffer[4096];
        string result = "";
        FILE* pipe = _popen(cmd, "r");
        if (!pipe) return "Error: Connection failed.";
        while (fgets(buffer, sizeof buffer, pipe) != NULL) {
            result += buffer;
        }
        _pclose(pipe);
        if (!result.empty()) {
            result.erase(result.find_last_not_of(" \n\r\t") + 1);
            result.erase(0, result.find_first_not_of(" \n\r\t"));
        }
        return result;
    }

public:
    string get_ai_response(string user_query) {
        string safe_query = super_sanitize(user_query);
        string safe_context = get_file_context();
        
        // We move instructions into the PowerShell script to avoid escaping issues
        string command = "powershell -NoProfile -ExecutionPolicy Bypass -Command \""
                         "$context = '" + safe_context + "'; "
                         "$query = '" + safe_query + "'; "
                         "$sys = 'You are a factual Tourista agent. Use ONLY the database provided. Do not invent transport or days. Prices in USD only.'; "
                         "$prompt = $sys + ' Database: ' + $context + ' | User: ' + $query; "
                         "$body = @{model='llama3'; prompt=$prompt; stream=$false} | ConvertTo-Json; "
                         "$res = Invoke-RestMethod -Method Post -Uri 'http://localhost:11434/api/generate' -Body $body -ContentType 'application/json'; "
                         "$res.response\"";

        return exec(command.c_str());
    }
};

#endif