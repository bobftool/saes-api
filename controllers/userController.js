const saes = require('../services/saes');

async function getInfo(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : res.json({message: 'No cuentas con credenciales de inicio de sesión.'});

    try{
        const userInfo = await saes.getUserInfo(credentials);
        
        res.json(userInfo);
    }
    catch(error){
        res.json({
            message: 'Ocurrió un error al conectar con el SAES.',
            error: error.message
        });
    }
}

async function getKardex(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : res.json({message: 'No cuentas con credenciales de inicio de sesión.'});

    try{
        const userKardex = await saes.getUserKardex(credentials);

        res.json(userKardex);
    }
    catch(error){
        res.json({
            message: 'Ocurrió un error al conectar con el SAES.',
            error: error.message
        });
    }
}

async function getHorario(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : res.json({message: 'No cuentas con credenciales de inicio de sesión.'});

    try{
        const userHorario = await saes.getUserHorario(credentials);
    
        res.json(userHorario);
    }
    catch(error){
        res.json({
            message: 'Ocurrió un error al conectar con el SAES.',
            error: error.message
        });
    }
}

async function getCalificaciones(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : res.json({message: 'No cuentas con credenciales de inicio de sesión.'});

    try{
        const userCalificaciones = await saes.getUserCalificaciones(credentials);
    
        res.json(userCalificaciones);
    }
    catch(error){
        res.json({
            message: 'Ocurrió un error al conectar con el SAES.',
            error: error.message
        });
    }
}

module.exports = {
    getInfo,
    getKardex,
    getHorario,
    getCalificaciones
}