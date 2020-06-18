const db = require('../lib/dbcfg')

async function pesquisarOcorrencia(dados) {

    var dadosQuery = [dados.matricula]

    if(dados.matricula === '') { return { error: true, msg: 'Matrícula inválida!', results: null }}

    var query = 'SELECT l.rua as rua, l.cidade as cidade, l.regiao as regiao, DATE_FORMAT(r.hora, "%Y-%m-%d %H:%i:%s") as hora, r.imagem as imagem FROM locais l, registo r WHERE r.idMatricula = ' +
        '(SELECT idMatricula FROM matriculas WHERE matricula = ?) AND r.idLocal = l.idLocal'

    if(dados.regiao !== '') {
        query += ' AND l.regiao = ?'
        dadosQuery.push(dados.regiao)
    }

    if(dados.cidade !== '') {
        query += ' AND l.cidade = ?'
        dadosQuery.push(dados.cidade)
    }

    if(dados.de !== '' && dados.ate !== '') {
        query += ' AND r.hora BETWEEN ? AND ?'
        dadosQuery.push(dados.de)
        dadosQuery.push(dados.ate)
    }
    console.log(query)
    return await db.asyncQuery(query, dadosQuery)
}

module.exports = {
    pesquisarOcorrencia: pesquisarOcorrencia
}