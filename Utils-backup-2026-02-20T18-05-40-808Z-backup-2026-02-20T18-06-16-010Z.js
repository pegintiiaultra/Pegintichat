cat > src/utils.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    utils: ['ping', 'health', 'stats'],
    message: 'Utilitaires PEGINTI ⚙️'
  });
});

module.exports = router;
EOF
