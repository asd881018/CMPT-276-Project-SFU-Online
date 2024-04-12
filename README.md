# SFU Online

**Project Name:** SFU Online

## Abstract
Due to the Covid-19 pandemic, educational institutions have moved to online learning, limiting student interaction. SFU Online is a web application designed to connect SFU students, professors, and teaching assistants virtually, compensating for the lack of physical campus interaction. This platform facilitates communication through discussion boards, chat rooms, and group channels, making the online learning experience more interactive and supportive.

## Customer
The primary users of SFU Online are:
- **SFU Students:** Especially new students who have missed out on traditional campus experiences.
- **SFU Professors and Teaching Assistants:** To facilitate seamless communication with students.
- **Tutors:** Offering another avenue to assist students in their studies.

## Competitive Analysis
SFU Online aims to stand out by being an exclusive platform for the SFU community, unlike broader platforms like Discord, Slack, or the educational tool Canvas. Key differentiators include:
- **Exclusivity:** Tailored specifically for interaction within the SFU community.
- **Integration:** Enables direct communication with faculty, unlike platforms like Canvas which primarily focus on course management.
- **Functionality:** Provides the ability to create and manage channels and chat rooms specifically for academic and social interaction.

## User Stories
- **Registering:** As a new user, I want to create a new account to access SFU Online content.
- **Login:** As a newly registered user, I want to sign in to my account to access my dashboard, messages, and groups.
- **Messaging:** As a student, I want to ask questions to my professors and TAs to clarify doubts regarding homework or projects.
- **Channel Management:** As a user, I want to find or create a channel to discuss topics with other users in the same channel.

## Implemented Features
- **Login and Registration Form:** Secure access to user accounts.
- **Messaging Interface:** Direct and group messaging capabilities.
- **Group Channels:** Dedicated spaces for specific topics or courses.
- **Dashboard:** Personalized user interface to access all features.

## Features Planned
- **Database Integration:** Hosting Postgres on Heroku for robust data management.
- **Code Refactoring:** Improving code quality and maintainability.
- **Unified Database Access:** Ensuring all features interact seamlessly with the central database.
- **Video Features:** Incorporating real-time video interactions.
- **UI Updates:** Enhancing the user interface for better usability and aesthetics.

## Instructions to Run Code
To set up and run SFU Online locally:
```bash
cd into project/SFUO
node app.js
