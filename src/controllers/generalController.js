const saes = require('../services/saes');

async function getHorariosActual(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : null;

    if(credentials){
        try{
            const generalHorariosActual = await saes.getGeneralHorarios(credentials);
    
            res.status(200).json(generalHorariosActual);
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

async function getHorariosProximo(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : null;

    if(credentials){
        try{
            const generalHorariosProximo = await saes.getGeneralHorarios(credentials, true);
    
            res.status(200).json(generalHorariosProximo);
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

async function getAsignaturas(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : null;

    if(credentials){
        try{
            const generalAsignaturas = await saes.getGeneralAsignaturas(credentials);
    
            res.status(200).json(generalAsignaturas);
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

async function getCupos(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : null;

    if(credentials){
        try{
            const generalCupos = await saes.getGeneralCupos(credentials);
    
            res.status(200).json(generalCupos);
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
    getHorariosActual,
    getHorariosProximo,
    getAsignaturas,
    getCupos
}