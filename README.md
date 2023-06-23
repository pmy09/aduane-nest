# ADUANE

## Description

Aduane is a web application that allows users to manage restaurants, menus, and orders. It provides features for creating restaurants, adding menu items, placing orders, and managing user accounts.


## Features

User Authentication: Users can sign up and log in. Authentication is required to access protected routes.

Restaurant Management: Users with admin and chef privileges can create restaurants and manage restaurant details.

Menu Management: Chefs can add, edit, and delete menu items for each restaurant.

Order Placement: Users can place orders by selecting items from the menu.

User Management: Admin users can view and manage user accounts.



## Technologies Used

Node.js

Nest.js (backend framework)

TypeORM (object-relational mapping)

PostgreSQL (database)

TypeScript



## Installation

Clone the repository:
```bash
$ git clone https://github.com/pmy09/aduane-nest.git
```

Install the dependencies:
```bash
$ npm install
```

Set up the database:

Install and configure PostgreSQL on your machine.

Create a new database for the project.

Update the database connection settings in the .env file in the root following the .env.example structure.


Build the project:
```bash
$ npm run build
```

Start the application:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Open your web browser and access the application at http://localhost:3000.


## Usage

Sign up for a new account or log in with your existing credentials.

Create a restaurant by providing the required details.

With chef privileges add menu items to the restaurant by specifying the name, description, image, price and restaurantId.

Place orders by selecting items from the menu.

View and manage user accounts if you have admin privileges.



## Note On Admin And Chef Roles

Sign up as admin and chef requires adding the intended role ("role": "admin") to the sign up data


## Contributing

Contributions to the Aduane Foood Ordering System are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.


## Contact

For any inquiries or support, please contact patrick.markin-yankah@amalitech.com.

