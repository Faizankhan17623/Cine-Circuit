const BASE_URL = import.meta.env.VITE_MAIN_BACKEND_URL_ADMIN


export const Orgaineser = { 
    Org_verification:BASE_URL+"/Org-Verification",
    Org_delete:BASE_URL+"/delete-Org",
    Org_deleteAll:BASE_URL+"/delete-allOrg",
    Org_details:BASE_URL+"/Get-All-Orgs",
    Org_detailing:BASE_URL+"/Orgainezer-Details"
}

export const Genre = {
    CreateGenre:BASE_URL+"/Create-Genre",
    UpdateGenre:BASE_URL+"/Update-Genre",
    DeleteGenre:BASE_URL+"/delete-Genre",
    DeleteAllGenre:BASE_URL+"/remove-AllGenre",
    GetAllGenres:BASE_URL+"/Get-AllGenre",
}


export const SubGenre = {
    CreateSubgenre:BASE_URL+"/Create-SubGenre",
    UpdateSubGenre:BASE_URL+"/Update-SubGenre",
    deletesubgenre:BASE_URL+"/delete-SubGenre",
    deleteAllsubGenres:BASE_URL+"/remove-All-SubGenre",
    getAllgenre:BASE_URL+"/Get-AllSubGenre",
}


export const Theatre = {
    TheatreRequest:BASE_URL+"/Theatre-Request",
    GetAllTheatres:BASE_URL+"/Get-AllTheatres",
    TheatreFormData:BASE_URL+"/Theatre-FormData",
}


export const ShowVerification = {
    VerifyShow:BASE_URL+"/Verify-Show",
    UnverifiedShows:BASE_URL+"/Unverified-Shows",
    VerifiedShows:BASE_URL+"/Verified-Shows",
    AllShows:BASE_URL+"/All-Shows",
}


export const Language = { 
    CreateLanguage:BASE_URL+"/Create-Language",
    UpdateLanguage:BASE_URL+"/Update-Language",
    deleteLanguage:BASE_URL+"/delete-Language",
    deleteallanguage:BASE_URL+"/delete-AllLanguage",
    Getalllanguage:BASE_URL+"/All-Languages",
    GetSingleLanguage:BASE_URL+"/Single-Languages",
}


export const OragineserRequest = {
    OrgaineserRequest:BASE_URL+"/Orgaineser-Request"
}


export const TheatreRequest = { 
    TheatreRequest:BASE_URL+"/Theatre-Request"
}


export const VerifiedUsers = {
    VerifiedUsers:BASE_URL+"/Verified-Users"
}


export const UnverifiedUsers = {
    UnverifiedUsers:BASE_URL+"/Unverified-Users"
}

export const VerifiedOrgainesers = {
    VerifiedOrgainesers:BASE_URL+"/Verified-Orgainesers"
}

export const UnverifiedOrgainesers = {
    UnverifiedOrgainesers:BASE_URL+"/Unverified-Orgainesers"
}

export const VerifiedTheatres = {
    VerifiedTheatres:BASE_URL+"/Verified-Theatres"
}

export const UnverifiedTheatres = {
    UnverifiedTheatres:BASE_URL+"/Unverified-Theatres"
}

export const DeleteComment={
    deleteComment:BASE_URL+"/delete-Comment"
}

export const TheatreVerification = {
    Verify_Theatres:BASE_URL+"/Verify-Theatres"
}