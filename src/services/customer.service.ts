import { customerRepository } from "../repository/customer.repository.js";

export async function getAllCustomers() {
    return await customerRepository.getAllCustomers();
}
