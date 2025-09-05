// data.js
const confessionData = (function() {
    const STORAGE_KEY = 'iiserConfessions';

    // Get all confessions from localStorage
    function getConfessions() {
        const confessionsJSON = localStorage.getItem(STORAGE_KEY);
        return confessionsJSON ? JSON.parse(confessionsJSON) : [];
    }

    // Save confessions to localStorage
    function saveConfessions(confessions) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(confessions));
    }

    // Add a new confession
    function addConfession(text) {
        const confessions = getConfessions();
        const now = new Date();
        const newConfession = {
            id: now.getTime(),
            text: text,
            likes: 0,
            comments: [],
            date: now.toLocaleDateString(),
            timestamp: now.getTime()
        };
        confessions.unshift(newConfession); // Add to beginning
        saveConfessions(confessions);
        return newConfession;
    }

    // Update a confession (for likes/comments)
    function updateConfession(id, updates) {
        const confessions = getConfessions();
        const index = confessions.findIndex(c => c.id == id);
        if (index !== -1) {
            confessions[index] = { ...confessions[index], ...updates };
            saveConfessions(confessions);
            return confessions[index];
        }
        return null;
    }

    // Add a comment to a confession
    function addComment(confessionId, text) {
        const confession = updateConfession(confessionId, {});
        if (confession) {
            const now = new Date();
            const newComment = {
                id: now.getTime(),
                text: text,
                date: now.toLocaleDateString(),
                timestamp: now.getTime()
            };
            confession.comments.push(newComment);
            updateConfession(confessionId, { comments: confession.comments });
            return newComment;
        }
        return null;
    }

    // Get top confessions sorted by likes and comments
    function getTopConfessions(limit = 3) {
        const confessions = getConfessions();
        return sortConfessions(confessions, 'popularity').slice(0, limit);
    }

    // Sort confessions by different criteria
    function sortConfessions(confessions, sortBy) {
        const sorted = [...confessions];
        
        switch(sortBy) {
            case 'date':
                // Sort by timestamp (newest first)
                sorted.sort((a, b) => b.timestamp - a.timestamp);
                break;
            case 'popularity':
                // Sort by likes and comments (most popular first)
                sorted.sort((a, b) => {
                    const aScore = a.likes + a.comments.length;
                    const bScore = b.likes + b.comments.length;
                    return bScore - aScore;
                });
                break;
            case 'likes':
                // Sort by likes (most liked first)
                sorted.sort((a, b) => b.likes - a.likes);
                break;
            case 'comments':
                // Sort by comments (most commented first)
                sorted.sort((a, b) => b.comments.length - a.comments.length);
                break;
            default:
                // Default to newest first
                sorted.sort((a, b) => b.timestamp - a.timestamp);
        }
        
        return sorted;
    }

    return {
        getConfessions,
        addConfession,
        updateConfession,
        addComment,
        getTopConfessions,
        sortConfessions
    };
})();
