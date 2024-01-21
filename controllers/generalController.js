const saes = require('../services/saes');

async function getHorariosActual(req, res){
    if(req.cookies['saesSESSION'] && req.cookies['saesLOGIN']){
        const credentials = {
            session: req.cookies['saesSESSION'],
            login: req.cookies['saesLOGIN']
        }

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
        res.json('No cuentas con credenciales de inicio de sesión.');
    }
}

async function getHorariosProximo(req, res){
    if(req.cookies['saesSESSION'] && req.cookies['saesLOGIN']){
        const credentials = {
            session: req.cookies['saesSESSION'],
            login: req.cookies['saesLOGIN']
        }

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
        res.json('No cuentas con credenciales de inicio de sesión.');
    }
}

async function getAsignaturas(req, res){
    if(req.cookies['saesSESSION'] && req.cookies['saesLOGIN']){
        const credentials = {
            session: req.cookies['saesSESSION'],
            login: req.cookies['saesLOGIN']
        }

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
        res.json('No cuentas con credenciales de inicio de sesión.');
    }
}

async function getCupos(req, res){
    if(req.cookies['saesSESSION'] && req.cookies['saesLOGIN']){
        const credentials = {
            session: req.cookies['saesSESSION'],
            login: req.cookies['saesLOGIN']
        }

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
        res.json('No cuentas con credenciales de inicio de sesión.');
    }
}

module.exports = {
    getHorariosActual,
    getHorariosProximo,
    getAsignaturas,
    getCupos
}