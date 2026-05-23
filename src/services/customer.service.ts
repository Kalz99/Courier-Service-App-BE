import { customerRepository } from "../repository/customer.repository.js";
import { AppError } from "../utils/errors.js";
import type { CustomerDbRow } from "../repository/customer.repository.js";


export async function getAllCustomers(): Promise<CustomerDbRow[]> {
    const customers = await customerRepository.getAllCustomers();
    if (!customers) {
        throw new AppError("Failed to retrieve customers from database", 500);
    }
    return customers;
}


export async function getTopCustomers(): Promise<any[]> {
    const topCustomers = await customerRepository.getTopCustomers();
    if (!topCustomers) {
        throw new AppError("Failed to retrieve top customers from database", 500);
    }
    return topCustomers;
}
