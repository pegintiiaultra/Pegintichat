cat > src/mcp.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'MCP - Mission Control Panel actif 🇨🇲' });
});

module.exports = router;
EOF
