const USER = require('../../models/user')
const Payment = require('../../models/payment')
const CreateShow = require('../../models/CreateShow')
const Theatre = require('../../models/Theatres');
const genre = require('../../models/genre')
const Theatrestickets = require('../../models/TheatresTicket')
const subgenre = require('../../models/subgenre')
const language = require('../../models/CreateLanguage')
const cast = require('../../models/Createcast')
const hashtags = require('../../models/CreateHashtags')

// const CreateShow = require('../../models/CreateShow')

exports.TicketPurchased = async(req,res)=>{
    try {
        const userId = req.USER.id;

        if(!userId){
            return res.status(400).json({message:"User ID not found", success: false});
        }

        const user = await USER.findOne({_id:userId}).populate('Casttaken')

        if(!user){
            return res.status(404).json({message:"User not found", success: false});
        }

        if(!user.PaymentId || user.PaymentId.length === 0){
            return res.status(200).json({
                success: true,
                message:"No tickets purchased yet",
                count: 0,
                data: []
            });
        }

        const paymentId = await Promise.all(
            user.PaymentId.map(async (payment) => {
                    const datas = await Payment.findOne({ _id: payment });
                    if(!datas) return null;
                    return datas
                })
        )

            const validTickets = paymentId.filter(ticket => ticket !== null);

        if(validTickets.length === 0){
            return res.status(200).json({
                success: true,
                message:"No ticket details found",
                count: 0,
                data: []
            });
        }

            return res.status(200).json({
                message:"Payments found",
                success:true,
                count: validTickets.length,
                data: validTickets
            });

    } catch (error) {
        console.log(error);
        console.log("Error in UserDashboard controller",error.message);
        res.status(500).json({message:"Internal Server Error"});        
    }
}

