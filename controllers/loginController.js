const saes = require('../services/saes');

async function session(req, res){
    try{
        const session = await saes.session();

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
    const loginData = req.body;

    try{
        const credential = await saes.authenticate(loginData);
    
        const login = credential? {
            username: loginData.username,
            credentials: {
                login: credential,
                session: loginData.credential
            },
            time: Date.now(),
            updateAfter: Date.now() + 15*60*1000,
            expires: Date.now() + 30*60*1000
        } : null;

        login? res.json(login) : res.json({message: 'Los datos de inicio de sesión son incorrectos.'});
    }
    catch(error){
        res.json({
            message: 'Se requieren más datos de inicio de sesión.',
            error: error.message
        });
    }
}

module.exports = {
    session,
    login
}