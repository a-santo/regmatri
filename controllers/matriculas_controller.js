const db = require('../lib/dbcfg');
const fs = require('fs');
const path = require('path');

// função para registar matrícula, com validação
async function registarMatricula(dados, imagem) {

    //validar a imagem, caso esteja presente
    if(imagem) {
        const imagemValida = await validarObjetoImagem(imagem)
        if(imagemValida.erro) {
            fs.unlink(imagem.path, (err) => {
                if (err) {
                    console.error(err)
                }
            })
            return imagemValida
        }
    }

    var idMatricula = await encontrarIdMatricula(dados.matricula)
    var idLocal = await adicionarLocal(dados)

    if (!idMatricula) {
        const query = 'INSERT INTO matriculas (matricula) VALUES (?)'
        const resultado = await db.asyncQuery(query, [dados.matricula])
        idMatricula = resultado.insertId;
    }

    const nomeImg = imagem ? imagem.filename + path.extname(imagem.originalname) : null

    if(nomeImg) {
        await guardarImagem(imagem.path, nomeImg)
        await apagarImagem(imagem.path)
    }

    const query = 'INSERT INTO registo (idMatricula, idLocal, hora, imagem) VALUES (?, ?, STR_TO_DATE(?, "%Y-%m-%d %H:%i"), ?)'
    await db.asyncQuery(query, [idMatricula, idLocal, dados.data, nomeImg])

    console.log('Registo inserido!')
    return {
        sucesso: true
    }
}

// função para encontrar ID de uma matrícula
async function encontrarIdMatricula(matricula) {
    const query = "SELECT idMatricula FROM matriculas WHERE matricula = ?"
    const resultado = await db.asyncQuery(query, [matricula])
    if (resultado.length > 0) {
        return resultado[0].idMatricula
    } else {
        return null
    }
}

// função para adicionar um local (um conjunto de rua, cidade e região) caso não exista. Devolve ID se já existir
async function adicionarLocal(dados) {
    const query = "SELECT idLocal FROM locais WHERE rua = ? AND cidade = ? AND regiao = ?"
    const resultado = await db.asyncQuery(query, [dados.rua, dados.cidade, dados.regiao])

    if (resultado.length > 0) {
        return resultado[0].idLocal
    } else {
        const query = 'INSERT INTO locais (rua, cidade, regiao) VALUES (?, ?, ?)'
        const resultado = await db.asyncQuery(query, [dados.rua, dados.cidade, dados.regiao])
        return resultado.insertId
    }
}

// função para guardar imagem
async function guardarImagem(org, nome, temp = false) {
    const destino = temp ? 'tmp/' + nome : 'db/imagens/' + nome
    const origem = org.path ? org.path : org
    if(fs.existsSync(origem)) {
        fs.copyFile(origem, destino, (err) => {
            if (err) throw err;
        });
    }
}

// função para apagar imagens
async function apagarImagem(caminho) {
    if(fs.existsSync(caminho)) {
        fs.unlinkSync(caminho);
    } else {
        console.log('Ficheiro não existe. Nada a fazer...')
    }

}

// valida se a imagem é um ficheiro PNG ou JPG/JPEG
async function validarObjetoImagem(imagem) {
    if(imagem.mimetype !== 'image/png' &&
        imagem.mimetype !== 'image/jpeg' &&
        imagem.mimetype !== 'image/jpg') {
        return {
            erro: true,
            mensagem: 'Apenas são aceites imagens no formato JPEG ou PNG.'
        }
    } else {
        return {
            erro: false,
            mensagem: null
        }
    }
}

// regista matrículas sem verificar a imagem (para o processo automático de detecção de matrículas)
async function registarMatriculaSemVerificacao(dados, imagem) {

    var idMatricula = await encontrarIdMatricula(dados.matricula)
    var idLocal = await adicionarLocal(dados)

    if (!idMatricula) {
        const query = 'INSERT INTO matriculas (matricula) VALUES (?)'
        const resultado = await db.asyncQuery(query, [dados.matricula])
        idMatricula = resultado.insertId;
    }

    await guardarImagem('tmp/' + imagem, imagem)
    await apagarImagem('tmp/' + imagem)

    const query = 'INSERT INTO registo (idMatricula, idLocal, hora, imagem) VALUES (?, ?, STR_TO_DATE(?, "%Y-%m-%d %H:%i"), ?)'
    await db.asyncQuery(query, [idMatricula, idLocal, dados.data, imagem])
    console.log('Registo inserido!')

}

module.exports = {
    registarMatricula: registarMatricula,
    encontrarIdMatricula: encontrarIdMatricula,
    validarObjetoImagem: validarObjetoImagem,
    guardarImagem: guardarImagem,
    registarMatriculaSemVerificacao: registarMatriculaSemVerificacao,
    apagarImagem: apagarImagem
}