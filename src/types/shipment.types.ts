export interface ShipmentRow {
    id: string;
    tracking_number: string;
    recipient_name: string;
    recipient_address: string;
    recipient_phone_number: string;
    shipment_type: string;
    weight: number;
    status: string;
    user_id: string;
    created_at: Date;
}

export interface CreateShipmentInput {
    trackingNumber: string;
    recipientName: string;
    recipientAddress: string;
    recipientPhoneNumber: string;
    shipmentType: string;
    weight: number;
    status?: string;
    userId: string;
}

export interface CreateShipmentDTO {
    recipientName: string;
    recipientAddress: string;
    recipientPhoneNumber: string;
    shipmentType: string;
    weight: number;
    userId: string;
}
