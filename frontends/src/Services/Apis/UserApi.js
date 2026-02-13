const BASE_URL = import.meta.env.VITE_MAIN_BACKEND_URL_USER

export const CreateUser ={
    createuser:BASE_URL+"/Create-User"
}

export const SendOtp = {
    createotp:BASE_URL+"/Create-Otp"
}

export const Login ={
    login:BASE_URL+"/Login"
}
export const AllDetails = {
    GetAllDetails: BASE_URL + "/Get-All-UserDetails",
    FindUserNames: BASE_URL + "/Find-UserNames",
    FindloginEmail: BASE_URL + "/Find-Login-Email",
    FinduserEmail: BASE_URL + "/Find-creation-Email",
    FindNumber: BASE_URL + "/Find-Number"
}

export const UpdatePersonalDetails = {
    UpdateUsername:BASE_URL+"/Update-userName",
    UpdatePassword:BASE_URL+"/Update-Password",
    UpdateImage:BASE_URL+"/Update-Image",
    UpdateNumber:BASE_URL+"/Update-Number",
    CurrentUserDetails:BASE_URL+"/Current-UserDetails"
}


export const ResetPassword = {
    LinkSend:BASE_URL+"/Send-Link",
    Resetpassword:BASE_URL+"/Change-Password"
}

export const GetAllShows = {
    AllShows:BASE_URL+"/Shows"
}

export const SpecificShow = {
    specificshow:BASE_URL+"/Specific-Show"
}

export const Comment = {
    Comments:BASE_URL+"/Comment-Banner",
    GetAllComment:BASE_URL+"/Get-Comment"
}

export const PersonalChoice = {
    LikeBanner:BASE_URL+"/Like-Banner",
    DislikeBanner:BASE_URL+"/Dislike-Banner",
}

export const SendMessage = {
    SendMessages:BASE_URL+"/Send-Message",
    UpdateMessage:BASE_URL+"/Update-Message",
    GetAllMessages:BASE_URL+"/Get-AllMessages",
}

export const TicketData = {
    TicketPurchase:BASE_URL+"/Ticket-Purchased",
    TicketPurchasedFullDetail:BASE_URL+"/Ticket-Purchased-FullDetails"
}

export const Ratings = {
    CreateRating:BASE_URL+"/createRating",
    GetAverageRating:BASE_URL+"/getAverageRating",
    GetAllRatingReview:BASE_URL+"/getReviews",
    banner :BASE_URL+"/Banner",
    finder :BASE_URL+"/Finder"
}
