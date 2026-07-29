const express = require('express')
const route = express.Router()
const { auth } = require('../middlewares/verification')
const { StartConversation, GetConversations, GetMessages, MarkRead } = require('../controllers/common/Chat')

// Real-time chat — any authenticated role (Viewer/Organizer/Theatrer/Administrator) may use these.
// Live message delivery happens over Socket.IO (see sockets/chat.js); these REST routes handle
// starting conversations, listing the inbox, and loading history/marking read on page load.

route.post('/Start-Conversation', auth, StartConversation)
route.get('/Conversations', auth, GetConversations)
route.get('/Messages/:conversationId', auth, GetMessages)
route.put('/Mark-Read/:conversationId', auth, MarkRead)

module.exports = route
