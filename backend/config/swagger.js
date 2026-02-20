const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cine Circuit API',
      version: '1.0.0',
      description: `
## Cine Circuit — Movie Booking Platform REST API

Complete API documentation for the Cine Circuit backend.

### Authentication
Most protected routes require a JWT token stored in an **httpOnly cookie** named \`token\`.
Login via \`POST /api/v1/createAccount/Login\` to receive the cookie automatically.

### Account Types & Access
| Role | Prefix | Description |
|------|--------|-------------|
| Viewer | IsUSER | Regular users who buy tickets and review movies |
| Organizer | IsOrganizer | Creates and manages movie shows |
| Theatrer | IsTheatrer | Owns venues and distributes tickets |
| Administrator | IsAdmin | Full platform control |
      `,
      contact: {
        name: 'Cine Circuit Support',
        email: 'faizankhan901152@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4003',
        description: 'Local Development Server',
      },
      {
        url: 'https://mw-mocha.vercel.app',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token stored in httpOnly cookie. Login first to get it.',
        },
      },
      schemas: {
        // ─── Common ───────────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            totalCount: { type: 'integer', example: 100 },
            totalPages: { type: 'integer', example: 10 },
            currentPage: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            hasNextPage: { type: 'boolean', example: true },
            hasPrevPage: { type: 'boolean', example: false },
          },
        },
        // ─── User ────────────────────────────────────
        CreateUserBody: {
          type: 'object',
          required: ['name', 'password', 'email', 'number', 'countrycode', 'otp'],
          properties: {
            name: { type: 'string', example: 'Faizan Khan' },
            password: { type: 'string', example: 'mypassword123' },
            email: { type: 'string', example: 'faizan@example.com' },
            number: { type: 'string', example: '9876543210' },
            countrycode: { type: 'string', example: '+91' },
            otp: { type: 'string', example: '482910' },
            usertype: { type: 'string', example: 'Viewer', default: 'Viewer' },
          },
        },
        LoginBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'faizan@example.com' },
            password: { type: 'string', example: 'mypassword123' },
          },
        },
        // ─── Show ─────────────────────────────────────
        CreateShowBody: {
          type: 'object',
          required: ['title', 'tagline', 'description', 'language', 'genre'],
          properties: {
            title: { type: 'string', example: 'Interstellar' },
            tagline: { type: 'string', example: 'Do not go gentle into that good night' },
            description: { type: 'string', example: 'A team of explorers travel through a wormhole in space.' },
            language: { type: 'string', example: 'English' },
            genre: { type: 'string', example: 'Sci-Fi' },
          },
        },
        // ─── Payment ──────────────────────────────────
        MakePaymentBody: {
          type: 'object',
          required: ['showId', 'theatreId', 'ticketCount'],
          properties: {
            showId: { type: 'string', example: '64abc123def456' },
            theatreId: { type: 'string', example: '64xyz789ghi000' },
            ticketCount: { type: 'integer', example: 2 },
          },
        },
        VerifyPaymentBody: {
          type: 'object',
          required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'],
          properties: {
            razorpay_order_id: { type: 'string', example: 'order_NbX9...' },
            razorpay_payment_id: { type: 'string', example: 'pay_NbX9...' },
            razorpay_signature: { type: 'string', example: 'abc123...' },
          },
        },
      },
    },
    // ─── Tags (groups in the UI) ─────────────────────
    tags: [
      { name: 'Auth', description: 'User registration, login, OTP, password reset' },
      { name: 'User', description: 'User profile — update name, password, image, number' },
      { name: 'Movies', description: 'Public movie & show listing, search, ratings, comments' },
      { name: 'Admin', description: 'Admin-only controls — genres, languages, verifications' },
      { name: 'Organizer', description: 'Organizer registration and show management' },
      { name: 'Show', description: 'Show creation — tags, cast, upload (Organizer only)' },
      { name: 'Theatre', description: 'Theatre registration and ticket distribution' },
      { name: 'Payment', description: 'Razorpay payment flow and ticket download' },
    ],

    // ─── All Paths ────────────────────────────────────
    paths: {

      // ════════════════════════════════════════════════
      // AUTH ROUTES  /api/v1/createAccount
      // ════════════════════════════════════════════════
      '/api/v1/createAccount/Create-OTP': {
        post: {
          tags: ['Auth'],
          summary: 'Send OTP to email for registration',
          description: 'Generates a 6-digit OTP and sends it to the given email. OTP expires in 2 minutes. Cooldown: cannot resend until previous OTP expires.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', example: 'faizan@example.com' } } },
              },
            },
          },
          responses: {
            200: { description: 'OTP sent successfully' },
            409: { description: 'Email already registered — use login instead' },
            429: { description: 'OTP cooldown active — wait before resending' },
          },
        },
      },

      '/api/v1/createAccount/Create-User': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new Viewer account',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUserBody' } } },
          },
          responses: {
            200: { description: 'User created successfully' },
            400: { description: 'Invalid OTP or missing fields' },
            409: { description: 'Email or username already taken' },
          },
        },
      },

      '/api/v1/createAccount/Login': {
        post: {
          tags: ['Auth'],
          summary: 'Login — works for Viewer, Organizer, Theatrer, Admin',
          description: 'Returns a JWT token set as an httpOnly cookie. Rate limited to 5 attempts per 15 minutes.',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } },
          },
          responses: {
            200: { description: 'Login successful — cookie set' },
            401: { description: 'Invalid email or password' },
            429: { description: 'Too many attempts — try after 15 minutes' },
          },
        },
      },

      '/api/v1/createAccount/Send-Link': {
        post: {
          tags: ['Auth'],
          summary: 'Send password reset link to email',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', example: 'faizan@example.com' } } } } },
          },
          responses: {
            200: { description: 'Reset link sent' },
            404: { description: 'Email not found' },
          },
        },
      },

      '/api/v1/createAccount/Change-Password': {
        put: {
          tags: ['Auth'],
          summary: 'Reset password using the link token',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { newPassword: { type: 'string' }, token: { type: 'string' } } } } },
          },
          responses: {
            200: { description: 'Password reset successfully' },
            400: { description: 'Invalid or expired token' },
          },
        },
      },

      // ════════════════════════════════════════════════
      // USER PROFILE ROUTES
      // ════════════════════════════════════════════════
      '/api/v1/createAccount/Current-UserDetails': {
        get: {
          tags: ['User'],
          summary: 'Get currently logged-in user details',
          security: [{ cookieAuth: [] }],
          responses: {
            200: { description: 'User data returned' },
            401: { description: 'Not authenticated' },
          },
        },
      },

      '/api/v1/createAccount/Update-userName': {
        put: {
          tags: ['User'],
          summary: 'Update username (once per 30 days)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { newName: { type: 'string', example: 'faizan_dev' } } } } },
          },
          responses: {
            200: { description: 'Username updated' },
            400: { description: 'Cooldown active or name taken' },
          },
        },
      },

      '/api/v1/createAccount/Update-Password': {
        put: {
          tags: ['User'],
          summary: 'Change password (once per 30 days)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { oldPassword: { type: 'string' }, newPassword: { type: 'string' } } } } },
          },
          responses: {
            200: { description: 'Password updated' },
            400: { description: 'Old password incorrect or cooldown active' },
          },
        },
      },

      '/api/v1/createAccount/Update-Image': {
        put: {
          tags: ['User'],
          summary: 'Update profile picture (once per 30 days)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'multipart/form-data': { schema: { type: 'object', properties: { displayPicture: { type: 'string', format: 'binary' } } } } },
          },
          responses: {
            200: { description: 'Profile picture updated' },
            400: { description: 'Invalid file type or cooldown active' },
          },
        },
      },

      '/api/v1/createAccount/Update-Number': {
        put: {
          tags: ['User'],
          summary: 'Update phone number (once per 7 days)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { newNumber: { type: 'string', example: '9876543210' }, code: { type: 'string', example: '+91' } } } } },
          },
          responses: {
            200: { description: 'Number updated' },
            400: { description: 'Number taken or cooldown active' },
          },
        },
      },

      // ════════════════════════════════════════════════
      // PUBLIC MOVIE ROUTES
      // ════════════════════════════════════════════════
      '/api/v1/createAccount/Shows': {
        get: {
          tags: ['Movies'],
          summary: 'Get all verified shows',
          responses: { 200: { description: 'List of all shows' } },
        },
      },

      '/api/v1/createAccount/Banner': {
        get: {
          tags: ['Movies'],
          summary: 'Get banner/featured movies for homepage slider',
          responses: { 200: { description: 'Banner movies returned' } },
        },
      },

      '/api/v1/createAccount/Most-Liked': {
        get: {
          tags: ['Movies'],
          summary: 'Get most liked movies (paginated)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: { 200: { description: 'Paginated most liked movies' } },
        },
      },

      '/api/v1/createAccount/Highly-Rated': {
        get: {
          tags: ['Movies'],
          summary: 'Get top rated movies (paginated)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: { 200: { description: 'Paginated top rated movies' } },
        },
      },

      '/api/v1/createAccount/Recently-Released': {
        get: {
          tags: ['Movies'],
          summary: 'Get recently released movies (paginated)',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: { 200: { description: 'Paginated recently released movies' } },
        },
      },

      '/api/v1/createAccount/Movie-Details': {
        get: {
          tags: ['Movies'],
          summary: 'Get single movie full details by ID',
          parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Movie details returned' }, 404: { description: 'Movie not found' } },
        },
      },

      '/api/v1/createAccount/Finder': {
        post: {
          tags: ['Movies'],
          summary: 'Search movies by title, genre, language, cast',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { query: { type: 'string', example: 'Interstellar' } } } } },
          },
          responses: { 200: { description: 'Search results returned' } },
        },
      },

      '/api/v1/createAccount/Personal': {
        get: {
          tags: ['Movies'],
          summary: 'Get personalised movie recommendations for logged-in user',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Recommended movies based on user history' } },
        },
      },

      '/api/v1/createAccount/Comment-Banner': {
        post: {
          tags: ['Movies'],
          summary: 'Post a comment on a movie (Viewer only)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { movieId: { type: 'string' }, comment: { type: 'string', example: 'Amazing movie!' } } } } },
          },
          responses: { 200: { description: 'Comment posted' }, 401: { description: 'Not authenticated' } },
        },
      },

      '/api/v1/createAccount/Get-Comment': {
        get: {
          tags: ['Movies'],
          summary: 'Get all comments for a movie',
          parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' }, description: 'Movie ID' }],
          responses: { 200: { description: 'Comments returned' } },
        },
      },

      '/api/v1/createAccount/delte-Comment': {
        delete: {
          tags: ['Movies'],
          summary: 'Delete own comment (Viewer only)',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' }, description: 'Comment ID' }],
          responses: { 200: { description: 'Comment deleted' } },
        },
      },

      '/api/v1/createAccount/createRating': {
        post: {
          tags: ['Movies'],
          summary: 'Rate and review a movie (Viewer only)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { movieId: { type: 'string' }, rating: { type: 'number', example: 4.5 }, review: { type: 'string', example: 'Brilliant direction!' } } } } },
          },
          responses: { 200: { description: 'Rating submitted' } },
        },
      },

      '/api/v1/createAccount/getAverageRating': {
        get: {
          tags: ['Movies'],
          summary: 'Get average rating for a movie',
          parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Average rating returned' } },
        },
      },

      '/api/v1/createAccount/getReviews': {
        get: {
          tags: ['Movies'],
          summary: 'Get all reviews for a movie',
          parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Reviews list returned' } },
        },
      },

      '/api/v1/createAccount/Like-Banner': {
        put: {
          tags: ['Movies'],
          summary: 'Like a movie (Viewer only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { movieId: { type: 'string' } } } } } },
          responses: { 200: { description: 'Movie liked' } },
        },
      },

      '/api/v1/createAccount/Dislike-Banner': {
        put: {
          tags: ['Movies'],
          summary: 'Remove like from a movie (Viewer only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { movieId: { type: 'string' } } } } } },
          responses: { 200: { description: 'Like removed' } },
        },
      },

      '/api/v1/createAccount/Ticket-Purchased': {
        get: {
          tags: ['Movies'],
          summary: 'Get all purchased tickets of logged-in Viewer',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Purchased tickets returned' } },
        },
      },

      '/api/v1/createAccount/Ticket-Purchased-FullDetails': {
        get: {
          tags: ['Movies'],
          summary: 'Get full details of a purchased ticket',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Ticket full details returned' } },
        },
      },

      // ════════════════════════════════════════════════
      // PAYMENT ROUTES  /api/v1/Payment
      // ════════════════════════════════════════════════
      '/api/v1/Payment/Make-Payment': {
        post: {
          tags: ['Payment'],
          summary: 'Initiate Razorpay payment order (Viewer only)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MakePaymentBody' } } },
          },
          responses: {
            200: { description: 'Razorpay order created — returns order ID' },
            400: { description: 'Tickets not available' },
          },
        },
      },

      '/api/v1/Payment/Verify-Payment': {
        post: {
          tags: ['Payment'],
          summary: 'Verify Razorpay payment signature and confirm ticket (Viewer only)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VerifyPaymentBody' } } },
          },
          responses: {
            200: { description: 'Payment verified — ticket generated and email sent' },
            400: { description: 'Payment signature verification failed' },
          },
        },
      },

      '/api/v1/Payment/download/{ticketId}': {
        get: {
          tags: ['Payment'],
          summary: 'Download ticket as PDF (Viewer only)',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'ticketId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'PDF ticket returned', content: { 'application/pdf': {} } },
            404: { description: 'Ticket not found' },
          },
        },
      },

      // ════════════════════════════════════════════════
      // ORGANIZER ROUTES  /api/v1/Org
      // ════════════════════════════════════════════════
      '/api/v1/Org/Create-Orgainezer': {
        post: {
          tags: ['Organizer'],
          summary: 'Register a new Organizer account',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, number: { type: 'string' }, countrycode: { type: 'string' }, otp: { type: 'string' } } } } },
          },
          responses: { 200: { description: 'Organizer registered — awaiting admin approval' } },
        },
      },

      '/api/v1/Org/Orgainezer-login': {
        post: {
          tags: ['Organizer'],
          summary: 'Organizer login',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } },
          },
          responses: { 200: { description: 'Login successful' }, 401: { description: 'Invalid credentials' } },
        },
      },

      '/api/v1/Org/Create-Ticket': {
        put: {
          tags: ['Organizer'],
          summary: 'Create ticket slots for a show (Organizer only)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { showId: { type: 'string' }, price: { type: 'number', example: 250 }, totalCount: { type: 'integer', example: 100 } } } } },
          },
          responses: { 200: { description: 'Tickets created' } },
        },
      },

      '/api/v1/Org/Allot-Theatre': {
        put: {
          tags: ['Organizer'],
          summary: 'Allot a show to a specific theatre (Organizer only)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { showId: { type: 'string' }, theatreId: { type: 'string' } } } } },
          },
          responses: { 200: { description: 'Theatre allotted to show' } },
        },
      },

      '/api/v1/Org/All-Shows': {
        get: {
          tags: ['Organizer'],
          summary: 'Get all shows for this organizer',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Shows list returned' } },
        },
      },

      '/api/v1/Org/Ticket-Details': {
        get: {
          tags: ['Organizer'],
          summary: 'Get ticket details for organizer shows',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Ticket details returned' } },
        },
      },

      '/api/v1/Org/Get-All-Theatre-Details': {
        get: {
          tags: ['Organizer'],
          summary: 'Get all available theatres (for allotment)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Theatre list returned' } },
        },
      },

      // ════════════════════════════════════════════════
      // SHOW MANAGEMENT ROUTES  /api/v1/Show
      // ════════════════════════════════════════════════
      '/api/v1/Show/Create-Show': {
        post: {
          tags: ['Show'],
          summary: 'Create a new movie show (Organizer only)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateShowBody' } } },
          },
          responses: { 200: { description: 'Show created — awaiting admin verification' } },
        },
      },

      '/api/v1/Show/Update-ShowTitle': {
        put: {
          tags: ['Show'],
          summary: 'Update show title (Organizer only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { showId: { type: 'string' }, title: { type: 'string' } } } } } },
          responses: { 200: { description: 'Title updated' } },
        },
      },

      '/api/v1/Show/Update-TitleImage': {
        put: {
          tags: ['Show'],
          summary: 'Update show poster image (Organizer only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { showId: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } },
          responses: { 200: { description: 'Poster updated' } },
        },
      },

      '/api/v1/Show/delete-show': {
        delete: {
          tags: ['Show'],
          summary: 'Delete a show (Organizer only)',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Show deleted' } },
        },
      },

      '/api/v1/Show/Upload': {
        put: {
          tags: ['Show'],
          summary: 'Mark show as uploaded/published (Organizer only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { showId: { type: 'string' } } } } } },
          responses: { 200: { description: 'Show published' } },
        },
      },

      '/api/v1/Show/Create-tags': {
        post: {
          tags: ['Show'],
          summary: 'Create a new tag (Organizer only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string', example: 'Action' } } } } } },
          responses: { 200: { description: 'Tag created' } },
        },
      },

      '/api/v1/Show/Get-Alltags': {
        get: {
          tags: ['Show'],
          summary: 'Get all available tags (Organizer only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Tags list returned' } },
        },
      },

      '/api/v1/Show/Create-cast': {
        post: {
          tags: ['Show'],
          summary: 'Add a cast member to a show (Organizer only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { showId: { type: 'string' }, name: { type: 'string', example: 'Matthew McConaughey' }, role: { type: 'string', example: 'Cooper' } } } } } },
          responses: { 200: { description: 'Cast member added' } },
        },
      },

      '/api/v1/Show/Get-WholeCast': {
        get: {
          tags: ['Show'],
          summary: 'Get full cast list for a show (Organizer only)',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'showId', in: 'query', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Cast list returned' } },
        },
      },

      '/api/v1/Show/Get-AllLanguages': {
        get: {
          tags: ['Show'],
          summary: 'Get all available languages (Organizer only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Languages returned' } },
        },
      },

      // ════════════════════════════════════════════════
      // THEATRE ROUTES  /api/v1/Theatre
      // ════════════════════════════════════════════════
      '/api/v1/Theatre/Create-Theatre': {
        post: {
          tags: ['Theatre'],
          summary: 'Register a new Theatre account (Step 1 of 2)',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' }, name: { type: 'string' } } } } },
          },
          responses: { 200: { description: 'Theatre credentials created' } },
        },
      },

      '/api/v1/Theatre/Theatre-info': {
        post: {
          tags: ['Theatre'],
          summary: 'Submit theatre venue details (Step 2 of 2)',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', properties: { theatreName: { type: 'string' }, location: { type: 'string' }, capacity: { type: 'integer', example: 300 } } } } },
          },
          responses: { 200: { description: 'Theatre info submitted — awaiting admin approval' } },
        },
      },

      '/api/v1/Theatre/Distribute-Tickets': {
        post: {
          tags: ['Theatre'],
          summary: 'Mark tickets as distributed to buyers (Theatrer only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { ticketId: { type: 'string' }, buyerDetails: { type: 'string' } } } } } },
          responses: { 200: { description: 'Tickets marked as distributed' } },
        },
      },

      '/api/v1/Theatre/Update-TicketsTime': {
        put: {
          tags: ['Theatre'],
          summary: 'Update show timing for tickets (Theatrer only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { ticketId: { type: 'string' }, newTime: { type: 'string', example: '2025-12-25T18:30:00Z' } } } } } },
          responses: { 200: { description: 'Ticket timing updated' } },
        },
      },

      '/api/v1/Theatre/Theatre-Details': {
        get: {
          tags: ['Theatre'],
          summary: 'Get logged-in theatre details (Theatrer only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Theatre details returned' } },
        },
      },

      '/api/v1/Theatre/CalculateTotalSale': {
        get: {
          tags: ['Theatre'],
          summary: 'Get total sales revenue for theatre (Theatrer only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Total sales data returned' } },
        },
      },

      '/api/v1/Theatre/Show-Alloted-Details': {
        get: {
          tags: ['Theatre'],
          summary: 'Get all shows allotted to this theatre (Theatrer only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Allotted shows list returned' } },
        },
      },

      '/api/v1/Theatre/All-Tickets-Details': {
        get: {
          tags: ['Theatre'],
          summary: 'Get all tickets across all shows (Theatrer only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'All tickets returned' } },
        },
      },

      '/api/v1/Theatre/Tickets-Created': {
        get: {
          tags: ['Theatre'],
          summary: 'Get all tickets created for this theatre (Theatrer only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Created tickets returned' } },
        },
      },

      // ════════════════════════════════════════════════
      // ADMIN ROUTES  /api/v1/Admin
      // ════════════════════════════════════════════════
      '/api/v1/Admin/Org-Verification': {
        put: {
          tags: ['Admin'],
          summary: 'Approve or reject an organizer registration (Admin only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { orgId: { type: 'string' }, status: { type: 'boolean' } } } } } },
          responses: { 200: { description: 'Organizer verification status updated' } },
        },
      },

      '/api/v1/Admin/Verify-Show': {
        put: {
          tags: ['Admin'],
          summary: 'Approve or reject a movie show submission (Admin only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { showId: { type: 'string' }, status: { type: 'boolean' } } } } } },
          responses: { 200: { description: 'Show verification status updated' } },
        },
      },

      '/api/v1/Admin/Verify-Theatres': {
        put: {
          tags: ['Admin'],
          summary: 'Approve or reject a theatre registration (Admin only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { theatreId: { type: 'string' }, status: { type: 'boolean' } } } } } },
          responses: { 200: { description: 'Theatre verification updated' } },
        },
      },

      '/api/v1/Admin/Create-Genre': {
        post: {
          tags: ['Admin'],
          summary: 'Create a new genre (Admin only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string', example: 'Thriller' } } } } } },
          responses: { 200: { description: 'Genre created' } },
        },
      },

      '/api/v1/Admin/Get-AllGenre': {
        get: {
          tags: ['Admin'],
          summary: 'Get all genres (Admin only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Genres list returned' } },
        },
      },

      '/api/v1/Admin/Create-Language': {
        post: {
          tags: ['Admin'],
          summary: 'Create a new language entry (Admin only)',
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string', example: 'Tamil' } } } } } },
          responses: { 200: { description: 'Language created' } },
        },
      },

      '/api/v1/Admin/All-Languages': {
        get: {
          tags: ['Admin'],
          summary: 'Get all languages (Admin only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Languages list returned' } },
        },
      },

      '/api/v1/Admin/Unverified-Shows': {
        get: {
          tags: ['Admin'],
          summary: 'Get all pending unverified shows (Admin only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Unverified shows returned' } },
        },
      },

      '/api/v1/Admin/Verified-Shows': {
        get: {
          tags: ['Admin'],
          summary: 'Get all verified shows (Admin only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Verified shows returned' } },
        },
      },

      '/api/v1/Admin/Get-AllTheatres': {
        get: {
          tags: ['Admin'],
          summary: 'Get all registered theatres (Admin only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'All theatres returned' } },
        },
      },

      '/api/v1/Admin/Verified-Users': {
        get: {
          tags: ['Admin'],
          summary: 'Get all verified users (Admin only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Verified users returned' } },
        },
      },

      '/api/v1/Admin/Unverified-Theatres': {
        get: {
          tags: ['Admin'],
          summary: 'Get all unverified theatre registrations (Admin only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Unverified theatres returned' } },
        },
      },

      '/api/v1/Admin/Orgainezer-Details': {
        get: {
          tags: ['Admin'],
          summary: 'Get all organizer details (Admin only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Organizer details returned' } },
        },
      },

      '/api/v1/Admin/Theatre-FormData': {
        post: {
          tags: ['Admin'],
          summary: 'Admin creates/finalises theatre record (Admin only)',
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: 'Theatre record finalised' } },
        },
      },

    }, // end paths
  }, // end definition
  apis: [], // using inline paths above — no need to scan files
};

module.exports = swaggerJsDoc(options);
