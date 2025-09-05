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
        const newConfession = {
            id: Date.now(),
            text: text,
            likes: 0,
            comments: [],
            date: new Date().toLocaleDateString()
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
            const newComment = {
                id: Date.now(),
                text: text,
                date: new Date().toLocaleDateString()
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
        return confessions
            .sort((a, b) => {
                // First sort by likes
                if (b.likes !== a.likes) return b.likes - a.likes;
                // Then by number of comments
                return b.comments.length - a.comments.length;
            })
            .slice(0, limit);
    }

    return {
        getConfessions,
        addConfession,
        updateConfession,
        addComment,
        getTopConfessions
    };
})();