const BASE_URL = import.meta.env.VITE_MAIN_BACKEND_URL_ORG

export const CreateOrgainezer = {
    createorgainezer:BASE_URL+"/Create-Orgainezer",
    orgainezerlogin:BASE_URL+"/Orgainezer-login",
}

export const Ticket = {
    CreateTicket:BASE_URL+"/Create-Ticket"
}

export const AllotTheatre = {
    Allotment:BASE_URL+"/Allot-Theatre",
}


export const GetAllSHowsDetails = {
    Getallshowsdetails:BASE_URL+"/All-Shows",
    notuploaded:BASE_URL+"/not-uploaded",
    verifiedNotUploaded:BASE_URL+"/verified-not-uploaded"
}

export const GetAllTheatreDetails = {
    Getalltheatredetails:BASE_URL+"/Get-All-Theatre-Details",
    ticketdetails:BASE_URL+"/Ticket-Details",
    AllDetails:BASE_URL+"/All-Ticket-Details"
}

export const orgainezerdata = {
    OrgainezerData:BASE_URL + "/Org-Data",
    DirectorFresher:BASE_URL + "/Dir-Fresh",
    DirectorExperience:BASE_URL + "/Dir-Experience",
    ProducerFresher:BASE_URL + "/Pro-Fresh",
    ProducerExperience:BASE_URL + "/Pro-Expe",
    GetMyOrgData: BASE_URL + "/My-Org-Data"
}