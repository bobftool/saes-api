const saes = require('../services/saes');

async function session(req, res){
    try{
        const session = await saes.session();

        res.cookie('saesSESSION', session.credential, {
            sameSite: 'none'
        });
        res.json(session);
    }
    catch(error){
        res.json({
            message: 'Ocurrió un error al conectar con el SAES.',
            error: error.message
        });
    }
}

async function login(req, res){
    if(req.cookies['saesSESSION']){
        const loginData = {
            ...req.body,
            credential: req.cookies['saesSESSION']
        };
    
        try{
            const credential = await saes.authenticate(loginData);
        
            const login = credential? {
                username: loginData.username,
                credential,
                time: Date.now(),
                updateAfter: Date.now() + 15*60*1000,
                expires: Date.now() + 30*60*1000
            } : null;
        
            if(login){
                res.cookie('saesLOGIN', login.credential, {
                    sameSite: 'none'
                });
                res.json(login);
            }
            else{
                res.json({message: 'Los datos de inicio de sesión son incorrectos.'});
            }
        }
        catch(error){
            res.json({
                message: 'Se requieren más datos de inicio de sesión.',
                error: error.message
            });
        }
    }
    else{
        res.json({message: 'Se requiere una credencial de sesión.'})
    }
}

module.exports = {
    session,
    login
}