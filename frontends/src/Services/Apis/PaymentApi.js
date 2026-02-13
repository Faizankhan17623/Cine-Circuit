const BASE_URL = import.meta.env.VITE_MAIN_BACKEND_URL_PAYMENT

export const MakePayment = {
    makepayment:BASE_URL+"/Make-Payment"
}

export const Verifypayment = {
    verifypayment:BASE_URL+"/Verify-Payment"
}

export const DownloadTicketdata = {
    downloadticketdata:BASE_URL+"/download/:ticketId"
}
