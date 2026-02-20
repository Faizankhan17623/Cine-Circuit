const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const Show = require('./models/CreateShow');
const Genre = require('./models/genre');
const Languages = require('./models/CreateLanguage');
const Cast = require('./models/Createcast');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cinecircuit');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Show.deleteMany({});
    await Cast.deleteMany({});
    await Languages.deleteMany({});
    await Genre.deleteMany({});

    console.log('Cleared existing data...');

    // Create Genres
    const genres = await Genre.insertMany([
      { genreName: 'ACTION' },
      { genreName: 'DRAMA' },
      { genreName: 'COMEDY' },
      { genreName: 'HORROR' },
      { genreName: 'SCI-FI' },
      { genreName: 'THRILLER' },
      { genreName: 'ROMANCE' },
    ]);
    console.log('Genres created');

    // Create Languages
    const languages = await Languages.insertMany([
      { name: 'Hindi' },
      { name: 'English' },
      { name: 'Tamil' },
      { name: 'Telugu' },
      { name: 'Kannada' },
    ]);
    console.log('Languages created');

    // Create Cast
    const casts = await Cast.insertMany([
      { name: 'Shah Rukh Khan', images: 'https://example.com/srk.jpg' },
      { name: 'Deepika Padukone', images: 'https://example.com/deepika.jpg' },
      { name: 'Ranbir Kapoor', images: 'https://example.com/ranbir.jpg' },
      { name: 'Vijay', images: 'https://example.com/vijay.jpg' },
      { name: 'Allu Arjun', images: 'https://example.com/alluarjun.jpg' },
      { name: 'Hrithik Roshan', images: 'https://example.com/hrithik.jpg' },
      { name: 'Cillian Murphy', images: 'https://example.com/cillian.jpg' },
      { name: 'Margot Robbie', images: 'https://example.com/margot.jpg' },
      { name: 'Timothee Chalamet', images: 'https://example.com/tim.jpg' },
      { name: 'Christopher Nolan', images: 'https://example.com/nolan.jpg' },
      { name: 'Rajkumar Hirani', images: 'https://example.com/hirani.jpg' },
    ]);
    console.log('Cast created');

    // Helper to get ObjectId by name
    const getGenreId = (name) => genres.find(g => g.genreName === name)?._id;
    const getLanguageId = (name) => languages.find(l => l.name === name)?._id;
    const getCastIds = (names) => names.map(n => casts.find(c => c.name === n)?._id).filter(Boolean);

    // Create Shows
    const shows = await Show.insertMany([
      {
        title: "Dhoom 4",
        tagline: "The Fire Within",
        releasedate: "2025-12-25",
        genre: getGenreId('ACTION'),
        language: [getLanguageId('Hindi')],
        TotalDuration: "175",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/dhoom4.jpg",
        trailerurl: "https://www.youtube.com/watch?v=dhoom4",
        showType: "Theatre",
        createdAt: "2025-01-15",
        castName: getCastIds(["Hrithik Roshan", "Deepika Padukone"]),
        uploaded: true,
        uploadingTime: "2025-01-15T10:30:00Z",
        movieStatus: "Released",
        VerifiedByTheAdmin: true,
        directorname: ["Sanjay Gadhvi"],
        producername: ["Yash Raj Films"],
        writersname: ["Vijay Kumar"],
        totalbudget: "350 Crores",
        movieDuration: "175",
        BannerLiked: 15420,
        BannerDisLiked: 230
      },
      {
        title: "Pushpa 3",
        tagline: "The Rule Continues",
        releasedate: "2025-10-15",
        genre: getGenreId('ACTION'),
        language: [getLanguageId('Telugu')],
        TotalDuration: "180",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/pushpa3.jpg",
        trailerurl: "https://www.youtube.com/watch?v=pushpa3",
        showType: "Theatre",
        createdAt: "2025-02-20",
        castName: getCastIds(["Allu Arjun"]),
        uploaded: true,
        uploadingTime: "2025-02-20T14:00:00Z",
        movieStatus: "Released",
        VerifiedByTheAdmin: true,
        directorname: ["Sukumar"],
        producername: ["Mythri Movie Makers"],
        writersname: ["Sukumar"],
        totalbudget: "400 Crores",
        movieDuration: "180",
        BannerLiked: 28500,
        BannerDisLiked: 450
      },
      {
        title: "KGF Chapter 4",
        tagline: "The Empire Rises",
        releasedate: "2026-08-15",
        genre: getGenreId('ACTION'),
        language: [getLanguageId('Kannada')],
        TotalDuration: "185",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/kgf4.jpg",
        trailerurl: "https://www.youtube.com/watch?v=kgf4",
        showType: "Theatre",
        createdAt: "2025-05-10",
        castName: getCastIds(["Hrithik Roshan"]),
        uploaded: true,
        uploadingTime: "2025-05-10T09:15:00Z",
        movieStatus: "Upcoming",
        VerifiedByTheAdmin: true,
        directorname: ["Prashanth Neel"],
        producername: ["Vijay Kiragandur"],
        writersname: ["Prashanth Neel"],
        totalbudget: "500 Crores",
        movieDuration: "185",
        BannerLiked: 42000,
        BannerDisLiked: 300
      },
      {
        title: "Dunki",
        tagline: "Home is Where the Heart Is",
        releasedate: "2024-12-12",
        genre: getGenreId('DRAMA'),
        language: [getLanguageId('Hindi')],
        TotalDuration: "165",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/dunki.jpg",
        trailerurl: "https://www.youtube.com/watch?v=dunki",
        showType: "Theatre",
        createdAt: "2024-06-01",
        castName: getCastIds(["Shah Rukh Khan"]),
        uploaded: true,
        uploadingTime: "2024-06-01T11:00:00Z",
        movieStatus: "Released",
        VerifiedByTheAdmin: true,
        directorname: ["Rajkumar Hirani"],
        producername: ["Red Chillies Entertainment"],
        writersname: ["Rajkumar Hirani"],
        totalbudget: "200 Crores",
        movieDuration: "165",
        BannerLiked: 18200,
        BannerDisLiked: 890
      },
      {
        title: "Animal",
        tagline: "Family Comes First",
        releasedate: "2023-12-01",
        genre: getGenreId('ACTION'),
        language: [getLanguageId('Hindi')],
        TotalDuration: "201",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/animal.jpg",
        trailerurl: "https://www.youtube.com/watch?v=animal",
        showType: "Theatre",
        createdAt: "2023-08-15",
        castName: getCastIds(["Ranbir Kapoor"]),
        uploaded: true,
        uploadingTime: "2023-08-15T16:30:00Z",
        movieStatus: "Released",
        VerifiedByTheAdmin: true,
        directorname: ["Sandeep Reddy Vanga"],
        producername: ["T-Series"],
        writersname: ["Sandeep Reddy Vanga"],
        totalbudget: "100 Crores",
        movieDuration: "201",
        BannerLiked: 35000,
        BannerDisLiked: 2100
      },
      {
        title: "Jawan",
        tagline: "Anti-Hero Era Begins",
        releasedate: "2023-09-07",
        genre: getGenreId('ACTION'),
        language: [getLanguageId('Hindi')],
        TotalDuration: "170",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/jawan.jpg",
        trailerurl: "https://www.youtube.com/watch?v=jawan",
        showType: "Theatre",
        createdAt: "2023-05-20",
        castName: getCastIds(["Shah Rukh Khan"]),
        uploaded: true,
        uploadingTime: "2023-05-20T12:00:00Z",
        movieStatus: "Released",
        VerifiedByTheAdmin: true,
        directorname: ["Atlee"],
        producername: ["Red Chillies Entertainment"],
        writersname: ["Atlee"],
        totalbudget: "300 Crores",
        movieDuration: "170",
        BannerLiked: 45000,
        BannerDisLiked: 1200
      },
      {
        title: "Pathaan",
        tagline: "The Mission Begins",
        releasedate: "2023-01-25",
        genre: getGenreId('ACTION'),
        language: [getLanguageId('Hindi')],
        TotalDuration: "165",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/pathaan.jpg",
        trailerurl: "https://www.youtube.com/watch?v=pathaan",
        showType: "Theatre",
        createdAt: "2022-11-10",
        castName: getCastIds(["Shah Rukh Khan", "Deepika Padukone"]),
        uploaded: true,
        uploadingTime: "2022-11-10T08:00:00Z",
        movieStatus: "Released",
        VerifiedByTheAdmin: true,
        directorname: ["Siddharth Anand"],
        producername: ["Yash Raj Films"],
        writersname: ["Siddharth Anand"],
        totalbudget: "250 Crores",
        movieDuration: "165",
        BannerLiked: 52000,
        BannerDisLiked: 800
      },
      {
        title: "Barbie",
        tagline: "She's a Doll. She's a Legend.",
        releasedate: "2023-07-21",
        genre: getGenreId('COMEDY'),
        language: [getLanguageId('English')],
        TotalDuration: "114",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/barbie.jpg",
        trailerurl: "https://www.youtube.com/watch?v=barbie",
        showType: "Theatre",
        createdAt: "2023-03-15",
        castName: getCastIds(["Margot Robbie"]),
        uploaded: true,
        uploadingTime: "2023-03-15T10:00:00Z",
        movieStatus: "Released",
        VerifiedByTheAdmin: true,
        directorname: ["Greta Gerwig"],
        producername: ["Warner Bros"],
        writersname: ["Greta Gerwig"],
        totalbudget: "145 Million",
        movieDuration: "114",
        BannerLiked: 38000,
        BannerDisLiked: 1500
      },
      {
        title: "Oppenheimer",
        tagline: "The Man Who Changed the World",
        releasedate: "2023-07-21",
        genre: getGenreId('DRAMA'),
        language: [getLanguageId('English')],
        TotalDuration: "180",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/oppenheimer.jpg",
        trailerurl: "https://www.youtube.com/watch?v=oppenheimer",
        showType: "Theatre",
        createdAt: "2023-02-28",
        castName: getCastIds(["Cillian Murphy"]),
        uploaded: true,
        uploadingTime: "2023-02-28T14:30:00Z",
        movieStatus: "Released",
        VerifiedByTheAdmin: true,
        directorname: ["Christopher Nolan"],
        producername: ["Universal Pictures"],
        writersname: ["Christopher Nolan"],
        totalbudget: "100 Million",
        movieDuration: "180",
        BannerLiked: 48000,
        BannerDisLiked: 600
      },
      {
        title: "Leo",
        tagline: "Beast Mode Unleashed",
        releasedate: "2023-10-19",
        genre: getGenreId('ACTION'),
        language: [getLanguageId('Tamil')],
        TotalDuration: "165",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/leo.jpg",
        trailerurl: "https://www.youtube.com/watch?v=leo",
        showType: "Theatre",
        createdAt: "2023-06-15",
        castName: getCastIds(["Vijay"]),
        uploaded: true,
        uploadingTime: "2023-06-15T09:00:00Z",
        movieStatus: "Released",
        VerifiedByTheAdmin: true,
        directorname: ["Lokesh Kanagaraj"],
        producername: ["7 Screen Studio"],
        writersname: ["Lokesh Kanagaraj"],
        totalbudget: "150 Crores",
        movieDuration: "165",
        BannerLiked: 32000,
        BannerDisLiked: 1800
      },
      {
        title: "Dune Part Two",
        tagline: "Long Live the Fighters",
        releasedate: "2024-02-28",
        genre: getGenreId('SCI-FI'),
        language: [getLanguageId('English')],
        TotalDuration: "166",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/dune2.jpg",
        trailerurl: "https://www.youtube.com/watch?v=dune2",
        showType: "Theatre",
        createdAt: "2023-11-01",
        castName: getCastIds(["Timothee Chalamet"]),
        uploaded: true,
        uploadingTime: "2023-11-01T11:30:00Z",
        movieStatus: "Released",
        VerifiedByTheAdmin: true,
        directorname: ["Denis Villeneuve"],
        producername: ["Warner Bros"],
        writersname: ["Denis Villeneuve"],
        totalbudget: "190 Million",
        movieDuration: "166",
        BannerLiked: 29000,
        BannerDisLiked: 420
      },
      {
        title: "Stree 2",
        tagline: "Mere Naam Tu Hai",
        releasedate: "2024-08-15",
        genre: getGenreId('HORROR'),
        language: [getLanguageId('Hindi')],
        TotalDuration: "150",
        Posterurl: "https://res.cloudinary.com/dit2bnxnd/image/upload/v1750000000/stree2.jpg",
        trailerurl: "https://www.youtube.com/watch?v=stree2",
        showType: "Theatre",
        createdAt: "2024-04-01",
        castName: getCastIds(["Rajkumar Rao"]),
        uploaded: true,
        uploadingTime: "2024-04-01T13:00:00Z",
        movieStatus: "Released",
        VerifiedByTheAdmin: true,
        directorname: ["Amar Kaushik"],
        producername: ["Dinesh Vijan"],
        writersname: ["Niren Bhatt"],
        totalbudget: "80 Crores",
        movieDuration: "150",
        BannerLiked: 22500,
        BannerDisLiked: 750
      }
    ]);

    console.log(`Created ${shows.length} shows`);

    console.log('\n✅ Seed data inserted successfully!');
    console.log(`- Genres: ${genres.length}`);
    console.log(`- Languages: ${languages.length}`);
    console.log(`- Cast: ${casts.length}`);
    console.log(`- Shows: ${shows.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