exports.TicketPurchasedFullDetails = async(req,res)=>{
    try {
        const userId = req.USER.id;

        if(!userId){
            return res.status(400).json({
                success: false,
                message:"User ID not found"
            });
        }

        const user = await USER.findOne({_id:userId}).populate('Casttaken');

        if(!user){
            return res.status(404).json({
                success: false,
                message:"User not found"
            });
        }

        if(!user.PaymentId || user.PaymentId.length === 0){
            return res.status(200).json({
                success: true,
                message: "No tickets purchased yet",
                count: 0,
                data: []
            });
        }

        // Use Promise.all to handle async operations
        const ticketDetails = await Promise.all(
            user.PaymentId.map(async (payment) => {
                try {
                    const datas = await Payment.findOne({ _id: payment });
                    if(!datas) return null;

                    const [showDetails, TheatreDetails] = await Promise.all([
                        CreateShow.findOne({_id: datas.showid}),
                        Theatre.findOne({_id: datas.theatreid})
                    ]);

                    if(!showDetails || !TheatreDetails) return null;

                    // Transform ticket categories for better readability
                    const transformedTickets = datas.ticketCategorey.map(ticket => ({
                        category: ticket.categoryName,
                        quantity: ticket.ticketsPurchased,
                        price: ticket.price,
                        totalAmount: parseInt(ticket.price) * parseInt(ticket.ticketsPurchased)
                    }));

                    return {
                        paymentDetails: {
                            ...datas.toObject(),
                            ticketCategorey: transformedTickets
                        },
                        showDetails: showDetails.toObject(),
                        theatreDetails: TheatreDetails.toObject()
                    };
                } catch (error) {
                    console.log("Error processing payment:", payment, error);
                    return null;
                }
            })
        );

        // Filter out null values
        const validTickets = ticketDetails.filter(ticket => ticket !== null);

        if(validTickets.length === 0){
            return res.status(200).json({
                success: true,
                message:"No ticket details found",
                count: 0,
                data: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket details found successfully",
            count: validTickets.length,
            data: validTickets
        });

    } catch (error) {
        console.log("Error in UserDashboard controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });        
    }
}


exports.BannerMovies = async(req,res)=>{
    try{

        const AllMovies = await CreateShow.find({ uploaded: true, VerifiedByTheAdmin: true })
            .populate("ratingAndReviews")

        if (!AllMovies || AllMovies.length === 0) {
            return res.status(404).json({
                message: "Movies not found",
                success: false
            })
        }

        // 1. Trending - Most liked show
        const MostLiked = [...AllMovies].sort((a, b) => {
            return (b.BannerLiked || 0) - (a.BannerLiked || 0)
        })[0]

        // 2. New - Recently created movie
        const RecentlyCreated = [...AllMovies].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })[0]

        // 3. Coming Soon - Upcoming movies
        const ComingSoon = AllMovies.filter((movie) => {
            return movie.movieStatus === "Upcoming" || movie.movieStatus === "Coming Soon"
        }).sort((a, b) => {
            return new Date(a.releasedate) - new Date(b.releasedate)
        })

        // 4. Top Picks & Blockbuster - 2 movies with most tickets sold
        const TopPicks = [...AllMovies].sort((a, b) => {
            return (b.ticketspurchased?.length || 0) - (a.ticketspurchased?.length || 0)
        }).slice(0, 2)

        // 5. Highest Rated - movie with best average rating that is still playing (not expired)
        const activeMovies = AllMovies.filter(movie => movie.movieStatus === "Released")
        let HighestRated = null
        if (activeMovies.length > 0) {
            let bestAvg = -1
            for (const movie of activeMovies) {
                if (movie.ratingAndReviews && movie.ratingAndReviews.length > 0) {
                    const avg = movie.ratingAndReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / movie.ratingAndReviews.length
                    if (avg > bestAvg) {
                        bestAvg = avg
                        HighestRated = { ...movie.toObject(), averageRating: Math.round(avg * 10) / 10 }
                    }
                }
            }
        }

        return res.status(200).json({
            message: "Banner movies fetched successfully",
            success: true,
            data: {
                mostLiked: MostLiked,
                recentlyCreated: RecentlyCreated,
                comingSoon: ComingSoon,
                topPicks: TopPicks,
                highestRated: HighestRated
            }
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        console.log("Theere is an error in the banner movies code")
    }
}


exports.FIndusingMOvieTags = async(req,res)=>{
    try{
            const {movies} = req.body
            if (!movies || typeof movies !== "string") {
        return res.status(400).json({
            message: "Input is required",
            success: false,
        });
        }

        const Finder = await genre.findOne({genreName:movies})
          if (!Finder) {
      return res.status(404).json({
        message: "No Movies are Present for this tag",
        success: false,
      });
    }

        const MovieFinding = await CreateShow.find({
      genre: Finder._id,
    });

    if (!MovieFinding || MovieFinding.length === 0) {
      return res.status(404).json({
        message: "No Movies found",
        success: false,
      });
    }

       return res.status(200).json({
      message: "Movies fetched successfully",
      success: true,
      data: MovieFinding,
    });
    }catch(error){
        console.log(error)
        console.log(error.message)
        console.log("Theere is an error in the Find movie code")
    }
}



exports.FindWholeMoviesData = async (req,res)=>{
    try{

        const {location,movie,theatre,date} = req.body


       if (!location || !movie || !theatre||!date) {
            return res.status(400).json({
                success: false,
                message: "All input fields are required"
            });
        }

      const finding = await Theatre.findOne({
            locationName: location,
            Theatrename: theatre
        });

          if (!finding) {
            return res.status(404).json({
                success: false,
                message: "Theatre not found in this location"
            });
        }

       const MovieFinding = await CreateShow.findOne({
            title: movie,
             AllotedToTheNumberOfTheatres: finding._id
        });

         if (!MovieFinding) {
            return res.status(404).json({
                success: false,
                message: "Movie not found"
            });
        }


         const mainData = await Theatrestickets.findOne({
            theatreId: finding._id,
            Date: date
        });

        if (!mainData) {
            return res.status(404).json({
                success: false,
                message: "No shows available for this date"
            });
        }

// const data = {
//     ...finding.toObject(),
//     ...MovieFinding.toObject(),
//     ...mainData.toObject()
// };
        return res.status(200).json({
            message:"date send ",
            success:true,
            data: [{
   theatre: finding,
   movie: MovieFinding,
   tickets: mainData
}]

        })


    }catch(error){
        console.log(error)
        console.log(error.message)
        console.log("There is an error in the find whole movie date code ")
    }
}


exports.FindMovieById = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                message: "Movie ID is required",
                success: false
            });
        }

        const movie = await CreateShow.findById(id)
            .populate("genre")
            .populate("SUbGenre")
            .populate("language")
            .populate("castName")
            .populate("hashtags")
            .populate("AllotedToTheNumberOfTheatres")
            .populate("ratingAndReviews");

        if (!movie) {
            return res.status(404).json({
                message: "Movie not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Movie data fetched successfully",
            success: true,
            data: movie
        });

    } catch (error) {
        console.log("Error in FindMovieById:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

exports.PurcahsingData = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        message: "The inputs are required",
        success: false
      });
    }

    const Finding = await CreateShow.findById(id);

    if (!Finding) {
      return res.status(404).json({
        message: "The show is not present",
        success: false
      });
    }

    // ✅ Get all theatres properly
    const theatreIds = Finding.AllotedToTheNumberOfTheatres || [];
    const Theatres = theatreIds.length > 0
      ? await Theatre.find({ _id: { $in: theatreIds } })
      : [];

    // ✅ Extract all ticket IDs from all theatres
    const allTicketIds = Theatres.flatMap(theatre => theatre.ticketCreation || []);

    // ✅ Get all tickets (empty array if none)
    const TicketData = allTicketIds.length > 0
      ? await Theatrestickets.find({ _id: { $in: allTicketIds } })
      : [];

    return res.status(200).json({
      message: "This is the data",
      success: true,
      data: {
        show: Finding,
        Theatres,
        TicketData
      }
    });

  } catch (error) {
    console.log(error);
    console.log(error.message);
    console.log("There is an error in the purchasing data code");

    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};


