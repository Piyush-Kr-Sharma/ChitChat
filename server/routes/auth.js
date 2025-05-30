const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
} = require("../controllers/userController");
const upload = require("../middleware/multer");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", upload.single("avatar"), setAvatar);
router.get("/logout/:id", logOut);

module.exports = router;
