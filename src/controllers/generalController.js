const saes = require('../services/saes');

async function getHorariosActual(req, res){
    const credentials = req.headers.login && req.headers.session? {
        login: req.headers.login,
        session: req.headers.session
    } : null;

    if(credentials){
        try{
            const generalHorariosActual = await saes.getGeneralHorarios(credentials);
    
            res.json(generalHorariosActual);
        }
        catch(error){
            res.json({
                message: 'Ocurrió un error al conectar con el SAES.',
                error: error.message
            });
        }
    }
    else{
        res.json({message: 'No cuentas con credenciales de inicio de sesión.'});
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
    
            res.json(generalHorariosProximo);
        }
        catch(error){
            res.json({
                message: 'Ocurrió un error al conectar con el SAES.',
                error: error.message
            });
        }
    }
    else{
        res.json({message: 'No cuentas con credenciales de inicio de sesión.'});
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
    
            res.json(generalAsignaturas);
        }
        catch(error){
            res.json({
                message: 'Ocurrió un error al conectar con el SAES.',
                error: error.message
            });
        }
    }
    else{
        res.json({message: 'No cuentas con credenciales de inicio de sesión.'});
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
    
            res.json(generalCupos);
        }
        catch(error){
            res.json({
                message: 'Ocurrió un error al conectar con el SAES.',
                error: error.message
            });
        }
    }
    else{
        res.json({message: 'No cuentas con credenciales de inicio de sesión.'});
    }
}

module.exports = {
    getHorariosActual,
    getHorariosProximo,
    getAsignaturas,
    getCupos
}