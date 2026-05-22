import { z } from "zod";

export const createShipmentBodySchema = z.object({
    recipientName: z.string({ message: "Recipient name is required" })
        .trim()
        .min(1, "Recipient name is required"),
    recipientAddress: z.string({ message: "Recipient address is required" })
        .trim()
        .min(1, "Recipient address is required"),
    recipientPhoneNumber: z.string({ message: "Recipient phone number is required" })
        .trim()
        .min(1, "Recipient phone number is required"),
    shipmentType: z.string({ message: "Shipment type is required" })
        .trim()
        .min(1, "Shipment type is required"),
    weight: z.preprocess(
        (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
        z.number({ message: "Weight must be a number" }).positive("Weight must be greater than zero")
    ),
});

export const updateShipmentStatusParamsSchema = z.object({
    id: z.string({ message: "A valid shipment ID string is required in the URL path." })
        .trim()
        .min(1, "A valid shipment ID string is required in the URL path."),
});

export const updateShipmentStatusBodySchema = z.object({
    status: z.string({ message: "A valid status string is required in the request body." })
        .trim()
        .min(1, "A valid status string is required in the request body."),
});

export const searchShipmentQuerySchema = z.object({
    tracking: z.string({ message: "A valid tracking number is required" })
        .trim()
        .min(1, "A valid tracking number is required"),
});
