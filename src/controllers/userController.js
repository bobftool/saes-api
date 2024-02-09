const saes = require('../services/saes');

async function getInfo(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : null;

    if(credentials){
        try{
            const userInfo = await saes.getUserInfo(credentials);
            
            res.status(200).json(userInfo);
        }
        catch(error){
            res.status(500).json({
                message: 'Ocurrió un error al conectar con el SAES.',
                error: error.message
            });
        }
    }
    else{
        res.status(401).json({message: 'No cuentas con credenciales de inicio de sesión.'});
    }
}

async function getKardex(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : null;

    if(credentials){
        try{
            const userKardex = await saes.getUserKardex(credentials);
    
            res.status(200).json(userKardex);
        }
        catch(error){
            res.status(500).json({
                message: 'Ocurrió un error al conectar con el SAES.',
                error: error.message
            });
        }
    }
    else{
        res.status(401).json({message: 'No cuentas con credenciales de inicio de sesión.'});
    }
}

async function getHorario(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : null;

    if(credentials){
        try{
            const userHorario = await saes.getUserHorario(credentials);
        
            res.status(200).json(userHorario);
        }
        catch(error){
            res.status(500).json({
                message: 'Ocurrió un error al conectar con el SAES.',
                error: error.message
            });
        }
    }
    else{
        res.status(401).json({message: 'No cuentas con credenciales de inicio de sesión.'});
    }
}

async function getCalificaciones(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : null;

    if(credentials){
        try{
            const userCalificaciones = await saes.getUserCalificaciones(credentials);
        
            res.status(200).json(userCalificaciones);
        }
        catch(error){
            res.status(500).json({
                message: 'Ocurrió un error al conectar con el SAES.',
                error: error.message
            });
        }
    }
    else{
        res.status(401).json({message: 'No cuentas con credenciales de inicio de sesión.'});
    }
}

module.exports = {
    getInfo,
    getKardex,
    getHorario,
    getCalificaciones
}