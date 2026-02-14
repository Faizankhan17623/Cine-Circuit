const BASE_URL = import.meta.env.VITE_MAIN_BACKEND_URL_PAYMENT

export const CreatePayment = {
    makepayment:BASE_URL+"/Make-Payment"
}

export const paymentVerification = {
    verifypayment:BASE_URL+"/Verify-Payment"
}

export const TicketDetails = {
    downloadticketdata:BASE_URL+"/download/:ticketId"
}
