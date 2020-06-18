const bcrypt = require('bcryptjs');
const db = require('../lib/dbcfg');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.con.query(
        `SELECT * FROM utilizadores WHERE id = ${id}`,
        (err, user) => {
            if (err) { done(err, null); }
            done(null, user[0]);
        }
    )
});

passport.use(new LocalStrategy((username, password, done) => {
    db.con.query(
        `SELECT * FROM utilizadores WHERE utilizador = ${db.escape(username)};`,
        (err, result) => {
            if (err) throw error;
            const user = result[0];
            if (!user) return done(null, false);
            bcrypt.compare(
                password,
                user.password,
                (bErr, bResult) => {
                    if (bErr) { return done(err); }
                    else if (bResult) {
                        return done(null, user);
                    }
                    else { return done(err); }
                }
            );
        }
    )
}));

module.exports = passport;
