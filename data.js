// data.js
const confessionData = (function() {
    const confessionsRef = database.ref('confessions');

    // Get all confessions from Firebase
    function getConfessions(callback) {
        confessionsRef.once('value', (snapshot) => {
            const confessions = [];
            snapshot.forEach((childSnapshot) => {
                const confession = childSnapshot.val();
                confession.id = childSnapshot.key;
                confessions.push(confession);
            });
            callback(confessions);
        });
    }

    // Add a new confession to Firebase
    function addConfession(text) {
        const now = new Date();
        const newConfession = {
            text: text,
            likes: 0,
            comments: [],
            date: now.toLocaleDateString(),
            timestamp: now.getTime()
        };
        return confessionsRef.push(newConfession);
    }

    // Update a confession (for likes/comments)
    function updateConfession(id, updates) {
        return database.ref(`confessions/${id}`).update(updates);
    }

    // Add a comment to a confession
    function addComment(confessionId, text) {
        const now = new Date();
        const newComment = {
            text: text,
            date: now.toLocaleDateString(),
            timestamp: now.getTime()
        };
        return database.ref(`confessions/${confessionId}/comments`).push(newComment);
    }

    // Get top confessions sorted by likes and comments
    function getTopConfessions(limit = 3, callback) {
        getConfessions((confessions) => {
            const sorted = sortConfessions(confessions, 'popularity').slice(0, limit);
            callback(sorted);
        });
    }

    // Sort confessions by different criteria
    function sortConfessions(confessions, sortBy) {
        const sorted = [...confessions];
        
        switch(sortBy) {
            case 'date':
                sorted.sort((a, b) => b.timestamp - a.timestamp);
                break;
            case 'popularity':
                sorted.sort((a, b) => {
                    const aScore = a.likes + (a.comments ? a.comments.length : 0);
                    const bScore = b.likes + (b.comments ? b.comments.length : 0);
                    return bScore - aScore;
                });
                break;
            case 'likes':
                sorted.sort((a, b) => b.likes - a.likes);
                break;
            case 'comments':
                sorted.sort((a, b) => {
                    const aComments = a.comments ? a.comments.length : 0;
                    const bComments = b.comments ? b.comments.length : 0;
                    return bComments - aComments;
                });
                break;
            default:
                sorted.sort((a, b) => b.timestamp - a.timestamp);
        }
        
        return sorted;
    }

    // Listen for real-time updates
    function onConfessionUpdate(callback) {
        confessionsRef.on('value', (snapshot) => {
            const confessions = [];
            snapshot.forEach((childSnapshot) => {
                const confession = childSnapshot.val();
                confession.id = childSnapshot.key;
                confessions.push(confession);
            });
            callback(confessions);
        });
    }

    return {
        getConfessions,
        addConfession,
        updateConfession,
        addComment,
        getTopConfessions,
        sortConfessions,
        onConfessionUpdate
    };
})();
