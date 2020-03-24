const bcrypt = require("bcryptjs");
const router = require("express").Router();
const Users = require("../users/users-model");

router.post("/register", (req, res) => {
    const userInfo = req.body;
    // the pasword will be hashed and re-hashed 2 ^ 8 time
    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

    userInfo.password = hash;

    Users.add(userInfo)
      .then(user => {
        res.json(user);
      })
      .catch(err => res.send(err));
  });

  router.post("/login", (req, res) => {
    const {username, password} = req.body;

    Users.findBy({ username })

    .then(([user]) => {
        if(user && bcrypt.compareSync(password, user.password)){

            req.session.user = {
                id: user.id,
                username: user.username,
            };

            res.status(200).json({hello: user.username})
        } else{
            res.status(401).json({message: "invalid credentials"})
        }
    })
    .catch(err => {
        res.status(500).json({errorMessage: "error finding the user"})
    })
  });
  router.get('/logout', (req, res) => {
    req.session ?
      req.session.destroy(error => {
        error
          ? res.status(500).json({ message: 'YOU SHALL NOT LOG OUT'})
          : res.status(200).json({ message: 'logged out'})
      }) :
      res.status(200).json({message: "I don't know you peasant" })
  });


module.exports = router;