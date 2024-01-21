const saes = require('../services/saes');

async function getInfo(req, res){
    if(req.cookies['saesSESSION'] && req.cookies['saesLOGIN']){
        const credentials = {
            session: req.cookies['saesSESSION'],
            login: req.cookies['saesLOGIN']
        }

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
    else{
        res.json({message: 'No cuentas con credenciales de inicio de sesión.'});
    }
}

async function getKardex(req, res){
    if(req.cookies['saesSESSION'] && req.cookies['saesLOGIN']){
        const credentials = {
            session: req.cookies['saesSESSION'],
            login: req.cookies['saesLOGIN']
        }

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
    else{
        res.json('No cuentas con credenciales de inicio de sesión.');
    }
}

async function getHorario(req, res){
    if(req.cookies['saesSESSION'] && req.cookies['saesLOGIN']){
        const credentials = {
            session: req.cookies['saesSESSION'],
            login: req.cookies['saesLOGIN']
        }

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
    else{
        res.json('No cuentas con credenciales de inicio de sesión.');
    }
}

async function getCalificaciones(req, res){
    if(req.cookies['saesSESSION'] && req.cookies['saesLOGIN']){
        const credentials = {
            session: req.cookies['saesSESSION'],
            login: req.cookies['saesLOGIN']
        }

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
    else{
        res.json('No cuentas con credenciales de inicio de sesión.');
    }
}

module.exports = {
    getInfo,
    getKardex,
    getHorario,
    getCalificaciones
}