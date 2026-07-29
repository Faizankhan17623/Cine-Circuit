import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { MdSupportAgent } from 'react-icons/md';
import { getSocket } from '../../../Services/socket';
import { fetchConversations, fetchMessages, markConversationRead, startConversation } from '../../../Services/operations/Chat';
import { appendMessage, setActiveConversation, upsertConversation } from '../../../Slices/chatSlice';
import { ACCOUNT_TYPE } from '../../../utils/constants';

const CATEGORY_LABEL = {
  Organizer: 'Organizer',
  Theatre: 'Theatre',
  Admin: 'Support',
};

const Chat = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { conversations, activeConversationId, messagesByConversation } = useSelector((state) => state.chat);

  const [draft, setDraft] = useState('');
  const [startingSupport, setStartingSupport] = useState(false);
  const [blockedReason, setBlockedReason] = useState('');
  const bottomRef = useRef(null);

  const isViewer = user?.usertype === ACCOUNT_TYPE.USER;

  const activeConversation = useMemo(
    () => conversations.find((c) => c._id === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  const activeMessages = messagesByConversation[activeConversationId] || [];

  useEffect(() => {
    if (!token) return;
    dispatch(fetchConversations(token));
  }, [token, dispatch]);

  useEffect(() => {
    const fromUrl = searchParams.get('conversation');
    if (fromUrl) {
      dispatch(setActiveConversation(fromUrl));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (!activeConversationId || !token) return;
    dispatch(fetchMessages(activeConversationId, token));
    dispatch(markConversationRead(activeConversationId, token));

    const socket = getSocket();
    if (socket) {
      socket.emit('join_conversation', activeConversationId);
      socket.emit('mark_read', activeConversationId);
    }
  }, [activeConversationId, token, dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onNewMessage = (message) => {
      dispatch(appendMessage(message));
      if (message.conversation === activeConversationId) {
        const socketNow = getSocket();
        socketNow?.emit('mark_read', activeConversationId);
      }
    };
    const onConversationUpdated = (conversation) => {
      dispatch(upsertConversation(conversation));
    };
    const onBlocked = ({ reason }) => {
      setBlockedReason(reason);
    };

    socket.on('new_message', onNewMessage);
    socket.on('conversation_updated', onConversationUpdated);
    socket.on('message_blocked', onBlocked);

    return () => {
      socket.off('new_message', onNewMessage);
      socket.off('conversation_updated', onConversationUpdated);
      socket.off('message_blocked', onBlocked);
    };
  }, [dispatch, activeConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeConversationId]);

  const selectConversation = (id) => {
    dispatch(setActiveConversation(id));
    setSearchParams({ conversation: id });
    setBlockedReason('');
  };

  const viewerBlocked = isViewer && activeConversation?.viewerPendingCount >= 1;

  const handleSend = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeConversationId) return;
    if (viewerBlocked) return;

    const socket = getSocket();
    if (!socket) return;

    socket.emit('send_message', { conversationId: activeConversationId, body: text });
    setDraft('');
  };

  const handleContactSupport = async () => {
    if (!token) return;
    setStartingSupport(true);
    const result = await dispatch(startConversation('Admin', null, token));
    setStartingSupport(false);
    if (result?.success && result.data?._id) {
      selectConversation(result.data._id);
    }
  };

  const counterpartName = (conversation) => {
    if (!conversation) return '';
    if (conversation.category === 'Admin') return 'Cine Circuit Support';
    if (isViewer) return conversation.staff?.userName || CATEGORY_LABEL[conversation.category];
    return conversation.viewer?.userName || 'Viewer';
  };

  return (
    <div className="h-full w-full bg-richblack-900 flex animate-fadeIn overflow-hidden">
      {/* Conversation list */}
      <div className="w-80 flex-shrink-0 border-r border-richblack-700 flex flex-col h-full">
        <div className="px-4 py-4 border-b border-richblack-700 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <IoChatbubblesOutline className="text-yellow-200" /> Chats
          </h2>
          {isViewer && (
            <button
              onClick={handleContactSupport}
              disabled={startingSupport}
              title="Contact Support"
              className="p-2 rounded-lg bg-richblack-800 hover:bg-richblack-700 text-yellow-200 transition-colors disabled:opacity-50"
            >
              <MdSupportAgent className="text-lg" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <div className="px-4 py-8 text-center text-richblack-300 text-sm">
              No conversations yet.
              {isViewer && (
                <p className="mt-2">
                  Message an organizer or theatre from your purchased tickets, or{' '}
                  <button onClick={handleContactSupport} className="text-yellow-200 underline">
                    contact support
                  </button>
                  .
                </p>
              )}
            </div>
          )}

          {conversations.map((conversation) => {
            const unread = isViewer ? conversation.unreadForViewer : conversation.unreadForStaff;
            return (
              <button
                key={conversation._id}
                onClick={() => selectConversation(conversation._id)}
                className={`w-full text-left px-4 py-3 border-b border-richblack-800 hover:bg-richblack-800 transition-colors flex flex-col gap-1 ${
                  activeConversationId === conversation._id ? 'bg-richblack-800' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white text-sm font-medium truncate">
                    {counterpartName(conversation)}
                  </span>
                  {unread > 0 && (
                    <span className="bg-yellow-200 text-richblack-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unread}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-richblack-300 px-1.5 py-0.5 rounded bg-richblack-700 inline-block w-fit">
                    {CATEGORY_LABEL[conversation.category]}
                  </span>
                </div>
                {conversation.lastMessage && (
                  <p className="text-xs text-richblack-400 truncate">{conversation.lastMessage}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 flex flex-col h-full">
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-richblack-400 gap-3">
            <HiOutlineChatBubbleLeftRight className="text-5xl" />
            <p>Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-richblack-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-richblack-900 font-semibold">
                {counterpartName(activeConversation)?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <h3 className="text-white font-semibold">{counterpartName(activeConversation)}</h3>
                <p className="text-xs text-richblack-400">{CATEGORY_LABEL[activeConversation.category]}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
              {activeMessages.map((message) => {
                const mine = String(message.sender) === String(user?._id);
                return (
                  <div key={message._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                        mine
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-richblack-900 rounded-br-sm'
                          : 'bg-richblack-800 text-white rounded-bl-sm'
                      }`}
                    >
                      {message.body}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {blockedReason && (
              <div className="px-6 py-2 text-xs text-yellow-200 bg-yellow-500/10 border-t border-yellow-500/20">
                {blockedReason}
              </div>
            )}

            <form onSubmit={handleSend} className="px-6 py-4 border-t border-richblack-700 flex items-center gap-3">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={viewerBlocked}
                placeholder={viewerBlocked ? 'Waiting for a reply...' : 'Type a message...'}
                className="flex-1 bg-richblack-800 border border-richblack-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-richblack-400 outline-none focus:border-yellow-200/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={viewerBlocked || !draft.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiSend className="text-richblack-900" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
