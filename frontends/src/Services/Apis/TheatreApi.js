const BASE_URL = import.meta.env.VITE_MAIN_BACKEND_URL_THEATRE

export const CreateTheatrere = {
    CreateTheatre:BASE_URL+"/Create-Theatre"
}

export const theatreinfos = {
    tt:BASE_URL+"/Theatre-info"
}

export const AllTheatres = {
    Alltheatres:BASE_URL+"/All-Theatres"
}

export const TheatreCreationRequest = {
    theatrecreationrequest:BASE_URL+"/Theatre-Creation-request"
}

export const DistributeTickets = {
    distributetickets:BASE_URL+"/Distribute-Tickets"
}

export const UpdateTicketTime = {
    updatetickettime:BASE_URL+"/Update-TicketsTime"
}

export const TicketsCreated = {
    ticketscreated:BASE_URL+"/Tickets-Created"
}

export const TheatreDetails = {
    theatredetails:BASE_URL+"/Theatre-Details"
}

export const totalsale = {
    TotalSale:BASE_URL+"/CalculateTotalSale"
}

export const GetShowAllotedDetailss = {
    getshowalloteddetails:BASE_URL+"/Show-Alloted-Details"
}

export const GetAllTicketsDetails = {
    getallticketsdetails:BASE_URL+"/All-Tickets-Details"
}

export const GetSingleShowDetailss = {
    getsingleshowdetails:BASE_URL+"/GetSingleShowDetails"
}
