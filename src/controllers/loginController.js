const saes = require('../services/saes');

async function session(req, res){
    try{
        const session = await saes.session();
        
        res.status(200).json(session);
    }
    catch(error){
        res.status(500).json({
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
    
            login? res.status(200).json(login) : res.status(401).json({message: 'Los datos de inicio de sesión son incorrectos.'});
        }
        catch(error){
            res.status(400).json({
                message: 'Se requieren más datos de inicio de sesión.',
                error: error.message
            });
        }
    }
    else{
        res.status(401).json({message: 'No cuentas con credencial de sesión.'});
    }
}

module.exports = {
    session,
    login
}