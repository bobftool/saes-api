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
    const credential = req.headers.session?? null;
    const loginData = req.body;

    if(credential){
        try{
            const credentials = await saes.authenticate(credential, loginData);
        
            const login = credentials? {
                username: loginData.username,
                credentials,
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
    else{
        res.json({message: 'No cuentas con credencial de sesión.'});
    }
}

module.exports = {
    session,
    login
}