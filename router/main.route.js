const router = require('express').Router();
const passport = require('../middleware/auth');
const auth = require('connect-ensure-login');
const db = require('../lib/dbcfg');
const matriculaController = require('../controllers/matriculas_controller');
const searchController = require('../controllers/search_controller');
const matriculaAutoController = require('../controllers/matriculas_auto_controller')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const multer = require('multer');
const upload = multer({ dest: './tmp/' });
const alpr = require('../lib/alpr');

const sessionStore = new MySQLStore({
    host: db.host,
    port: 3306,
    user: db.user,
    password: db.password,
    database: db.schema
});

require('dotenv').config()

router.use(session({
    key: '_regMatri',
    secret: process.env.SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());

router.get('/', function(req, res) {
    res.render('index', { utilizador: req.user ? req.user.utilizador : null });
});

router.get('/login', function(req, res) {
    res.render('login', { utilizador: req.user ? req.user.utilizador : null });
})

router.get('/logout', function (req, res){
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.render('login', { erro: true }); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/registar-matriculas');
        });
    })(req, res, next);
});

// registar matriculas manualmente (get)
router.get('/registar-matriculas', auth.ensureLoggedIn(), (req, res, next) => {
    const regioesPortugal = require('../lib/regioes_portugal')
    res.render('registar_matricula', {
        regioes: regioesPortugal,
        erro: false,
        mensagem: false,
        sucesso: false,
        utilizador: req.user ? req.user.utilizador : null
    })
});

// registar matriculas manualmente (post)
router.post('/registar-matriculas', [auth.ensureLoggedIn(), upload.single('imagem')], (req, res, next) => {
    const regioesPortugal = require('../lib/regioes_portugal')
    matriculaController.registarMatricula(req.body, req.file).then(function (resultado) {
        if (resultado.erro) {
            res.render('registar_matricula', {
                regioes: regioesPortugal,
                erro: true,
                mensagem: resultado.mensagem,
                sucesso: false,
                utilizador: req.user ? req.user.utilizador : null
            })
        } else if (resultado.sucesso) {
            res.render('registar_matricula', {
                regioes: regioesPortugal,
                erro: false,
                mensagem: null,
                sucesso: true,
                utilizador: req.user ? req.user.utilizador : null
            })
        } else {
            res.render('registar_matricula', {
                regioes: regioesPortugal,
                erro: true,
                mensagem: 'Erro desconhecido! Por favor tente mais tarde...',
                sucesso: false,
                utilizador: req.user ? req.user.utilizador : null
            })
        }
    })

});

// registar matriculas automaticamente (get)
router.get('/registar-matriculas-auto', auth.ensureLoggedIn(), (req, res, next) => {
    alpr.verificarAlpr().then(function (resultado) {
        if(resultado) {
            const regioesPortugal = require('../lib/regioes_portugal')
            res.render('registar_matricula_auto', {
                regioes: regioesPortugal,
                erro: false,
                mensagem: false,
                sucesso: false,
                utilizador: req.user ? req.user.utilizador : null
            })
        } else {
            req.session.erro = "Para utilizar esta funcionalidade é necessário instalar OpenALPR no sistema operativo."
            res.redirect("/erro");
        }
    })
});

// registar matriculas automaticamente (post)
router.post('/registar-matriculas-auto', [auth.ensureLoggedIn(), upload.single('imagem')], (req, res, next) => {
    const regioesPortugal = require('../lib/regioes_portugal')
    matriculaAutoController.encontrarMatriculas(req.body, req.file).then(function (resultado) {
        if (resultado.erro) {
            res.render('registar_matricula_auto', {
                regioes: regioesPortugal,
                erro: true,
                mensagem: resultado.mensagem,
                sucesso: false,
                utilizador: req.user ? req.user.utilizador : null
            })
        } else if (resultado.sucesso) {
            res.render('tabela_auto', {
                regioes: regioesPortugal,
                erro: false,
                mensagem: null,
                sucesso: true,
                matriculas: resultado.matriculas,
                dados: req.body,
                imagem: resultado.imagem,
                utilizador: req.user ? req.user.utilizador : null
            })
        } else {
            res.render('registar_matricula_auto', {
                regioes: regioesPortugal,
                erro: true,
                mensagem: 'Erro desconhecido! Por favor tente mais tarde...',
                sucesso: false,
                utilizador: req.user ? req.user.utilizador : null
            })
        }
    })

});

router.post('/registar', auth.ensureLoggedIn(), (req, res, next) => {
    const resultado = matriculaController.registarMatriculaSemVerificacao(req.body, req.body.imagem)
    res.status(200).send('OK')
})

router.get('/pesquisar', function(req, res) {
    const regioesPortugal = require('../lib/regioes_portugal')
    res.render('search', { regioes: regioesPortugal, utilizador: req.user ? req.user.utilizador : null })
});

router.post('/pesquisar', function(req, res) {
    searchController.pesquisarOcorrencia(req.body).then(function(resultado) {
        res.end(JSON.stringify(resultado))
    });
});

router.get('/erro', function (req, res){
    res.render('erro', {
      erro: req.session.erro ? req.session.erro : 'Não foi possível concluir o pedido. Por favor tente mais tarde.'
    })
});

router.get('/sobre', function(req, res) {
    res.render('sobre')
});

module.exports = router;
