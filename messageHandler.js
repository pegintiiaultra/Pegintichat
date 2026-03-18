const processMessage = async (message, userId) => {
    // ✅ RECHERCHES PEGINTI UNIQUEMENT
    const response = await pegintiAI.search(message);
    return response;
};
module.exports = { processMessage };
