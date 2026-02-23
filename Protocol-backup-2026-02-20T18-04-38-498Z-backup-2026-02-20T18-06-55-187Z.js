module.exports = {
  success(result) {
    return { ok: true, result };
  },

  failure(message) {
    return { ok: false, error: message };
  }
};
