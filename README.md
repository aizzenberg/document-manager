# DocumentManager

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.2.

## Introduction

I would like to thank you for this interesting test assignment. I found the proposed task very interesting, especially the degree of freedom that was provided.

Throughout the development process, I adhered to the widely accepted principles of “clean code” and aimed to create a highly understandable and easily scalable solution that is also easy to maintain. My goal was not just to meet all the formal requirements but also to showcase my approach to design and development.

I approached this application as if it were a real-world project with the potential for future growth. Therefore, I made several decisions to enhance scalability (though I understand this might seem like premature optimization in the context of a test assignment).

My approach to solving the problem was as follows:

1.  **Separation of role-specific functionality into distinct components.** I opted for a single, shared presentation component (`DocumentListComponent`) used by two container components (`UserDashboardComponent` and `ReviewerDashboardComponent`), each determining the available functionality based on the user's role.
2.  **Utilizing inheritance to abstract common logic into base abstract classes** (`BaseDialogComponent`, `BaseDashboardComponent`).
3.  **Aiming to separate the management of asynchronous flows by using both Signal and Observable APIs.** I primarily used Observables for lower-level logic (such as in services) and implemented Signals as a facade for the components to simplify state management.
4.  **Choosing to implement the “Command” pattern for handling document actions**, encapsulating the logic of each individual action within its own class that implements a common interface (`DocumentCommand`).

## Project Setup and Instructions

This section provides instructions on how to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version = ^18.19.1 || ^20.11.1 || ^22.0.0)
- [npm](https://www.npmjs.com/) (version = ^8.0.0 || ^10.0.0) 
- [Git](https://git-scm.com/) (for cloning the repository)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/aizzenberg/document-manager.git
    ```

2.  **Install dependencies:**

    Using npm:

    ```bash
    npm install
    ```
