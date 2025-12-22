#ifndef CHATBOT_H
#define CHATBOT_H

#include <iostream>
#include <string>
#include <fstream>
#include <cstdlib>
#include <algorithm>
#include "utilities.h" // Essential for centralized path logic

using namespace std;

class tourista_bot {
private:
    // Helper to escape single quotes so PowerShell command doesn't break
    string escape_quotes(string str) {
        string result = "";
        for (char c : str) {
            if (c == '\'') {
                result += "''"; // PowerShell handles apostrophes as double single-quotes
            } else {
                result += c;
            }
        }
        return result;
    }

    // Fetches context from data files using the centralized path
    string get_file_context() {
        string context = "Current Tourista Database Info: ";
        string path = tourista_utils::get_path();
        string files[] = {"cities.txt", "packages.txt"}; // Relevant files for recommendations
        
        for (const string& f : files) {
            ifstream in(path + f);
            if (!in) continue;
            string line;
            while (getline(in, line)) {
                // Replace delimiters with spaces for natural language understanding
                replace(line.begin(), line.end(), '|', ' ');
                context += line + ". ";
            }
            in.close();
        }
        return context;
    }

public:
    void chat() {
        string user_query;
        cout << "\n[Tourista AI]: Connecting to Llama 3 via local RAG bridge...\n";
        cout << "I have read your database. Ask me anything! (type 'exit' to quit)\n";
        
        while (true) {
            cout << "\nYou: ";
            getline(cin, user_query);
            if (tourista_utils::to_lower(user_query) == "exit") break;

            // Step 1: Sanitize and fetch context
            string safe_query = escape_quotes(user_query);
            string context = escape_quotes(get_file_context());
            
            // Step 2: Construct a Professional Prompt
            string system_role = "You are a professional travel agent for Tourista Management System. ";
            string instruction = "Use the following context to answer the user query. If the data is not there, say you can customize a plan. ";
            string full_prompt = system_role + instruction + "Context Data: " + context + " | User Question: " + safe_query;

            // Step 3: PowerShell Bridge to Ollama API
            // This command sends the prompt to Llama and extracts only the 'response' field from the JSON
            string command = "powershell -command \"$res = Invoke-RestMethod -Method Post -Uri http://localhost:11434/api/generate -Body (ConvertTo-Json @{model='llama3'; prompt='" + full_prompt + "'; stream=$false}); $res.response\"";

            cout << "[Tourista AI]: Consulting database...\n";
            system(command.c_str()); 
            cout << endl;
        }
    }
};

#endif