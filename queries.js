/*------------------------------- Starter Code -------------------------------*/
import dotnev from "dotenv";
dotnev.config()
import mongoose from "mongoose";
import Customer from "./customers.js";
import promptSync from 'prompt-sync';



const prompt = promptSync();
const username = prompt('What is your name? ');

console.log(`Welcome ${username}`);

let customers = [];

// Function to display the menu
const displayMenu = async () => {
    console.log("Welcome to the CRM");
    console.log("What would you like to do?");
    console.log("  1. Create a customer");
    console.log("  2. View all customers");
    console.log("  3. Update a customer");
    console.log("  4. Delete a customer");
    console.log("  5. Quit");
};

// Function to create a customer
const createCustomer = async () => {
    const name = await prompt("Enter customer name: ");
    const age = await prompt("Enter customer age: ");
    const newCustomer = new Customer({ name, age });
    await newCustomer.save();
    console.log(`Customer ${name} has been created.`);
};

const viewCustomers = async () => {
    const customers = await Customer.find();
    if (customers.length === 0) {
        console.log("No customers available.");
    } else {
        console.log("Customer List:");
        customers.forEach((customer) => {
            console.log(` Name: ${customer.name}, Age: ${customer.age}`);
        });
    }
};

const updateCustomer = async () => {
    console.log("Below is a list of customers:");
    const customers = await Customer.find(); // Retrieve all customers from MongoDB

    customers.forEach((customer) => {
        console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`);
    });

    const customerId = await prompt("Copy and paste the id of the customer you would like to update here: ");

    // Find the customer by id
    const customer = await Customer.findById(customerId);

    if (customer) {
        const newName = await prompt(`What is the customer's new name? (current: ${customer.name}): `);
        const newAge = await prompt(`What is the customer's new age? (current: ${customer.age}): `);

        customer.name = newName
        customer.age = newAge
        await customer.save();

        console.log(`Customer ${customerId} has been updated to: Name: ${customer.name}, Age: ${customer.age}`);
    } else {
        console.log("Invalid customer ID.");
    }
};


const deleteCustomer = async () => {
    const customerIndex = await prompt("Enter customer id to delete: ");
    const customers = await Customer.find();
    if (customerIndex >= 1 && customerIndex <= customers.length) {
        const deletedCustomer = customers[customerIndex - 1];
        await Customer.deleteOne({ _id: deletedCustomer._id });
        console.log(`Customer ${deletedCustomer.name} has been deleted.`);
    } else {
        console.log("Invalid customer id.");
    }
};

const run = async () => {
    let isRunning = true;
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    while (isRunning) {
        await displayMenu();
        const action = await prompt("Number of input to run: ");


        switch (action) {
            case '1':
                await createCustomer();
                break;
            case '2':
                await viewCustomers();
                break;
            case '3':
                await updateCustomer();
                break;
            case '4':
                await deleteCustomer();
                break;
            case '5':
                await mongoose.disconnect();
                console.log("Disconnected from MongoDB");
                process.exit();
                break;
            default:
                console.log("Invalid input. Please choose a valid input.");
        }
    }
};

run();


/*------------------------------ Query Functions -----------------------------*/