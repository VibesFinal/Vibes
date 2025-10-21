// frontend/src/utils/errorMapper.js

export const errorMapper = {
  // Auth & login
  "Invalid or expired token.": "Your session has expired. Please log in again.",
  "You must be logged in to perform this action.": "Please log in to continue.",
  "You do not have permission to perform this action.": "You don’t have permission to do that.",
  "Incorrect email or password.": "Invalid email or password. Try again.",
  "Account not found.": "This account doesn’t exist.",
  "Your account has been temporarily locked.": "Your account is locked for security reasons.",
  "Your account is not active.": "This account is currently inactive.",
  "Please verify your email before continuing.": "Please verify your email to continue.",
  "Authentication token is missing.": "Login required to access this feature.",

  // User
  "A user with this email already exists.": "An account with this email already exists.",
  "User not found.": "User not found.",
  "Invalid user ID format.": "Something went wrong with this profile.",
  "Failed to update user information.": "Couldn’t save your profile changes.",
  "Could not delete the user.": "Couldn’t delete the account.",
  "Friend request already sent.": "You’ve already sent a friend request.",
  "Friend request not found.": "Friend request not found.",
  "You cannot add yourself as a friend.": "You can’t add yourself.",

  // Posts
  "Post not found.": "This post doesn’t exist anymore.",
  "Failed to create post.": "Couldn’t create your post.",
  "Failed to update post.": "Couldn’t update your post.",
  "Failed to delete post.": "Couldn’t delete this post.",
  "Post content cannot be empty.": "Your post can’t be empty.",
  "Invalid or unsupported image format.": "Please upload a supported image type.",
  "Post exceeds the maximum length.": "Your post is too long.",

  // Comments
  "Comment not found.": "Comment no longer exists.",
  "Failed to post your comment.": "Couldn’t add your comment.",
  "Failed to delete comment.": "Couldn’t remove this comment.",
  "Comment cannot be empty.": "Please write something before commenting.",

  // Reactions / Likes
  "You have already liked this post.": "You’ve already liked this post.",
  "You have not liked this post yet.": "You haven’t liked this post yet.",
  "Failed to react to the post.": "Couldn’t add your reaction.",

  // Media
  "Failed to upload file.": "Couldn’t upload your file.",
  "Unsupported file type.": "This file type isn’t supported.",
  "File size exceeds the maximum allowed limit.": "Your file is too large.",
  "Media file not found.": "Media not found.",
  "Failed to delete media file.": "Couldn’t remove this file.",

  // Chat
  "Failed to send message.": "Couldn’t send your message.",
  "Message not found.": "Message not found.",
  "Conversation not found.": "Conversation no longer exists.",
  "You cannot access this conversation.": "You don’t have access to this chat.",
  "Message cannot be empty.": "Type something before sending.",

  // Notifications
  "Failed to load notifications.": "Couldn’t load your notifications.",
  "Failed to mark notification as read.": "Couldn’t update your notifications.",

  // Feed & Search
  "Failed to load feed.": "Couldn’t load your feed right now.",
  "Invalid feed filter option.": "Invalid filter option.",
  "Search query cannot be empty.": "Please type something to search.",
  "No results found.": "No matches found.",
  "Search request failed.": "Search failed. Try again later.",

  // System
  "A database error occurred.": "Server issue — please try again later.",
  "An internal server error occurred.": "Something went wrong. Please try again.",
  "Something went wrong. Please try again later.": "Oops! Something went wrong.",
  "You are sending too many requests. Please wait a moment.": "Too many actions. Slow down a bit.",
  "Service temporarily unavailable.": "Service is currently down. Try again soon.",
  "Request timed out. Please try again.": "The request took too long. Please retry.",
  "Network Error": "Can’t connect to the server. Check your internet.",
};