exports.MostLikedMovies = async (req,res)=>{
    try{
        const page  = parseInt(req.query.page)  || 1
        const limit = parseInt(req.query.limit) || 10
        const skip  = (page - 1) * limit

        const AllMovies = await CreateShow.find({ uploaded: true, VerifiedByTheAdmin: true })
            .populate("genre")
            .populate("ratingAndReviews")

        if(!AllMovies || AllMovies.length === 0){
            return res.status(200).json({
                message:"No movies found",
                success:true,
                data:[]
            })
        }

        const MostLiked = [...AllMovies].sort((a,b)=>{
            return (b.BannerLiked || 0) - (a.BannerLiked || 0)
        })

        const totalCount = MostLiked.length
        const paginated  = MostLiked.slice(skip, skip + limit)

        return res.status(200).json({
            message:"Most liked movies fetched successfully",
            success:true,
            data:paginated,
            pagination:{
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit,
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPrevPage: page > 1
            }
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        console.log("There is an error in the MostLikedMovies code")
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }
}

exports.HighlyRatedMovies = async (req,res)=>{
    try{
        const page  = parseInt(req.query.page)  || 1
        const limit = parseInt(req.query.limit) || 10
        const skip  = (page - 1) * limit

        const AllMovies = await CreateShow.find({ uploaded: true, VerifiedByTheAdmin: true })
            .populate("ratingAndReviews")
            .populate("genre")

        if(!AllMovies || AllMovies.length === 0){
            return res.status(200).json({
                message:"No movies found",
                success:true,
                data:[]
            })
        }

        const Rated = AllMovies.map((movie)=>{
            let averageRating = 0
            if(movie.ratingAndReviews && movie.ratingAndReviews.length > 0){
                const total = movie.ratingAndReviews.reduce((sum,r)=> sum + (r.rating || 0), 0)
                averageRating = Math.round((total / movie.ratingAndReviews.length) * 10) / 10
            }
            return {
                ...movie.toObject(),
                averageRating,
                reviewCount: movie.ratingAndReviews?.length || 0
            }
        })

        const HighlyRated = Rated.sort((a,b)=>{
            if (a.reviewCount === 0 && b.reviewCount === 0) {
                return (b.BannerLiked || 0) - (a.BannerLiked || 0)
            }
            if (a.reviewCount === 0) return 1
            if (b.reviewCount === 0) return -1
            const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0)
            if (ratingDiff !== 0) return ratingDiff
            return b.reviewCount - a.reviewCount
        })

        const totalCount = HighlyRated.length
        const paginated  = HighlyRated.slice(skip, skip + limit)

        return res.status(200).json({
            message:"Highly rated movies fetched successfully",
            success:true,
            data:paginated,
            pagination:{
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit,
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPrevPage: page > 1
            }
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        console.log("There is an error in the HighlyRatedMovies code")
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }
}

exports.RecentlyReleased = async (req,res)=>{
    try{
        const page  = parseInt(req.query.page)  || 1
        const limit = parseInt(req.query.limit) || 10
        const skip  = (page - 1) * limit

        const AllMovies = await CreateShow.find({ uploaded: true, VerifiedByTheAdmin: true, movieStatus: "Released" })
            .populate("genre")
            .populate("ratingAndReviews")

        if(!AllMovies || AllMovies.length === 0){
            return res.status(200).json({
                message:"No movies found",
                success:true,
                data:[]
            })
        }

        const Recent = [...AllMovies].sort((a,b)=>{
            const dateA = a.VerificationTime ? new Date(a.VerificationTime) : new Date(0)
            const dateB = b.VerificationTime ? new Date(b.VerificationTime) : new Date(0)
            return dateB - dateA
        })

        const totalCount = Recent.length
        const paginated  = Recent.slice(skip, skip + limit)

        return res.status(200).json({
            message:"Recently released movies fetched successfully",
            success:true,
            data:paginated,
            pagination:{
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit,
                hasNextPage: page < Math.ceil(totalCount / limit),
                hasPrevPage: page > 1
            }
        })

    }catch(error){
        console.log(error)
        console.log(error.message)
        console.log("There is an error in the RecentlyReleased code")
        return res.status(500).json({
            message:"Internal Server Error",
            success:false
        })
    }
}

exports.ContentBasedAlgorithm = async(req,res) => {
    try {

 const userId = req.USER.id;

//  console.log(userId)

        const user = await USER.findById(userId)
            .populate("UserBannerliked")
            .populate("UserBannerhated");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // console.log("User Data:", user);

       const GenreFinding = await Promise.all(
            user.UserBannerliked.map(async (data) => {
                return await genre.findById(data.genre);
            })
        );
        // console.log(GenreFinding)

if (GenreFinding.length === 0 || !GenreFinding) {
    return res.status(400).json({
        message: "No genre details",
        success: false
    });
}


        // const Genres = []
        // for(let i=0;i<GenreFinding.length;i++){
        //     if(GenreFinding.genreName !== GenreFinding.genreName -1  ){
        //         Genres.push(GenreFinding.genreName)
        //     }
        // }

        
const uniqueGenres = [
    ...new Set(GenreFinding.map(g => g.genreName))
];

        return res.status(200).json({
            message: "This is the user data",
            success: true,
            data: uniqueGenres
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
