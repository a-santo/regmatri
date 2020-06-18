const db = require('../lib/dbcfg');
const fs = require('fs');
const path = require('path');
const matriculasController = require('./matriculas_controller');
const alpr = require('../lib/alpr')

// função para encontrar matrículas numa imagem
async function encontrarMatriculas(dados, imagem) {
    if(imagem) {
        const imagemValida = await matriculasController.validarObjetoImagem(imagem)
        if(imagemValida.erro) {
            fs.unlink(imagem.path, (err) => {
                if (err) {
                    console.error(err)
                }
            })
            return imagemValida
        }
    }

    const imgGuardada = imagem.filename + path.extname(imagem.originalname)
    await matriculasController.guardarImagem(imagem, imgGuardada, true)
    const matriculas = JSON.parse(await alpr.executarAlpr('tmp/' + imgGuardada))
    return await processarResultados(matriculas, imgGuardada)
}

// função para processar os resultados do comando alpr (procurar matrículas na imagem)
async function processarResultados(resultados, imagem) {
    let estrutura = {
        sucesso: false,
        erro: false,
        mensagem: null,
        matriculas: [],
        imagem: imagem
    }
    try {
        if (resultados.results.length === 0) {
            estrutura.erro = true
            estrutura.mensagem = 'Não foram encontradas matrículas na imagem enviada. Certifique-se que a fotografia: é de boa qualidade, a matrícula está bem visível e sem obstruções ou com pouca/demasiada luz'
            return estrutura
        }

        // percorrer o objecto JSON e guardar apenas as matrículas que estão no formato PT
        for (let i = 0; i < resultados.results[0].candidates.length; i++) {
            if(resultados.results[0].candidates[i].matches_template === 1) {
                // formatar a matrícula: XX-XX-XX
                var matricula = resultados.results[0].candidates[i].plate.match(/.{1,2}/g);
                matricula = matricula.join('-')
                estrutura.matriculas.push({
                    matricula: matricula,
                    certeza: resultados.results[0].candidates[i].confidence
                })
            }
        }
        estrutura.sucesso = true;
        return estrutura

    } catch (e) {
        console.log(e)
        estrutura.erro = true
        estrutura.mensagem = 'Não foram encontradas matrículas ou ocorreu um erro ao processar a imagem!'
        return estrutura
    }
}

module.exports = {
    encontrarMatriculas: encontrarMatriculas
}