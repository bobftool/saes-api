const axios = require('axios').default;
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const { JSDOM } = require('jsdom');

//
async function getPage(url, cookie){
    const response = await axios.get(url, {
        headers: {
            Cookie: cookie
        }
    });
    let html = response.data;
    let page = (new JSDOM(html)).window.document;

    return page;
}
//

//
async function postPage(url, cookie, data){
    const response = await axios.post(url, data, {
        headers: {
            Cookie: cookie,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    let html = response.data;
    let page = (new JSDOM(html)).window.document;

    return page;
}
//

async function session(){
    const response = await axios.get('https://www.saes.upiita.ipn.mx/', {
        headers: {
            Cookie: 'AspxAutoDetectCookieSupport=1'
        }
    });
    let html = response.data;
    let page = (new JSDOM(html)).window.document;

    let credential = response.headers['set-cookie'][0].split('; ')[0].split('=')[1];
    let captchaId = page.getElementById('LBD_VCID_c_default_ctl00_leftcolumn_loginuser_logincaptcha').value;
    let captchaImageUrl = 'https://www.saes.upiita.ipn.mx/' + page.getElementById('c_default_ctl00_leftcolumn_loginuser_logincaptcha_CaptchaImage').src.split('/').pop();
    let captchaImageRequest = await axios.get(captchaImageUrl, {
        headers: {
            Cookie: 'ASP.NET_SessionId=' + credential
        },
        responseType: 'arraybuffer'
    });
    let captchaImageBase64 = Buffer.from(captchaImageRequest.data, 'binary').toString('base64');

    const session = {
        credential,
        captcha: {
            id: captchaId,
            imageBase64: captchaImageBase64
        }
    }

    return session;
}

async function authenticate(credential, loginData){
    const data = {
        '__VIEWSTATE': '/wEPDwUJNDM4MjMwNTM1D2QWAmYPZBYCAgMPZBYKAgEPDxYCHghJbWFnZVVybAUVfi9JbWFnZXMvbG9nb3MvNjQucG5nZGQCBQ88KwANAgAPFgIeC18hRGF0YUJvdW5kZ2QMFCsAAgUDMDowFCsAAhYSHgVWYWx1ZQUGSW5pY2lvHglEYXRhQm91bmRnHghTZWxlY3RlZGceBFRleHQFBkluaWNpbx4LTmF2aWdhdGVVcmwFDS9kZWZhdWx0LmFzcHgeB0VuYWJsZWRnHgpTZWxlY3RhYmxlZx4HVG9vbFRpcAUGSW5pY2lvHghEYXRhUGF0aAUNL2RlZmF1bHQuYXNweBQrAAQFCzA6MCwwOjEsMDoyFCsAAhYQHwUFClJlZ2xhbWVudG8fAgUKUmVnbGFtZW50bx8GBRgvUmVnbGFtZW50by9EZWZhdWx0LmFzcHgfCQUKUmVnbGFtZW50bx8HZx8IZx8KBRgvcmVnbGFtZW50by9kZWZhdWx0LmFzcHgfA2dkFCsAAhYQHwUFBUF5dWRhHwIFBUF5dWRhHwYFES9BeXVkYS9BeXVkYS5hc3B4HwkFBUF5dWRhHwdnHwhnHwoFES9heXVkYS9heXVkYS5hc3B4HwNnZBQrAAIWEB8FBRVSZWN1cGVyYXIgQ29udHJhc2XDsWEfAgUVUmVjdXBlcmFyIENvbnRyYXNlw7FhHwYFHC9TZW5kRW1haWwvUmVjdXBlcmFQYXNzLmFzcHgfCQUqUmVjdXBlcmFyIGxhIENvbnRyYXNlw7FhIGRlIGFjY2VzbyBhbCBTQUVTHwdnHwhnHwoFHC9zZW5kZW1haWwvcmVjdXBlcmFwYXNzLmFzcHgfA2dkZAIID2QWAgIDDw8WAh8FBYcSPENFTlRFUj4gIDxkaXYgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IzZDMTQ1ODsgY29sb3I6d2hpdGU7IGZvbnQtc2l6ZToxNnB4OyBmb250LXdlaWdodDpib2xkOyBXaWR0aDo1MDBweCI+SW5ncmVzYSBhIHJlYWxpemFyIHR1IGRlbnVuY2lhwqBzZWd1cmEgZW46PGJyPiA8YSBocmVmPSIgaHR0cHM6Ly9kZW51bmNpYXNlZ3VyYS5pcG4ubXgvaW5kZXgucGhwP3I9c2l0ZS9jb25kaWNpb25lcyAgIj48ZGl2IHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOndoaXRlOyBjb2xvcjpibHVlOyBmb250LXNpemU6MTdweDsgZm9udC13ZWlnaHQ6Ym9sZDsgV2lkdGg6NTAwcHgiPmRlbnVuY2lhc2VndXJhLmlwbi5teDwvZGl2PjwvYT48L2Rpdj48L0NFTlRFUj4gPGRpdiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjp3aGl0ZTsgZm9udC1zaXplOjVweDsgV2lkdGg6NTAwcHgiPiAgPGJyPjwvZGl2PiAgPENFTlRFUj48ZGl2IHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiM2QzE0NTg7IGNvbG9yOndoaXRlOyBmb250LXNpemU6MTZweDsgZm9udC13ZWlnaHQ6Ym9sZDsgV2lkdGg6NTAwcHgiPsK/TmVjZXNpdGFzIG9yaWVudGFjacOzbiBvIGxldmFudGFyIHVuYSBxdWVqYT/CoEluZ3Jlc2HCoGE6PGJyPiA8YSBocmVmPSIgaHR0cHM6Ly93d3cuaXBuLm14L2RlZmVuc29yaWEvb3JpZW50YWNpb24tcXVlamEvcXVlamEuaHRtbCAgIj48ZGl2IHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOndoaXRlOyBjb2xvcjpibHVlOyBmb250LXNpemU6MTdweDsgZm9udC13ZWlnaHQ6Ym9sZDsgV2lkdGg6NTAwcHgiPnd3dy5pcG4ubXgvZGVmZW5zb3JpYS9vcmllbnRhY2lvbi1xdWVqYS9xdWVqYS5odG1sPC9kaXY+IDwvYT4gPC9kaXY+PC9DRU5URVI+PENFTlRFUj48ZGl2IHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOndoaXRlOyBmb250LXNpemU6NXB4OyBXaWR0aDo1MDBweCI+ICA8YnI+PC9kaXY+ICA8ZGl2IHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiM2QzFENDUgO2NvbG9yOldISVRFOyBmb250LXNpemU6MTVweDsgZm9udC13ZWlnaHQ6Ym9sZDsgV2lkdGg6NjAwcHgiPkFob3JhIHF1ZSBoYXMgY29uY2x1aWRvIGNvbiB0dSBpbnNjcmlwY2nDs24sIGVzIGltcG9ydGFudGUgcXVlIG9idGVuZ2FzIHTDuiBOw7ptZXJvIGRlIFNlZ3VyaWRhZCBTb2NpYWwgKE5OUykuIEVuIGNhc28gZGUgcXVlIG5vIGN1ZW50ZXMgY29uIHVubywgaW5ncmVzYSBlbjo8L2Rpdj4gIDxkaXYgc3R5bGU9ImZvbnQtc2l6ZTo5cHg7IGZvbnQtd2VpZ2h0OmJvbGQ7IFdpZHRoOjYwMHB4Ij48YSBocmVmPSIgaHR0cHM6Ly9zZXJ2aWNpb3NkaWdpdGFsZXMuaW1zcy5nb2IubXgvZ2VzdGlvbkFzZWd1cmFkb3Mtd2ViLWV4dGVybm8vYXNpZ25hY2lvbk5TUztKU0VTU0lPTklEQVNFR0VYVEVSTk89WG95WDJUbTExQ1V4SDZLZlBRb2p3TGt2amRZN2s0RVVqbzhSbG1SdmwwQVBYTm1lQWtQdyEtNzc3NjIwOTc4ICI+aHR0cHM6Ly9zZXJ2aWNpb3NkaWdpdGFsZXMuaW1zcy5nb2IubXgvZ2VzdGlvbkFzZWd1cmFkb3Mtd2ViLWV4dGVybm8vYXNpZ25hY2lvbk5TUztKU0VTU0lPTklEQVNFR0VYVEVSTk89WG95WDJUbTExQ1V4SDZLZlBRb2p3TGt2amRZN2s0RVVqbzhSbG1SdmwwQVBYTm1lQWtQdyEtNzc3NjIwOTc4PGJyPjxicj48YnI+PC9hPjwvZGl2PiAgPGRpdiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojNkMxRDQ1IDtjb2xvcjpXSElURTsgZm9udC1zaXplOjE1cHg7IGZvbnQtd2VpZ2h0OmJvbGQ7IFdpZHRoOjYwMHB4Ij5VbmEgdmV6IHF1ZSB5YSBsbyB0ZW5nYXMgZmF2b3IgZGUgcmVnaXN0cmFydGUgZW46PC9kaXY+ICA8ZGl2IHN0eWxlPSJmb250LXNpemU6OXB4OyBmb250LXdlaWdodDpib2xkOyBXaWR0aDo2MDBweCI+PGEgaHJlZj0iIGh0dHBzOi8vd3d3LnNpc21pLmRzZS5pcG4ubXgvcG9ydGFsL2Y/cD0xMDAwOjEwMToxMDI1MzY4MjExMDc3NiAiPmh0dHBzOi8vd3d3LnNpc21pLmRzZS5pcG4ubXgvcG9ydGFsL2Y/cD0xMDAwOjEwMToxMDI1MzY4MjExMDc3Njxicj48YnI+PGJyPjwvYT48L2Rpdj4gIDxkaXYgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IzZDMUQ0NSA7Y29sb3I6V0hJVEU7IGZvbnQtc2l6ZToxNXB4OyBmb250LXdlaWdodDpib2xkOyBXaWR0aDo2MDBweCI+UGFyYSBtYXlvciBpbmZvcm1hY2nDs24gcHVlZGVzIGVzY3JpYmlyIGEgZXN0ZSBjb3JyZW8gZWxlY3Ryw7NuaWNvOjwvZGl2PiAgPGRpdiBzdHlsZT0iY29sb3I6IzAwMzNGRjsgZm9udC1zaXplOjE1cHg7IGZvbnQtd2VpZ2h0OmJvbGQ7IFdpZHRoOjYwMHB4Ij5hZmlsaWFjaW9uaW1zc0BpcG4ubXg8L3N0cm9uZz48L2Rpdj4gIDwvQ0VOVEVSPmRkAgkPPCsADQEADxYCHwFnZGQCCg9kFgICAQ8WAh4HVmlzaWJsZWhkGAEFDmN0bDAwJG1haW5tZW51Dw9kBQZJbmljaW9kYnQg6L3m0RwzjcuZY9eD/He10d8=',
        '__VIEWSTATEGENERATOR': 'CA0B0334',
        '__EVENTVALIDATION': '/wEWBQKlydPzBQKplu7qAwKz5ZDgDwKlyZNfAqbvnfYMQGflSzMKzwF8JmOAb+OlwUjaLqE=',
        'ctl00$leftColumn$LoginUser$UserName': loginData.username,
        'ctl00$leftColumn$LoginUser$Password': loginData.password,
        'ctl00$leftColumn$LoginUser$CaptchaCodeTextBox': loginData.captcha.solution,
        'LBD_VCID_c_default_ctl00_leftcolumn_loginuser_logincaptcha': loginData.captcha.id,
        'ctl00$leftColumn$LoginUser$LoginButton': ''
    };
    const cookie = 'ASP.NET_SessionId=' + credential;
    const response = (await wrapper(axios.create({ jar: new CookieJar() })).post('https://www.saes.upiita.ipn.mx/', data, {
        headers: {
            Cookie: cookie,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })).config;

    const credentials = (response.jar.toJSON().cookies.length > 0)? {
        login: response.jar.toJSON().cookies[0].value,
        session: credential
    } : null;
    /**
        const response = await axios.post('https://www.saes.upiita.ipn.mx/', data, {
            headers: {
                Cookie: cookie,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            maxRedirects: 0,
            validateStatus: (status)=>{
                return status == 302 /* success * || 200 /* error *;
            }
        });
        let credential = response.headers['set-cookie']? response.headers['set-cookie'][0].split('; ')[0].split('=')[1] : null;
    */

    return credentials;
}

async function getUserInfo(credentials){
    const cookie = 'ASP.NET_SessionId=' + credentials.session + '; ' + '.ASPXFORMSAUTH=' + credentials.login;
    const response = await axios.get('https://www.saes.upiita.ipn.mx/Alumnos/info_alumnos/Datos_Alumno.aspx', {
        headers: {
            Cookie: cookie
        }
    });
    let html = response.data;
    let page = (new JSDOM(html)).window.document;
    
    let userBoleta = page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Generales_Lbl_Boleta').textContent;
    let userNombre = page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Generales_Lbl_Nombre').textContent;
    let userPlantel = page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Generales_Lbl_Plantel').textContent;
    let userRfc = page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Generales_Lbl_RFC').textContent;
    let userCartilla = page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Generales_Lbl_Cartilla').textContent;
    let userPasaporte = page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Generales_Lbl_Pasaporte').textContent;
    let userSexo = page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Generales_Lbl_Sexo').textContent;
    let userNacimiento = {
        fecha: page.getElementById('ctl00_mainCopy_TabContainer1_TabPanel1_Lbl_FecNac').textContent,
        nacionalidad: page.getElementById('ctl00_mainCopy_TabContainer1_TabPanel1_Lbl_Nacionalidad').textContent,
        entidad: page.getElementById('ctl00_mainCopy_TabContainer1_TabPanel1_Lbl_EntNac').textContent
    }
    let userDireccion = {
        calle: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_Calle').textContent,
        numeroExt: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_NumExt').textContent,
        numeroInt: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_NumInt').textContent,
        numeroInt: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_NumInt').textContent,
        colonia: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_Colonia').textContent,
        cp: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_CP').textContent,
        estado: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_Estado').textContent,
        municipio: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_DelMpo').textContent,
        telefono: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_Tel').textContent,
        movil: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_Movil').textContent,
        email: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_eMail').textContent,
        labora: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_Labora').textContent,
        oficina: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Direccion_Lbl_TelOficina').textContent
    }
    let userEscolaridad = {
        procedencia: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Escolaridad_Lbl_EscProc').textContent,
        entidad: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Escolaridad_Lbl_EdoEscProc').textContent,
        promedioSecundaria: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Escolaridad_Lbl_PromSec').textContent,
        promedioMedioSuperior: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Escolaridad_Lbl_PromNMS').textContent,
    }
    let userTutores = {
        nombreTutor: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Tutor_Lbl_NomTut').textContent,
        rfcTutor: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Tutor_Lbl_RFCTut').textContent,
        nombrePadre: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Tutor_Lbl_Padre').textContent,
        nombreMadre: page.getElementById('ctl00_mainCopy_TabContainer1_Tab_Tutor_Lbl_Madre').textContent
    }
    let userFotografiaRequest = await axios.get('https://www.saes.upiita.ipn.mx/Alumnos/info_alumnos/Fotografia.aspx', {
        headers: {
            Cookie: cookie
        },
        validateStatus: (status)=>{
            return status == 200;
        },
        responseType: 'arraybuffer'
    });
    let userFotografiaBase64 = Buffer.from(userFotografiaRequest.data, 'binary').toString('base64');

    const userInfo = {
        boleta: userBoleta,
        nombre: userNombre,
        plantel: userPlantel,
        rfc: userRfc,
        cartilla: userCartilla,
        pasaporte: userPasaporte,
        sexo: userSexo,
        nacimiento: userNacimiento,
        direccion: userDireccion,
        escolaridad: userEscolaridad,
        tutores: userTutores,
        fotografiaBase64: userFotografiaBase64
    }

    return userInfo;
}

async function getUserKardex(credentials){
    const cookie = 'ASP.NET_SessionId=' + credentials.session + '; ' + '.ASPXFORMSAUTH=' + credentials.login;
    const response = await axios.get('https://www.saes.upiita.ipn.mx/Alumnos/boleta/kardex.aspx', {
        headers: {
            Cookie: cookie
        }
    });
    let html = response.data;
    let page = (new JSDOM(html)).window.document;

    let userKardex = [];
    let userKardexTable = page.getElementById('ctl00_mainCopy_Lbl_Kardex');
    let userKardexTableContents = userKardexTable.getElementsByTagName('table');

    for(let i=0, n=userKardexTableContents.length; i<n; i++){
        let userKardexTableContent = userKardexTableContents[i].getElementsByTagName('tbody')[0].getElementsByTagName('tr');

        for(let j=2, m=userKardexTableContent.length; j<m; j++){
            let userKardexTableContentRowColumns = userKardexTableContent[j].getElementsByTagName('td');
            let userKardexTableContentRow = {
                clave: userKardexTableContentRowColumns[0].textContent,
                asignatura: userKardexTableContentRowColumns[1].textContent,
                fecha: userKardexTableContentRowColumns[2].textContent,
                periodo: userKardexTableContentRowColumns[3].textContent,
                formaEvaluacion: userKardexTableContentRowColumns[4].textContent,
                calificacion: userKardexTableContentRowColumns[5].textContent
            }

            userKardex.push(userKardexTableContentRow);
        }
    }

    return userKardex;
}

async function getUserHorario(credentials){
    const cookie = 'ASP.NET_SessionId=' + credentials.session + '; ' + '.ASPXFORMSAUTH=' + credentials.login;
    const response = await axios.get('https://www.saes.upiita.ipn.mx/Alumnos/Informacion_semestral/Horario_Alumno.aspx', {
        headers: {
            Cookie: cookie
        }
    });
    let html = response.data;
    let page = (new JSDOM(html)).window.document;

    let userHorario = [];
    let userHorarioTable = page.getElementById('ctl00_mainCopy_GV_Horario');
    let userHorarioTableContent = userHorarioTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for(let i=1, n=userHorarioTableContent.length; i<n; i++){
        let userHorarioTableContentRowColumns = userHorarioTableContent[i].getElementsByTagName('td');
        let userHorarioTableContentRow = {
            grupo: userHorarioTableContentRowColumns[0].textContent.trim(),
            clave: userHorarioTableContentRowColumns[1].textContent.split('-')[0].trim(),
            asignatura: userHorarioTableContentRowColumns[1].textContent.split('-')[1].trim(),
            profesor: userHorarioTableContentRowColumns[2].textContent.trim(),
            horas: {
                lunes: userHorarioTableContentRowColumns[3].textContent.trim(),
                martes: userHorarioTableContentRowColumns[4].textContent.trim(),
                miercoles: userHorarioTableContentRowColumns[5].textContent.trim(),
                jueves: userHorarioTableContentRowColumns[6].textContent.trim(),
                viernes: userHorarioTableContentRowColumns[7].textContent.trim()
            }
        }

        userHorario.push(userHorarioTableContentRow);
    }

    return userHorario;
}

async function getUserCalificaciones(credentials){
    const cookie = 'ASP.NET_SessionId=' + credentials.session + '; ' + '.ASPXFORMSAUTH=' + credentials.login;
    const response = await axios.get('https://www.saes.upiita.ipn.mx/Alumnos/Informacion_semestral/calificaciones_sem.aspx', {
        headers: {
            Cookie: cookie
        }
    });
    let html = response.data;
    let page = (new JSDOM(html)).window.document;

    let userCalificaciones = [];
    let userCalificacionesTable = page.getElementById('ctl00_mainCopy_GV_Calif');
    let userCalificacionesTableContent = userCalificacionesTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for(let i=1, n=userCalificacionesTableContent.length; i<n; i++){
        let userCalificacionesTableContentRowColumns = userCalificacionesTableContent[i].getElementsByTagName('td');
        let userCalificacionesTableContentRow = {
            grupo: userCalificacionesTableContentRowColumns[0].textContent,
            clave: userCalificacionesTableContentRowColumns[1].textContent.split('-')[0],
            asignatura: userCalificacionesTableContentRowColumns[1].textContent.split('-')[1],
            parcial1: userCalificacionesTableContentRowColumns[2].textContent,
            parcial2: userCalificacionesTableContentRowColumns[3].textContent,
            parcial3: userCalificacionesTableContentRowColumns[4].textContent,
            extraordinario: userCalificacionesTableContentRowColumns[5].textContent,
            calificacion: userCalificacionesTableContentRowColumns[6].textContent.split(' ')[0],
        }

        userCalificaciones.push(userCalificacionesTableContentRow);
    }

    return userCalificaciones;
}

async function getGeneralHorarios(credentials, upcoming){
    let data = {
        '__VIEWSTATE': '/wEPDwUKMTQ3Mjg3NzY1Mg9kFgJmD2QWAgIDD2QWCgIBDw8WAh4ISW1hZ2VVcmwFFX4vSW1hZ2VzL2xvZ29zLzY0LnBuZ2RkAgUPPCsADQIADxYCHgtfIURhdGFCb3VuZGdkDBQrAAIFAzA6MBQrAAIWEB4EVGV4dAUGSW5pY2lvHgVWYWx1ZQUGSW5pY2lvHgtOYXZpZ2F0ZVVybAUNL2RlZmF1bHQuYXNweB4HVG9vbFRpcAUGSW5pY2lvHgdFbmFibGVkZx4KU2VsZWN0YWJsZWceCERhdGFQYXRoBQ0vZGVmYXVsdC5hc3B4HglEYXRhQm91bmRnFCsABgUTMDowLDA6MSwwOjIsMDozLDA6NBQrAAIWEB8CBQdBbHVtbm9zHwMFB0FsdW1ub3MfBAUVL0FsdW1ub3MvZGVmYXVsdC5hc3B4HwUFB0FsdW1ub3MfBmcfB2cfCAUVL2FsdW1ub3MvZGVmYXVsdC5hc3B4HwlnZBQrAAIWEh8DBQpBY2Fkw6ltaWNhHwlnHghTZWxlY3RlZGcfAgUKQWNhZMOpbWljYR8EBRcvQWNhZGVtaWNhL2RlZmF1bHQuYXNweB8GZx8HZx8FBQpBY2Fkw6ltaWNhHwgFFy9hY2FkZW1pY2EvZGVmYXVsdC5hc3B4ZBQrAAIWEB8CBQpSZWdsYW1lbnRvHwMFClJlZ2xhbWVudG8fBAUYL1JlZ2xhbWVudG8vRGVmYXVsdC5hc3B4HwUFClJlZ2xhbWVudG8fBmcfB2cfCAUYL3JlZ2xhbWVudG8vZGVmYXVsdC5hc3B4HwlnZBQrAAIWEB8CBQVBeXVkYR8DBQVBeXVkYR8EBREvQXl1ZGEvQXl1ZGEuYXNweB8FBQVBeXVkYR8GZx8HZx8IBREvYXl1ZGEvYXl1ZGEuYXNweB8JZ2QUKwACFhAfAgUVUmVjdXBlcmFyIENvbnRyYXNlw7FhHwMFFVJlY3VwZXJhciBDb250cmFzZcOxYR8EBRwvU2VuZEVtYWlsL1JlY3VwZXJhUGFzcy5hc3B4HwUFKlJlY3VwZXJhciBsYSBDb250cmFzZcOxYSBkZSBhY2Nlc28gYWwgU0FFUx8GZx8HZx8IBRwvc2VuZGVtYWlsL3JlY3VwZXJhcGFzcy5hc3B4HwlnZGQCCA9kFhICAQ9kFgICAQ9kFgoCAQ8QDxYCHwFnZBAVBRNJTkdFTklFUklBIEJJw5NOSUNBF0lOR0VOSUVSw41BIEVOIEVORVJHw41BF0lOR0VOSUVSSUEgTUVDQVRSw5NOSUNBHUlORy4gRU4gU0lTVEVNQVMgQVVUT01PVFJJQ0VTFklOR0VOSUVSSUEgVEVMRU3DgVRJQ0EVBQFCAUUBTQFTAVQUKwMFZ2dnZ2dkZAIHDxAPFgIfAWdkEBUCElBsYW4gZGVsIDMwLzYvMjAwORJQbGFuIGRlbCAxNS84LzE5OTcVAgIwOQI5OBQrAwJnZ2RkAgkPD2QPEBYBZhYBFgIeDlBhcmFtZXRlclZhbHVlBQFCFgFmZGQCCw8PZA8QFgJmAgEWAhYCHwsFAUIWAh8LBQIwORYCZmZkZAINDxAPFgIfAWdkEBUFATEBMgEzATQBNRUFATEBMgEzATQBNRQrAwVnZ2dnZ2RkAgcPEA8WAh8BZ2QQFQEEVG9kbxUBBFRvZG8UKwMBZ2RkAgkPZBYEAgEPPCsADQBkAgMPDxYCHgdWaXNpYmxlaGRkAgsPD2QPEBYFZgIBAgICAwIEFgUWAh8LBQExFgIfC2UWAh8LZRYCHwsFAU0WAh8LZRYFZmZmZmZkZAINDw8WAh8CZWRkAg8PDxYCHwJlZGQCEQ8PFgIfAmVkZAITDw8WAh8CBQFNZGQCFQ8PFgIfAgUBMWRkAgkPPCsADQIADxYCHwFnZAwUKwAIBRswOjAsMDoxLDA6MiwwOjMsMDo0LDA6NSwwOjYUKwACFhAfAgUOQWdlbmRhIGVzY29sYXIfAwUOQWdlbmRhIGVzY29sYXIfBAUeL0FjYWRlbWljYS9hZ2VuZGFfZXNjb2xhci5hc3B4HwUFDkFnZW5kYSBlc2NvbGFyHwZnHwdnHwgFHi9hY2FkZW1pY2EvYWdlbmRhX2VzY29sYXIuYXNweB8JZ2QUKwACFhAfAgUPTWFwYSBjdXJyaWN1bGFyHwMFD01hcGEgY3VycmljdWxhch8EBR8vQWNhZGVtaWNhL21hcGFfY3VycmljdWxhci5hc3B4HwUFD01hcGEgY3VycmljdWxhch8GZx8HZx8IBR8vYWNhZGVtaWNhL21hcGFfY3VycmljdWxhci5hc3B4HwlnZBQrAAIWEh8DBRJIb3JhcmlvcyBkZSBDbGFzZXMfCWcfCmcfAgUSSG9yYXJpb3MgZGUgQ2xhc2VzHwQFGC9BY2FkZW1pY2EvaG9yYXJpb3MuYXNweB8GZx8HZx8FBRFIb3JhcmlvcyBkZSBjbGFzZR8IBRgvYWNhZGVtaWNhL2hvcmFyaW9zLmFzcHhkFCsAAhYQHwIFFE9jdXBhYmlsaWRhZCBIb3JhcmlvHwMFFE9jdXBhYmlsaWRhZCBIb3JhcmlvHwQFIy9BY2FkZW1pY2EvT2N1cGFiaWxpZGFkX2dydXBvcy5hc3B4HwUFJU9jdXBhYmlsaWRhZCBkZSBsb3MgZ3J1cG9zIHkgbWF0ZXJpYXMfBmcfB2cfCAUjL2FjYWRlbWljYS9vY3VwYWJpbGlkYWRfZ3J1cG9zLmFzcHgfCWdkFCsAAhYQHwIFDkNhbGVuZGFyaW8gRXhhHwMFDkNhbGVuZGFyaW8gRXhhHwQFGi9BY2FkZW1pY2EvQ2FsZW5kYXJpby5hc3B4HwUFQ0NhbGVuZGFyaW8gZGUgbG9zIGV4YW1lbmVzIG9yZGluYXJpb3NuIGluY2x1eWVuZG8gZWwgZXh0cmFvcmRpbmFyaW8fBmcfB2cfCAUaL2FjYWRlbWljYS9jYWxlbmRhcmlvLmFzcHgfCWdkFCsAAhYQHwIFEUNhbGVuZGFyaW8gZGUgRVRTHwMFEUNhbGVuZGFyaW8gZGUgRVRTHwQFHi9BY2FkZW1pY2EvQ2FsZW5kYXJpb19ldHMuYXNweB8FBRFDYWxlbmRhcmlvIGRlIEVUUx8GZx8HZx8IBR4vYWNhZGVtaWNhL2NhbGVuZGFyaW9fZXRzLmFzcHgfCWdkFCsAAhYQHwIFDUVxdWl2YWxlbmNpYXMfAwUNRXF1aXZhbGVuY2lhcx8EBR0vQWNhZGVtaWNhL0VxdWl2YWxlbmNpYXMuYXNweB8FBRlFcXVpdmFsZW5jaWFzIGRlIE1hdGVyaWFzHwZnHwdnHwgFHS9hY2FkZW1pY2EvZXF1aXZhbGVuY2lhcy5hc3B4HwlnZGQCCg9kFgICAw8WAh8MaGQYBAUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgUFGGN0bDAwJG1haW5Db3B5JG9wdEFjdHVhbAUZY3RsMDAkbWFpbkNvcHkkb3B0UHJveGltbwUZY3RsMDAkbWFpbkNvcHkkb3B0UHJveGltbwUpY3RsMDAkbGVmdENvbHVtbiRMb2dpblN0YXR1c1Nlc3Npb24kY3RsMDEFKWN0bDAwJGxlZnRDb2x1bW4kTG9naW5TdGF0dXNTZXNzaW9uJGN0bDAzBQ1jdGwwMCRzdWJNZW51Dw9kBRJIb3JhcmlvcyBkZSBDbGFzZXNkBRpjdGwwMCRtYWluQ29weSRkYmdIb3Jhcmlvcw9nZAUOY3RsMDAkbWFpbm1lbnUPD2QFEUluaWNpb1xBY2Fkw6ltaWNhZKXC1UlK8LJyQm2KneFgfMRA5Vtb',
        '__VIEWSTATEGENERATOR': '9CE16246',
        '__EVENTVALIDATION': '/wEWGgKbo+DFCgLOt4qBAQKQ2KDvDQKV2KDvDQKt2KDvDQKj2KDvDQKi2KDvDQKxtZLtCgLS2riDBgLb2riDBgLJ2riDBgLt8dimDQL9nt7IAQL6ntLIAQL6k+ySDgL1/Mb8AgL0/Mb8AgL3/Mb8AgL2/Mb8AgLx/Mb8AgKA+Ia/BAKf+IKVDALcwtLfDwK+25eKBAKQ99qQCQLui87GCMVuVctjs/MCSFDcYVoy8yfh5LpD',
        'ctl00$mainCopy$GroupPeriodoEscolar': upcoming? 'optProximo' : 'optActual'
    };
    const cookie = 'ASP.NET_SessionId=' + credentials.session + '; ' + '.ASPXFORMSAUTH=' + credentials.login;
    let page = await getPage('https://www.saes.upiita.ipn.mx/Academica/horarios.aspx', cookie);
    data['__VIEWSTATE'] = page.getElementById('__VIEWSTATE').value;
    data['__EVENTVALIDATION'] = page.getElementById('__EVENTVALIDATION').value;

    let generalHorarios = [];
    let generalHorariosCarreras = page.getElementById('ctl00_mainCopy_Filtro_cboCarrera').getElementsByTagName('option');

    for(let i=0, n=generalHorariosCarreras.length; i<n; i++){
        let generalHorariosCarrera = {
            id: generalHorariosCarreras[i].value
        }
        data['ctl00$mainCopy$Filtro$cboCarrera'] = generalHorariosCarrera.id;

        page = await postPage('https://www.saes.upiita.ipn.mx/Academica/horarios.aspx', cookie, data);
        data['__VIEWSTATE'] = page.getElementById('__VIEWSTATE').value;
        data['__EVENTVALIDATION'] = page.getElementById('__EVENTVALIDATION').value;

        generalHorariosCarrera.periodos = page.getElementById('ctl00_mainCopy_Filtro_lsNoPeriodos').getElementsByTagName('option');
        generalHorariosCarrera.turnos = page.getElementById('ctl00_mainCopy_Filtro_cboTurno').getElementsByTagName('option');
        generalHorariosCarrera.plan = page.getElementById('ctl00_mainCopy_Filtro_cboPlanEstud').getElementsByTagName('option');

        let generalHorariosCarreraPlan = generalHorariosCarrera.plan[0].value;
        data['ctl00$mainCopy$Filtro$cboPlanEstud'] = generalHorariosCarreraPlan;

        for(let j=0, m=generalHorariosCarrera.periodos.length; j<m; j++){
            let generalHorariosCarreraPeriodo = generalHorariosCarrera.periodos[j].value
            data['ctl00$mainCopy$Filtro$lsNoPeriodos'] = generalHorariosCarreraPeriodo;

            for(let k=0, o=generalHorariosCarrera.turnos.length; k<o; k++){
                let generalHorariosCarreraTurno = generalHorariosCarrera.turnos[k].value;
                data['ctl00$mainCopy$Filtro$cboTurno'] = generalHorariosCarreraTurno;

                page = await postPage('https://www.saes.upiita.ipn.mx/Academica/horarios.aspx', cookie, data);
                data['__VIEWSTATE'] = page.getElementById('__VIEWSTATE').value;
                data['__EVENTVALIDATION'] = page.getElementById('__EVENTVALIDATION').value;

                let generalHorariosCarreraTable = page.getElementById('ctl00_mainCopy_dbgHorarios');

                if(!generalHorariosCarreraTable) continue;

                let generalHorariosCarreraTableContent = generalHorariosCarreraTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

                for(let l=1, p=generalHorariosCarreraTableContent.length; l<p; l++){
                    let generalHorariosCarreraTableContentRowColumns = generalHorariosCarreraTableContent[l].getElementsByTagName('td');
                    let generalHorariosCarreraTableContentRow = {
                        carrera: generalHorariosCarrera.id,
                        turno: generalHorariosCarreraTurno,
                        periodo: generalHorariosCarreraPeriodo,
                        grupo: generalHorariosCarreraTableContentRowColumns[0].textContent,
                        asignatura: generalHorariosCarreraTableContentRowColumns[1].textContent,
                        profesor: generalHorariosCarreraTableContentRowColumns[2].textContent,
                        edificio: generalHorariosCarreraTableContentRowColumns[3].textContent,
                        aula: generalHorariosCarreraTableContentRowColumns[4].textContent,
                        horas: {
                            lunes: generalHorariosCarreraTableContentRowColumns[5].textContent.trim(),
                            martes: generalHorariosCarreraTableContentRowColumns[6].textContent.trim(),
                            miercoles: generalHorariosCarreraTableContentRowColumns[7].textContent.trim(),
                            jueves: generalHorariosCarreraTableContentRowColumns[8].textContent.trim(),
                            viernes: generalHorariosCarreraTableContentRowColumns[9].textContent.trim()
                        }
                    }

                    generalHorarios.push(generalHorariosCarreraTableContentRow);
                }
            }
        }
    }

    return generalHorarios;
}

async function getGeneralAsignaturas(credentials){
    let data = {
        '__VIEWSTATE': '/wEPDwUKMTY5MjE1NTA3Mg9kFgJmD2QWAgIDD2QWCgIBDw8WAh4ISW1hZ2VVcmwFFX4vSW1hZ2VzL2xvZ29zLzY0LnBuZ2RkAgUPPCsADQIADxYCHgtfIURhdGFCb3VuZGdkDBQrAAIFAzA6MBQrAAIWEB4EVGV4dAUGSW5pY2lvHgVWYWx1ZQUGSW5pY2lvHgtOYXZpZ2F0ZVVybAUNL2RlZmF1bHQuYXNweB4HVG9vbFRpcAUGSW5pY2lvHgdFbmFibGVkZx4KU2VsZWN0YWJsZWceCERhdGFQYXRoBQ0vZGVmYXVsdC5hc3B4HglEYXRhQm91bmRnFCsABgUTMDowLDA6MSwwOjIsMDozLDA6NBQrAAIWEB8CBQdBbHVtbm9zHwMFB0FsdW1ub3MfBAUVL0FsdW1ub3MvZGVmYXVsdC5hc3B4HwUFB0FsdW1ub3MfBmcfB2cfCAUVL2FsdW1ub3MvZGVmYXVsdC5hc3B4HwlnZBQrAAIWEh8DBQpBY2Fkw6ltaWNhHwlnHghTZWxlY3RlZGcfAgUKQWNhZMOpbWljYR8EBRcvQWNhZGVtaWNhL2RlZmF1bHQuYXNweB8GZx8HZx8FBQpBY2Fkw6ltaWNhHwgFFy9hY2FkZW1pY2EvZGVmYXVsdC5hc3B4ZBQrAAIWEB8CBQpSZWdsYW1lbnRvHwMFClJlZ2xhbWVudG8fBAUYL1JlZ2xhbWVudG8vRGVmYXVsdC5hc3B4HwUFClJlZ2xhbWVudG8fBmcfB2cfCAUYL3JlZ2xhbWVudG8vZGVmYXVsdC5hc3B4HwlnZBQrAAIWEB8CBQVBeXVkYR8DBQVBeXVkYR8EBREvQXl1ZGEvQXl1ZGEuYXNweB8FBQVBeXVkYR8GZx8HZx8IBREvYXl1ZGEvYXl1ZGEuYXNweB8JZ2QUKwACFhAfAgUVUmVjdXBlcmFyIENvbnRyYXNlw7FhHwMFFVJlY3VwZXJhciBDb250cmFzZcOxYR8EBRwvU2VuZEVtYWlsL1JlY3VwZXJhUGFzcy5hc3B4HwUFKlJlY3VwZXJhciBsYSBDb250cmFzZcOxYSBkZSBhY2Nlc28gYWwgU0FFUx8GZx8HZx8IBRwvc2VuZGVtYWlsL3JlY3VwZXJhcGFzcy5hc3B4HwlnZGQCCA9kFgwCAQ9kFgICAQ9kFgoCAQ8QDxYCHwFnZBAVBRNJTkdFTklFUklBIEJJw5NOSUNBF0lOR0VOSUVSw41BIEVOIEVORVJHw41BF0lOR0VOSUVSSUEgTUVDQVRSw5NOSUNBHUlORy4gRU4gU0lTVEVNQVMgQVVUT01PVFJJQ0VTFklOR0VOSUVSSUEgVEVMRU3DgVRJQ0EVBQFCAUUBTQFTAVQUKwMFZ2dnZ2dkZAIFDxAPFgIfAWdkEBUCElBsYW4gZGVsIDMwLzYvMjAwORJQbGFuIGRlbCAxNS84LzE5OTcVAgIwOQI5OBQrAwJnZ2RkAgcPD2QPEBYBZhYBFgIeDlBhcmFtZXRlclZhbHVlBQFCFgFmZGQCCQ8PZA8QFgJmAgEWAhYCHwsFAUIWAh8LBQIwORYCZmZkZAILDxAPFgIfAWdkEBUFATEBMgEzATQBNRUFATEBMgEzATQBNRQrAwVnZ2dnZ2RkAgUPPCsADQEADxYEHwFnHgtfIUl0ZW1Db3VudGZkZAIHDw9kDxAWA2YCAQICFgMWAh8LZRYCHwtlFgIfC2UWA2ZmZmRkAgkPDxYCHwJlZGQCCw8PFgIfAmVkZAINDw8WAh8CZWRkAgkPPCsADQIADxYCHwFnZAwUKwAIBRswOjAsMDoxLDA6MiwwOjMsMDo0LDA6NSwwOjYUKwACFhAfAgUOQWdlbmRhIGVzY29sYXIfAwUOQWdlbmRhIGVzY29sYXIfBAUeL0FjYWRlbWljYS9hZ2VuZGFfZXNjb2xhci5hc3B4HwUFDkFnZW5kYSBlc2NvbGFyHwZnHwdnHwgFHi9hY2FkZW1pY2EvYWdlbmRhX2VzY29sYXIuYXNweB8JZ2QUKwACFhIfAwUPTWFwYSBjdXJyaWN1bGFyHwlnHwpnHwIFD01hcGEgY3VycmljdWxhch8EBR8vQWNhZGVtaWNhL21hcGFfY3VycmljdWxhci5hc3B4HwZnHwdnHwUFD01hcGEgY3VycmljdWxhch8IBR8vYWNhZGVtaWNhL21hcGFfY3VycmljdWxhci5hc3B4ZBQrAAIWEB8CBRJIb3JhcmlvcyBkZSBDbGFzZXMfAwUSSG9yYXJpb3MgZGUgQ2xhc2VzHwQFGC9BY2FkZW1pY2EvaG9yYXJpb3MuYXNweB8FBRFIb3JhcmlvcyBkZSBjbGFzZR8GZx8HZx8IBRgvYWNhZGVtaWNhL2hvcmFyaW9zLmFzcHgfCWdkFCsAAhYQHwIFFE9jdXBhYmlsaWRhZCBIb3JhcmlvHwMFFE9jdXBhYmlsaWRhZCBIb3JhcmlvHwQFIy9BY2FkZW1pY2EvT2N1cGFiaWxpZGFkX2dydXBvcy5hc3B4HwUFJU9jdXBhYmlsaWRhZCBkZSBsb3MgZ3J1cG9zIHkgbWF0ZXJpYXMfBmcfB2cfCAUjL2FjYWRlbWljYS9vY3VwYWJpbGlkYWRfZ3J1cG9zLmFzcHgfCWdkFCsAAhYQHwIFDkNhbGVuZGFyaW8gRXhhHwMFDkNhbGVuZGFyaW8gRXhhHwQFGi9BY2FkZW1pY2EvQ2FsZW5kYXJpby5hc3B4HwUFQ0NhbGVuZGFyaW8gZGUgbG9zIGV4YW1lbmVzIG9yZGluYXJpb3NuIGluY2x1eWVuZG8gZWwgZXh0cmFvcmRpbmFyaW8fBmcfB2cfCAUaL2FjYWRlbWljYS9jYWxlbmRhcmlvLmFzcHgfCWdkFCsAAhYQHwIFEUNhbGVuZGFyaW8gZGUgRVRTHwMFEUNhbGVuZGFyaW8gZGUgRVRTHwQFHi9BY2FkZW1pY2EvQ2FsZW5kYXJpb19ldHMuYXNweB8FBRFDYWxlbmRhcmlvIGRlIEVUUx8GZx8HZx8IBR4vYWNhZGVtaWNhL2NhbGVuZGFyaW9fZXRzLmFzcHgfCWdkFCsAAhYQHwIFDUVxdWl2YWxlbmNpYXMfAwUNRXF1aXZhbGVuY2lhcx8EBR0vQWNhZGVtaWNhL0VxdWl2YWxlbmNpYXMuYXNweB8FBRlFcXVpdmFsZW5jaWFzIGRlIE1hdGVyaWFzHwZnHwdnHwgFHS9hY2FkZW1pY2EvZXF1aXZhbGVuY2lhcy5hc3B4HwlnZGQCCg9kFgICAw8WAh4HVmlzaWJsZWhkGAQFHl9fQ29udHJvbHNSZXF1aXJlUG9zdEJhY2tLZXlfXxYCBSljdGwwMCRsZWZ0Q29sdW1uJExvZ2luU3RhdHVzU2Vzc2lvbiRjdGwwMQUpY3RsMDAkbGVmdENvbHVtbiRMb2dpblN0YXR1c1Nlc3Npb24kY3RsMDMFDWN0bDAwJHN1Yk1lbnUPD2QFD01hcGEgY3VycmljdWxhcmQFGGN0bDAwJG1haW5Db3B5JEdyaWRWaWV3MQ88KwAKAQhmZAUOY3RsMDAkbWFpbm1lbnUPD2QFEUluaWNpb1xBY2Fkw6ltaWNhZNPH8SAuIRIjr452Nhok/VzNeEr4',
        '__VIEWSTATEGENERATOR': 'A5B4566B',
        '__EVENTVALIDATION': '/wEWEgLjmIrIDgLOt4qBAQKQ2KDvDQKV2KDvDQKt2KDvDQKj2KDvDQKi2KDvDQLt8dimDQL9nt7IAQL6ntLIAQL6k+ySDgL1/Mb8AgL0/Mb8AgL3/Mb8AgL2/Mb8AgLx/Mb8AgKQ99qQCQLui87GCFd+sYl2boSWXZaPu5DWWwkUlDck'
    };
    const cookie = 'ASP.NET_SessionId=' + credentials.session + '; ' + '.ASPXFORMSAUTH=' + credentials.login;
    let page = await getPage('https://www.saes.upiita.ipn.mx/Academica/mapa_curricular.aspx', cookie);
    data['__VIEWSTATE'] = page.getElementById('__VIEWSTATE').value;
    data['__EVENTVALIDATION'] = page.getElementById('__EVENTVALIDATION').value;

    let generalAsignaturas = [];
    let generalAsignaturasCarreras = page.getElementById('ctl00_mainCopy_Filtro_cboCarrera').getElementsByTagName('option');

    for(let i=0, n=generalAsignaturasCarreras.length; i<n; i++){
        let generalAsignaturasCarrera = {
            id: generalAsignaturasCarreras[i].value
        }
        data['ctl00$mainCopy$Filtro$cboCarrera'] = generalAsignaturasCarrera.id;

        page = await postPage('https://www.saes.upiita.ipn.mx/Academica/mapa_curricular.aspx', cookie, data);
        data['__VIEWSTATE'] = page.getElementById('__VIEWSTATE').value;
        data['__EVENTVALIDATION'] = page.getElementById('__EVENTVALIDATION').value;

        generalAsignaturasCarrera.periodos = page.getElementById('ctl00_mainCopy_Filtro_lsNoPeriodos').getElementsByTagName('option');
        generalAsignaturasCarrera.plan = page.getElementById('ctl00_mainCopy_Filtro_cboPlanEstud').getElementsByTagName('option');

        let generalAsignaturasCarreraPlan = generalAsignaturasCarrera.plan[0].value;
        data['ctl00$mainCopy$Filtro$cboPlanEstud'] = generalAsignaturasCarreraPlan;

        for(let j=0, m=generalAsignaturasCarrera.periodos.length; j<m; j++){
            let generalAsignaturasCarreraPeriodo = generalAsignaturasCarrera.periodos[j].value
            data['ctl00$mainCopy$Filtro$lsNoPeriodos'] = generalAsignaturasCarreraPeriodo;

            page = await postPage('https://www.saes.upiita.ipn.mx/Academica/mapa_curricular.aspx', cookie, data);

            data['__VIEWSTATE'] = page.getElementById('__VIEWSTATE').value;
            data['__EVENTVALIDATION'] = page.getElementById('__EVENTVALIDATION').value;

            let generalAsignaturasCarreraTable = page.getElementById('ctl00_mainCopy_GridView1');

            if(!generalAsignaturasCarreraTable) continue;

            let generalAsignaturasCarreraTableContent = generalAsignaturasCarreraTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

            for(let k=1, o=generalAsignaturasCarreraTableContent.length; k<o; k++){
                let generalAsignaturasCarreraTableContentRowColumns = generalAsignaturasCarreraTableContent[k].getElementsByTagName('td');
                let generalAsignaturasCarreraTableContentRow = {
                    carrera: generalAsignaturasCarrera.id,
                    periodo: generalAsignaturasCarreraTableContentRowColumns[0].textContent,
                    clave: generalAsignaturasCarreraTableContentRowColumns[1].textContent,
                    nombre: generalAsignaturasCarreraTableContentRowColumns[2].textContent,
                    tipo: generalAsignaturasCarreraTableContentRowColumns[3].textContent,
                    creditos: generalAsignaturasCarreraTableContentRowColumns[4].textContent,
                    horasTeoria: generalAsignaturasCarreraTableContentRowColumns[5].textContent,
                    horasPractica: generalAsignaturasCarreraTableContentRowColumns[6].textContent
                }
                
                generalAsignaturas.push(generalAsignaturasCarreraTableContentRow);
            }
        }
    }

    return generalAsignaturas;
}

async function getGeneralCupos(credentials){
    let data = {
        '__VIEWSTATEGENERATOR': '6E3CB963',
        '__VIEWSTATEENCRYPTED': '',
        'ctl00$mainCopy$rblEsquema': '1'
    };
    const cookie = 'ASP.NET_SessionId=' + credentials.session + '; ' + '.ASPXFORMSAUTH=' + credentials.login;
    let page = await getPage('https://www.saes.upiita.ipn.mx/Academica/Ocupabilidad_grupos.aspx', cookie);
    data['__VIEWSTATE'] = page.getElementById('__VIEWSTATE').value;
    data['__EVENTVALIDATION'] = page.getElementById('__EVENTVALIDATION').value;

    page = await postPage('https://www.saes.upiita.ipn.mx/Academica/Ocupabilidad_grupos.aspx', cookie, data);
    data['__VIEWSTATE'] = page.getElementById('__VIEWSTATE').value;
    data['__EVENTVALIDATION'] = page.getElementById('__EVENTVALIDATION').value;

    let generalCupos = [];
    let generalCuposCarreras = page.getElementById('ctl00_mainCopy_dpdcarrera').getElementsByTagName('option');

    for(let i=0, n=generalCuposCarreras.length; i<n; i++){
        let generalCuposCarrera = {
            id: generalCuposCarreras[i].value
        }
        data['ctl00$mainCopy$dpdcarrera'] = generalCuposCarrera.id;

        page = await postPage('https://www.saes.upiita.ipn.mx/Academica/Ocupabilidad_grupos.aspx', cookie, data);
        data['__VIEWSTATE'] = page.getElementById('__VIEWSTATE').value;
        data['__EVENTVALIDATION'] = page.getElementById('__EVENTVALIDATION').value;

        generalCuposCarrera.plan = page.getElementById('ctl00_mainCopy_dpdplan').getElementsByTagName('option');

        let generalCuposCarreraPlan = generalCuposCarrera.plan[0].value;
        data['ctl00$mainCopy$dpdplan'] = generalCuposCarreraPlan;

        page = await postPage('https://www.saes.upiita.ipn.mx/Academica/Ocupabilidad_grupos.aspx', cookie, data);
        data['__VIEWSTATE'] = page.getElementById('__VIEWSTATE').value;
        data['__EVENTVALIDATION'] = page.getElementById('__EVENTVALIDATION').value;

        let generalCuposCarreraTable = page.getElementById('ctl00_mainCopy_GrvOcupabilidad');

        if(!generalCuposCarreraTable) continue;

        let generalCuposCarreraTableContent = generalCuposCarreraTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

        for(let j=1, m=generalCuposCarreraTableContent.length; j<m; j++){
            let generalCuposCarreraTableContentRowColumns = generalCuposCarreraTableContent[j].getElementsByTagName('td');
            let generalCuposCarreraTableContentRow = {
                carrera: generalCuposCarrera.id,
                grupo: generalCuposCarreraTableContentRowColumns[0].textContent,
                clave: generalCuposCarreraTableContentRowColumns[1].textContent,
                asignatura: generalCuposCarreraTableContentRowColumns[2].textContent,
                periodo: generalCuposCarreraTableContentRowColumns[3].textContent,
                cupo: generalCuposCarreraTableContentRowColumns[4].textContent,
                inscritos: generalCuposCarreraTableContentRowColumns[5].textContent,
                disponibles: generalCuposCarreraTableContentRowColumns[6].textContent
            }
            
            generalCupos.push(generalCuposCarreraTableContentRow);
        }
    }

    return generalCupos;
}

module.exports = {
    session,
    authenticate,
    getUserInfo,
    getUserKardex,
    getUserHorario,
    getUserCalificaciones,
    getGeneralHorarios,
    getGeneralAsignaturas,
    getGeneralCupos
}