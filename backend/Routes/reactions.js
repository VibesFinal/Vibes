const express = require('express');
const router = express.Router();
const pg = require('pg');
const routeGuard = require('../middleware/verifyToken');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Valid reaction types for mental health platform
const VALID_REACTIONS = ['inspire', 'love', 'care', 'strength', 'hope', 'empathy', 'hug'];

// Add or update a reaction to a post
router.post("/reaction/:postId", routeGuard, async (req, res) => {
    const userId = req.user.id;
    const { postId } = req.params;
    const { reactionType } = req.body;

    // Validate reaction type
    if (!VALID_REACTIONS.includes(reactionType)) {
        return res.status(400).json({ 
            error: "Invalid reaction type", 
            validReactions: VALID_REACTIONS 
        });
    }

    try {
        // First, remove any existing reaction from this user for this post
        await pool.query(
            "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
            [userId, postId]
        );

        // Then add the new reaction
        await pool.query(
            "INSERT INTO likes (user_id, post_id, reaction_type) VALUES ($1, $2, $3)",
            [userId, postId, reactionType]
        );

        res.status(200).json({ message: "Reaction added successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Remove a reaction from a post
router.delete("/reaction/:postId", routeGuard, async (req, res) => {
    const userId = req.user.id;
    const { postId } = req.params;

    try {
        await pool.query(
            "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
            [userId, postId]
        );

        res.status(200).json({ message: "Reaction removed successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all reactions for a post with counts
router.get("/reactions/:postId", routeGuard, async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        // Get reaction counts grouped by type
        const countResult = await pool.query(
            `SELECT reaction_type, COUNT(*) as count 
             FROM likes 
             WHERE post_id = $1 
             GROUP BY reaction_type`,
            [postId]
        );

        // Get user's current reaction for this post
        const userReactionResult = await pool.query(
            "SELECT reaction_type FROM likes WHERE user_id = $1 AND post_id = $2",
            [userId, postId]
        );

        // Format response
        const reactions = {};
        VALID_REACTIONS.forEach(type => {
            reactions[type] = 0;
        });

        countResult.rows.forEach(row => {
            reactions[row.reaction_type] = parseInt(row.count);
        });

        const userReaction = userReactionResult.rows.length > 0 
            ? userReactionResult.rows[0].reaction_type 
            : null;

        res.status(200).json({
            reactions,
            userReaction,
            totalReactions: Object.values(reactions).reduce((sum, count) => sum + count, 0)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get users who reacted with a specific reaction type
router.get("/reactions/:postId/:reactionType", routeGuard, async (req, res) => {
    const { postId, reactionType } = req.params;

    if (!VALID_REACTIONS.includes(reactionType)) {
        return res.status(400).json({ 
            error: "Invalid reaction type", 
            validReactions: VALID_REACTIONS 
        });
    }

    try {
        const result = await pool.query(
            `SELECT u.id, u.username, l.created_at 
             FROM likes l 
             JOIN users u ON l.user_id = u.id 
             WHERE l.post_id = $1 AND l.reaction_type = $2 
             ORDER BY l.created_at DESC`,
            [postId, reactionType]
        );

        res.status(200).json({
            reactionType,
            users: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get reaction summary for multiple posts (useful for feed)
router.post("/reactions/summary", routeGuard, async (req, res) => {
    const { postIds } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(postIds) || postIds.length === 0) {
        return res.status(400).json({ error: "postIds must be a non-empty array" });
    }

    try {
        // Get reaction counts for all posts
        const countResult = await pool.query(
            `SELECT post_id, reaction_type, COUNT(*) as count 
             FROM likes 
             WHERE post_id = ANY($1) 
             GROUP BY post_id, reaction_type`,
            [postIds]
        );

        // Get user's reactions for these posts
        const userReactionsResult = await pool.query(
            `SELECT post_id, reaction_type 
             FROM likes 
             WHERE user_id = $1 AND post_id = ANY($2)`,
            [userId, postIds]
        );

        // Format response
        const summary = {};
        postIds.forEach(postId => {
            summary[postId] = {
                reactions: {},
                userReaction: null,
                totalReactions: 0
            };
            VALID_REACTIONS.forEach(type => {
                summary[postId].reactions[type] = 0;
            });
        });

        countResult.rows.forEach(row => {
            const postId = row.post_id;
            const reactionType = row.reaction_type;
            const count = parseInt(row.count);
            
            if (summary[postId]) {
                summary[postId].reactions[reactionType] = count;
                summary[postId].totalReactions += count;
            }
        });

        userReactionsResult.rows.forEach(row => {
            const postId = row.post_id;
            if (summary[postId]) {
                summary[postId].userReaction = row.reaction_type;
            }
        });

        res.status(200).json({ summary });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;