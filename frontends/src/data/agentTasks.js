// AI Agent Tasks — Cine Circuit
// roles: ["all"] means visible to everyone (including logged out)
// roles: ["Viewer","Organizer","Theatrer","Administrator"] — restrict per account type

export const agentTasks = [
  {
    id: "recommend",
    category: "Movie Recommendations",
    icon: "🎬",
    roles: ["all"],
    tasks: [
      {
        id: "rec-1",
        query: "Recommend me a movie 🎬",
        type: "recommendation",
        answer: "",
      },
    ],
  },
  {
    id: "onboarding",
    category: "Getting Started",
    icon: "🚀",
    roles: ["all"],
    tasks: [
      {
        id: "ob-1",
        query: "How do I sign up as a Viewer?",
        answer: "Click the Sign Up button on the top navbar. Select Viewer as your account type, fill in your full name, email, and phone number, then hit Send OTP. Enter the 6-digit OTP sent to your email within 2 minutes to complete registration.",
      },
      {
        id: "ob-2",
        query: "How do I register as an Organizer?",
        answer: "Click Sign Up on the navbar and select Organizer as your account type. Fill in your details and verify your email with the OTP. After registration, go to Dashboard → Organizer Verification and submit your documents for admin approval.",
      },
      {
        id: "ob-3",
        query: "How do I register my Theatre?",
        answer: "Click Sign Up and select Theatre as your account type. Fill in your details and verify via OTP. Once registered, your theatre account will be reviewed by the admin. After approval you can manage shows and tickets from your dashboard.",
      },
      {
        id: "ob-4",
        query: "What is the difference between Viewer, Organizer, and Theatre?",
        answer: "Viewer — a regular user who browses movies, buys tickets, and writes reviews. Organizer — creates and manages movie shows, uploads posters and cast details. Theatre — owns a physical venue, gets shows allotted, and distributes tickets to buyers.",
      },
      {
        id: "ob-5",
        query: "How do I log in to my account?",
        answer: "Click the Login button on the navbar. Enter your registered email and password, then click Sign In. If you forgot your password, click Forgot Password to reset it via email.",
      },
    ],
  },
  {
    id: "account",
    category: "Account & Profile",
    icon: "👤",
    roles: ["Viewer", "Organizer", "Theatrer", "Administrator"],
    tasks: [
      {
        id: "ac-1",
        query: "How do I update my profile picture?",
        answer: "Go to Dashboard → My Profile → Settings. Click on your current profile image and upload a new one. Supported formats are PNG, JPG, and JPEG up to 10MB. Note: profile picture can only be changed once every 30 days.",
      },
      {
        id: "ac-2",
        query: "How do I change my username?",
        answer: "Go to Dashboard → Settings. Find the username field and enter your new unique username. Click Update. Note: usernames can only be changed once every 30 days.",
      },
      {
        id: "ac-3",
        query: "How do I change my phone number?",
        answer: "Go to Dashboard → Settings. Enter your new phone number along with the country code and click Update. Phone numbers can only be changed once every 7 days.",
      },
      {
        id: "ac-4",
        query: "How do I reset my password?",
        answer: "On the Login page, click Forgot Password. Enter your registered email and a reset link will be sent to your inbox. Click the link and set your new password. Passwords can only be changed once every 30 days.",
      },
      {
        id: "ac-5",
        query: "Where can I see my account settings?",
        answer: "Go to Dashboard → Settings from the left sidebar. You can update your username, phone number, password, and profile picture all from one place.",
      },
    ],
  },
  {
    id: "movies",
    category: "Movie Discovery",
    icon: "🎬",
    roles: ["all"],
    tasks: [
      {
        id: "mv-1",
        query: "Show me the top rated movies right now",
        answer: "On the home page scroll to the Top Rated section to see movies ranked by average user ratings. Click View All to see the full list sorted from highest to lowest rating.",
      },
      {
        id: "mv-2",
        query: "What movies are releasing this week?",
        answer: "Check the Recently Released section on the home page. It shows the latest movies sorted by release date with the newest ones at the top. Click View All to browse all recent releases.",
      },
      {
        id: "mv-3",
        query: "What are the most liked movies?",
        answer: "Scroll to the Most Liked section on the home page. These are movies with the highest number of user likes. Click View All to see the complete ranked list.",
      },
      {
        id: "mv-4",
        query: "How do I search for a movie?",
        answer: "Use the search bar in the middle of the home page. Type the movie name or keyword and press Enter. You can also browse by genre or language using the filter options.",
      },
      {
        id: "mv-5",
        query: "What shows are available in my city?",
        answer: "Go to Theatres from the navbar to browse all registered theatres. Click on a theatre to see the shows currently allotted to it along with timings and available tickets.",
      },
    ],
  },
  {
    id: "tickets",
    category: "Buying Tickets",
    icon: "🎟️",
    roles: ["Viewer"],
    tasks: [
      {
        id: "tk-1",
        query: "How do I buy a ticket?",
        answer: "Open the movie you want to watch, click Buy Ticket, select a show and theatre, choose the number of tickets, and proceed to payment. After successful payment your ticket will be saved in Dashboard → Purchased Tickets.",
      },
      {
        id: "tk-2",
        query: "Walk me through the payment process step by step",
        answer: "1. Open a movie and click Buy Ticket. 2. Select your preferred show and theatre. 3. Choose the number of tickets. 4. Click Proceed to Pay — this opens the Razorpay payment gateway. 5. Complete the payment using card, UPI, or net banking. 6. On success your ticket is generated instantly.",
      },
      {
        id: "tk-3",
        query: "What payment methods are accepted?",
        answer: "Cine Circuit uses Razorpay as the payment gateway. You can pay using Credit Card, Debit Card, UPI (GPay, PhonePe, Paytm), Net Banking, and Wallets.",
      },
      {
        id: "tk-4",
        query: "How do I select my seats?",
        answer: "Currently ticket purchase reserves a count of seats rather than specific numbered seats. Select the number of tickets you want during the checkout flow. Seat assignment details will be shown on your ticket.",
      },
      {
        id: "tk-5",
        query: "Where do I find my ticket QR code after purchase?",
        answer: "After successful payment go to Dashboard → Purchased Tickets. Your ticket will be listed there with all show details. The ticket QR code can be used at the theatre for entry verification.",
      },
    ],
  },
  {
    id: "ticket-management",
    category: "Manage My Tickets",
    icon: "📋",
    roles: ["Viewer"],
    tasks: [
      {
        id: "tm-1",
        query: "How do I cancel my ticket?",
        answer: "Go to Dashboard → Purchased Tickets. Find the ticket you want to cancel and click the Cancel button. Cancellations are subject to the refund policy of the show. Refunds are processed back to your original payment method.",
      },
      {
        id: "tm-2",
        query: "Where can I see my purchased tickets?",
        answer: "Go to Dashboard → Purchased Tickets from the left sidebar. All your active tickets are listed here with show name, theatre, date, time, and ticket count.",
      },
      {
        id: "tm-3",
        query: "How do I download or view my ticket?",
        answer: "Go to Dashboard → Purchased Tickets and click on any ticket to view its full details including the QR code. You can screenshot or save it to show at the theatre entrance.",
      },
      {
        id: "tm-4",
        query: "What is the refund policy?",
        answer: "Refund eligibility depends on how far in advance you cancel before the show. Cancellations well before the show time qualify for a full refund. Refunds are processed within 5-7 business days to your original payment method.",
      },
      {
        id: "tm-5",
        query: "Payment was deducted but I didn't get a ticket — what do I do?",
        answer: "First check Dashboard → Purchase History to see if the transaction was recorded. If money was deducted but no ticket was generated, take a screenshot of your payment confirmation and contact support. The issue is usually resolved within 24 hours.",
      },
    ],
  },
  {
    id: "reviews",
    category: "Reviews & Engagement",
    icon: "⭐",
    roles: ["Viewer"],
    tasks: [
      {
        id: "rv-1",
        query: "How do I comment on a movie?",
        answer: "Open any movie page and scroll down to the Comments section. Type your comment in the text box and click Post. You must be logged in to leave a comment.",
      },
      {
        id: "rv-2",
        query: "How do I rate a movie?",
        answer: "Open the movie page and click the Review button. A popup will appear where you can select a star rating from 1 to 5 and optionally write a review. Click Submit to save your rating.",
      },
      {
        id: "rv-3",
        query: "Can I edit or delete my comment?",
        answer: "Currently comments can be deleted by hovering over your comment and clicking the delete icon. Comment editing is not available yet but will be added in a future update.",
      },
      {
        id: "rv-4",
        query: "How do I like a movie?",
        answer: "Open the movie page and click the Like button (heart icon) near the movie poster or in the movie details section. You must be logged in to like a movie. Your liked movies also appear in Dashboard → Wishlist.",
      },
      {
        id: "rv-5",
        query: "Where can I see all reviews for a movie?",
        answer: "Open the movie page and scroll down. All user comments and ratings are displayed in the Reviews and Comments section. You can see the average rating, total review count, and individual user reviews.",
      },
    ],
  },
  {
    id: "organizer",
    category: "Organizer Tasks",
    icon: "🎥",
    roles: ["Organizer"],
    tasks: [
      {
        id: "or-1",
        query: "How do I submit a new movie for approval?",
        answer: "Go to Dashboard → Shows → Create. Fill in the movie title, description, genre, language, release date, and upload a poster image. Submit for admin review. Once approved the movie will be visible to all users.",
      },
      {
        id: "or-2",
        query: "How do I check the status of my submitted movie?",
        answer: "Go to Dashboard → Manage Events. All your submitted movies are listed with their current status — Pending, Approved, or Rejected. Click on any movie to view full details.",
      },
      {
        id: "or-3",
        query: "How do I add cast and crew details?",
        answer: "Go to Dashboard → Shows → Cast. Here you can add actors, directors, and crew members. Each cast entry includes name, role, and profile image. Cast details are shown on the movie page.",
      },
      {
        id: "or-4",
        query: "How do I upload a movie poster or trailer?",
        answer: "While creating or editing a show go to Dashboard → Shows → Upload. You can upload the movie poster image. Supported formats are PNG, JPG, and JPEG. Max file size is 10MB.",
      },
      {
        id: "or-5",
        query: "How do I add tags and genres to my movie?",
        answer: "Go to Dashboard → Shows → Tags while creating a show. Select from available genres and add relevant tags that describe your movie. Tags help users discover your movie through search and filters.",
      },
      {
        id: "or-6",
        query: "How do I create or manage tickets for my movie?",
        answer: "Go to Dashboard → Tickets → Create to create ticket slots for your show. Set the price, total count, and show details. You can view all created tickets under Dashboard → Tickets → All.",
      },
    ],
  },
  {
    id: "theatre",
    category: "Theatre Management",
    icon: "🏟️",
    roles: ["Theatrer"],
    tasks: [
      {
        id: "th-1",
        query: "How do I view shows allotted to my theatre?",
        answer: "Go to Dashboard → Alloted Shows. All shows assigned to your theatre by organizers or admin are listed here with show name, date, time, and ticket details.",
      },
      {
        id: "th-2",
        query: "How do I distribute tickets to buyers?",
        answer: "Go to Dashboard → Distribute Tickets. Select the show and enter the buyer details to mark tickets as distributed. This confirms the ticket has been handed over to the customer at the venue.",
      },
      {
        id: "th-3",
        query: "How do I see total ticket sales?",
        answer: "Go to Dashboard → Total Sales. This shows a complete breakdown of tickets sold per show, total revenue, and payment status for all shows running at your theatre.",
      },
      {
        id: "th-4",
        query: "How do I update my theatre details?",
        answer: "Go to Dashboard → Theatre Details. You can update your theatre name, location, seating capacity, and contact information. Changes take effect immediately after saving.",
      },
      {
        id: "th-5",
        query: "How do I see all tickets for a specific show?",
        answer: "Go to Dashboard → All Tickets and filter by the specific show name. You will see a complete list of all tickets issued, buyer info, and their current status — active, used, or cancelled.",
      },
      {
        id: "th-6",
        query: "How do I update ticket timing?",
        answer: "Go to Dashboard → Update Ticket Time. Select the show and update the screening time. This will reflect on all active tickets for that show and notify affected ticket holders.",
      },
    ],
  },
  // {
  //   id: "admin",
  //   category: "Admin Controls",
  //   icon: "🛡️",
  //   roles: ["Administrator"],
  //   tasks: [
  //     {
  //       id: "ad-1",
  //       query: "How do I verify a new show submission?",
  //       answer: "Go to Dashboard → Verify Shows. All pending show submissions from organizers are listed here. Review the movie details, poster, and cast info. Click Approve to make it live or Reject with a reason.",
  //     },
  //     {
  //       id: "ad-2",
  //       query: "How do I approve or reject an organizer?",
  //       answer: "Go to Dashboard → Verifications. All pending organizer registration requests appear here with their submitted documents. Click Approve to grant organizer access or Reject to deny with feedback.",
  //     },
  //     {
  //       id: "ad-3",
  //       query: "How do I manage all users on the platform?",
  //       answer: "Go to Dashboard → Users. You can see all registered users with their account type, join date, and status. You can search, filter, and manage user accounts from this panel.",
  //     },
  //     {
  //       id: "ad-4",
  //       query: "How do I verify a theatre registration?",
  //       answer: "Go to Dashboard → Verify Theatre. All pending theatre registration requests are listed here. Review the theatre details and location, then Approve or Reject the registration.",
  //     },
  //     {
  //       id: "ad-5",
  //       query: "How do I add or manage genres?",
  //       answer: "Go to Dashboard → Genre. You can add new genres like Action, Drama, Comedy, etc. These genres are used by organizers when submitting movies. You can also edit or delete existing genres.",
  //     },
  //     {
  //       id: "ad-6",
  //       query: "How do I add or manage languages?",
  //       answer: "Go to Dashboard → Create Language. Add languages like Hindi, English, Tamil, etc. that organizers can assign to their movie submissions. Language tags help users filter movies by their preferred language.",
  //     },
  //     {
  //       id: "ad-7",
  //       query: "How do I view site-wide statistics?",
  //       answer: "Go to Dashboard → Right Side panel which shows total visitors, registered users, active shows, and platform-wide metrics. More detailed analytics are available in the Site Settings section.",
  //     },
  //   ],
  // },
  {
    id: "troubleshoot",
    category: "Troubleshooting",
    icon: "🔧",
    roles: ["all"],
    tasks: [
      {
        id: "ts-1",
        query: "My OTP didn't arrive — what should I do?",
        answer: "First check your spam or junk folder — OTP emails sometimes land there. If still not found, wait 2 minutes for the current OTP to expire, then click Resend OTP. Make sure the email address you entered is correct.",
      },
      {
        id: "ts-2",
        query: "The payment failed but money was deducted",
        answer: "Go to Dashboard → Purchase History to check if the transaction was recorded. If money was deducted but no ticket was created, the payment gateway usually auto-refunds within 5-7 business days. Take a screenshot of the payment confirmation and reach out via the Contact page.",
      },
      {
        id: "ts-3",
        query: "I can't log in — what do I do?",
        answer: "Make sure you are using the correct email and password. If you forgot your password click Forgot Password on the login page to reset it via email. If your account was not verified via OTP during signup you will need to register again.",
      },
      {
        id: "ts-4",
        query: "How do I contact support?",
        answer: "Go to the Contact page from the navbar footer. Fill in your name, email, and message describing your issue. Our team typically responds within 24-48 hours. For urgent payment issues include your transaction ID.",
      },
      {
        id: "ts-5",
        query: "Check your spam folder if OTP is missing",
        answer: "OTP emails from Cine Circuit are sent automatically. If you do not see the email in your inbox within 1-2 minutes, check your Spam or Junk folder. Add our email to your contacts to avoid this in future. You can also click Resend OTP after the 2 minute cooldown.",
      },
    ],
  },
];
