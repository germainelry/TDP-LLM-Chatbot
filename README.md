![UOB AI Chatbot](img/UOB-AI-Chatbot.png)

# Cross-Regional Customer Service Chatbot

A multilingual AI Chatbot that incorporates NLP to offer personalised customer service for banking clients across various regions. This chatbot, once deployed, will be able to operate 24/7 and service clients from anywhere around the globe. It is capable of handling matters ranging from routine inquiries to transaction assistance.

## Problem Statement

In today's globalized economy, banks face the challenge of providing consistent, high-quality customer service across multiple regions and languages, while managing the expectations of clients who demand instant, round-the-clock support. Traditional customer service models struggle to meet these demands due to limitations in human resources, operational hours, and language capabilities. This results in delays, communication barriers, and customer dissatisfaction. A multilingual AI chatbot addresses these issues by leveraging natural language processing (NLP) to deliver personalized, efficient, and scalable customer service, ensuring that clients receive timely assistance regardless of their location or language. This solution not only enhances customer experience but also reduces operational costs and improves service availability.

## Project Description

The Cross-Regional Customer Service Chatbot will be hosted on Telegram to provide personalized banking support to clients worldwide. Developed using Python, Flask, and React, the chatbot is accessible 24/7, ensuring that customers receive immediate, high-quality service regardless of their location or time zone.

In addition to its core functionality, a comprehensive dashboard has been developed to monitor and log the chatbot's performance and overall customer experience. This dashboard enables real-time insights into customer interactions, helping banks optimize service delivery and continually improve the chatbot's effectiveness.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Features](#features)
  - [Multilingual Support](#multilingual-support)
  - [Personalized Customer Service](#personalized-customer-service)
  - [Dashboard for Monitoring](#dashboard-for-monitoring)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
- [Usage](#usage)
  - [Accessing the Chatbot on Telegram](#accessing-the-chatbot-on-telegram)
  - [Using the Dashboard](#using-the-dashboard)
- [Authors](#authors)
- [License](#license)
- [Contact](#contact)

## Technology Stack

- **[Python](https://www.python.org)**: Chosen for its simplicity and powerful libraries, making it ideal for rapid development and handling complex computations.
- **[Flask API](https://flask.palletsprojects.com/en/latest/api/)**: Selected for its lightweight nature and flexibility, providing a simple yet powerful framework for building RESTful APIs.
- **[Ollama LLM](https://ollama.com)**: Utilized for its advanced natural language processing capabilities, enabling sophisticated language understanding and generation.
- **[ReactJS](https://react.dev)**: Preferred for its efficient rendering and component-based architecture, which simplifies the development of dynamic and interactive user interfaces.
- **[Bootstrap](https://getbootstrap.com)**: Used for its responsive design framework, allowing quick and easy styling of the application with a consistent look and feel.

| Technology | Purpose              |
| ---------- | -------------------- |
| **React**  | Frontend development |
| **Flask**  | Backend development  |

## Project Overview

The following table highlights some of the key features in our project. While some of the following features have not been implemented yet, they do not impact the integrity of the existing program.

| Feature                 | Description                               | Status           |
| ----------------------- | ----------------------------------------- | ---------------- |
| **User Authentication** | Handles user login and registration       | Future Iteration |
| **Dashboard**           | Displays user data and analytics          | Completed        |
| **API Integration**     | Connects to third-party services          | Completed        |
| **Notification System** | Sends notifications based on user actions | Future Iteration |

## Features

### Multilingual Support

The AI-powered chatbot is designed to provide seamless and efficient communication across a wide range of languages, ensuring inclusivity and accessibility for users from different linguistic backgrounds.

#### Language Detection

- The chatbot automatically detects the language in which a user is communicating. This is achieved using natural language processing (NLP) algorithms that analyze the input text and identify the language.

#### Language Switching

- Users can switch languages during a conversation without restarting the session. The chatbot seamlessly transitions to the new language, maintaining the context of the conversation.
- This is particularly useful in multilingual regions or for users who are comfortable using multiple languages.

#### Fallback Mechanism

In cases where the chatbot encounters text in a language that is not supported or poorly understood, it will provide a fallback response in a default language (e.g., English), and suggest ways for the user to continue the conversation (e.g., using a different language or contacting support).

However, we do acknowledge that inaccurate response and language outputs may occur at times due to limited model training.

## Dashboard for Monitoring

### General Analytics

| Feature                           | Description                                                                                              | Purpose                                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Conversation History**          | Provides access to past conversations between customers and the chatbot.                                 | Enables agents to review previous interactions for context and follow-up.                   |
| **Multilingual Interaction Logs** | Logs and categorizes conversations based on the language used by the customer.                           | Facilitates analysis of language preferences and ensures multilingual support is effective. |
| **Data Export**                   | Provides options to export conversation logs and performance data in various formats (CSV, Excel, etc.). | Facilitates external analysis and reporting.                                                |
| **Alerts & Notifications**        | Sends real-time alerts for specific triggers (e.g., high-priority customers, unresolved issues).         | Ensures timely response to critical situations.                                             |

### Performance analytics

| Feature                             | Description                                                                        | Purpose                                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Conversation-Resolution Metrics** | Displays ongoing customer conversations in real-time.                              | Allows customer service agents to monitor and intervene if needed.                        |
| **Sentiment Analysis**              | Analyzes the sentiment of customer messages (positive, neutral, negative).         | Helps agents understand customer emotions and prioritize responses.                       |
| **Performance Metrics**             | Shows key performance indicators (KPIs) such as response time and resolution rate. | Allows management to track chatbot efficiency and customer satisfaction.                  |
| **User Feedback Collection**        | Displays customer feedback and ratings on chatbot interactions.                    | Helps in evaluating customer satisfaction and refining the chatbot experience.            |
| **Issue Escalation Tracking**       | Tracks cases where conversations were escalated to human agents.                   | Monitors the chatbot's ability to handle queries and when human intervention is required. |

## Installation

### Prerequisites

### Setup Instructions

## Usage

### Accessing the Chatbot on Telegram

### Using the Dashboard

## Authors

- [@KevinTan1203](https://github.com/KevinTan1203)
- [@user2](https://github.com/)
- [@user3](https://github.com/)
- [@user4](https://github.com/)
- [@user5](https://github.com/)
