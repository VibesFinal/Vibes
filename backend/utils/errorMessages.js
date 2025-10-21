export const ERROR_MESSAGES = {

// Authentication & Authorization
AUTH: {
INVALID_TOKEN: "Invalid or expired authentication token.",
TOKEN_MISSING: "Authentication token is missing.",
UNAUTHORIZED: "You must be logged in to perform this action.",
ACCESS_DENIED: "You do not have permission to perform this action.",
LOGIN_FAILED: "Incorrect email or password.",
ACCOUNT_NOT_FOUND: "Account not found.",
ACCOUNT_LOCKED: "Your account has been temporarily locked due to suspicious activity.",
ACCOUNT_INACTIVE: "Your account is not active.",
EMAIL_NOT_VERIFIED: "Please verify your email to continue.",
SESSION_EXPIRED: "Your session has expired. Please log in again.",
PASSWORD_RESET_EXPIRED: "Password reset link has expired.",
INVALID_CREDENTIALS: "Invalid credentials provided.",
MISSING_FIELDS: "Username, email, and password are required.",
INVALID_RESET_TOKEN: "Invalid or expired password reset token",
},

// User Management
USER: {
ALREADY_EXISTS: "A user with this email or username already exists.",
NOT_FOUND: "User not found.",
INVALID_ID: "Invalid user ID format.",
UPDATE_FAILED: "Failed to update user information.",
DELETE_FAILED: "Failed to delete user account.",
AVATAR_UPLOAD_FAILED: "Failed to upload profile picture.",
FRIEND_REQUEST_ALREADY_SENT: "Friend request already sent.",
FRIEND_REQUEST_NOT_FOUND: "Friend request not found.",
CANNOT_FRIEND_SELF: "You cannot add yourself as a friend.",
BLOCK_FAILED: "Failed to block this user.",
UNBLOCK_FAILED: "Failed to unblock this user.",
PRIVACY_SETTINGS_UPDATE_FAILED: "Failed to update privacy settings.",
},

// Following / Followers
FOLLOW: {
FOLLOW_FAILED: "Failed to follow the user.",
UNFOLLOW_FAILED: "Failed to unfollow the user.",
ALREADY_FOLLOWING: "You are already following this user.",
NOT_FOLLOWING: "You are not following this user.",
FOLLOW_SUCCESS: "Successfully followed the user.",
UNFOLLOW_SUCCESS: "Successfully unfollowed the user.",
},

// Communities / Groups
COMMUNITY: {
NOT_FOUND: "Community not found.",
CREATE_FAILED: "Failed to create the community.",
UPDATE_FAILED: "Failed to update community.",
DELETE_FAILED: "Failed to delete community.",
JOIN_FAILED: "Failed to join community.",
CREATE_COMMUNITY: "Community created successfully.",
MISSING_FIELDS: "All fields (name, description, icon, tags) are required.",
},

// Posts
POST: {
NOT_FOUND: "Post not found.",
CREATE_FAILED: "Failed to create post.",
UPDATE_FAILED: "Failed to update post.",
DELETE_FAILED: "Failed to delete post.",
EMPTY_CONTENT: "Post content cannot be empty.",
INVALID_IMAGE: "Invalid or unsupported image format.",
TOO_LONG: "Post exceeds the maximum allowed length.",
PERMISSION_DENIED: "You cannot modify this post.",
SCHEDULE_FAILED: "Failed to schedule post.",
},

// Comments
COMMENT: {
NOT_FOUND: "Comment not found.",
CREATE_FAILED: "Failed to post your comment.",
UPDATE_FAILED: "Failed to update comment.",
DELETE_FAILED: "Failed to delete comment.",
EMPTY_CONTENT: "Comment cannot be empty.",
REPLY_FAILED: "Failed to reply to this comment.",
FAILED_TO_FETCH: "Failed to fetch comments",
},

// Reactions / Likes
REACTION: {
ALREADY_LIKED: "You already liked this post.",
NOT_LIKED: "You have not liked this post yet.",
REACTION_FAILED: "Failed to react to the post.",
REMOVE_FAILED: "Failed to remove reaction.",
},

// Media Uploads
MEDIA: {
UPLOAD_FAILED: "Failed to upload file.",
INVALID_TYPE: "Unsupported file type.",
TOO_LARGE: "File size exceeds the maximum limit.",
NOT_FOUND: "Media file not found.",
DELETE_FAILED: "Failed to delete media file.",
STORAGE_FULL: "Storage limit reached. Please delete unused files.",
COMPRESSION_FAILED: "Failed to compress image or video.",
UPLOAD_CERTIFI: "Certification file is required.",
UPLOAD_FAILED_CERTIFI: "Failed to upload certification file.",
},

// Messaging / Chat
CHAT: {
MESSAGE_SEND_FAILED: "Failed to send message.",
MESSAGE_SEND_SUCCESS: "Message sent successfully.",
MESSAGE_NOT_FOUND: "Message not found.",
CONVERSATION_NOT_FOUND: "Conversation not found.",
UNAUTHORIZED_ACCESS: "You cannot access this conversation.",
EMPTY_MESSAGE: "Message cannot be empty.",
ATTACHMENT_TOO_LARGE: "Message attachment is too large.",
GROUP_CREATION_FAILED: "Failed to create group chat.",
LOAD_HISTORY_FAILED: "Failed to load chat history.",
},

// Notifications
NOTIFICATION: {
FETCH_FAILED: "Failed to load notifications.",
MARK_READ_FAILED: "Failed to mark notification as read.",
DELETE_FAILED: "Failed to delete notification.",
SUBSCRIBE_FAILED: "Failed to subscribe to notifications.",
NOTIFICATION_SUCCESS: "Notification sent successfully.",
NOTIFICATION_FAILED: "Failed to send notification.",
},

// Search & Feed
FEED: {
LOAD_FAILED: "Failed to load feed.",
FILTER_INVALID: "Invalid feed filter option.",
REFRESH_FAILED: "Failed to refresh feed.",
},

SEARCH: {
QUERY_EMPTY: "Search query cannot be empty.",
NO_RESULTS: "No results found.",
FAILED: "Search request failed.",
},

// System & Server
SYSTEM: {
DATABASE_ERROR: "A database error occurred.",
SERVER_ERROR: "Internal server error occurred.",
UNKNOWN: "Something went wrong. Please try again later.",
RATE_LIMIT: "Too many requests. Please slow down.",
SERVICE_UNAVAILABLE: "Service temporarily unavailable.",
TIMEOUT: "The request timed out. Please try again.",
DEPENDENCY_FAILED: "One of the required services failed.",
},

// API / Network
NETWORK: {
CONNECTION_FAILED: "Unable to connect to the server.",
RESPONSE_INVALID: "Received invalid response from the server.",
ENDPOINT_NOT_FOUND: "Requested endpoint not found.",
},

// Payments (if integrated)
PAYMENT: {
PROCESS_FAILED: "Payment process failed.",
CARD_DECLINED: "Card was declined.",
INVALID_CARD: "Invalid card information.",
INSUFFICIENT_FUNDS: "Insufficient funds.",
PAYMENT_NOT_FOUND: "Payment record not found.",
},

// Ads / Promotions
ADS: {
CREATION_FAILED: "Failed to create advertisement.",
UPDATE_FAILED: "Failed to update advertisement.",
DELETE_FAILED: "Failed to delete advertisement.",
INVALID_BUDGET: "Invalid budget or duration provided.",
},

// Integrations (External APIs)
INTEGRATION: {
THIRD_PARTY_FAILED: "Third-party integration failed.",
API_KEY_MISSING: "Missing or invalid API key.",
WEBHOOK_ERROR: "Webhook processing failed.",
},
};
