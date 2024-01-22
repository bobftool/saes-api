const saes = require('../services/saes');

async function getHorariosActual(req, res){
    const credentials = req.body.credentials?? res.json({message: 'No cuentas con credenciales de inicio de sesión.'});
        
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

async function getHorariosProximo(req, res){
    const credentials = req.body.credentials?? res.json({message: 'No cuentas con credenciales de inicio de sesión.'});

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

async function getAsignaturas(req, res){
    const credentials = req.body.credentials?? res.json({message: 'No cuentas con credenciales de inicio de sesión.'});

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

async function getCupos(req, res){
    const credentials = req.body.credentials?? res.json({message: 'No cuentas con credenciales de inicio de sesión.'});

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

module.exports = {
    getHorariosActual,
    getHorariosProximo,
    getAsignaturas,
    getCupos
}