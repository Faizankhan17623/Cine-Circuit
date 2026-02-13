const BASE_URL = import.meta.env.VITE_MAIN_BACKEND_URL_SHOW

export const tags = {
    CreateTags:BASE_URL+"/Create-tags",
    UpdateTagsname:BASE_URL+"/Update-tags",
    DeleteTagsname:BASE_URL+"/Delete-tags",
    GetAlltags:BASE_URL+"/Get-Alltags",
    SearchTags:BASE_URL+"/Search-tags"
}


export const language = {
    GetLanguage:BASE_URL+"/Get-AllLanguages",
    FindSingleLanguage:BASE_URL+"/Find-Singlelanguage"
}

export const cast = {
    CreateCast:BASE_URL+"/Create-cast",
    updateCastname:BASE_URL+"/Update-castName",
    updatecastimage:BASE_URL+"/Update-castImage",
    deletecast:BASE_URL+"/Delete-cast",
    getwholecastlist:BASE_URL+"/Get-WholeCast",
    FindSingleCast:BASE_URL+"/Find-SingleCast"
}

export const show = { 
    CreateShow:BASE_URL+"/Create-Show",
    UpdateShowtitle:BASE_URL+"/Update-ShowTitle",
    UpdateShowtagline:BASE_URL+"/Update-TagLine",
    UpdateTitleImage:BASE_URL+"/Update-TitleImage",
    UpdateTitleTrailer:BASE_URL+"/Update-TitleTrailer",
    deleteShow:BASE_URL+"/delete-show",
    DeleteAllShow:BASE_URL+"/delete-Allshow"
}

export const Uploading = {
    Upload:BASE_URL+"/Upload",
}

export const Genres = {
    genre : BASE_URL+"/genre"
}

export const SUBGENRE = {
    subgenre :BASE_URL+"/sub-genre"
}


export const Bothdate={
    VerifiedDateBoth:BASE_URL+"/Both-Verified_data"
}